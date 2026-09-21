/**
 * The film: the evolution of a human being, told in paintings and scrubbed by
 * the scroll. Each scene is a real work of art in the public domain — Huxley's line of skeletons from gibbon to man, stone-age
 * toolmakers, a migration, a mammoth hunt, painters in a lamp-lit cave,
 * Leonardo's measured man — and the camera moves through it as the page moves:
 * a push, a pan along the line-up, a drift across a canvas.
 *
 * One WebGL fragment shader does the work: two paintings at a time, each under
 * its own camera; a pixel-dither wipe between them; the old paper of a plate
 * multiplied onto the site's own paper so a drawing has no edges; a slow warp
 * so the paint is never quite still; lamplight that flickers; a lens that
 * drifts with the pointer; vignette, grain, and a scrim where the type sits.
 *
 * Paintings are loaded only as the scroll approaches them and let go again
 * afterwards. With no WebGL the canvas steps aside for a CSS backdrop.
 * Credits for every plate are printed in the sign-off (see `content.ts`).
 */

type SceneId = "march" | "lineup" | "hands" | "trek" | "hunt" | "cave" | "measure" | "paper" | "sky";

/**
 * Three worlds, in rotation: open sky, white paper, and a painting that fills the frame.
 * kind: 0 a painting · 1 a drawing multiplied onto paper · 2 bare paper · 3 cobalt sky with halftone clouds ·
 *       4 a drawing in cream on that sky.  `src` lets two scenes share one picture.
 */
type Near = [number, number, number, number];
const SCENES: Record<SceneId, { aspect: number; kind: number; tint: [number, number, number]; flicker?: number; near?: Near[]; floor?: number; src?: SceneId }> = {
  /* `near` marks what stands in front — soft regions (u, v, radius, strength) — and `floor` how far the ground
     comes forward. From them the shader makes a depth field, and slides near things further than far things as
     the camera moves: a flat canvas reads as a space. Soft on purpose, so nothing tears. */
  march: { aspect: 3149 / 1330, kind: 4, tint: [0.955, 0.93, 0.85], src: "lineup" },
  lineup: { aspect: 3149 / 1330, kind: 1, tint: [0.955, 0.93, 0.85] },
  hands: { aspect: 3840 / 2413, kind: 0, tint: [0.03, 0.035, 0.05], floor: 0.4, near: [[0.37, 0.5, 0.13, 0.7], [0.55, 0.45, 0.2, 0.9], [0.2, 0.72, 0.18, 0.8], [0.8, 0.7, 0.2, 0.6]] },
  trek: { aspect: 1920 / 1648, kind: 0, tint: [0.05, 0.04, 0.035], floor: 0.5, near: [[0.78, 0.55, 0.2, 0.9], [0.38, 0.55, 0.22, 0.7]] },
  hunt: { aspect: 3840 / 1402, kind: 0, tint: [0.03, 0.03, 0.04], floor: 0.3, near: [[0.68, 0.5, 0.2, 0.9], [0.36, 0.5, 0.2, 0.7], [0.55, 0.35, 0.16, 0.5]] },
  cave: { aspect: 1600 / 1071, kind: 0, tint: [0.01, 0.012, 0.02], flicker: 1, floor: 0.35, near: [[0.57, 0.5, 0.2, 0.9], [0.3, 0.7, 0.17, 0.8], [0.75, 0.72, 0.17, 0.8], [0.12, 0.5, 0.14, 0.6]] },
  measure: { aspect: 1876 / 605, kind: 1, tint: [0.93, 0.80, 0.63] },
  paper: { aspect: 1, kind: 2, tint: [1, 1, 1] },
  sky: { aspect: 1, kind: 3, tint: [0, 0, 0] },
};

/**
 * A camera: the point of the picture at the centre (cx, cy in 0…1), how many
 * picture-heights fit in the viewport's height (vh: below 1 fills the screen,
 * above 1 shows the whole plate with room round it), and where on screen that
 * centre sits (ox as a fraction of half-width, oy of half-height).
 */
type Cam = { cx: number; cy: number; vh: number; ox?: number; oy?: number };
/** wipe: how this shot arrives — 0 a field of pixels from the middle · 1 an iris opening from a point · 2 a curtain drawn across */
type Shot = { scene: SceneId; from: number; to: number; a: Cam; b: Cam; na?: Cam; nb?: Cam; pan?: number; hold?: number; dim?: number; wipe?: [number, number, number] };

const still: Cam = { cx: 0.5, cy: 0.5, vh: 1 };
const SHOTS: Shot[] = [
  // the procession from gibbon to man, in cream on an open sky, standing on the lower rule beside the headline
  { scene: "march", from: 0, to: 0.056, a: { cx: 0.5, cy: 0.5, vh: 1.95, ox: 0.24, oy: 0.105 }, b: { cx: 0.5, cy: 0.5, vh: 1.75, ox: 0.2, oy: 0.151 },
    na: { cx: 0.3, cy: 0.5, vh: 2.9, oy: 0.52 }, nb: { cx: 0.72, cy: 0.5, vh: 2.7, oy: 0.52 } },
  // the answer, 1863: the camera walks the line from gibbon to man
  { scene: "lineup", from: 0.064, to: 0.122, pan: 0.5, wipe: [2, 0, 0], a: { cx: 0.08, cy: 0.47, vh: 1.02, ox: -0.3 }, b: { cx: 0.772, cy: 0.47, vh: 1.2, ox: -0.46 },
    na: { cx: 0.08, cy: 0.47, vh: 2.5, oy: 0.44 }, nb: { cx: 0.77, cy: 0.46, vh: 2.6, oy: 0.44 } },
  { scene: "hands", from: 0.13, to: 0.182, wipe: [1, 0.1, -0.1], a: { cx: 0.36, cy: 0.6, vh: 0.7 }, b: { cx: 0.44, cy: 0.5, vh: 0.86 },
    na: { cx: 0.27, cy: 0.64, vh: 0.78 }, nb: { cx: 0.36, cy: 0.52, vh: 0.95 } },
  { scene: "trek", from: 0.192, to: 0.244, a: { cx: 0.44, cy: 0.4, vh: 0.6 }, b: { cx: 0.56, cy: 0.58, vh: 0.66 },
    na: { cx: 0.3, cy: 0.5, vh: 0.9 }, nb: { cx: 0.72, cy: 0.48, vh: 0.98 } },
  { scene: "hunt", from: 0.256, to: 0.308, wipe: [2, 0, 0], a: { cx: 0.56, cy: 0.52, vh: 0.98 }, b: { cx: 0.74, cy: 0.45, vh: 0.8 },
    na: { cx: 0.5, cy: 0.5, vh: 0.98 }, nb: { cx: 0.76, cy: 0.46, vh: 0.9 } },
  { scene: "cave", from: 0.322, to: 0.376, wipe: [1, 0.25, -0.05], //  the dark opens from the lamp
    a: { cx: 0.3, cy: 0.52, vh: 0.74 }, b: { cx: 0.62, cy: 0.45, vh: 0.92 },
    na: { cx: 0.22, cy: 0.5, vh: 0.9 }, nb: { cx: 0.62, cy: 0.45, vh: 0.98 } },
  // the paper chapters keep a ghost of the line-up drifting behind them
  { scene: "lineup", from: 0.396, to: 0.718, dim: 0.9, a: { cx: 0.2, cy: 0.5, vh: 0.74 }, b: { cx: 0.78, cy: 0.46, vh: 0.74 },
    na: { cx: 0.1, cy: 0.5, vh: 1.0 }, nb: { cx: 0.8, cy: 0.5, vh: 1.0 } },
  // under an open sky: the questions, and the brief
  { scene: "sky", from: 0.742, to: 0.936, a: still, b: still },
  // the measure of man: the span of the arms, as a frieze above the type
  { scene: "measure", from: 0.948, to: 0.978, wipe: [2, 0, 0], a: { cx: 0.5, cy: 0.5, vh: 2.7, oy: 0.34 }, b: { cx: 0.5, cy: 0.5, vh: 2.3, oy: 0.34 },
    na: { cx: 0.5, cy: 0.5, vh: 2.9, oy: 0.44 }, nb: { cx: 0.5, cy: 0.5, vh: 2.5, oy: 0.44 } },
  { scene: "sky", from: 0.986, to: 1.01, a: still, b: still },
];

/** Where the skeleton of Man stands in the line-up plate: the specimen's labels are pinned to it. */
const MAN = { u: 0.772, v: 0.45, halfHeight: 0.435 };

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerpCam = (a: Cam, b: Cam, t: number): Required<Cam> => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  vh: a.vh + (b.vh - a.vh) * t,
  ox: (a.ox ?? 0) + ((b.ox ?? 0) - (a.ox ?? 0)) * t,
  oy: (a.oy ?? 0) + ((b.oy ?? 0) - (a.oy ?? 0)) * t,
});
function camOf(shot: Shot, p: number, narrow: boolean, asp = 1.6) {
  const a = narrow ? (shot.na ?? shot.a) : shot.a;
  const b = narrow ? (shot.nb ?? shot.b) : shot.b;
  const t = shotT(shot, p);
  return cover(lerpCam(a, b, smooth(t)), shot, asp);
}
/**
 * A painting meant to fill the screen must fill ANY screen: tighten the zoom until it does (with room for the
 * push-through at a cut, which backs the camera out by PUSH), then keep the centre far enough from every edge.
 */
const PUSH = 1.14;
function cover(c: Required<Cam>, shot: Shot, asp: number): Required<Cam> {
  const sc = SCENES[shot.scene];
  if (sc.kind !== 0 || c.ox !== 0 || c.oy !== 0 || c.vh > 1.05) return c; // a plate on a wall, or a drawing on paper
  const vh = Math.min(c.vh, 1 / PUSH, sc.aspect / asp / PUSH);
  const hw = (asp * vh * PUSH * 0.5) / sc.aspect;
  const hh = vh * PUSH * 0.5;
  return { ...c, vh, cx: Math.min(1 - hw, Math.max(hw, c.cx)), cy: Math.min(1 - hh, Math.max(hh, c.cy)) };
}
/** How far through its move a shot's camera is: it may hold first (`hold`), or finish early (`pan`). */
function shotT(shot: Shot, p: number) {
  const raw = (p - shot.from) / (shot.to - shot.from);
  const start = shot.hold ?? 0;
  const end = shot.pan ?? 1;
  return clamp01((raw - start) / Math.max(1e-6, end - start));
}

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPtr;
uniform sampler2D tA, tB;
uniform vec4 camA, camB;     // cx, cy, vh, picture aspect
uniform vec4 parA, parB;     // ox, oy, kind, dim
uniform vec4 extA, extB;     // tint.rgb, flicker
uniform vec2 uHas;           // is each picture loaded yet
uniform float uMix, uFlare, uNarrow, uVel;
uniform vec4 nearA[4]; uniform vec4 nearB[4];   // u, v, radius, strength
uniform vec4 movA, movB;     // the camera's travel (x, y), the floor's depth, how far through the shot
uniform vec3 uWipe;          // style, and the point an iris opens from

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return s; }
float bayer2(vec2 a){ a=floor(a); return fract(a.x/2.+a.y*a.y*.75); }
float bayer4(vec2 a){ return bayer2(.5*a)*.25+bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5*a)*.25+bayer2(a); }

// motes of dust in the light, a little out of focus
vec3 motes(vec2 p, float asp){
  vec3 s=vec3(0.);
  for(int i=0;i<8;i++){
    float fi=float(i), h1=hash(vec2(fi,21.)), h2=hash(vec2(fi,22.)), h3=hash(vec2(fi,23.));
    float r=.018+.05*h3*h3;
    vec2 c=vec2((fract(h1-uTime*(.004+.01*h3))*2.8-1.4)*asp,(fract(h2+uTime*.006*(h3-.3))-.5)*2.5)+uPtr*vec2(.06,.04)*(.4+h3);
    float d=length(p-c);
    s+=vec3(1.,.93,.80)*smoothstep(r,r*.7,d)*(.55+.45*smoothstep(r*.45,r*.95,d))*(.03+.05*h3);
  }
  return s;
}

// an open cobalt sky, and a handful of compact clouds read through a dot screen
vec3 skyOf(vec2 p, float asp){
  vec2 frag=gl_FragCoord.xy; vec2 uv=frag/uRes; float px=uRes.y/900.;
  vec3 sky=mix(vec3(.10,.37,.78),vec3(.035,.165,.52),smoothstep(0.,1.,uv.y));
  sky*=1.+.10*(fbm(p*1.3+3.)-.5);
  float cell=6.5*px; vec2 cc=(floor(frag/cell)+.5)*cell; vec2 cp=(cc-.5*uRes)/(.5*uRes.y);
  float dens=0., lit=0.;
  for(int i=0;i<5;i++){
    float fi=float(i); vec2 c=vec2(0.); float s=.3;
    if(i==0){ c=vec2(.10*asp,.80); s=.30; }
    if(i==1){ c=vec2(.80*asp,.46); s=.24; }
    if(i==2){ c=vec2(-.66*asp,.70); s=.27; }
    if(i==3){ c=vec2(-.06*asp,-.84); s=.26; }
    if(i==4){ c=vec2(.62*asp,-.70); s=.22; }
    s*=clamp(asp/1.6,.42,1.);
    c.x+=sin(uTime*.013+fi*2.1)*.05+uTime*.0016*(fi-2.)+uPtr.x*.02*(fi-2.);
    vec2 d=(cp-c)/vec2(s*1.75,s*.66);
    float bump=fbm(cp*5.2+fi*7.3)*.62;
    float dn=smoothstep(0.,.30,1.-length(d)+bump-.34)*smoothstep(-.34,.02,d.y);
    lit=max(lit,dn*smoothstep(-.5,.7,d.y+bump*.5)); dens=max(dens,dn);
  }
  float rad=sqrt(clamp(dens,0.,1.))*.52*cell;
  float dotm=smoothstep(rad,rad-1.1*px,length(frag-cc))*step(.03,dens);
  vec3 cloud=mix(vec3(.60,.64,.76),vec3(.98,.95,.87),clamp(lit/max(dens,.001),0.,1.));
  return mix(sky,cloud,dotm*.96)+uFlare*.05;
}

vec3 shot(sampler2D t, vec4 cam, vec4 par, vec4 ext, vec4 near[4], vec4 mov, float has, vec2 p, float asp, out float dark){
  float kind=par.z;
  vec3 paper=vec3(.949,.945,.929)*(1.+.035*(fbm(p*2.2+40.)-.5));
  dark=0.;
  if(kind>1.5 && kind<2.5) return paper;
  if(kind>2.5 && kind<3.5) return skyOf(p,asp);
  if(kind>3.5){
    // a drawing in cream on the sky: the figures come out of the haze on the side where the type is
    vec2 q4=p-vec2(par.x*asp,par.y)-uPtr*vec2(.010,.006);
    vec2 u4=vec2(cam.x+q4.x*cam.z*.5/cam.w, cam.y-q4.y*cam.z*.5);
    vec2 e4=min(u4,1.-u4);
    vec3 i4=clamp(texture2D(t,clamp(u4,0.,1.)).rgb/ext.rgb,0.,1.);
    float ink4=clamp((1.-dot(i4,vec3(.333)))*1.35,0.,1.)*smoothstep(0.,.05,e4.x)*smoothstep(0.,.06,e4.y)*has;
    ink4*=mix(smoothstep(.0,.30,p.x/asp),1.,uNarrow);
    ink4*=smoothstep(.955,.915,u4.y);                        // the plate's own caption stays off the sky
    return mix(skyOf(p,asp),vec3(.985,.96,.885),ink4);
  }
  // the lens drifts with the pointer, and the paint is never quite still
  vec2 q=p-vec2(par.x*asp,par.y)-uPtr*vec2(.014,.010);
  q+=.0045*cam.z*vec2(fbm(p*1.6+vec2(uTime*.05,0.))-.5,fbm(p*1.6+vec2(9.,-uTime*.045))-.5);
  vec2 uv=vec2(cam.x+q.x*cam.z*.5/cam.w, cam.y-q.y*cam.z*.5);
  vec2 e=min(uv,1.-uv);
  // depth: what is near slides further than what is far — with the camera's travel, the pointer, the scroll itself
  float dep=mov.z*smoothstep(.25,1.,uv.y);
  for(int i=0;i<4;i++){ vec2 dd=(uv-near[i].xy)*vec2(cam.w,1.); dep+=near[i].w*exp(-dot(dd,dd)/max(near[i].z*near[i].z,1e-4)); }
  dep=clamp(dep,0.,1.)-.35;
  vec2 slide=mov.xy*(mov.w-.5)*.085+uPtr*vec2(-.006,.004)+vec2(0.,uVel*.010);
  uv+=dep*slide*vec2(1./cam.w,1.)*step(kind,.5);
  // the faster the scroll, the more the colours part
  float ab=clamp(abs(uVel),0.,1.)*.0042;
  vec2 cuv=clamp(uv,0.,1.);
  vec3 img=vec3(texture2D(t,clamp(cuv+vec2(0.,ab),0.,1.)).r, texture2D(t,cuv).g, texture2D(t,clamp(cuv-vec2(0.,ab),0.,1.)).b);
  if(kind>.5){
    // a drawing: divide its own old paper away, then lay the ink on ours, fading at the sheet's edge
    vec3 ink=clamp(img/ext.rgb,0.,1.);
    ink=mix(vec3(1.),ink,1.12);
    float edge=smoothstep(0.,.05,e.x)*smoothstep(0.,.06,e.y);
    return paper*mix(vec3(1.),clamp(ink,0.,1.),edge*has*(1.-par.w));       // par.w fades it to a ghost
  }
  dark=1.;
  // a painting: graded toward the studio's palette — cool in the shadows, warm in the lights
  float lum=dot(img,vec3(.30,.59,.11));
  img=mix(vec3(lum),img,1.14);                                   // a touch more colour,
  img=pow(clamp(img,0.,1.),vec3(.90))*1.06;                      // lifted so the paint glows, as varnished canvas does
  img=mix(img,img*vec3(1.05,1.0,.93),.30*lum);
  // a band of light crosses the canvas as the shot is scrolled, like a lamp carried past it
  float sw=exp(-pow((uv.x*.85+uv.y*.35-mix(-.35,1.45,mov.w))*2.6,2.));
  img=img*(1.+.26*sw)+vec3(.05,.04,.02)*sw*lum;
  // lamplight
  float fl=ext.a*(.55+.45*vnoise(vec2(uTime*5.,3.)))*(.8+.2*vnoise(vec2(uTime*13.,7.)))+uFlare;
  img+=vec3(.16,.09,.03)*lum*lum*fl;
  // dimmed, it recedes: darker, greyer
  img=mix(img,vec3(lum)*vec3(.80,.88,1.05),par.w*.55)*(1.-par.w*.62);
  // off the canvas there is a dark wall, a hairline frame, and a little shadow
  float inside=step(0.,e.x)*step(0.,e.y);
  float dist=max(-e.x*cam.w,-e.y)/(cam.z*.5);          // distance outside the canvas, in screen units
  vec3 wall=ext.rgb*(1.+.5*(fbm(p*1.4)-.5))+vec3(.015,.02,.035)*smoothstep(1.4,0.,length(p-vec2(par.x*asp,par.y)));
  vec2 sp=(p-vec2(par.x*asp,par.y+.35))*vec2(.75,.5);                 // a picture light above the frame
  wall+=vec3(.16,.125,.08)*exp(-dot(sp,sp)*1.5)*(.85+.15*vnoise(vec2(uTime*.7,2.)));
  wall*=.55+.45*smoothstep(0.,.10,dist);
  wall+=vec3(.55,.5,.42)*smoothstep(.006,.003,abs(dist-.012))*.35;
  vec3 col=mix(wall,img*has+ext.rgb*(1.-has),inside);
  return col+motes(p,asp)*(1.-par.w*.5);
}

void main(){
  vec2 frag=gl_FragCoord.xy; vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=(frag-.5*uRes)/(.5*uRes.y);
  float px=uRes.y/900.;
  float dA, dB;
  // every cut is a push: the shot leaving is driven into, the shot arriving is backed out of
  vec4 cA=camA; cA.z*=1.-.13*uMix;
  vec4 cB=camB; cB.z*=1.+.13*(1.-uMix);
  vec3 col=shot(tA,cA,parA,extA,nearA,movA,uHas.x,p,asp,dA);
  float dk=dA;
  if(uMix>.001){
    vec3 cb=shot(tB,cB,parB,extB,nearB,movB,uHas.y,p,asp,dB);
    // three ways in: a field of pixels from the middle, an iris from a point, a curtain drawn across
    float grain2=bayer8(floor(frag/(3.*px)))*.16+fbm(p*3.4+7.)*.30;
    float field=(abs(uv.x-.5)*1.5+abs(uv.y-.5)*.35)*.62+grain2;
    if(uWipe.x>.5 && uWipe.x<1.5) field=length((p-uWipe.yz*vec2(asp,1.))/vec2(max(asp,1.),1.))*.62+grain2*.8;
    if(uWipe.x>1.5) field=uv.x*.70+grain2*.8+.06*sin(uv.y*9.+uTime);
    float k=uMix*1.16-.06, m=step(field,k);
    col=mix(col,cb,m); dk=mix(dA,dB,m);
    float edge=smoothstep(.05,0.,abs(field-k));
    float rnd=hash(floor(frag/(3.*px))+floor(uTime*8.));
    col=mix(col,.5+.5*cos(6.2831*(rnd+vec3(0.,.33,.67))),edge*step(.55,rnd)*.85);
  }
  // a scrim where the type sits: the left on a wide screen, the foot on a phone
  float sc=uNarrow>.5 ? smoothstep(.45,-.65,p.y)*.62 : max(smoothstep(.10,-1.25,p.x/asp)*.62,smoothstep(-.35,-1.05,p.y)*.46);
  col*=1.-sc*dk;
  float vg=length((uv-.5)*vec2(1.08,1.));
  col*=1.-mix(.08,.26,dk)*smoothstep(.35,.95,vg)*vg;
  col+=(hash(frag+fract(uTime)*91.7)-.5)*.045;
  gl_FragColor=vec4(col,1.);
}`;

const UNIFORMS = ["uRes", "uTime", "uPtr", "tA", "tB", "camA", "camB", "parA", "parB", "extA", "extB", "uHas", "uMix", "uFlare", "uNarrow", "uVel", "nearA", "nearB", "movA", "movB", "uWipe"] as const;

export type Frame = {
  /** The chrome should read dark-on-light. */
  light: boolean;
  /** Where the labelled specimen stands on screen: x of half-width, y of half-height, and its half-height. */
  ax: number;
  ay: number;
  au: number;
};

export class Film {
  ok = false;
  private gl: WebGLRenderingContext | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private tex = new Map<SceneId, { t: WebGLTexture | null; ready: boolean }>();
  private blank: WebGLTexture | null = null;
  private scale = 1;
  private ptr = [0, 0];
  private flareTo = 0;
  private flareNow = 0;
  private lastTime = 0;

  constructor(private canvas: HTMLCanvasElement, private small: boolean) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
    if (!gl) return;
    const make = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("[film] shader failed to compile:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = make(gl.VERTEX_SHADER, VERT);
    const fs = make(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[film] shader failed to link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of UNIFORMS) this.u[name] = gl.getUniformLocation(prog, name);
    this.blank = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.blank);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 8, 10, 255]));
    this.gl = gl;
    this.scale = small ? 0.8 : 1;
    this.ok = true;
    this.resize();
  }

  /** Fetch a painting as the scroll nears it; forget it once it is far behind. */
  private want(id: SceneId) {
    const gl = this.gl;
    const kind = SCENES[id].kind;
    if (!gl || kind === 2 || kind === 3) return;
    id = SCENES[id].src ?? id;
    if (this.tex.has(id)) return;
    const entry = { t: null as WebGLTexture | null, ready: false };
    this.tex.set(id, entry);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!this.gl || this.tex.get(id) !== entry) return;
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      entry.t = t;
      entry.ready = true;
    };
    img.src = `/film/${id}-${this.small ? "m" : "d"}.webp`;
  }
  private forget(keep: Set<SceneId>) {
    for (const [id, e] of this.tex) {
      if (keep.has(id) || !e.ready) continue;
      this.gl?.deleteTexture(e.t);
      this.tex.delete(id);
    }
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * this.scale;
    const w = Math.max(2, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(2, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  /** Step the film down a notch. */
  degrade() {
    if (!this.gl || this.scale < 0.5) return;
    this.scale *= 0.85;
    this.resize();
  }

  pointer(x: number, y: number) {
    this.ptr[0] += (x - this.ptr[0]) * 0.06;
    this.ptr[1] += (y - this.ptr[1]) * 0.06;
  }

  /** The brief was sent: the lamps flare. */
  flare() {
    this.flareTo = 1;
  }

  /** Which shots are on screen at p, and how far the wipe between them has opened. */
  static at(p: number) {
    let i = 0;
    SHOTS.forEach((s, k) => {
      if (p >= s.from) i = k;
    });
    const cur = SHOTS[i];
    const next = SHOTS[i + 1];
    const mix = next && p > cur.to ? clamp01((p - cur.to) / (next.from - cur.to)) : 0;
    return { cur, next, mix: smooth(mix) };
  }

  frame(p: number, time: number, narrow: boolean, velocity = 0): Frame {
    const { cur, next, mix } = Film.at(p);
    const lead = mix > 0.5 && next ? next : cur;
    const asp = this.canvas.clientWidth / Math.max(1, this.canvas.clientHeight);
    // the line-up's labels follow Man across the screen
    const lineup = [cur, next].find((s) => s?.scene === "lineup");
    let ax = 0, ay = 0, au = 0.5;
    if (lineup) {
      const c = camOf(lineup, p, narrow, asp);
      const sc = SCENES.lineup;
      ax = c.ox + (MAN.u - c.cx) / ((c.vh * 0.5) / sc.aspect) / asp;
      ay = c.oy - (MAN.v - c.cy) / (c.vh * 0.5);
      au = MAN.halfHeight / (c.vh * 0.5);
    }
    const out: Frame = { light: SCENES[lead.scene].kind > 0.5 && SCENES[lead.scene].kind < 2.5, ax, ay, au };

    const gl = this.gl;
    if (!gl) return out;
    // keep this painting, the next and the one after within reach; let the rest go
    const idx = SHOTS.indexOf(cur);
    const keep = new Set<SceneId>();
    for (let k = Math.max(0, idx - 1); k <= Math.min(SHOTS.length - 1, idx + 2); k++) keep.add(SCENES[SHOTS[k].scene].src ?? SHOTS[k].scene);
    // fetch the next painting at once, and the one after it only when this shot is half gone
    const ahead = p > (cur.from + cur.to) / 2 ? 2 : 1;
    for (let k = idx; k <= Math.min(SHOTS.length - 1, idx + ahead); k++) this.want(SHOTS[k].scene);
    this.forget(keep);

    const dt = Math.min(0.05, Math.max(0, time - this.lastTime));
    this.lastTime = time;
    this.flareNow += (this.flareTo - this.flareNow) * Math.min(1, dt * 2);

    const u = this.u;
    const set = (shot: Shot, cam: string, par: string, ext: string, unit: number, tex: string, near: string, mov: string) => {
      const sc = SCENES[shot.scene];
      const c = camOf(shot, p, narrow, asp);
      const a0 = narrow ? (shot.na ?? shot.a) : shot.a;
      const b0 = narrow ? (shot.nb ?? shot.b) : shot.b;
      const flat = new Float32Array(16);
      (sc.near ?? []).slice(0, 4).forEach((n, i) => flat.set(n, i * 4));
      gl.uniform4fv(u[near], flat);
      gl.uniform4f(u[mov], Math.sign(b0.cx - a0.cx) || 0.4, Math.sign(a0.cy - b0.cy) * 0.5, sc.floor ?? 0, shotT(shot, p));
      gl.uniform4f(u[cam], c.cx, c.cy, c.vh, sc.aspect);
      gl.uniform4f(u[par], c.ox, c.oy, sc.kind, shot.dim ?? 0);
      gl.uniform4f(u[ext], sc.tint[0], sc.tint[1], sc.tint[2], sc.flicker ?? 0);
      const e = this.tex.get(sc.src ?? shot.scene);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, e?.ready ? e.t : this.blank);
      gl.uniform1i(u[tex], unit);
      return e?.ready ? 1 : 0;
    };
    const hasA = set(cur, "camA", "parA", "extA", 0, "tA", "nearA", "movA");
    const hasB = set(next ?? cur, "camB", "parB", "extB", 1, "tB", "nearB", "movB");
    const wipe = next?.wipe ?? [0, 0, 0];
    gl.uniform3f(u.uWipe, wipe[0], wipe[1], wipe[2]);
    gl.uniform1f(u.uVel, Math.max(-1, Math.min(1, velocity)));
    gl.uniform2f(u.uHas, hasA, hasB);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, time);
    gl.uniform2f(u.uPtr, this.ptr[0], this.ptr[1]);
    gl.uniform1f(u.uMix, mix);
    gl.uniform1f(u.uFlare, this.flareNow * 1.4);
    gl.uniform1f(u.uNarrow, narrow ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return out;
  }

  destroy() {
    const gl = this.gl;
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }
}

/**
 * The film: Kodinav's scroll-scrubbed backdrop, rendered live in WebGL. It is
 * original artwork in code, and it tells one story — a living thing that
 * changes as the page is scrolled:
 *
 *   · one cell in deep water, which divides into a colony,
 *   · a fish, studied on paper as an engraving, then carrying a light through
 *     the dark, then outswimming a school in the sunlit shallows,
 *   · a tetrapod hauling itself up a bank, half in the water and half out,
 *   · a first bird perched under the stars, an egg in a nest, and a bird in
 *     flight at dawn through halftone clouds.
 *
 * Every creature is a body of tens of thousands of halftone dots — the same
 * language as the clouds — scattered over a distance field (`creatures.ts`)
 * and sized by the light that falls on them: cream dots on water and sky, ink
 * stipple on paper. Between stages the dots let go, swirl, and settle into the
 * next form; under a mouse they part. The worlds (water, paper, night, sky)
 * dissolve into each other through a pixel-dither wipe.
 *
 * Two passes: a full-screen fragment shader paints the world, then the dots
 * are drawn over it as depth-tested points — no ray marching, so it holds its
 * frame rate on a phone.
 *
 * The stage feeds it a handful of numbers per frame (see `filmAt`); nothing
 * here knows about the DOM. If WebGL is unavailable the canvas stays empty
 * and the CSS gradient behind it shows instead.
 */

/** What the picture is doing, independent of screen shape. */
type World = {
  /** 0 = sky/water world, 1 = paper world (dissolved with a dither wipe). */
  paper: number;
  /** 0 = day, 1 = night (the abyss, or the night sky). */
  night: number;
  /** Cloud cover, 0..1. */
  cloud: number;
  /** Clouds on the right-hand side, 0..1. */
  cr: number;
  /** 0 cells · 1 fish · 2 tetrapod · 3 first bird · 4 egg · 5 bird in flight. Fractions blend. */
  stage: number;
  /** Cell divisions so far, 0..3 (1 → 2 → 4 → 8 cells). */
  div: number;
  /** Waterline, in the creature's own units above its centre (±9 = off screen). */
  surf: number;
  /** 0 = sunlit shallows, 1 = deep water. */
  depth: number;
  /** The bank the tetrapod climbs. */
  bank: number;
  /** The branch (and nest) of the night scenes. */
  perch: number;
  /** The fish's lantern. */
  glow: number;
  /** Swimming speed: streaks the water and hurries the tail. */
  speed: number;
  /** How much the body moves (a pinned specimen barely does). */
  swim: number;
  /** The other fish: unlit in the deep, left behind in the shallows. */
  others: number;
  /** Dawn light on the horizon. */
  dawn: number;
  /** Camera orbit, radians. */
  yaw: number;
  pitch: number;
};

/** Where the creature sits in the frame — this is what changes with screen shape. */
type Framing = {
  /** Centre: x as a fraction of half-width, y of half-height. */
  ox: number;
  oy: number;
  /** Scale (1 ≈ the creature's unit is half the viewport height). */
  os: number;
  /** Opacity. */
  oa: number;
};

export type FilmState = Omit<World, "surf"> & Framing & { /** Waterline in screen units. */ surf: number };

type Keyed<T> = T & { p: number };

/** Rows state only what changes; everything else carries over from the row before. */
function track<T>(first: T, rows: [number, Partial<T>][]): Keyed<T>[] {
  let cur = first;
  return rows.map(([p, patch]) => {
    cur = { ...cur, ...patch };
    return { ...cur, p };
  });
}

const WORLD = track<World>(
  { paper: 0, night: 0, cloud: 0, cr: 1, stage: 0, div: 0, surf: 9, depth: 0.9, bank: 0, perch: 0, glow: 0, speed: 0, swim: 1, others: 0, dawn: 0, yaw: 0, pitch: 0 },
  [
    [0, {}],
    [0.052, {}],
    [0.1, { div: 3 }], //                                     one cell has become eight
    [0.104, {}],
    [0.128, { paper: 1, stage: 1, swim: 0.2, yaw: 0.2, depth: 0.6 }], // the notebook: a fish, pinned
    [0.172, {}],
    [0.196, { paper: 0, night: 1, depth: 1, glow: 1, others: 1, swim: 0.8, yaw: 0.5 }], // the deep
    [0.238, {}],
    [0.262, { night: 0, glow: 0, depth: 0.18, speed: 1, swim: 1, yaw: 0.42 }], // the shallows
    [0.303, {}],
    [0.332, { stage: 2, surf: -0.2, bank: 1, speed: 0, others: 0, cloud: 0.8, depth: 0.08, yaw: 0.32 }], // the shore
    [0.372, {}],
    [0.398, { paper: 1 }], //                                  the cabinet
    [0.64, { bank: 0, surf: -9 }],
    [0.7, { stage: 3, cloud: 0.25 }],
    [0.716, {}],
    [0.742, { paper: 0, night: 1, perch: 1, yaw: 0.3 }], //    the night
    [0.852, {}],
    [0.872, { stage: 4, yaw: 0.1 }], //                        the egg
    [0.93, { dawn: 0.35 }],
    [0.955, { stage: 5, night: 0, dawn: 1, perch: 0, cloud: 1, yaw: 0.34, pitch: 0.9 }], // first flight, seen from above
    [1, { dawn: 0.7 }],
  ],
);

/* Wide screens keep the creature beside the type… */
const WIDE = track<Framing>({ ox: 0.6, oy: 0.04, os: 0.6, oa: 1 }, [
  [0, {}],
  [0.052, { ox: 0.58, oy: 0.06, os: 0.66 }],
  [0.1, { ox: 0.5, oy: 0.02, os: 0.78 }],
  [0.128, { ox: -0.42, oy: 0.02, os: 0.6 }],
  [0.172, { os: 0.62 }],
  [0.196, { ox: 0.46, oy: 0.04, os: 0.7 }],
  [0.238, { ox: 0.44, oy: 0.06, os: 0.74 }],
  [0.262, { ox: 0.42, oy: 0.02, os: 0.8 }],
  [0.303, { ox: 0.38, oy: 0.0, os: 0.84 }],
  [0.332, { ox: 0.46, oy: -0.1, os: 0.66 }],
  [0.372, { ox: 0.44, oy: -0.08, os: 0.7 }],
  [0.398, { ox: -0.56, oy: -0.34, os: 1.2, oa: 0.09 }], //   a watermark behind the plates
  [0.64, { ox: -0.6, oy: 0.2, os: 1.3 }],
  [0.66, { ox: 0.5, oy: 0, os: 0.6, oa: 0 }], //             the lineage is drawn in ink instead
  [0.716, {}],
  [0.742, { ox: 0.7, oy: -0.4, os: 0.46, oa: 0.92 }],
  [0.852, { oy: -0.38, os: 0.48 }],
  [0.872, { ox: -0.54, oy: -0.42, os: 0.5, oa: 1 }],
  [0.93, { oy: -0.4, os: 0.52 }],
  [0.955, { ox: 0.44, oy: -0.02, os: 0.6 }], //              wings spread, whole, inside the frame
  [0.978, { ox: 0.42, oy: 0.04, os: 0.64 }],
  [1, { ox: 0.7, oy: 0.26, os: 0.5, oa: 0.9 }], //            up and away, clear of the sign-off
]);

/* …a portrait tablet keeps two columns in a tall frame, so it keeps to the top… */
const PORTRAIT = track<Framing>({ ox: 0.22, oy: 0.5, os: 0.4, oa: 1 }, [
  [0, {}],
  [0.052, { ox: 0.2, oy: 0.52, os: 0.44 }],
  [0.1, { ox: 0.1, oy: 0.42, os: 0.5 }],
  [0.128, { ox: -0.44, oy: 0.56, os: 0.3 }],
  [0.172, { os: 0.31 }],
  [0.196, { ox: 0.1, oy: 0.42, os: 0.44 }],
  [0.303, { ox: 0.08, oy: 0.4, os: 0.48 }],
  [0.332, { ox: 0.12, oy: 0.4, os: 0.42 }],
  [0.372, { os: 0.44 }],
  [0.398, { ox: -0.45, oy: 0.62, os: 0.42, oa: 0.12 }],
  [0.64, { oy: 0.6 }],
  [0.66, { oa: 0 }],
  [0.716, {}],
  [0.742, { ox: 0.5, oy: -0.62, os: 0.36, oa: 0.9 }],
  [0.852, {}],
  [0.872, { ox: -0.5, oy: -0.5, os: 0.36, oa: 1 }],
  [0.93, {}],
  [0.955, { ox: 0.1, oy: 0.42, os: 0.42 }],
  [0.978, { ox: 0.08, oy: 0.46, os: 0.44 }],
  [1, { ox: 0.5, oy: 0.62, os: 0.4, oa: 0.7 }],
]);

/* …and a phone lifts it above the type. */
const NARROW = track<Framing>({ ox: 0.12, oy: 0.52, os: 0.38, oa: 1 }, [
  [0, {}],
  [0.052, { ox: 0.1, oy: 0.54, os: 0.42 }],
  [0.1, { ox: 0, oy: 0.46, os: 0.38 }],
  [0.128, { ox: 0.05, oy: 0.58, os: 0.34 }],
  [0.172, { os: 0.35 }],
  [0.196, { ox: 0, oy: 0.46, os: 0.44 }],
  [0.303, { oy: 0.44, os: 0.48 }],
  [0.332, { ox: 0.04, oy: 0.42, os: 0.44 }],
  [0.372, { os: 0.46 }],
  [0.398, { ox: 0, oy: 0.62, os: 0.7, oa: 0.1 }],
  [0.64, {}],
  [0.66, { oa: 0 }],
  [0.716, {}],
  [0.742, { ox: 0.3, oy: -0.66, os: 0.34, oa: 0.85 }],
  [0.852, {}],
  [0.872, { ox: 0, oy: 0.2, os: 0.27, oa: 1 }], //            between the invitation and the form
  [0.93, {}],
  [0.955, { ox: 0.05, oy: 0.4, os: 0.36 }],
  [0.978, { oy: 0.44, os: 0.38 }],
  [1, { ox: 0.45, oy: 0.66, os: 0.3, oa: 0.5 }],
]);

const smooth = (t: number) => t * t * (3 - 2 * t);

function at<T extends Record<string, number>>(keys: Keyed<T>[], p: number): T {
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].p && p <= keys[i + 1].p) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  if (p <= keys[0].p) b = a = keys[0];
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / Math.max(1e-6, b.p - a.p))));
  const out: Record<string, number> = {};
  for (const k of Object.keys(a)) out[k] = a[k] + (b[k] - a[k]) * t;
  return out as T;
}

/** wide: beside the type · tablet: ≤1100px, still two columns · narrow: one column */
export type FilmMode = "wide" | "tablet" | "narrow";

export function filmAt(p: number, mode: FilmMode, portrait = false): FilmState {
  const w = at(WORLD, p);
  const f = at(mode === "narrow" ? NARROW : mode === "tablet" && portrait ? PORTRAIT : WIDE, p);
  // A small landscape screen runs the wide film with a smaller creature.
  if (mode === "tablet" && !portrait) f.os *= 0.8;
  return { ...w, ...f, surf: f.oy + w.surf * f.os };
}

const NOISE = `
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return s; }
float bayer2(vec2 a){ a=floor(a); return fract(a.x/2.+a.y*a.y*.75); }
float bayer4(vec2 a){ return bayer2(.5*a)*.25+bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5*a)*.25+bayer2(a); }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
vec2 r2(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
// the dither wipe between the worlds: both passes must agree on it
float wipeField(vec2 uv, vec2 frag, vec2 p, float px){
  float field=abs(uv.x-.5)*1.5+abs(uv.y-.5)*.35;
  return field*.62+bayer8(floor(frag/(3.*px)))*.16+fbm(p*3.4+7.)*.30;
}
// the nest sits in front of the egg
float nestBowl(vec2 q){ vec2 nq=q-vec2(0.,-.50);
  return max(length(nq*vec2(1.,2.1))-.74, nq.y-.05+.035*sin(q.x*38.)+.02*sin(q.x*71.)); }
`;

const BG_VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const BG_FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform float uPaper,uNight,uCloud,uCloudR,uObjA;
uniform vec3 uObj;   // x, y, scale
uniform vec2 uPtr;
uniform float uStage,uSurf,uDepth,uBank,uPerch,uGlow,uSpeed,uOthers,uDawn,uYaw,uPitch,uHatch;
${NOISE}
void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=(frag-.5*uRes)/(.5*uRes.y);           // y in [-1,1], x in [-asp,asp]
  float px=uRes.y/900.;                         // design pixels
  float dth=bayer8(frag/(1.6*px));
  vec2 oc=vec2(uObj.x*asp,uObj.y)+uPtr*.012;
  vec2 q=(p-oc)/uObj.z;                         // the creature's own frame

  vec3 paper=vec3(.949,.945,.929);
  if(uPaper>.999){                              // wholly on paper: none of the sky or water is worked out
    paper*=1.+.035*(fbm(p*2.2+40.)-.5);
    gl_FragColor=vec4(paper+(hash(frag+fract(uTime)*91.7)-.5)*.04,1.);
    return;
  }

  // ---------- sky ----------
  vec3 dayTop=vec3(.035,.165,.52), dayLow=vec3(.10,.37,.78);
  vec3 nitTop=vec3(.016,.02,.05),  nitLow=vec3(.05,.085,.2);
  float gy=smoothstep(0.,1.,uv.y);
  vec3 sky=mix(mix(dayLow,dayTop,gy), mix(nitLow,nitTop,gy), uNight);
  sky=mix(sky, vec3(.99,.80,.60), uDawn*(1.-uNight)*smoothstep(.45,-1.,p.y)*.62);
  sky*=1.+.10*(fbm(p*1.3+3.)-.5);

  vec2 sc=floor(frag/(2.2*px));
  float st=step(.9972,hash(sc))*uNight*(.55+.45*sin(uTime*1.5+hash(sc+3.)*40.));
  sky+=vec3(.95,.93,.85)*st*smoothstep(-.2,.6,p.y);

  // a thin moon over the night scenes
  vec2 mc=vec2(mix(.52,-.10,step(1.,asp))*asp,.80); float mr=.05;   // on a phone it keeps to the right, clear of the chip
  float moon=smoothstep(mr,mr-.004,length(p-mc))*smoothstep(mr*.92-.004,mr*.92,length(p-mc-vec2(.034,.018)));
  sky=mix(sky,vec3(.93,.92,.84),moon*uPerch*uNight);
  sky+=vec3(.10,.12,.18)*exp(-length(p-mc)*length(p-mc)*26.)*uPerch*uNight;

  // the halftone screen shared by the clouds and the other fish
  float cell=6.5*px;
  vec2 cc=(floor(frag/cell)+.5)*cell;
  vec2 cp=(cc-.5*uRes)/(.5*uRes.y);
  float dens=0., lit=0.;
  if(uCloud>.01) for(int i=0;i<5;i++){
    float fi=float(i);
    vec2 c=vec2(0.); float s=.3;
    if(i==0){ c=vec2(.10*asp, .80); s=.30; }
    if(i==1){ c=vec2(.80*asp, .46); s=.24; }
    if(i==2){ c=vec2(-.66*asp,.70); s=.27; }
    if(i==3){ c=vec2(-.06*asp,-.84); s=.26; }
    if(i==4){ c=vec2(.62*asp,-.70); s=.22; }
    s*=clamp(asp/1.6,.42,1.);
    c.x+=sin(uTime*.013+fi*2.1)*.05+uTime*.0016*(fi-2.);
    vec2 d=(cp-c)/vec2(s*1.75,s*.66);
    float bump=fbm(cp*5.2+fi*7.3)*.62;
    float body=1.-length(d)+bump-.34;
    float under=smoothstep(-.34,.02,d.y);
    float dn=smoothstep(.0,.30,body)*under;
    dn*=mix(1., uCloudR, smoothstep(.50,.60,uv.x));
    lit=max(lit, dn*smoothstep(-.5,.7,d.y+bump*.5));
    dens=max(dens,dn);
  }
  dens*=uCloud;
  float rad=sqrt(clamp(dens,0.,1.))*.52*cell;
  float dotm=smoothstep(rad,rad-1.1*px,length(frag-cc))*step(.03,dens);
  vec3 cloudCol=mix(vec3(.60,.64,.76),vec3(.98,.95,.87),clamp(lit/max(dens,.001),0.,1.));
  cloudCol=mix(cloudCol,vec3(.42,.5,.72),uNight*.75);
  cloudCol=mix(cloudCol,vec3(1.,.90,.78),uDawn*(1.-uNight)*.5);
  sky=mix(sky,cloudCol,dotm*.96);

  // low hills under the night sky
  float hl=smoothstep(0.,.012,(-.80+.12*fbm(vec2(p.x*1.1,5.))+.05*sin(p.x*1.7))-p.y)*uPerch;
  sky=mix(sky,vec3(.012,.018,.05),hl);

  // ---------- water ----------
  float wave=.010*sin(p.x*8.+uTime*1.1)+.006*sin(p.x*19.-uTime*1.6);
  float below=smoothstep(.006,-.006,p.y-uSurf-wave);
  vec3 scene=sky;
  if(below>.001){
    float dd=clamp((uSurf-p.y)*.45,0.,1.);
    vec3 wA=mix(vec3(.075,.34,.74),vec3(.03,.13,.42),dd);
    vec3 wB=mix(vec3(.010,.04,.17),vec3(.035,.15,.47),uv.y);
    vec3 water=mix(wA,wB,uDepth);
    water=mix(water, mix(vec3(.004,.008,.03),vec3(.02,.035,.10),uv.y), uNight);
    water*=1.+.10*(fbm(p*1.3+3.)-.5);

    // shafts of light, stippled
    vec2 sp=vec2(p.x+p.y*.38,p.y);
    float sh=smoothstep(.22,.95,vnoise(vec2(sp.x*1.1+uTime*.025,2.)))*(.55+.45*vnoise(vec2(sp.x*4.-uTime*.05,9.)));
    sh*=smoothstep(-1.2,.9,p.y)*(1.-uNight)*(1.-.35*uDepth);
    float shq=step(bayer8(frag/(2.*px)),sh*.70);
    water+=vec3(.20,.32,.44)*shq*.5+vec3(.06,.10,.15)*sh;
    water+=vec3(.10,.16,.20)*smoothstep(.55,0.,uSurf-p.y)*(1.-uNight);

    // the others — unlit in the deep, left behind in the shallows — through the same dot screen
    float oth=0.;
    if(uOthers>.01) for(int i=0;i<7;i++){
      float fi=float(i);
      float scl=.10+.09*hash(vec2(fi,1.));
      float vx=(.010+.018*hash(vec2(fi,2.)))*(1.+uSpeed*7.);
      vec2 c=vec2((fract(hash(vec2(fi,3.))-uTime*vx)*2.8-1.4)*asp,(hash(vec2(fi,5.))-.5)*1.6);
      vec2 o=(cp-c)/scl; o.y+=.14*sin(o.x*2.+uTime*3.+fi);
      float body=length(o*vec2(1.,2.7))-1.;
      float tail=max(abs(o.y)-(-o.x-.75)*.85, max(-o.x-1.7,o.x+.75));
      oth=max(oth,smoothstep(.10,-.12,min(body,tail))*(.45+.55*hash(vec2(fi,9.))));
    }
    oth*=uOthers;
    float orad=sqrt(clamp(oth,0.,1.))*.42*cell;
    float odot=smoothstep(orad,orad-1.1*px,length(frag-cc))*step(.03,oth);
    water=mix(water, mix(water*1.9+vec3(.03,.05,.09),vec3(.035,.06,.13),uNight), odot*.8);

    // drifting motes: marine snow by day, living sparks in the deep
    for(int l=0;l<3;l++){
      float fl=float(l);
      float cs=(30.+24.*fl)*px;
      vec2 g=frag; g.x+=uTime*px*(4.+6.*fl)*(1.+uSpeed*14.); g.y+=uTime*px*(2.+1.5*fl);
      vec2 id=floor(g/cs), lc=fract(g/cs);
      vec2 pp=vec2(hash(id),hash(id+7.))*.7+.15;
      float sz=(1.1+1.7*hash(id+3.))*px/cs;
      vec2 dv=vec2((lc.x-pp.x)/(1.+uSpeed*3.5),lc.y-pp.y);
      float on=step(max(abs(dv.x),abs(dv.y)),sz)*step(.5+.22*uSpeed,hash(id+11.));
      float tw=.6+.4*sin(uTime*(1.+2.*hash(id+5.))+hash(id)*30.);
      vec3 mcol=mix(vec3(.55,.68,.82),vec3(.45,.95,1.),uNight);
      water+=mcol*on*tw*(.20+.14*fl)*(1.+uNight*1.4);
    }
    scene=mix(sky,water,below);
    float sl=smoothstep(.014,0.,abs(p.y-uSurf-wave));
    scene+=vec3(.55,.66,.76)*sl*.55*(1.-uNight)*step(.2,fract(p.x*7.+uTime*.2+vnoise(vec2(p.x*9.,uTime))*.6));
  }

  // ---------- the bank the tetrapod climbs ----------
  if(uBank>.001){
    float gh=-.31+.52*(smoothstep(-1.6,1.6,q.x)-.5)+.03*(fbm(vec2(q.x*3.2,2.))-.5);
    float bk=smoothstep(0.,.012,gh-q.y)*uBank;
    float bsh=clamp(.86-(gh-q.y)*1.1+.34*(fbm(q*7.)-.5),0.,1.);
    float bq=floor(bsh*3.+dth)/3.;
    vec3 bankCol=mix(vec3(.13,.20,.42),vec3(.93,.90,.80),bq);
    bankCol=mix(bankCol,scene*.62+bankCol*.30,below);
    scene=mix(scene,bankCol,bk);
  }

  // ---------- the branch, and the nest ----------
  float eggW=clamp(1.-abs(uStage-4.),0.,1.);
  if(uPerch>.001){
    float br=seg(q,vec2(-.85,-.70),vec2(7.,-.50))-(.05+.012*sin(q.x*9.));
    br=min(br,seg(q,vec2(-.85,-.70),vec2(-1.3,-.79))-.028);
    br=min(br,seg(q,vec2(.95,-.63),vec2(1.4,-.28))-.022);
    br=min(br,seg(q,vec2(1.4,-.28),vec2(1.66,-.22))-.013);
    br=min(br,seg(q,vec2(1.18,-.46),vec2(1.5,-.50))-.012);
    float bm=smoothstep(.008,-.008,br)*uPerch;
    vec3 brCol=mix(vec3(.17,.21,.38),vec3(.03,.04,.10),smoothstep(0.,-.045,br));
    brCol=mix(brCol,vec3(.30,.22,.24),uDawn*(1.-uNight)*.6);
    scene=mix(scene,brCol,bm);
    float bowl=nestBowl(q);
    float nm=smoothstep(.008,-.008,bowl)*uPerch*eggW;
    float tw=step(.5,fract((q.x*1.3+q.y*3.)*9.+vnoise(q*14.)*2.));
    vec3 nestCol=mix(vec3(.035,.045,.11),vec3(.17,.21,.38),tw*.85);
    scene=mix(scene,nestCol,nm);
  }

  // light that spills: the lantern in the deep, and the egg when the brief is sent
  if(uGlow>.001){
    vec3 lp=vec3(1.02,.47,0.);
    lp.xz=r2(lp.xz,-(uYaw+uPtr.x*.10)); lp.yz=r2(lp.yz,uPitch-uPtr.y*.06);
    vec2 lq=lp.xy*4.2/(4.2+lp.z);
    float hr=length(q-lq);
    float gl=uGlow*uObjA*(exp(-hr*hr*6.)*.8+exp(-hr*hr*60.)*1.3)*(.9+.1*sin(uTime*3.));
    scene+=vec3(.42,.80,1.)*floor(gl*5.+dth)/5.*.55;
  }
  if(uHatch>.001){
    float hr=length(q-vec2(0.,-.1));
    scene+=vec3(1.,.86,.62)*floor(uHatch*eggW*exp(-hr*hr*1.6)*4.+dth)/4.*.34;
  }

  // ---------- paper, and the wipe between the worlds ----------
  vec3 col=scene;
  if(uPaper>.001){
    paper*=1.+.035*(fbm(p*2.2+40.)-.5);
    float field=wipeField(uv,frag,p,px);
    float k=uPaper*1.16-.06;
    col=mix(scene,paper,step(field,k));
    float edge=smoothstep(.05,0.,abs(field-k));
    float rnd=hash(floor(frag/(3.*px))+floor(uTime*8.));
    vec3 spark=.5+.5*cos(6.2831*(rnd+vec3(0.,.33,.67)));
    col=mix(col,spark,edge*step(.55,rnd)*.85);
  }

  col+=(hash(frag+fract(uTime)*91.7)-.5)*.04;
  gl_FragColor=vec4(col,1.);
}`;

const PT_VERT = `
precision highp float;
attribute vec4 aA; attribute vec3 aNA; attribute vec4 aB; attribute vec3 aNB; attribute float aSeed;
uniform vec2 uRes; uniform float uTime;
uniform vec3 uObj; uniform vec2 uPtr;
uniform float uSA,uF,uDiv,uSwim,uPh,uYaw,uPitch,uHatch,uGlow,uPaper,uObjA,uDot,uRepel;
varying float vShade; varying float vAlpha; varying float vKind;
vec2 r2(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }
float hash1(float n){ return fract(sin(n*91.345)*47453.5453); }

// fold a wing: the outer half about the wrist, then the whole of it about the shoulder
void flap(inout vec3 P, inout vec3 N, float sgn, float outer, float fl, float fl2){
  vec3 S=vec3(.10,.07,sgn*.10), W=vec3(-.02,.07,sgn*.62);
  if(outer>.5){
    vec3 v=P-W; vec2 r=r2(vec2(v.z*sgn,v.y),fl2); P=W+vec3(v.x,r.y,r.x*sgn);
    r=r2(vec2(N.z*sgn,N.y),fl2); N=vec3(N.x,r.y,r.x*sgn);
  }
  vec3 v=P-S; vec2 r=r2(vec2(v.z*sgn,v.y),fl); P=S+vec3(v.x,r.y,r.x*sgn);
  r=r2(vec2(N.z*sgn,N.y),fl); N=vec3(N.x,r.y,r.x*sgn);
}

void pose(float st, vec4 a, vec3 n, out vec3 P, out vec3 N){
  P=a.xyz; N=n; float part=a.w;
  if(st<.5){
    // one cell, dividing: 1, 2, 4, 8
    float d1=smoothstep(0.,1.,uDiv), d2=smoothstep(1.,2.,uDiv), d3=smoothstep(2.,3.,uDiv);
    float r=.62*pow(.81,d1+d2+d3);
    float nuc=step(.5,part);
    vec3 dir=a.xyz;
    vec3 side=step(.5,fract(aSeed*vec3(2.,4.,8.)))*2.-1.;      // which daughter this dot goes with
    P=vec3(d1,d2,d3)*r*.90*side+r*dir*mix(1.,.34,nuc);
    P+=dir*.022*sin(dir.x*7.+uTime*1.3)*sin(dir.y*6.-uTime*1.1)*(1.-nuc);
    P.xz=r2(P.xz,uTime*.12); N.xz=r2(N.xz,uTime*.12);
    P.xy=r2(P.xy,.3+uTime*.07); N.xy=r2(N.xy,.3+uTime*.07);
  } else if(st<1.5){
    float env=smoothstep(.75,-1.05,P.x);
    float amp=uSwim*(.20*env*env+.02);
    P.z+=amp*sin(3.3*P.x+uPh);
    P.y+=uSwim*.012*sin(uPh*.5);
    N.x-=amp*3.3*cos(3.3*a.x+uPh)*N.z*.6; N=normalize(N);
  } else if(st<2.5){
    if(part>.5 && part<4.5){
      float front=step(part,2.5), near=step(.5,mod(part,2.));   // 1, 3 are the near side
      float xs=mix(-.38,.36,front), zs=mix(1.,-1.,near);
      float ph=uPh+(abs(part-1.)<.5||abs(part-4.)<.5?0.:3.14159);
      vec3 S=vec3(xs,-.05,zs*.20);
      vec3 v=P-S; float along=clamp(-v.y/.27,0.,1.);
      v.xy=r2(v.xy,.34*sin(ph)*along); N.xy=r2(N.xy,.34*sin(ph)*along);
      P=S+v; P.y+=.06*max(0.,cos(ph))*along;
    }
    P.y+=.012*sin(uPh*2.);
    P.z+=uSwim*.08*sin(2.4*P.x+uPh)*smoothstep(.3,-1.1,P.x);
    P.xy=r2(P.xy,.24); N.xy=r2(N.xy,.24);
  } else if(st<3.5){
    P.y+=.010*sin(uTime*1.6)*smoothstep(-.4,.3,P.y);
    if(part>8.5){ P.x+=.03*sin(uTime*.7); P.y+=.012*sin(uTime*1.1); }
  } else if(st<4.5){
    vec2 base=vec2(0.,-.72);
    float wob=uHatch*.10*sin(uTime*11.);
    P.xy=base+r2(P.xy-base,wob); N.xy=r2(N.xy,wob);
  } else {
    float f1=.12+.72*sin(uPh), f2=.22+.62*sin(uPh-.9);
    if(part>.5 && part<4.5){
      float sgn=part<2.5?-1.:1.;
      float outer=(abs(part-2.)<.5||abs(part-4.)<.5)?1.:0.;
      flap(P,N,sgn,outer,f1,f2);
    }
    P.y+=.05*cos(uPh);
  }
}

// per-stage dot size: the same number of dots covers very different areas
float dotOf(float st){ return st<.5?1.34: st<1.5?1.: st<2.5?1.06: st<3.5?1.02: st<4.5?.74: 1.42; }

void main(){
  float asp=uRes.x/uRes.y;
  vec3 PA,NA,PB,NB;
  pose(uSA,aA,aNA,PA,NA);
  pose(uSA+1.,aB,aNB,PB,NB);
  float f=clamp(uF*1.45-aSeed*.45,0.,1.); f=f*f*(3.-2.*f);
  vec3 P=mix(PA,PB,f);
  vec3 N=normalize(mix(NA,NB,f)+1e-5);
  vec3 R=mix(aA.xyz,aB.xyz,f);
  float part=f<.5?aA.w:aB.w;
  float sNow=uSA+f;
  float wCell=clamp(1.-sNow,0.,1.), wFish=clamp(1.-abs(sNow-1.),0.,1.);
  float wEgg=clamp(1.-abs(sNow-4.),0.,1.), wFly=clamp(sNow-4.,0.,1.);

  // between forms the dots let go, swirl, and settle
  float m=sin(f*3.14159);
  vec3 tq=P*4.+aSeed*37.;
  P+=m*.30*vec3(sin(tq.y+uTime*1.1),sin(tq.z+uTime*1.3),sin(tq.x+uTime*.9));
  P*=1.+m*.10;
  P+=.0035*vec3(sin(uTime*2.+aSeed*90.),cos(uTime*1.7+aSeed*70.),0.);

  // the only light in the deep is the one it carries (measured before the camera turns)
  vec3 lv=vec3(1.02,.47,0.)-P; float ld=length(lv);
  float lsh=clamp(dot(N,lv/ld),0.,1.)*1.7/(1.+5.*ld*ld);

  float yaw=uYaw+uPtr.x*.10, pit=uPitch-uPtr.y*.06;
  P.xz=r2(P.xz,-yaw); N.xz=r2(N.xz,-yaw);
  P.yz=r2(P.yz,pit);  N.yz=r2(N.yz,pit);

  float w=4.2/(4.2+P.z);
  vec2 q=P.xy*w;
  vec2 oc=vec2(uObj.x*asp,uObj.y)+uPtr*.012;
  vec2 pq=(vec2(uPtr.x*asp,uPtr.y)-oc)/uObj.z;
  vec2 dq=q-pq; float dl=length(dq)+1e-4;
  q+=dq/dl*.10*exp(-dl*dl*9.)*uRepel;
  vec2 s=oc+q*uObj.z;
  gl_Position=vec4(s.x/asp,s.y,clamp(P.z*.4,-.95,.95),1.);

  vec3 L=normalize(vec3(-.55,.75,-.55));
  float facing=-N.z;
  float dif=clamp(dot(N,L),0.,1.), amb=.5+.5*N.y;
  float rim=pow(1.-abs(facing),2.2);
  float shade=clamp(dif*.85+amb*.22+rim*.25,0.,1.);
  // a cell is mostly membrane: bright at the rim, a nucleus glowing inside
  float nuc=step(.5,part)*wCell;
  shade=mix(shade,mix(.16+rim*1.15,.95,nuc),wCell);
  // bars on the fish, speckles on the egg, barring on the wings
  float bars=smoothstep(.1,.9,sin(R.x*13.+sin(R.y*7.)*1.3))*smoothstep(-.06,.16,R.y)*smoothstep(.60,.40,R.x);
  shade*=1.-.42*bars*wFish;
  shade*=1.-.55*step(.80,hash1(floor(R.x*17.)+floor(R.y*17.)*31.+floor(R.z*9.)*7.))*wEgg;
  shade*=1.-.34*smoothstep(.2,.8,sin(abs(R.z)*30.+R.x*7.))*smoothstep(.2,.4,abs(R.z))*wFly;
  shade=mix(shade,clamp(lsh+rim*.14,0.,1.),uGlow*.92);
  shade=clamp(shade+uHatch*wEgg*(.22+.18*sin(uTime*5.)),0.,1.);

  float vis=mix(smoothstep(-.14,.12,facing), mix(.42,1.,smoothstep(-.1,.1,facing)), wCell*(1.-nuc));
  float mul=1.; vKind=0.;
  if(part>5.5 && part<6.5) vis=0.;                         // the pupil: no dots at all
  if(part>6.5 && part<7.5){ shade=1.; mul=1.35; }          // and a bright ring round it
  if((part>4.5 && part<5.5) || (part>7.5 && part<8.5)){ vis*=smoothstep(.05,.6,uGlow); }
  if(part>7.5 && part<8.5){ shade=1.; mul=1.9; vKind=1.; }
  vis*=1.-m*.35;

  // on paper the dots are ink, and gather where the shadow is
  float ink=clamp(1.02-shade*.92+rim*.45,0.,1.);
  float S=mix(shade,ink,step(.5,uPaper));
  float size=uDot*mix(dotOf(uSA),dotOf(uSA+1.),f)*uRes.y*uObj.z*w*(.26+1.2*S)*mul*vis;
  gl_PointSize=max(size,1.);
  vAlpha=uObjA*clamp(size,0.,1.)*step(.001,vis);
  vShade=shade;
}`;

const PT_FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform vec3 uObj; uniform vec2 uPtr;
uniform float uPaper,uNight,uDawn,uSurf,uDepth,uPerch,uStage;
varying float vShade; varying float vAlpha; varying float vKind;
${NOISE}
void main(){
  vec2 c=gl_PointCoord-.5; float r=length(c);
  if(r>.5 || vAlpha<.004) discard;
  vec2 frag=gl_FragCoord.xy; vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=(frag-.5*uRes)/(.5*uRes.y);
  float px=uRes.y/900.;
  vec2 oc=vec2(uObj.x*asp,uObj.y)+uPtr*.012;
  vec2 q=(p-oc)/uObj.z;
  float eggW=clamp(1.-abs(uStage-4.),0.,1.);
  if(uPerch*eggW>.5 && nestBowl(q)<0.) discard;            // the nest is in front of the egg

  float wave=.010*sin(p.x*8.+uTime*1.1)+.006*sin(p.x*19.-uTime*1.6);
  float below=smoothstep(.006,-.006,p.y-uSurf-wave);
  vec3 lite=mix(vec3(.985,.96,.885),vec3(.80,.92,1.),below*(.35+.4*uDepth));
  lite=mix(lite,vec3(.72,.82,.98),uNight);
  lite=mix(lite,vec3(1.,.93,.80),uDawn*(1.-uNight)*.8);
  lite=mix(lite,vec3(.62,.95,1.)*1.15,vKind);
  lite*=.80+.20*vShade;
  vec3 inkc=vec3(.115,.11,.10);
  float onPaper=uPaper<.001?0.:uPaper>.999?1.:step(wipeField(uv,frag,p,px),uPaper*1.16-.06);
  vec3 col=mix(lite,inkc,onPaper);
  float a=vAlpha*smoothstep(.5,.40,r)*mix(1.,.94,onPaper)*(1.-.42*below*step(uSurf,1.5));
  gl_FragColor=vec4(col,a);
}`;

const BG_UNIFORMS = [
  "uRes", "uTime", "uPaper", "uNight", "uCloud", "uCloudR", "uObjA", "uObj", "uPtr", "uStage", "uSurf", "uDepth",
  "uBank", "uPerch", "uGlow", "uSpeed", "uOthers", "uDawn", "uYaw", "uPitch", "uHatch",
] as const;
const PT_UNIFORMS = [
  "uRes", "uTime", "uObj", "uPtr", "uSA", "uF", "uDiv", "uSwim", "uPh", "uYaw", "uPitch", "uHatch", "uGlow", "uPaper",
  "uObjA", "uDot", "uRepel", "uNight", "uDawn", "uSurf", "uDepth", "uPerch", "uStage",
] as const;
const STAGES = 6;

export class Film {
  ok = false;
  /** How many dots each creature is made of. */
  readonly count: number;
  private gl: WebGLRenderingContext | null = null;
  private bg: WebGLProgram | null = null;
  private pt: WebGLProgram | null = null;
  private ub: Record<string, WebGLUniformLocation | null> = {};
  private up: Record<string, WebGLUniformLocation | null> = {};
  private quad: WebGLBuffer | null = null;
  private seeds: WebGLBuffer | null = null;
  private pos: (WebGLBuffer | null)[] = Array(STAGES).fill(null);
  private nrm: (WebGLBuffer | null)[] = Array(STAGES).fill(null);
  private loc = { a: -1, aA: -1, aNA: -1, aB: -1, aNB: -1, aSeed: -1 };
  private scale = 1;
  private dot = 0.0105;
  private ptr = [0, 0];
  private repel = 0;
  private repelTo = 0;
  private ph = 0;
  private lastTime = 0;
  private hatchTo = 0;
  private hatch = 0;

  constructor(private canvas: HTMLCanvasElement, narrow: boolean) {
    this.count = narrow ? 15000 : 26000;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
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
    const link = (vsrc: string, fsrc: string) => {
      const vs = make(gl.VERTEX_SHADER, vsrc);
      const fs = make(gl.FRAGMENT_SHADER, fsrc);
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn("[film] shader failed to link:", gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    };
    const bg = link(BG_VERT, BG_FRAG);
    const pt = link(PT_VERT, PT_FRAG);
    if (!bg || !pt) return;
    for (const name of BG_UNIFORMS) this.ub[name] = gl.getUniformLocation(bg, name);
    for (const name of PT_UNIFORMS) this.up[name] = gl.getUniformLocation(pt, name);
    this.loc = {
      a: gl.getAttribLocation(bg, "a"),
      aA: gl.getAttribLocation(pt, "aA"),
      aNA: gl.getAttribLocation(pt, "aNA"),
      aB: gl.getAttribLocation(pt, "aB"),
      aNB: gl.getAttribLocation(pt, "aNB"),
      aSeed: gl.getAttribLocation(pt, "aSeed"),
    };
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const seeds = new Float32Array(this.count);
    for (let i = 0; i < seeds.length; i++) seeds[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.abs(seeds[i]);
    this.seeds = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.seeds);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LEQUAL);

    this.gl = gl;
    this.bg = bg;
    this.pt = pt;
    // The world pass is fill-rate bound, so the buffer is rendered below native
    // resolution; the dither and grain hide the difference.
    this.scale = narrow ? 0.7 : 0.85;
    this.ok = true;
    this.resize();
  }

  /** Hand the film one creature's dots (see `sampleStage`). */
  load(stage: number, pos: Float32Array, nrm: Float32Array) {
    const gl = this.gl;
    if (!gl || stage < 0 || stage >= STAGES || pos.length !== this.count * 4) return;
    this.pos[stage] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pos[stage]);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    this.nrm[stage] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nrm[stage]);
    gl.bufferData(gl.ARRAY_BUFFER, nrm, gl.STATIC_DRAW);
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6) * this.scale;
    const w = Math.max(2, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(2, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  /** Step the film down a notch: fewer pixels for the world pass. */
  degrade() {
    if (!this.gl || this.scale < 0.45) return;
    this.scale *= 0.82;
    this.resize();
  }

  /** x, y in −1…1, y up. Only a mouse parts the dots; a finger is busy scrolling. */
  pointer(x: number, y: number, mouse = true) {
    this.ptr[0] += (x - this.ptr[0]) * 0.08;
    this.ptr[1] += (y - this.ptr[1]) * 0.08;
    this.repelTo = mouse ? 1 : 0;
  }

  /** The brief was sent: the egg lights up. */
  hatchEgg() {
    this.hatchTo = 1;
  }

  render(s: FilmState, time: number) {
    const gl = this.gl;
    if (!gl || !this.bg || !this.pt) return;
    const dt = Math.min(0.05, Math.max(0, time - this.lastTime));
    this.lastTime = time;
    // Tail, legs and wings run on one phase, advanced here so a change of pace never makes it jump.
    const pace = s.stage < 1.5 ? 3 + 6.5 * s.speed : s.stage < 3 ? 2.4 : 7.6;
    this.ph = (this.ph + dt * pace) % (Math.PI * 200);
    this.hatch += (this.hatchTo - this.hatch) * Math.min(1, dt * 1.6);
    this.repel += (this.repelTo - this.repel) * Math.min(1, dt * 3);
    const W = this.canvas.width, H = this.canvas.height;

    // ---- the world ----
    gl.useProgram(this.bg);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    const b = this.ub;
    gl.uniform2f(b.uRes, W, H);
    gl.uniform1f(b.uTime, time);
    gl.uniform1f(b.uPaper, s.paper);
    gl.uniform1f(b.uNight, s.night);
    gl.uniform1f(b.uCloud, s.cloud);
    gl.uniform1f(b.uCloudR, s.cr);
    gl.uniform1f(b.uObjA, s.oa);
    gl.uniform3f(b.uObj, s.ox, s.oy, s.os);
    gl.uniform2f(b.uPtr, this.ptr[0], this.ptr[1]);
    gl.uniform1f(b.uStage, s.stage);
    gl.uniform1f(b.uSurf, s.surf);
    gl.uniform1f(b.uDepth, s.depth);
    gl.uniform1f(b.uBank, s.bank);
    gl.uniform1f(b.uPerch, s.perch);
    gl.uniform1f(b.uGlow, s.glow);
    gl.uniform1f(b.uSpeed, s.speed);
    gl.uniform1f(b.uOthers, s.others);
    gl.uniform1f(b.uDawn, s.dawn);
    gl.uniform1f(b.uYaw, s.yaw);
    gl.uniform1f(b.uPitch, s.pitch);
    gl.uniform1f(b.uHatch, this.hatch);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(this.loc.a);
    gl.vertexAttribPointer(this.loc.a, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---- the creature ----
    if (s.oa < 0.01) return;
    let sa = Math.min(STAGES - 2, Math.floor(s.stage));
    let f = s.stage - sa;
    if (!this.pos[sa + 1]) f = 0; //           the next form is not sampled yet: hold this one
    if (!this.pos[sa]) {
      // deep-linked past what is loaded: show the nearest form we have
      let k = sa;
      while (k > 0 && !this.pos[k]) k--;
      if (!this.pos[k]) return;
      sa = Math.min(k, STAGES - 2);
      f = k === STAGES - 1 ? 1 : 0;
    }
    const posB = this.pos[sa + 1] ?? this.pos[sa];
    const nrmB = this.nrm[sa + 1] ?? this.nrm[sa];

    gl.useProgram(this.pt);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    const bind = (loc: number, buf: WebGLBuffer | null, size: number) => {
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind(this.loc.aA, this.pos[sa], 4);
    bind(this.loc.aNA, this.nrm[sa], 3);
    bind(this.loc.aB, posB, 4);
    bind(this.loc.aNB, nrmB, 3);
    bind(this.loc.aSeed, this.seeds, 1);
    const u = this.up;
    gl.uniform2f(u.uRes, W, H);
    gl.uniform1f(u.uTime, time);
    gl.uniform3f(u.uObj, s.ox, s.oy, s.os);
    gl.uniform2f(u.uPtr, this.ptr[0], this.ptr[1]);
    gl.uniform1f(u.uSA, sa);
    gl.uniform1f(u.uF, f);
    gl.uniform1f(u.uDiv, s.div);
    gl.uniform1f(u.uSwim, s.swim);
    gl.uniform1f(u.uPh, this.ph);
    gl.uniform1f(u.uYaw, s.yaw);
    gl.uniform1f(u.uPitch, s.pitch);
    gl.uniform1f(u.uHatch, this.hatch);
    gl.uniform1f(u.uGlow, s.glow);
    gl.uniform1f(u.uPaper, s.paper);
    gl.uniform1f(u.uObjA, s.oa);
    gl.uniform1f(u.uDot, this.dot);
    gl.uniform1f(u.uRepel, this.repel);
    gl.uniform1f(u.uNight, s.night);
    gl.uniform1f(u.uDawn, s.dawn);
    gl.uniform1f(u.uSurf, s.surf);
    gl.uniform1f(u.uDepth, s.depth);
    gl.uniform1f(u.uPerch, s.perch);
    gl.uniform1f(u.uStage, s.stage);
    gl.drawArrays(gl.POINTS, 0, this.count);
    for (const l of [this.loc.aA, this.loc.aNA, this.loc.aB, this.loc.aNB, this.loc.aSeed]) {
      if (l >= 0) gl.disableVertexAttribArray(l);
    }
  }

  destroy() {
    const gl = this.gl;
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }
}

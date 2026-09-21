/**
 * The film: Kodinav's scroll-scrubbed backdrop, rendered live in one WebGL
 * fragment shader. It is original artwork in code —
 *
 *   · a cobalt sky with grain and halftone clouds (night and day),
 *   · an armillary sphere, the navigator's instrument, ray-marched and shaded
 *     like an engraving through an ordered dither,
 *   · a warm-paper world that the sky dissolves into (and back out of)
 *     through a pixel-dither wipe.
 *
 * The stage feeds it a handful of numbers per frame (see `filmAt`); nothing
 * here knows about the DOM. If WebGL is unavailable the canvas stays empty
 * and the CSS gradient behind it shows instead.
 */

export type FilmState = {
  /** 0 = sky world, 1 = paper world (dissolved with a dither wipe). */
  paper: number;
  /** 0 = day cobalt, 1 = night. */
  night: number;
  /** Cloud cover, 0..1. */
  cloud: number;
  /** Clouds on the right-hand side, 0..1 (cleared while the work column is up). */
  cr: number;
  /** Instrument centre: x as a fraction of half-width, y of half-height. */
  ox: number;
  oy: number;
  /** Instrument scale (1 ≈ fills the viewport height). */
  os: number;
  /** Instrument opacity. */
  oa: number;
  /** Ring angles, radians. */
  s1: number;
  s2: number;
  s3: number;
};

type Key = { p: number } & Omit<FilmState, "s1" | "s2" | "s3">;

/* Where the camera is at each point of the scroll. Wide screens keep the
   instrument beside the type; narrow screens lift it above. */
const WIDE: Key[] = [
  { p: 0.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.64, oy: 0.03, os: 0.54, oa: 1 },
  { p: 0.06, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.62, oy: 0.05, os: 0.6, oa: 1 },
  { p: 0.085, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.47, oy: 0.02, os: 0.76, oa: 1 },
  { p: 0.215, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.45, oy: -0.03, os: 0.86, oa: 1 },
  { p: 0.24, paper: 0, night: 0, cloud: 0.9, cr: 0, ox: -0.78, oy: -0.34, os: 1.42, oa: 0.9 },
  { p: 0.5, paper: 0, night: 0, cloud: 0.9, cr: 0, ox: -0.84, oy: 0.3, os: 1.5, oa: 0.9 },
  { p: 0.525, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: -0.5, oy: -0.06, os: 0.74, oa: 1 },
  { p: 0.585, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: -0.49, oy: -0.04, os: 0.78, oa: 1 },
  { p: 0.6, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.56, oy: 0.06, os: 0.74, oa: 1 },
  { p: 0.64, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.56, oy: 0.02, os: 0.78, oa: 1 },
  { p: 0.668, paper: 0, night: 1, cloud: 0.3, cr: 1, ox: 0.0, oy: -0.82, os: 0.86, oa: 0.62 },
  { p: 0.8, paper: 0, night: 1, cloud: 0.3, cr: 1, ox: 0.0, oy: -0.86, os: 0.94, oa: 0.62 },
  { p: 0.83, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: -0.55, oy: -0.4, os: 0.74, oa: 0.7 },
  { p: 0.905, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: -0.54, oy: -0.36, os: 0.78, oa: 0.7 },
  { p: 0.945, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: -0.04, os: 0.98, oa: 0.78 },
  { p: 1.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: 0.0, os: 1.04, oa: 0.78 },
];

const NARROW: Key[] = [
  { p: 0.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.22, oy: 0.5, os: 0.4, oa: 1 },
  { p: 0.06, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.2, oy: 0.52, os: 0.44, oa: 1 },
  { p: 0.085, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.1, oy: 0.4, os: 0.5, oa: 1 },
  { p: 0.215, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.0, oy: 0.36, os: 0.56, oa: 1 },
  { p: 0.24, paper: 0, night: 0, cloud: 0.9, cr: 1, ox: -0.5, oy: 0.62, os: 0.8, oa: 0.55 },
  { p: 0.5, paper: 0, night: 0, cloud: 0.9, cr: 1, ox: 0.5, oy: 0.66, os: 0.86, oa: 0.55 },
  { p: 0.525, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.0, oy: 0.6, os: 0.4, oa: 1 },
  { p: 0.64, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.06, oy: 0.62, os: 0.42, oa: 1 },
  { p: 0.668, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: 0.0, oy: -0.8, os: 0.6, oa: 0.8 },
  { p: 0.8, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: 0.0, oy: -0.84, os: 0.64, oa: 0.78 },
  { p: 0.83, paper: 0, night: 1, cloud: 0.2, cr: 1, ox: 0.0, oy: 0.2, os: 0.36, oa: 0.8 },
  { p: 0.905, paper: 0, night: 1, cloud: 0.2, cr: 1, ox: 0.0, oy: 0.22, os: 0.38, oa: 0.8 },
  { p: 0.945, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: 0.06, os: 0.5, oa: 0.5 },
  { p: 1.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: 0.08, os: 0.54, oa: 0.5 },
];

/* A portrait tablet keeps the two-column layout inside a tall frame, so the
   instrument keeps to the top of it: above the headline, above the plate, and
   on the side of the page the type is not. */
const PORTRAIT: Key[] = [
  { p: 0.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.22, oy: 0.5, os: 0.4, oa: 1 },
  { p: 0.06, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.2, oy: 0.52, os: 0.44, oa: 1 },
  { p: 0.085, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.1, oy: 0.42, os: 0.46, oa: 1 },
  { p: 0.215, paper: 1, night: 0, cloud: 0.6, cr: 1, ox: 0.0, oy: 0.4, os: 0.5, oa: 1 },
  { p: 0.24, paper: 0, night: 0, cloud: 0.9, cr: 0, ox: -0.45, oy: 0.62, os: 0.4, oa: 0.6 },
  { p: 0.5, paper: 0, night: 0, cloud: 0.9, cr: 0, ox: -0.45, oy: 0.6, os: 0.42, oa: 0.6 },
  { p: 0.525, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: -0.5, oy: 0.6, os: 0.3, oa: 1 },
  { p: 0.585, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: -0.5, oy: 0.6, os: 0.32, oa: 1 },
  { p: 0.6, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.5, oy: 0.62, os: 0.3, oa: 1 },
  { p: 0.64, paper: 1, night: 0, cloud: 0.5, cr: 1, ox: 0.5, oy: 0.62, os: 0.32, oa: 1 },
  { p: 0.668, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: 0.0, oy: -0.8, os: 0.6, oa: 0.7 },
  { p: 0.8, paper: 0, night: 1, cloud: 0.25, cr: 1, ox: 0.0, oy: -0.84, os: 0.64, oa: 0.7 },
  { p: 0.83, paper: 0, night: 1, cloud: 0.2, cr: 1, ox: -0.5, oy: -0.44, os: 0.52, oa: 0.7 },
  { p: 0.905, paper: 0, night: 1, cloud: 0.2, cr: 1, ox: -0.5, oy: -0.4, os: 0.54, oa: 0.7 },
  { p: 0.945, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: -0.04, os: 0.7, oa: 0.78 },
  { p: 1.0, paper: 0, night: 0, cloud: 1, cr: 1, ox: 0.0, oy: 0.0, os: 0.74, oa: 0.78 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (p: number, from: number, to: number) => smooth(Math.min(1, Math.max(0, (p - from) / (to - from))));

/** wide: beside the type · tablet: ≤1100px, still two columns · narrow: one column */
export type FilmMode = "wide" | "tablet" | "narrow";

export function filmAt(p: number, mode: FilmMode, time: number, portrait = false): FilmState {
  const keys = mode === "narrow" ? NARROW : mode === "tablet" && portrait ? PORTRAIT : WIDE;
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].p && p <= keys[i + 1].p) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const span = Math.max(1e-6, b.p - a.p);
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / span)));
  const mix = (x: number, y: number) => x + (y - x) * t;
  let ox = mix(a.ox, b.ox);
  let os = mix(a.os, b.os);
  let oa = mix(a.oa, b.oa);
  if (mode === "tablet" && !portrait) {
    // A small landscape screen runs the wide film with a smaller instrument:
    // further into the corner and quieter while the work column is up, and
    // further out to the side while the terms are being read.
    const inWork = ramp(p, 0.215, 0.24) * (1 - ramp(p, 0.5, 0.525));
    const inTerms = ramp(p, 0.5, 0.525) * (1 - ramp(p, 0.64, 0.668));
    os *= 0.74;
    ox = (ox - 0.2 * inWork) * (1 + 0.25 * inTerms);
    oa *= 1 - 0.55 * inWork;
  }
  return {
    paper: mix(a.paper, b.paper),
    night: mix(a.night, b.night),
    cloud: mix(a.cloud, b.cloud),
    cr: mix(a.cr, b.cr),
    ox,
    oy: mix(a.oy, b.oy),
    os,
    oa,
    // the rings turn with the scroll — scrubbing, like film — plus a slow idle drift
    s1: p * 9.0 + time * 0.05,
    s2: -p * 7.0 + 1.1 - time * 0.035,
    s3: p * 12.0 + time * 0.06,
  };
}

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform float uPaper, uNight, uCloud, uCloudR, uObjA, uSteps;
uniform vec3 uObj;   // x, y, scale
uniform vec3 uSpin;
uniform vec2 uPtr;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec2(17.1,9.2); a*=.5; } return s; }
float bayer2(vec2 a){ a=floor(a); return fract(a.x/2.+a.y*a.y*.75); }
float bayer4(vec2 a){ return bayer2(.5*a)*.25+bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5*a)*.25+bayer2(a); }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

// a flat band bent into a ring: the armillary's hoops
float band(vec3 p, float R, float w, float h){
  vec2 q=vec2(length(p.xz)-R, p.y);
  vec2 d=abs(q)-vec2(w,h);
  return length(max(d,0.))+min(max(d.x,d.y),0.)-.006;
}
float capsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }

float map(vec3 p){
  float d=length(p)-.27;
  vec3 a=p; a.xy*=rot(.38); a.yz*=rot(uSpin.x);           d=min(d, band(a,1.00,.014,.052));
  vec3 b=p; b.xy*=rot(-.62); b.xz*=rot(uSpin.y); b.yz*=rot(1.18); d=min(d, band(b,.83,.013,.046));
  vec3 c=p; c.yz*=rot(.9); c.xy*=rot(uSpin.z);            d=min(d, band(c,.655,.012,.04));
  vec3 e=p; e.xy*=rot(.38);                                d=min(d, capsule(e,vec3(0,-1.16,0),vec3(0,1.16,0),.011));
  // two small finials on the axis
  d=min(d, length(e-vec3(0,1.16,0))-.035);
  d=min(d, length(e+vec3(0,1.16,0))-.035);
  // the bead that rides the outer hoop
  vec3 g=a; g.xz*=rot(uSpin.z*.7);                         d=min(d, length(g-vec3(1.,0.,0.))-.05);
  return d;
}
vec3 nrm(vec3 p){ vec2 e=vec2(.0015,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx))); }

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=(frag-.5*uRes)/(.5*uRes.y);           // y in [-1,1], x in [-asp,asp]
  float px=uRes.y/900.;                         // design pixels

  // ---------- sky ----------
  vec3 dayTop=vec3(.035,.165,.52), dayLow=vec3(.10,.37,.78);
  vec3 nitTop=vec3(.016,.02,.05),  nitLow=vec3(.05,.085,.2);
  float gy=smoothstep(0.,1.,uv.y);
  vec3 sky=mix(mix(dayLow,dayTop,gy), mix(nitLow,nitTop,gy), uNight);
  sky*=1.+.10*(fbm(p*1.3+3.)-.5);

  // stars, only at night
  vec2 sc=floor(frag/(2.2*px));
  float st=step(.9975,hash(sc))*uNight*(.55+.45*sin(uTime*1.5+hash(sc+3.)*40.));
  sky+=vec3(.95,.93,.85)*st*smoothstep(-.2,.6,p.y);

  // halftone clouds: a handful of compact puffs, read through a dot screen
  float cell=6.5*px;
  vec2 cc=(floor(frag/cell)+.5)*cell;
  vec2 cp=(cc-.5*uRes)/(.5*uRes.y);
  float dens=0., lit=0.;
  for(int i=0;i<5;i++){
    float fi=float(i);
    vec2 c=vec2(0.); float s=.3;
    if(i==0){ c=vec2(.10*asp, .80); s=.30; }
    if(i==1){ c=vec2(.80*asp, .46); s=.24; }
    if(i==2){ c=vec2(-.66*asp,.70); s=.27; }
    if(i==3){ c=vec2(-.06*asp,-.84); s=.26; }
    if(i==4){ c=vec2(.62*asp,-.70); s=.22; }
    s*=clamp(asp/1.6,.42,1.);                          // smaller puffs on a tall screen
    c.x+=sin(uTime*.013+fi*2.1)*.05+uTime*.0016*(fi-2.);
    vec2 d=(cp-c)/vec2(s*1.75,s*.66);
    float bump=fbm(cp*5.2+fi*7.3)*.62;
    float body=1.-length(d)+bump-.34;
    float under=smoothstep(-.34,.02,d.y);              // a flatter underside
    float dn=smoothstep(.0,.30,body)*under;
    dn*=mix(1., uCloudR, smoothstep(.50,.60,uv.x));    // keep the sky clear behind the work column
    lit=max(lit, dn*smoothstep(-.5,.7,d.y+bump*.5));
    dens=max(dens,dn);
  }
  dens*=uCloud;
  float rad=sqrt(clamp(dens,0.,1.))*.52*cell;
  float dotm=smoothstep(rad,rad-1.1*px,length(frag-cc))*step(.03,dens);
  vec3 cloudCol=mix(vec3(.60,.64,.76),vec3(.98,.95,.87),clamp(lit/max(dens,.001),0.,1.));
  cloudCol=mix(cloudCol,vec3(.42,.5,.72),uNight*.75);
  sky=mix(sky,cloudCol,dotm*.96);

  // ---------- paper ----------
  vec3 paper=vec3(.949,.945,.929);
  paper*=1.+.035*(fbm(p*2.2+40.)-.5);

  // ---------- the instrument ----------
  float shade=0., hit=0.;
  vec2 oc=vec2(uObj.x*asp,uObj.y)+uPtr*.012;
  vec2 q=(p-oc)/uObj.z;
  if(uObjA>.01 && dot(q,q)<1.62){
    vec3 ro=vec3(0.,0.,-4.2), rd=normalize(vec3(q,4.2));
    float b=dot(ro,rd), c2=dot(ro,ro)-1.5;      // bounding sphere
    float h=b*b-c2;
    if(h>0.){
      float t=-b-sqrt(h);
      float tmax=-b+sqrt(h);
      for(int i=0;i<72;i++){
        if(float(i)>=uSteps) break;
        vec3 pos=ro+rd*t;
        float d=map(pos);
        if(d<.0018){ hit=1.; break; }
        t+=d*.92;
        if(t>tmax) break;
      }
      if(hit>.5){
        vec3 pos=ro+rd*t, n=nrm(pos);
        vec3 L=normalize(vec3(-.55,.75,-.55));
        float dif=clamp(dot(n,L),0.,1.);
        float amb=.5+.5*n.y;
        float rim=pow(1.-clamp(dot(n,-rd),0.,1.),2.5);
        float spec=pow(clamp(dot(reflect(-L,n),-rd),0.,1.),22.);
        shade=clamp(dif*.78+amb*.2+rim*.16+spec*.5,0.,1.);
      }
    }
  }
  // engraving: quantise the light through an ordered dither
  float dth=bayer8(frag/(1.6*px));
  float q4=floor(shade*4.+dth)/4.;

  vec3 objSky=mix(vec3(.10,.17,.46), vec3(.975,.95,.875), q4);
  objSky=mix(objSky, mix(vec3(.04,.06,.16), vec3(.80,.84,.95), q4), uNight);
  vec3 objPaper=mix(vec3(.115,.11,.10), vec3(.93,.92,.895), q4);

  vec3 skyScene=mix(sky,objSky,hit*uObjA);
  vec3 paperScene=mix(paper,objPaper,hit*uObjA);

  // ---------- the wipe between the two worlds ----------
  vec2 wc=floor(frag/(3.*px));
  float field=abs(uv.x-.5)*1.5+abs(uv.y-.5)*.35;                 // opens from the centre
  field=field*.62+bayer8(wc)*.16+fbm(p*3.4+7.)*.30;
  float k=uPaper*1.16-.06;
  float mask=step(field,k);
  vec3 col=mix(skyScene,paperScene,mask);
  // a fringe of loose coloured pixels along the moving edge
  float edge=smoothstep(.05,0.,abs(field-k))*step(.001,uPaper)*step(uPaper,.999);
  float rnd=hash(wc+floor(uTime*8.));
  vec3 spark=.5+.5*cos(6.2831*(rnd+vec3(0.,.33,.67)));
  col=mix(col,spark,edge*step(.55,rnd)*.85);

  // grain
  col+=(hash(frag+fract(uTime)*91.7)-.5)*.04;
  gl_FragColor=vec4(col,1.);
}`;

export class Film {
  ok = false;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private scale = 1;
  private steps = 64;
  private ptr = [0, 0];

  constructor(private canvas: HTMLCanvasElement, narrow: boolean) {
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
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
    const vs = make(gl.VERTEX_SHADER, VERT);
    const fs = make(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of ["uRes", "uTime", "uPaper", "uNight", "uCloud", "uCloudR", "uObjA", "uSteps", "uObj", "uSpin", "uPtr"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    this.gl = gl;
    this.prog = prog;
    // Fill-rate is the cost here, so the buffer is rendered below native
    // resolution; the dither and grain hide the difference.
    this.scale = narrow ? 0.62 : 0.8;
    this.steps = narrow ? 44 : 64;
    this.ok = true;
    this.resize();
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * this.scale;
    const w = Math.max(2, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(2, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  /** Step the film down a notch: fewer pixels, shorter marches. */
  degrade() {
    if (!this.gl || this.scale < 0.42) return;
    this.scale *= 0.8;
    this.steps = Math.max(30, this.steps - 12);
    this.resize();
  }

  pointer(x: number, y: number) {
    this.ptr[0] += (x - this.ptr[0]) * 0.06;
    this.ptr[1] += (y - this.ptr[1]) * 0.06;
  }

  render(s: FilmState, time: number) {
    const gl = this.gl;
    if (!gl) return;
    const u = this.u;
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uPaper, s.paper);
    gl.uniform1f(u.uNight, s.night);
    gl.uniform1f(u.uCloud, s.cloud);
    gl.uniform1f(u.uCloudR, s.cr);
    gl.uniform1f(u.uObjA, s.oa);
    gl.uniform1f(u.uSteps, this.steps);
    gl.uniform3f(u.uObj, s.ox, s.oy, s.os);
    gl.uniform3f(u.uSpin, s.s1, s.s2, s.s3);
    gl.uniform2f(u.uPtr, this.ptr[0], this.ptr[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    const gl = this.gl;
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }
}

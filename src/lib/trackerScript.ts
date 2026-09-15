/**
 * First-party analytics tracker, rendered as a plain inline script in
 * RootDocument (a client component with usePathname in the root layout broke
 * the production build once — see the note there).
 *
 * - Page views, including client-side navigations (history.pushState).
 * - Engaged time: only while the tab is visible, sent when it is hidden.
 * - Clicks on WhatsApp, email and phone links; window.kdnTrack(name) for others.
 * - First-touch attribution per tab session (landing page, referrer, UTM),
 *   read back by lib/attribution.ts when a form is submitted.
 *
 * No cookies. sessionStorage holds a random per-tab visit id; localStorage
 * holds a single "seen before" flag. Skips /admin and automated browsers.
 */
export const trackerScript = `(function(){try{
var L=location,D=document,N=navigator,S=sessionStorage;
if(/^\\/admin/.test(L.pathname))return;
if(/[?&]kdn_allow=1/.test(L.search))S.setItem('kdn_allow','1');
if(N.webdriver&&!S.getItem('kdn_allow'))return;
function rnd(){return Math.random().toString(36).slice(2,12)+Date.now().toString(36)}
var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
var sid=S.getItem('kdn_sid');if(!sid){sid=rnd();S.setItem('kdn_sid',sid)}
var q=new URLSearchParams(L.search),ext=D.referrer&&D.referrer.indexOf(L.origin)!==0?D.referrer.slice(0,300):'';
if(!S.getItem('kdn_attr'))S.setItem('kdn_attr',JSON.stringify({lp:L.pathname,ref:ext,us:q.get('utm_source')||'',um:q.get('utm_medium')||'',uc:q.get('utm_campaign')||'',g:q.has('gclid')?1:0}));
var isNew=0;try{if(!localStorage.getItem('kdn_seen')){localStorage.setItem('kdn_seen','1');isNew=1}}catch(e){}
function send(b){b.tz=tz;b.nl=N.language||'';var s=JSON.stringify(b);
if(N.sendBeacon&&N.sendBeacon('/api/track',new Blob([s],{type:'application/json'})))return;
fetch('/api/track',{method:'POST',body:s,keepalive:true,headers:{'Content-Type':'application/json'}}).catch(function(){})}
var cur=null,first=true;
function flush(){if(!cur)return;if(cur.vis){cur.ms+=Date.now()-cur.vis;cur.vis=0}if(cur.ms>999&&cur.ms>cur.sent){cur.sent=cur.ms;send({t:'lv',id:cur.id,ms:cur.ms})}}
function view(){var p=L.pathname;if(cur&&cur.p===p)return;flush();
cur={id:rnd(),p:p,ms:0,sent:0,vis:D.visibilityState==='visible'?Date.now():0};
var u=new URLSearchParams(L.search);
send({t:'pv',id:cur.id,sid:sid,p:p,r:first?ext:'',us:first?u.get('utm_source')||'':'',um:first?u.get('utm_medium')||'':'',uc:first?u.get('utm_campaign')||'':'',g:first&&u.has('gclid')?1:0,l:D.documentElement.lang||'',w:innerWidth,n:first?isNew:0});
first=false}
['pushState','replaceState'].forEach(function(k){var o=history[k];history[k]=function(){var r=o.apply(this,arguments);setTimeout(view,0);return r}});
addEventListener('popstate',function(){setTimeout(view,0)});
D.addEventListener('visibilitychange',function(){if(!cur)return;if(D.visibilityState==='hidden')flush();else cur.vis=Date.now()});
addEventListener('pagehide',flush);
window.kdnTrack=function(n,s){send({t:'ev',n:String(n),s:s?String(s):'',p:L.pathname,sid:sid})};
D.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;
var h=a.getAttribute('href')||'',n=/^https:\\/\\/(wa\\.me|api\\.whatsapp\\.com)\\//.test(h)?'whatsapp':/^mailto:/.test(h)?'email':/^tel:/.test(h)?'phone':'';
if(n)window.kdnTrack(n)},true);
view();
}catch(e){}})();`;

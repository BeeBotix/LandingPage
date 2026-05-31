/* ================================================================
   BeeBotix main.js — v6 clean
   All data in window.BB. Three.js loads synchronously before this.
   ================================================================ */
"use strict";

/* ---- SVG constants — defined FIRST so boot() can reference them ---- */
var EXT = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
var ARR = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
var SICONS = {
  instagram:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  x:        '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  youtube:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.96-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
};

/* ASCII ramp — sparse to dense */
var RAMP = " .,:;~!?+<>/\\|(){}[]il1#@";
function toC(v){ return RAMP[Math.round(Math.max(0,Math.min(1,v))*(RAMP.length-1))]; }

/* ================================================================
   MICRO UTILS — defined before BOOT so nothing is undefined
   ================================================================ */
function g(id)       { return document.getElementById(id); }
function mk(tag)     { return document.createElement(tag); }
function mkc(t,cls)  { var e=mk(t); e.className=cls; return e; }
function set(id,v)   { var e=g(id); if(e&&v!=null) e.textContent=String(v); }
function xe(s){
  if(s==null) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ================================================================
   BOOT
   ================================================================ */
(function boot(){
  var d = window.BB;
  if(!d){ console.error("BeeBotix: window.BB missing"); return; }

  fillNav(d.nav);
  fillHero(d.hero);
  fillAbout(d.about);
  fillPlatform(d.platform);
  fillBrands(d.brands);
  fillFAQ(d.faq);
  fillContact(d.contact);
  if(d.gallery) fillGallery(d.gallery);
  fillFooter(d.footer, d.site);

  document.body.classList.add("r");

  var yr=g("hero-year"); if(yr) yr.textContent=new Date().getFullYear();

  uiNav();
  uiMobileNav();
  uiReveal();
  uiScrollBar();
  uiMarquee();
  uiCursor();
  uiForm();

  /* ASCII art — called by correct names */
  buildAsciiChip();
  /* Offering card ASCII injected after cards exist */
  setTimeout(injectOfferingAscii, 120);

  /* WebGL — two rAFs to guarantee canvas has painted dimensions */
  function startGL(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        heroGL();
        brandsGL();
      });
    });
  }
  if(document.readyState==="complete"){ startGL(); }
  else { window.addEventListener("load", startGL); }

  /* Notification bar */
  initNotifBar();
})();

/* ================================================================
   FILL CONTENT
   ================================================================ */

function fillNav(items){
  var dl=g("nav-list"), ml=g("nav-overlay-list");
  (items||[]).forEach(function(item){
    if(dl){
      var li=mk("li"), a=mk("a");
      a.href=item.href; a.textContent=item.label;
      if(item.external){a.target="_blank";a.rel="noopener";var sp=mk("span");sp.className="nav-ext";sp.textContent="ext";a.appendChild(sp);}
      li.appendChild(a); dl.appendChild(li);
    }
    if(ml){
      var li2=mk("li"), a2=mk("a");
      a2.href=item.href; a2.textContent=item.label;
      if(item.external){a2.target="_blank";a2.rel="noopener";}
      a2.addEventListener("click",closeNav);
      li2.appendChild(a2); ml.appendChild(li2);
    }
  });
}

function fillHero(h){
  set("hero-badge",h.badge); set("hero-sub",h.sub);
  var el=g("hero-headline");
  if(el&&h.slogan){
    el.innerHTML=h.slogan.split("\n").map(function(p,i){ return i===1?"<em>"+xe(p)+"</em>":xe(p); }).join("<br>");
  }
}

function fillAbout(a){
  var hh=g("about-headline");
  if(hh&&a.headline) hh.innerHTML=a.headline.split("\n").map(xe).join("<br>");
  set("about-body",a.body);
  var ai=a.edge_ai||{};
  var eh=g("edge-headline");
  if(eh&&ai.headline) eh.innerHTML=ai.headline.split("\n").map(xe).join("<br>");
  set("edge-body",ai.body);
  var sg=g("stats-grid");
  (a.stats||[]).forEach(function(s){
    var c=mkc("div","stat-card r-item");
    c.innerHTML='<div class="stat-value">'+xe(s.value)+'</div><div class="stat-label">'+xe(s.label)+'</div>';
    if(sg) sg.appendChild(c);
  });
}

function fillPlatform(p){
  set("platform-label",p.label); set("platform-sub",p.sub);
  var ph=g("platform-headline");
  if(ph&&p.headline) ph.innerHTML=p.headline.split("\n").map(xe).join("<br>");
  var grid=g("offerings-grid"); if(!grid) return;
  (p.offerings||[]).forEach(function(o,i){
    var card=mkc("div","offering-card r-item");
    var tags=(o.tags||[]).map(function(t){return '<span class="tag">'+xe(t)+'</span>';}).join("");
    var lnk="";
    if(o.cta){
      var ext=!!o.cta.external;
      lnk='<a class="offering-link" href="'+xe(o.cta.href)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+xe(o.cta.label)+(ext?EXT:ARR)+'</a>';
    }
    card.innerHTML=
      '<div class="offering-num">'+xe(o.index)+'</div>'+
      '<div class="offering-title">'+xe(o.title)+'</div>'+
      '<div class="offering-tagline">'+xe(o.tagline)+'</div>'+
      '<div class="offering-desc">'+xe(o.description)+'</div>'+
      '<div class="offering-tags">'+tags+'</div>'+lnk+
      '<div class="offering-bar"></div>';
    grid.appendChild(card);
  });
}

function fillBrands(brands){
  var list=g("brands-list"); if(!list) return;
  (brands||[]).forEach(function(b){
    var card=mkc("div","brand-card r-item");
    var kws=(b.keywords||[]).map(function(k){return '<div class="brand-kw">'+xe(k)+'</div>';}).join("");
    card.innerHTML=
      '<div class="brand-left"><div class="brand-name">'+xe(b.name)+'</div><div class="brand-tagline">'+xe(b.tagline)+'</div><div class="brand-sector">'+xe(b.sector)+'</div></div>'+
      '<div class="brand-desc">'+xe(b.description)+'</div>'+
      '<div class="brand-right"><a class="brand-link" href="'+xe(b.url)+'" target="_blank" rel="noopener">'+EXT+xe(b.subdomain)+'</a><div class="brand-keywords">'+kws+'</div></div>';
    list.appendChild(card);
  });
}

function fillFAQ(faqs){
  var list=g("faq-list"); if(!list) return;
  (faqs||[]).forEach(function(item){
    var div=mkc("div","faq-item r-item");
    div.innerHTML=
      '<button class="faq-q" aria-expanded="false"><span class="faq-q-text">'+xe(item.q)+'</span><span class="faq-icon" aria-hidden="true">+</span></button>'+
      '<div class="faq-ans"><p class="faq-ans-text">'+xe(item.a)+'</p></div>';
    div.querySelector(".faq-q").addEventListener("click",function(){
      var open=div.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function(el){ el.classList.remove("open"); el.querySelector(".faq-q").setAttribute("aria-expanded","false"); });
      if(!open){div.classList.add("open");this.setAttribute("aria-expanded","true");}
    });
    list.appendChild(div);
  });
}

function fillContact(c){
  if(!c){console.error("BB: contact missing");return;}
  set("contact-headline",c.headline); set("contact-body",c.body);
  var ff=g("form-fields"); if(!ff) return;
  (c.form_fields||[]).forEach(function(f){
    var grp=mkc("div","form-group");
    var lbl=mk("label"); lbl.className="form-label"; lbl.setAttribute("for",f.name); lbl.textContent=f.label;
    grp.appendChild(lbl);
    var ctrl;
    if(f.type==="select"){
      ctrl=mk("select"); ctrl.className="form-select";
      var ph=mk("option"); ph.value=""; ph.textContent="Select one\u2026"; ph.disabled=true; ph.selected=true; ctrl.appendChild(ph);
      (f.options||[]).forEach(function(opt){var o=mk("option");o.value=opt;o.textContent=opt;ctrl.appendChild(o);});
    } else if(f.type==="textarea"){
      ctrl=mk("textarea"); ctrl.className="form-textarea"; ctrl.placeholder="Describe your use case."; ctrl.rows=4;
    } else {
      ctrl=mk("input"); ctrl.className="form-input"; ctrl.type=f.type;
    }
    ctrl.name=f.name; ctrl.id=f.name; if(f.required) ctrl.required=true;
    grp.appendChild(ctrl); ff.appendChild(grp);
  });
}

function fillFooter(footer,site){
  var soc=g("footer-social");
  if(soc&&site&&site.social){
    Object.keys(SICONS).forEach(function(k){
      if(!site.social[k]) return;
      var a=mk("a"); a.className="social-btn"; a.href=site.social[k]; a.target="_blank"; a.rel="noopener"; a.setAttribute("aria-label",k); a.innerHTML=SICONS[k]; soc.appendChild(a);
    });
  }
  colLinks("footer-support",footer.support);
  colLinks("footer-solutions",footer.solutions);
  colLinks("footer-company",footer.company);
  var leg=g("footer-legal");
  (footer.legal||[]).forEach(function(l){var li=mk("li");var a=mk("a");a.href=l.href;a.textContent=l.label;li.appendChild(a);if(leg)leg.appendChild(li);});
}

function colLinks(id,items){
  var ul=g(id); if(!ul||!items) return;
  items.forEach(function(l){
    var li=mk("li"),a=mk("a"); a.href=l.href; a.textContent=l.label;
    if(l.href&&l.href.startsWith("http")){a.target="_blank";a.rel="noopener";}
    li.appendChild(a); ul.appendChild(li);
  });
}

/* ================================================================
   UI BEHAVIOURS
   ================================================================ */

function uiNav(){
  var nav=g("navbar"); if(!nav) return;
  function t(){ nav.classList.toggle("scrolled",window.scrollY>10); }
  window.addEventListener("scroll",t,{passive:true}); t();
}

function closeNav(){
  var tog=g("nav-toggle"),ov=g("nav-overlay");
  if(tog){tog.classList.remove("open");tog.setAttribute("aria-expanded","false");}
  if(ov) ov.classList.remove("open");
  document.body.style.overflow="";
}

function uiMobileNav(){
  var tog=g("nav-toggle"),ov=g("nav-overlay"),cl=g("nav-overlay-close");
  if(!tog||!ov) return;
  var open=false;
  tog.addEventListener("click",function(e){
    e.preventDefault(); open=!open;
    tog.classList.toggle("open",open); ov.classList.toggle("open",open);
    document.body.style.overflow=open?"hidden":""; tog.setAttribute("aria-expanded",String(open));
  });
  if(cl) cl.addEventListener("click",function(e){e.preventDefault();open=false;closeNav();});
  ov.addEventListener("click",function(e){if(e.target===ov){open=false;closeNav();}});
}

function uiReveal(){
  var els=document.querySelectorAll(".r-item"); if(!els.length) return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add("r-visible");io.unobserve(en.target);}});
  },{threshold:0.06,rootMargin:"0px 0px -10px 0px"});
  els.forEach(function(el){io.observe(el);});
}

function uiScrollBar(){
  var bar=g("scroll-bar"); if(!bar) return;
  window.addEventListener("scroll",function(){
    var total=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.setProperty("--p",(total>0?window.scrollY/total*100:0)+"%");
  },{passive:true});
}

function uiMarquee(){
  var t=g("marquee-track"); if(!t) return;
  t.innerHTML=t.innerHTML+t.innerHTML;
}

function uiCursor(){
  var cur=g("cursor"),ring=g("cursor-ring");
  if(!cur||!ring||window.matchMedia("(max-width:768px)").matches) return;
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+"px";cur.style.top=my+"px";});
  (function loop(){rx+=(mx-rx)*0.1;ry+=(my-ry)*0.1;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop);})();
  document.querySelectorAll("a,button,.offering-card,.brand-card,.stat-card,.faq-q").forEach(function(el){
    el.addEventListener("mouseenter",function(){cur.classList.add("big");ring.classList.add("big");});
    el.addEventListener("mouseleave",function(){cur.classList.remove("big");ring.classList.remove("big");});
  });
}

function uiForm(){
  var form=g("contact-form"); if(!form) return;
  var btn=form.querySelector(".form-btn"),note=g("form-note");
  form.addEventListener("submit",function(e){
    e.preventDefault();
    if(btn){btn.textContent="Sending\u2026";btn.disabled=true;}
    setTimeout(function(){
      if(btn){btn.textContent="Message Received";btn.style.opacity="0.6";btn.style.cursor="default";}
      if(note){note.textContent="We\u2019ll be in touch soon.";note.style.color="var(--g400)";}
      form.reset();
    },1200);
  });
}

/* ================================================================
   ASCII DENSITY ART
   ================================================================ */

/* Chip map (Edge AI block) */
function buildAsciiChip(){
  var wrap=g("ascii-chip"); if(!wrap) return;
  var W=30,H=12,base=chipMap(W,H);
  var pre=mk("pre"); pre.className="ascii-pre"; wrap.appendChild(pre);
  var t=0;
  (function tick(){
    t+=0.02; var lines=[];
    for(var r=0;r<H;r++){
      var ln="";
      for(var c=0;c<W;c++){
        var b=base[r][c];
        ln+=toC(b<0.04?0:Math.max(0,Math.min(1,b+Math.sin(t+c*0.3+r*0.22)*0.09)));
      }
      lines.push(ln);
    }
    pre.textContent=lines.join("\n");
    requestAnimationFrame(tick);
  })();
}

/* Car — Modular Platforms card */
function buildAsciiCar(){
  var W=32,H=12;
  var base=densityMap(W,H,function(nx,ny){
    var body  =(Math.abs(nx)<0.72&&ny>-0.05&&ny<0.40)?0.82:0;
    var roof  =(Math.abs(nx)<0.38&&ny>-0.55&&ny<-0.05)?0.78:0;
    var wsFrt =(nx>0.20&&nx<0.45&&ny>-0.52&&ny<-0.02)?0.5:0;
    var wsRr  =(nx<-0.20&&nx>-0.45&&ny>-0.52&&ny<-0.02)?0.5:0;
    var wl=Math.max(0,1-Math.sqrt(Math.pow((nx+0.52)/0.17,2)+Math.pow((ny-0.58)/0.20,2)))*0.92;
    var wr=Math.max(0,1-Math.sqrt(Math.pow((nx-0.52)/0.17,2)+Math.pow((ny-0.58)/0.20,2)))*0.92;
    var hl=(nx>0.64&&nx<0.78&&ny>0.05&&ny<0.25)?0.9:0;
    var road=(Math.abs(ny-0.82)<0.06)?0.35:0;
    return Math.min(1,body+roof+wsFrt+wsRr+wl+wr+hl+road);
  });
  animAscii("ascii-ugv",W,H,base,function(r,c,t){
    var nx=(c/(W-1))*2-1,ny=(r/(H-1))*2-1,mod=0;
    [[0.52,0.58],[-0.52,0.58]].forEach(function(hub){
      var dist=Math.sqrt(Math.pow(nx-hub[0],2)+Math.pow(ny-hub[1],2));
      if(dist<0.20){var angle=Math.atan2(ny-hub[1],nx-hub[0]);mod+=Math.sin(t*5+angle*2)*0.16*(1-dist/0.20);}
    });
    if(Math.abs(ny-0.82)<0.06){var d=((nx+t*0.55)%0.5);mod+=(d>0.05&&d<0.35)?0.3:-0.35;}
    return mod;
  });
}

/* Gear — Custom Builds card */
function buildAsciiGear(){
  var W=28,H=14;
  var base=densityMap(W,H,function(nx,ny){
    var dist=Math.sqrt(nx*nx+ny*ny);
    var ring=(dist>0.52&&dist<0.75)?0.80:0;
    var hub=(dist<0.28)?0.72:0;
    var teeth=0;
    for(var i=0;i<8;i++){var a=i*(Math.PI/4);var tx=Math.cos(a)*0.88,ty=Math.sin(a)*0.88;var td=Math.sqrt(Math.pow(nx-tx,2)+Math.pow(ny-ty,2));teeth+=Math.max(0,1-td/0.18)*0.85;}
    var spoke=(Math.abs(nx)<0.06||Math.abs(ny)<0.06)&&dist<0.55?0.6:0;
    return Math.min(1,ring+hub+teeth+spoke);
  });
  animAscii("ascii-rov",W,H,base,function(r,c,t){
    var nx=(c/(W-1))*2-1,ny=(r/(H-1))*2-1;
    var angle=Math.atan2(ny,nx),dist=Math.sqrt(nx*nx+ny*ny);
    var spin=Math.sin(t*2+angle*8)*0.12*(dist>0.45?1:0);
    var hubSpin=(dist<0.28)?Math.sin(t*2-angle*4)*0.10:0;
    return spin+hubSpin;
  });
}

/* Book — From the Catalog card */
function buildAsciiBook(){
  var W=30,H=14;
  var base=densityMap(W,H,function(nx,ny){
    var spine=(nx>-0.85&&nx<-0.60&&Math.abs(ny)<0.78)?0.90:0;
    var pages=0;
    for(var p=0;p<7;p++){var py=-0.72+p*0.22;var pw=0.55+p*0.04;if(Math.abs(ny-py)<0.07&&nx>-0.60&&nx<pw)pages+=0.72;}
    var cover=(nx>-0.60&&nx<0.72&&Math.abs(ny)<0.78)?0.40:0;
    var top=(Math.abs(ny+0.75)<0.05&&nx>-0.85&&nx<0.72)?0.8:0;
    var bot=(Math.abs(ny-0.75)<0.05&&nx>-0.85&&nx<0.72)?0.8:0;
    return Math.min(1,spine+pages+cover+top+bot);
  });
  animAscii("ascii-drone",W,H,base,function(r,c,t){
    var nx=(c/(W-1))*2-1,ny=(r/(H-1))*2-1,lift=0;
    for(var p=0;p<7;p++){
      var py=-0.72+p*0.22,phase=p*0.45;
      if(Math.abs(ny-py)<0.10&&nx>0.20){
        var ef=Math.max(0,(nx-0.20)/0.52);
        lift+=Math.sin(t*1.5+phase)*0.20*ef;
      }
    }
    return lift;
  });
}

/* Shared density map factory */
function densityMap(W,H,fn){
  var m=[];
  for(var r=0;r<H;r++){
    var row=[];
    for(var c=0;c<W;c++){
      var nx=(c/(W-1))*2-1,ny=(r/(H-1))*2-1;
      var b=fn(nx,ny)+(Math.random()-0.5)*0.03;
      row.push(Math.max(0,Math.min(1,b)));
    }
    m.push(row);
  }
  return m;
}

/* Chip map (kept for buildAsciiChip) */
function chipMap(W,H){
  var m=[];
  for(var r=0;r<H;r++){
    var row=[];
    for(var c=0;c<W;c++){
      var nx=(c/(W-1))*2-1,ny=(r/(H-1))*2-1;
      var box=(Math.abs(nx)<0.62&&Math.abs(ny)<0.62)?0.7:0;
      var core=(Math.abs(nx)<0.28&&Math.abs(ny)<0.28)?0.88:0;
      var pX=(Math.abs(Math.abs(nx)-0.62)<0.1&&Math.abs(ny)<0.48&&Math.round(ny*5)%2===0)?0.5:0;
      var pY=(Math.abs(Math.abs(ny)-0.62)<0.1&&Math.abs(nx)<0.48&&Math.round(nx*5)%2===0)?0.5:0;
      row.push(Math.max(0,Math.min(1,box+core*0.4+pX+pY+(Math.random()-0.5)*0.05)));
    }
    m.push(row);
  }
  return m;
}

/* Shared rAF animation runner */
function animAscii(containerId,W,H,base,modFn){
  var wrap=g(containerId); if(!wrap) return;
  wrap.innerHTML="";
  var pre=mk("pre"); pre.className="ascii-pre"; pre.setAttribute("aria-hidden","true"); wrap.appendChild(pre);
  var t=0;
  (function tick(){
    t+=0.022; var lines=[];
    for(var r=0;r<H;r++){
      var ln="";
      for(var c=0;c<W;c++){
        var b=base[r][c],mod=modFn(r,c,t),wave=Math.sin(t+c*0.28+r*0.18)*0.06;
        ln+=toC(b<0.04?0:Math.max(0,Math.min(1,b+wave+mod)));
      }
      lines.push(ln);
    }
    pre.textContent=lines.join("\n");
    requestAnimationFrame(tick);
  })();
}

/* Inject ASCII containers into the 3 offering cards, then animate */
function injectOfferingAscii(){
  var cards=document.querySelectorAll(".offering-card");
  var ids=["ascii-ugv","ascii-rov","ascii-drone"];
  cards.forEach(function(card,i){
    if(!ids[i]) return;
    var wrap=mk("div"); wrap.id=ids[i]; wrap.className="offering-ascii-wrap"; wrap.setAttribute("aria-hidden","true");
    card.appendChild(wrap);
  });
  buildAsciiCar();
  buildAsciiGear();
  buildAsciiBook();
}

/* ================================================================
   GALLERY — 3D HELIX SCROLL
   The scroll-driver height = 100vh (sticky) + N * SPREAD_Y (travel).
   The sticky container stays locked at top:0 for the entire scroll.
   Center text is position:fixed during sticky phase.
   ================================================================ */
var GALLERY_SPREAD_Y = 110;   /* px between card centres */
var GALLERY_RADIUS   = 300;   /* Z depth radius */
var GALLERY_ROT_STEP = 52;    /* Y rotation degrees per card */

function fillGallery(gallery){
  var lbl=g("gallery-label"),hd=g("gallery-headline"),sub=g("gallery-sub"),cta=g("gallery-cta");
  if(lbl) lbl.textContent=gallery.label;
  if(hd&&gallery.headline) hd.innerHTML=gallery.headline.split("\n").map(xe).join("<br>");
  if(sub) sub.textContent=gallery.sub;
  if(cta){cta.textContent=gallery.cta.label;cta.href=gallery.cta.href;}

  var ring=g("gallery-ring"); if(!ring) return;
  var items=gallery.items||[];
  var N=items.length; if(!N) return;

  var extIcon='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  var catAscii={"Land / OEM":" _\n[=]\nO O","Edge AI":"[cpu]\n||||","Consumer / B2C":"(o_o)\n |_|","Underwater":"~~~\n[R]","Military / Industrial":"/##\\\n|x|","Education":"/--\\\n|?|"};

  items.forEach(function(item,i){
    var card=mk("a");
    card.className="gallery-card";
    card.href=item.link; card.target="_blank"; card.rel="noopener";
    card.setAttribute("aria-label",item.title);
    card.setAttribute("data-index",String(i));
    card.setAttribute("data-title",item.title);
    card.setAttribute("data-sub",item.category);
    card.style.setProperty("--card-ry",  (i*GALLERY_ROT_STEP)+"deg");
    card.style.setProperty("--card-tz",  GALLERY_RADIUS+"px");
    card.style.setProperty("--card-y",   (i*GALLERY_SPREAD_Y)+"px");
    var ascii=catAscii[item.category]||"";
    card.innerHTML=
      '<img class="gallery-card-img" src="'+item.img+'" alt="'+xe(item.title)+'" loading="lazy" decoding="async"/>'+
      '<div class="gallery-card-overlay"><p class="gallery-card-cat">'+xe(item.category)+'</p><p class="gallery-card-title">'+xe(item.title)+'</p><p class="gallery-card-caption">'+xe(item.caption)+'</p></div>'+
      '<div class="gallery-card-ext">'+extIcon+'</div>'+
      (ascii?'<pre class="gallery-card-ascii">'+ascii+'</pre>':'');
    ring.appendChild(card);
  });

  /* Set driver height = 100vh for sticky + enough to scroll all cards */
  var driver=g("gallery-scroll-driver");
  if(driver){
    var scrollNeeded=GALLERY_SPREAD_Y*(N-1);
    /* Driver = sticky viewport (100vh) + travel distance */
    driver.style.height="calc(100vh + "+scrollNeeded+"px)";
  }

  initHelixScroll(N);
}

function initHelixScroll(N){
  var driver=g("gallery-scroll-driver");
  var ringEl=g("gallery-ring");
  var centerLabel=g("gallery-center-label");
  var centerText=g("gallery-center-text");
  var centerSub=g("gallery-center-sub");
  if(!driver||!ringEl) return;

  var cards=Array.prototype.slice.call(ringEl.querySelectorAll(".gallery-card"));
  var totalTravel=GALLERY_SPREAD_Y*(N-1);
  var targetY=0,currentY=0,targetRot=0,currentRot=0,prevFront=-1;

  window.addEventListener("scroll",function(){
    var rect=driver.getBoundingClientRect();
    var scrolled=Math.max(0,-rect.top);
    var pct=Math.min(1,scrolled/totalTravel);
    targetY  =pct*totalTravel;
    targetRot=pct*GALLERY_ROT_STEP*(N-1);
    /* Show/hide center label based on whether we're in sticky phase */
    if(centerLabel){
      var inSticky = rect.top<=0 && rect.bottom>window.innerHeight;
      centerLabel.classList.toggle("visible", inSticky);
    }
  },{passive:true});

  (function frame(){
    requestAnimationFrame(frame);
    currentY  +=(targetY  -currentY  )*0.09;
    currentRot+=(targetRot-currentRot)*0.09;

    /* Translate ring UP (cards scroll past viewport) + rotate on Y */
    ringEl.style.transform="translateY(-"+currentY+"px) rotateY(-"+currentRot+"deg)";

    /* Per-card: scale + fade based on distance from viewport centre */
    var frontIdx=0,minDist=1e9;
    cards.forEach(function(card,i){
      var cardY=i*GALLERY_SPREAD_Y-currentY;
      var dist=Math.abs(cardY);
      card.style.setProperty("--active-scale",dist<70?String(1+0.10*(1-dist/70)):"1");
      card.style.setProperty("--active-opacity",String(Math.max(0.30,1-dist/240)));
      if(dist<minDist){minDist=dist;frontIdx=i;}
    });

    /* Centre text: update when front card changes */
    if(frontIdx!==prevFront){
      prevFront=frontIdx;
      var fc=cards[frontIdx];
      if(centerText) centerText.textContent=fc?fc.getAttribute("data-title"):"";
      if(centerSub)  centerSub.textContent =fc?fc.getAttribute("data-sub"):"";
    }
    if(centerLabel){
      /* Show label whenever any card is within 200px of centre */
      centerLabel.classList.toggle("visible",minDist<200);
    }
  })();
}

/* ================================================================
   WEBGL — HERO GLOBE
   ================================================================ */
function heroGL(){
  if(typeof THREE==="undefined"){ console.warn("Three.js not loaded"); return; }
  var canvas=g("hero-canvas"); if(!canvas) return;

  var W=canvas.offsetWidth>0?canvas.offsetWidth:Math.round(window.innerWidth*0.6);
  var H=canvas.offsetHeight>0?canvas.offsetHeight:window.innerHeight;
  if(H<100) H=window.innerHeight;
  if(W<50)  W=Math.round(window.innerWidth*0.6);

  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(52,W/H,0.1,100);
  /* Canvas is right 60% — camera centred, globe at scene origin (right-of-page naturally) */
  cam.position.set(0,0,4.5);

  var ren=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  ren.setPixelRatio(Math.min(window.devicePixelRatio,2));
  ren.setSize(W,H,false);
  ren.setClearColor(0,0);

  window.addEventListener("resize",function(){
    var w=canvas.offsetWidth,h=canvas.offsetHeight; if(!w||!h) return;
    ren.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix();
  });

  function wMat(op){return new THREE.MeshBasicMaterial({color:0xf4f4ef,wireframe:true,opacity:op,transparent:true});}
  function eMat(op){return new THREE.LineBasicMaterial({color:0xf4f4ef,opacity:op,transparent:true});}

  var R=1.5;

  /* Sphere wireframe */
  var globeM=new THREE.Mesh(new THREE.SphereGeometry(R,32,24),wMat(0.07));
  scene.add(globeM);

  /* Latitude circles */
  var latG=new THREE.Group();
  for(var lat=-75;lat<=75;lat+=15){
    var lr=(lat*Math.PI)/180,cr=R*Math.cos(lr),cy=R*Math.sin(lr),pts2=[];
    for(var s=0;s<=64;s++){var a=(s/64)*Math.PI*2;pts2.push(new THREE.Vector3(cr*Math.cos(a),cy,cr*Math.sin(a)));}
    latG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2),eMat(lat===0?0.40:0.18)));
  }
  scene.add(latG);

  /* Longitude circles */
  var lonG=new THREE.Group();
  for(var lon=0;lon<360;lon+=20){
    var lonR=(lon*Math.PI)/180,pts3=[];
    for(var s2=0;s2<=64;s2++){var ph=(s2/64)*Math.PI-Math.PI/2;pts3.push(new THREE.Vector3(R*Math.cos(ph)*Math.cos(lonR),R*Math.sin(ph),R*Math.cos(ph)*Math.sin(lonR)));}
    lonG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts3),eMat(0.15)));
  }
  scene.add(lonG);

  /* Equator ring */
  var eq=new THREE.Mesh(new THREE.TorusGeometry(R,0.01,8,128),new THREE.MeshBasicMaterial({color:0xf4f4ef,opacity:0.55,transparent:true}));
  scene.add(eq);

  /* Orbital rings */
  var orb1=new THREE.Mesh(new THREE.TorusGeometry(R*1.35,0.007,8,128),new THREE.MeshBasicMaterial({color:0xf4f4ef,opacity:0.25,transparent:true}));
  orb1.rotation.x=Math.PI/4; orb1.rotation.z=Math.PI/6;
  scene.add(orb1);

  var orb2=new THREE.Mesh(new THREE.TorusGeometry(R*1.75,0.005,8,128),new THREE.MeshBasicMaterial({color:0xf4f4ef,opacity:0.14,transparent:true}));
  orb2.rotation.x=-Math.PI/3; orb2.rotation.y=Math.PI/5;
  scene.add(orb2);

  /* Particles */
  var N2=300,pos=new Float32Array(N2*3);
  for(var i=0;i<N2;i++){var phi=Math.acos(2*Math.random()-1),th=Math.random()*Math.PI*2,rad=2.1+Math.random()*1.8;pos[i*3]=rad*Math.sin(phi)*Math.cos(th);pos[i*3+1]=rad*Math.sin(phi)*Math.sin(th);pos[i*3+2]=rad*Math.cos(phi);}
  var pts=new THREE.Points(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(pos,3)),new THREE.PointsMaterial({color:0xf4f4ef,size:0.022,opacity:0.45,transparent:true}));
  scene.add(pts);

  var all=[globeM,latG,lonG,eq,orb1,orb2,pts];

  var scrollP=0,mX=0,mY=0;
  window.addEventListener("scroll",function(){var h=g("hero");if(h)scrollP=Math.min(window.scrollY/h.offsetHeight,1);},{passive:true});
  document.addEventListener("mousemove",function(e){mX=(e.clientX/window.innerWidth-0.5)*2;mY=(e.clientY/window.innerHeight-0.5)*2;});

  var clk=new THREE.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    var t=clk.getElapsedTime(),sy=-scrollP*2.2;
    globeM.rotation.y=latG.rotation.y=lonG.rotation.y=eq.rotation.y=t*0.09;
    orb1.rotation.z=t*0.12; orb2.rotation.y=t*0.07; orb2.rotation.z=-t*0.05;
    pts.rotation.y=t*0.025; pts.rotation.x=t*0.012;
    eq.scale.setScalar(1+Math.sin(t*1.4)*0.025);
    all.forEach(function(o){o.position.y=sy;});
    /* Camera centred — globe is at scene origin, fills the right-60% canvas */
    cam.position.x+=(mX*0.35-cam.position.x)*0.04;
    cam.position.y+=(-mY*0.30-cam.position.y)*0.04;
    cam.lookAt(0,sy*0.2,0);
    ren.render(scene,cam);
  })();
}

/* ================================================================
   WEBGL — BRANDS BACKGROUND
   ================================================================ */
function brandsGL(){
  if(typeof THREE==="undefined") return;
  var canvas=g("brands-canvas"); if(!canvas) return;
  var W=canvas.offsetWidth||window.innerWidth,H=canvas.offsetHeight||600;
  if(W<50){W=window.innerWidth;H=500;}
  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(60,W/H,0.1,100); cam.position.z=8;
  var ren=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  ren.setPixelRatio(Math.min(window.devicePixelRatio,2));
  ren.setSize(W,H,false); ren.setClearColor(0,0);
  window.addEventListener("resize",function(){var w=canvas.offsetWidth,h=canvas.offsetHeight;if(!w||!h)return;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();});
  var geos=[new THREE.TetrahedronGeometry(0.4,0),new THREE.OctahedronGeometry(0.38,0),new THREE.IcosahedronGeometry(0.32,0)];
  var shapes=[];
  for(var i=0;i<10;i++){
    var edge=new THREE.LineSegments(new THREE.EdgesGeometry(geos[i%3]),new THREE.LineBasicMaterial({color:0xf4f4ef,opacity:0.05+Math.random()*0.1,transparent:true}));
    edge.position.set((Math.random()-0.5)*16,(Math.random()-0.5)*9,(Math.random()-0.5)*4);
    edge.userData.rx=(Math.random()-0.5)*0.007; edge.userData.ry=(Math.random()-0.5)*0.009;
    scene.add(edge); shapes.push(edge);
  }
  var bg=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(8,1)),new THREE.LineBasicMaterial({color:0xf4f4ef,opacity:0.018,transparent:true}));
  scene.add(bg);
  var clk=new THREE.Clock();
  (function loop(){requestAnimationFrame(loop);var t=clk.getElapsedTime();shapes.forEach(function(s){s.rotation.x+=s.userData.rx;s.rotation.y+=s.userData.ry;});bg.rotation.y=t*0.012;bg.rotation.x=t*0.007;ren.render(scene,cam);})();
}

/* ================================================================
   NOTIFICATION BAR
   ================================================================ */
function initNotifBar(){
  function load(cb){
    fetch("notification.json").then(function(r){return r.json();}).then(cb).catch(function(){
      var x=new XMLHttpRequest(); x.open("GET","notification.json"); x.onload=function(){try{cb(JSON.parse(x.responseText));}catch(e){}};x.onerror=function(){};x.send();
    });
  }
  load(function(data){
    var now=new Date(),bar=g("notif-bar"),track=g("notif-track");
    if(!bar||!track) return;
    var active=(data.notifications||[]).filter(function(n){
      return now>=new Date(n.dos||0)&&now<=new Date(n.doe||"2099-12-31");
    });
    if(!active.length) return;
    var sep='<span class="notif-dot"></span>';
    var items=active.map(function(n){
      var txt=n.link?'<a href="'+n.link+'" target="_blank" rel="noopener">'+xe(n.message)+'</a>':xe(n.message);
      return '<span class="notif-item">'+sep+' '+txt+'</span>';
    }).join("");
    track.innerHTML=items+items;
    bar.style.display="flex";
    if(active[0].type==="warning") bar.classList.add("notif-warning");
    document.body.classList.add("has-notif");
    var cb=g("notif-close");
    if(cb){cb.addEventListener("click",function(){bar.style.display="none";document.body.classList.remove("has-notif");try{sessionStorage.setItem("notif-dismissed","1");}catch(e){}});}
    try{if(sessionStorage.getItem("notif-dismissed")==="1"){bar.style.display="none";document.body.classList.remove("has-notif");}}catch(e){}
  });
}
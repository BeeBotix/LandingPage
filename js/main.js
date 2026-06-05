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
    var name    = (form.querySelector('[name="name"]')   ||{}).value||"";
    var email   = (form.querySelector('[name="email"]')  ||{}).value||"";
    var type    = (form.querySelector('[name="type"]')   ||{}).value||"";
    var message = (form.querySelector('[name="message"]')||{}).value||"";
    var subj = "BeeBotix Inquiry" + (type?" \u2014 "+type:"") + (name?" from "+name:"");
    var body = (name?"Name: "+name+"\n":"") + (email?"Email: "+email+"\n":"") + (type?"I am a: "+type+"\n":"") + "\nMessage:\n"+message+"\n\n\u2014 Sent via beebotix.com";
    window.location.href = "mailto:contact@beebotix.com?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
    if(note){ note.textContent="Opening your mail client…"; note.style.color="var(--g400)"; }
    if(btn) { btn.textContent="Opening Mail…"; btn.disabled=true; }
    setTimeout(function(){
      if(btn){btn.textContent="Send Message";btn.disabled=false;btn.style.opacity="";btn.style.cursor="";}
      if(note){note.textContent="We respond within 48 hours.";note.style.color="";}
    },3000);
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
   GALLERY — 3 INFINITE MARQUEE ROWS
   True seamless loop: measure one set width ONCE, reset by exactly
   that amount. Each row pauses independently on hover. B&W → colour
   on card hover. All 3 rows share the same 12 items.
   ================================================================ */
function fillGallery(gallery){
  /* Header text */
  var lbl=g("gallery-label"),hd=g("gallery-headline"),sub=g("gallery-sub"),cta=g("gallery-cta");
  if(lbl) lbl.textContent=gallery.label;
  if(hd&&gallery.headline) hd.innerHTML=gallery.headline.split("\n").map(xe).join("<br>");
  if(sub) sub.textContent=gallery.sub;
  if(cta){cta.textContent=gallery.cta.label;cta.href=gallery.cta.href;}

  var items=gallery.items||[];
  if(!items.length) return;

  var extSvg='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  /* Build one card DOM node */
  function makeCard(item){
    var a=mk("a");
    a.className="gallery-card";
    a.href=item.link||"#"; a.target="_blank"; a.rel="noopener noreferrer";
    a.setAttribute("draggable","false");
    a.innerHTML=
      '<img class="gallery-card-img" src="'+item.img+'" alt="'+xe(item.title)+'" draggable="false" loading="lazy"/>'+
      '<div class="gallery-card-overlay">'+
        '<p class="gallery-card-cat">'+xe(item.category)+'</p>'+
        '<h3 class="gallery-card-title">'+xe(item.title)+'</h3>'+
        '<p class="gallery-card-caption">'+xe(item.caption)+'</p>'+
        '<span class="gallery-card-link">View '+extSvg+'</span>'+
      '</div>';
    return a;
  }

  /* Row config: direction and speed */
  var rows=[
    {id:"gallery-band-0", dir:1,  speed:0.55},   /* L → R */
    {id:"gallery-band-1", dir:-1, speed:0.45},   /* R → L */
    {id:"gallery-band-2", dir:1,  speed:0.65}    /* L → R  (slightly faster) */
  ];

  rows.forEach(function(row){
    var track=g(row.id); if(!track) return;

    /* All 3 rows use the same full item set (same content) */
    var rowItems = items;  /* 12 items, same for all rows */

    /* Build ONE set of cards, measure it, then clone for seamless loop */
    rowItems.forEach(function(item){
      track.appendChild(makeCard(item));
    });

    /* After first paint, measure the natural width of one set */
    /* Then prepend a clone so R→L rows start from right naturally */
    row.el    = track;
    row.ready = false;
  });

  /* Single rAF after layout */
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      rows.forEach(function(row){
        var track=row.el; if(!track) return;
        /* Measure one set width */
        var oneW = track.scrollWidth;  /* only one set so far */
        row.oneW = oneW;

        /* Clone the set and append — track now has 2 identical sets */
        /* This is enough: when pos crosses oneW we reset to 0 */
        Array.prototype.slice.call(track.children).forEach(function(card){
          track.appendChild(card.cloneNode(true));
        });

        /* R→L rows: initialise pos so first card is at the right edge */
        row.pos = row.dir < 0 ? oneW : 0;

        /* Apply initial transform */
        track.style.transform = "translateX(" + (-row.pos) + "px)";

        row.ready = true;
      });

      /* Start the animation once all rows are measured */
      startMarqueeRows(rows);
    });
  });
}

function startMarqueeRows(rows){
  /* Wire hover per band — only that band pauses */
  var bandEls = document.querySelectorAll(".gallery-band");
  bandEls.forEach(function(bandEl, idx){
    bandEl.addEventListener("mouseenter", function(){ if(rows[idx]) rows[idx].paused=true;  });
    bandEl.addEventListener("mouseleave", function(){ if(rows[idx]) rows[idx].paused=false; });
    rows[idx].paused = false;
  });

  (function tick(){
    requestAnimationFrame(tick);
    rows.forEach(function(row){
      if(!row.ready || row.paused) return;
      row.pos += row.speed * row.dir;

      /* Seamless loop: when we've scrolled one full set, snap back */
      if(row.dir > 0 && row.pos >= row.oneW) row.pos -= row.oneW;  /* L→R */
      if(row.dir < 0 && row.pos <= 0)        row.pos += row.oneW;  /* R→L */

      row.el.style.transform = "translateX(" + (-row.pos) + "px)";
    });
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
  /* Wider FOV to see more of the globe, closer z */
  var cam=new THREE.PerspectiveCamera(55,W/H,0.1,100);
  /* Shift camera left so globe appears in RIGHT portion of canvas */
  /* Canvas is right 60% of page; shifting camera left shows globe offset right */
  cam.position.set(0, 0, 4.2);

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

  /* Sphere base — very faint wireframe */
  var globeM=new THREE.Mesh(new THREE.SphereGeometry(R,36,26),wMat(0.06));

  /* Latitude circles every 15° */
  var latG=new THREE.Group();
  for(var lat=-75;lat<=75;lat+=15){
    var lr=(lat*Math.PI)/180,cr=R*Math.cos(lr),cy=R*Math.sin(lr),pts2=[];
    for(var s=0;s<=80;s++){var a=(s/80)*Math.PI*2;pts2.push(new THREE.Vector3(cr*Math.cos(a),cy,cr*Math.sin(a)));}
    latG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2),eMat(lat===0?0.55:0.22)));
  }

  /* Longitude circles every 20° */
  var lonG=new THREE.Group();
  for(var lon=0;lon<360;lon+=20){
    var lonR=(lon*Math.PI)/180,pts3=[];
    for(var s2=0;s2<=80;s2++){var ph=(s2/80)*Math.PI-Math.PI/2;pts3.push(new THREE.Vector3(R*Math.cos(ph)*Math.cos(lonR),R*Math.sin(ph),R*Math.cos(ph)*Math.sin(lonR)));}
    lonG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts3),eMat(0.18)));
  }

  /* Particle star field — dots scattered around the globe */
  var starCount=280, starPos=new Float32Array(starCount*3);
  for(var si=0;si<starCount;si++){
    var sPhi=Math.acos(2*Math.random()-1), sTh=Math.random()*Math.PI*2, sRad=2.1+Math.random()*2.2;
    starPos[si*3]  =sRad*Math.sin(sPhi)*Math.cos(sTh);
    starPos[si*3+1]=sRad*Math.sin(sPhi)*Math.sin(sTh);
    starPos[si*3+2]=sRad*Math.cos(sPhi);
  }
  var starGeo=new THREE.BufferGeometry();
  starGeo.setAttribute("position",new THREE.BufferAttribute(starPos,3));
  var starPts=new THREE.Points(starGeo,new THREE.PointsMaterial({
    color:0xf4f4ef, size:0.028, opacity:0.55, transparent:true, sizeAttenuation:true
  }));

  /* Group — sphere + lat/lon lines + star particles */
  var globeGroup=new THREE.Group();
  globeGroup.add(globeM);
  globeGroup.add(latG);
  globeGroup.add(lonG);
  globeGroup.add(starPts);
  scene.add(globeGroup);

  var scrollP=0,mX=0,mY=0;
  window.addEventListener("scroll",function(){var h=g("hero");if(h)scrollP=Math.min(window.scrollY/h.offsetHeight,1);},{passive:true});
  document.addEventListener("mousemove",function(e){mX=(e.clientX/window.innerWidth-0.5)*2;mY=(e.clientY/window.innerHeight-0.5)*2;});

  var clk=new THREE.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    var t=clk.getElapsedTime(),sy=-scrollP*2.2;
    /* Rotate globe group slowly — lat/lon lines rotate with it */
    globeGroup.rotation.y=t*0.09;
    globeGroup.position.y=sy;
    /* Mouse parallax around base offset */
    var gbx=-0.8;
    cam.position.x+=(gbx+mX*0.3-cam.position.x)*0.04;
    cam.position.y+=(-mY*0.28-cam.position.y)*0.04;
    cam.lookAt(0.5,sy*0.2,0);
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
      var x=new XMLHttpRequest(); x.open("GET","notification.json");
      x.onload=function(){try{cb(JSON.parse(x.responseText));}catch(e){}};
      x.onerror=function(){}; x.send();
    });
  }
  load(function(data){
    var now=new Date(), bar=g("notif-bar"), track=g("notif-track");
    if(!bar||!track) return;
    var active=(data.notifications||[]).filter(function(n){
      return now>=new Date(n.dos||0) && now<=new Date(n.doe||"2099-12-31");
    });
    if(!active.length) return;

    /* Build one full set of notification spans */
    var sep='<span class="notif-dot"></span>';
    var oneSet=active.map(function(n){
      /* No link — plain text only */
      return '<span class="notif-item">'+sep+' '+xe(n.message)+'</span>';
    }).join('<span class="notif-sep">·</span>');

    /* Put 4 copies so we always have content in view at any scroll position */
    track.innerHTML=oneSet+oneSet+oneSet+oneSet;
    bar.style.display="flex";
    document.body.classList.add("has-notif");

    /* JS rAF marquee — measure ONE set width, loop seamlessly */
    var dismissed=false;
    try{ if(sessionStorage.getItem("notif-dismissed")==="1"){ dismissed=true; } }catch(e){}
    if(dismissed){ bar.style.display="none"; document.body.classList.remove("has-notif"); return; }

    /* Dismiss button */
    var closeBtn=g("notif-close");
    if(closeBtn){
      closeBtn.addEventListener("click",function(){
        bar.style.display="none";
        document.body.classList.remove("has-notif");
        try{sessionStorage.setItem("notif-dismissed","1");}catch(e){}
      });
    }

    /* Wait for layout so we can measure the track */
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var fullW = track.scrollWidth;   /* 4 copies */
        var oneW  = fullW / 4;           /* width of 1 copy */
        var pos   = 0;
        var speed = 0.55;                /* px per frame — ~33px/s at 60fps */
        var hovering=false;
        track.parentElement.addEventListener("mouseenter",function(){ hovering=true; });
        track.parentElement.addEventListener("mouseleave",function(){ hovering=false; });
        (function tick(){
          requestAnimationFrame(tick);
          if(hovering) return;
          pos+=speed;
          /* When we've scrolled one full copy, reset by one copy width (seamless) */
          if(pos>=oneW) pos-=oneW;
          track.style.transform="translateX(-"+pos+"px)";
        })();
      });
    });
  });
}
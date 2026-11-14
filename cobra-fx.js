/* COBRA7 — أشكال أمنية متحركة في الخلفية (parallax مع السكرول) + شريط تقدم + أنيميشن الأسعار والعناوين. */
(function(){
  'use strict';
  var root=document.documentElement; root.classList.add('fx');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SH={
    hex:'<svg viewBox="0 0 100 100"><g class="spin"><polygon class="g" points="50,4 91,27 91,73 50,96 9,73 9,27"/><polygon class="p" points="50,22 75,36 75,64 50,78 25,64 25,36"/></g></svg>',
    ring:'<svg viewBox="0 0 100 100"><g class="spin rev"><circle class="p dash" cx="50" cy="50" r="46"/><circle class="g" cx="50" cy="50" r="30" stroke-dasharray="2 8"/></g></svg>',
    cross:'<svg viewBox="0 0 40 40"><g class="bob"><path class="g" d="M20 4v32M4 20h32"/></g></svg>',
    tri:'<svg viewBox="0 0 100 90"><g class="bob"><polygon class="p" points="50,6 94,84 6,84"/><polygon class="g" points="50,34 72,74 28,74" opacity=".6"/></g></svg>',
    shield:'<svg viewBox="0 0 80 96"><g class="bob"><path class="g" d="M40 4 74 16v30c0 22-14 36-34 46C20 82 6 68 6 46V16z"/><path class="p" d="M40 26v38M24 42h32"/></g></svg>',
    dots:'<svg viewBox="0 0 100 100">'+(function(){var s='';for(var y=0;y<5;y++)for(var x=0;x<5;x++)s+='<circle class="dot" style="--d:'+((x+y)*.35)+'s" cx="'+(10+x*20)+'" cy="'+(10+y*20)+'" r="1.8"/>';return s})()+'</svg>',
    circuit:'<svg viewBox="0 0 200 100"><path class="g flow" d="M0 80H50L70 50H120L140 20H200"/><path class="p flow" style="--d:1.6s" d="M0 30H40L60 60H110L130 90H200"/><circle class="dot" cx="70" cy="50" r="3"/><circle class="dot" style="--d:1s" cx="140" cy="20" r="3"/><circle class="dot" style="--d:2s" cx="60" cy="60" r="3"/></svg>'
  };
  /* [شكل, x%, y%, العرض px, سرعة البارالاكس, مدة الدوران] */
  var LAYOUT=[['hex',6,10,120,.10],['circuit',62,6,300,.05],['ring',84,34,170,.16],['shield',10,56,84,.08],['dots',78,72,110,.12],['tri',46,44,70,.18],
              ['cross',28,22,34,.20],['hex',90,8,64,.22],['ring',3,86,110,.07],['circuit',30,82,260,.09],['cross',66,56,30,.14],['tri',92,90,56,.2]];
  var bg=document.createElement('div'); bg.className='fx-bg'; bg.setAttribute('aria-hidden','true');
  var els=LAYOUT.map(function(a,i){
    var d=document.createElement('div'); d.className='fx-s';
    d.style.cssText='left:'+a[1]+'%;top:'+a[2]+'%;width:'+a[3]+'px;--t:'+(30+i*6)+'s;--d:-'+(i*1.3)+'s';
    d.innerHTML=SH[a[0]]; d.dataset.k=a[4]; bg.appendChild(d); return d;
  });
  document.body.insertBefore(bg,document.body.firstChild);
  var bar=document.createElement('div'); bar.className='fx-prog'; document.body.appendChild(bar);

  var y=0,tick=false;
  function frame(){
    tick=false;
    var h=Math.max(1,root.scrollHeight-innerHeight);
    bar.style.setProperty('--p',Math.min(1,y/h).toFixed(4));
    if(reduce) return;
    for(var i=0;i<els.length;i++) els[i].style.transform='translate3d(0,'+(-y*els[i].dataset.k).toFixed(1)+'px,0)';
  }
  addEventListener('scroll',function(){y=scrollY;if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});
  frame();

  /* عناوين + أسعار: بتتحرك أول ما تظهر */
  var fmt=function(n){return Math.round(n).toLocaleString('en')};
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; var el=e.target; io.unobserve(el); el.classList.add('fx-in');
    var b=el.querySelector&&el.querySelector('b[data-from]');
    if(b&&!reduce){var f=+b.dataset.from,t=+b.dataset.to,t0=performance.now()+500;(function s(n){var p=Math.max(0,Math.min(1,(n-t0)/1100)),k=1-Math.pow(1-p,3);b.textContent=fmt(f+(t-f)*k);if(p<1)requestAnimationFrame(s)})(performance.now())}
  })},{threshold:.5}):null;
  function scan(){document.querySelectorAll('.sech:not([data-fx]),.pkg:not([data-fx])').forEach(function(el){el.dataset.fx=1;if(io)io.observe(el);else el.classList.add('fx-in')})}
  scan(); new MutationObserver(function(){requestAnimationFrame(scan)}).observe(document.body,{childList:true,subtree:true});
})();

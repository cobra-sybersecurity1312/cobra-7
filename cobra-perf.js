/* COBRA7 — تحسين الأداء.
   1) بيوقّف أنيميشن أي قسم مش ظاهر في الشاشة.
   2) بيقيس سرعة الفريمات بعد التحميل، ولو الجهاز ضعيف بيفعّل "وضع خفيف" تلقائيًا ويفتكره للزيارات الجاية.
   تجبر الوضع الخفيف بـ ?lite=1 وتلغيه بـ ?lite=0 في آخر الرابط. */
(function(){
  'use strict';
  var root=document.documentElement, KEY='cobra_lite';
  var q=location.search, forced=/[?&]lite=1/.test(q), off=/[?&]lite=0/.test(q);
  try{ if(off) localStorage.removeItem(KEY); }catch(e){}
  var saved=false; try{ saved=localStorage.getItem(KEY)==='1'; }catch(e){}
  if(forced||(!off&&saved)) root.classList.add('pf-lite');
  var setLite=function(){root.classList.add('pf-lite');try{window.dispatchEvent(new Event('cobra-lite'))}catch(e){}};

  /* 1) إيقاف الأنيميشن برّه الشاشة */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){e.target.classList.toggle('pf-off',!e.isIntersecting)});
    },{rootMargin:'120px 0px'});
    Array.prototype.forEach.call(document.querySelectorAll('body > section, body > footer, main > section'),function(el){io.observe(el)});
  }
  /* لو التبويب مخفي مفيش داعي لأي حاجة تشتغل */
  document.addEventListener('visibilitychange',function(){root.classList.toggle('pf-hidden',document.hidden)});

  /* 2) كشف الجهاز الضعيف */
  if(off||forced||saved||!window.requestAnimationFrame) return;
  function sample(){
    var n=0,t0=0,last=0,slow=0;
    function f(t){
      if(!t0){t0=last=t;return requestAnimationFrame(f)}
      if(document.hidden){t0=0;return requestAnimationFrame(f)}   // التبويب في الخلفية: نعيد القياس
      n++; if(t-last>34) slow++; last=t;
      if(t-t0<1600) return requestAnimationFrame(f);
      var fps=n/((t-t0)/1000);
      if(fps<38 && slow/n>.4){
        setLite();
        try{localStorage.setItem(KEY,'1')}catch(e){}
      }
    }
    requestAnimationFrame(f);
  }
  var go=function(){setTimeout(sample,900)};
  if(document.readyState==='complete') go(); else addEventListener('load',go);
})();

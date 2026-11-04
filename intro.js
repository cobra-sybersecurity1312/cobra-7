/* Cobra intro — Islam Ali */
(function(){
  var KEY='cbIntroSeen';
  try{ var seen=+localStorage.getItem(KEY)||0; if(seen && Date.now()-seen<3*864e5 && location.search.indexOf('intro')<0) return; }catch(e){}
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches; if(reduce) return;
  var lines=[{t:'ISLAM',light:2},{t:'ALI',light:0}]; // أول حروف تقيلة والباقي أخف زي الفيديو
  var el=document.createElement('div'); el.id='cbIntro';
  el.innerHTML='<div class="cbi-photo"></div><div class="cbi-grid"></div>'+
    '<div class="cbi-tag"><img src="cobra-logo.jpg" alt=""><span>AKA &nbsp;COBRA</span></div>'+
    '<h1 class="cbi-name" aria-label="Islam Ali"></h1>'+
    '<div class="cbi-sub"><b>أنا اللي بدخل الأنظمة… عشان تفضل إنت بره.</b><small>ETHICAL HACKER • CYBER SECURITY • COBRA7</small></div>'+
    '<img class="cbi-logo" src="cobra-logo.jpg" alt="Cobra">'+
    '<button type="button" class="cbi-skip" aria-label="تخطي المقدمة">تخطي ✕</button><div class="cbi-scan"></div><div class="cbi-bar"></div><div class="cbi-wipe"></div><div class="cbi-flash"></div>';
  document.documentElement.appendChild(el);
  var name=el.querySelector('.cbi-name'), chars=[], rows=[];
  lines.forEach(function(l){
    var row=document.createElement('span'); row.className='cbi-line';
    l.t.split('').forEach(function(c,i){var s=document.createElement('span'); s.className='cbi-ch'+(i>=l.light?'':'');s.textContent=c; s.dataset.c=c; if(l.light&&i>=l.light) s.classList.add('light'); row.appendChild(s); chars.push(s);});
    name.appendChild(row); rows.push(row);
  });
  var timers=[]; function T(f,ms){timers.push(setTimeout(f,ms));}
  var pool='ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&01';
  function scramble(span,dur){var t0=Date.now(),orig=span.dataset.c;span.classList.add('glitch');var iv=setInterval(function(){if(Date.now()-t0>dur){clearInterval(iv);span.textContent=orig;span.classList.remove('glitch');return;}span.textContent=pool[Math.random()*pool.length|0];},55);}
  function finish(){timers.forEach(clearTimeout);el.classList.add('out');try{localStorage.setItem(KEY,String(Date.now()))}catch(e){} setTimeout(function(){el.remove();document.documentElement.style.overflow='';},1000);}
  document.documentElement.style.overflow='hidden';
  el.querySelector('.cbi-skip').addEventListener('click',finish);
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){finish();document.removeEventListener('keydown',esc)}});
  var bar=el.querySelector('.cbi-bar'); bar.style.transition='width 6.9s linear'; requestAnimationFrame(function(){bar.style.width='100%'});
  // 1) الحروف تطير جوه بالتتابع
  chars.forEach(function(c,i){T(function(){c.classList.add('in')},250+i*110);});
  // 2) فلاش أبيض
  T(function(){el.classList.add('flash')},2200);
  // 3) مسحة النيون الأخضر
  T(function(){el.classList.add('wipe')},3500);
  // 4) الصورة تظهر بصبغة خضرا وبعدين تتحول أبيض واسود
  T(function(){el.classList.add('s3');el.querySelector('.cbi-photo').classList.add('tint')},4000);
  T(function(){el.querySelector('.cbi-photo').classList.remove('tint')},5000);
  // 5) glitch على الحروف عشوائي
  [4300,4700,5100,5500,5900,6200].forEach(function(ms){T(function(){for(var k=0;k<4;k++){scramble(chars[Math.random()*chars.length|0],380);}},ms);});
  // حرف أخضر بيفلكر زي الفيديو
  T(function(){var a=chars[chars.length-1];a.classList.add('lime');setTimeout(function(){a.classList.remove('lime')},300);},6300);
  T(function(){chars[chars.length-1].classList.add('lime')},6600);
  // 6) الشعار + الجملة
  T(function(){el.classList.add('s4')},5300);
  // 7) خروج
  T(finish,7000);
})();

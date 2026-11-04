/* COBRA7 — منطق أقسام الصفحة الرئيسية. بيعتمد على: academy-data.js و about-data.js و reviews-data.js و cobra-shared.js */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cfg=typeof SITE!=='undefined'?SITE:{};
  var T=function(id){return (typeof TRACKS!=='undefined'?TRACKS:[]).find(function(t){return t.id===id})};
  var hrs=function(t){return parseInt(String(t&&t.hours||'').replace(/[^\d]/g,''))||0};
  var store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

  /* ---------- زرار الشراء/البداية (من about-data.js) ---------- */
  var buyHref=cfg.buyUrl||'courses.html', buyExternal=!!cfg.buyUrl;
  var buyLabel=cfg.buyLabel||'ابدأ التعلّم الآن';
  $$('[data-buy]').forEach(function(a){
    a.href=buyHref; if(buyExternal){a.target='_blank';a.rel='noopener noreferrer'}
    var l=$('.l',a); if(l) l.textContent=buyLabel;
    var p=$('small',a); if(p){ if(cfg.price) p.textContent=cfg.price; else p.remove(); }
  });
  var spr=$('#chStickyPrice'); if(spr){ if(cfg.price) spr.textContent=cfg.price; else spr.remove(); }

  /* ---------- التحريك بعد الانترو ---------- */
  function afterIntro(cb){
    if(!document.getElementById('cbIntro')) return cb();
    var n=0, iv=setInterval(function(){ if(!document.getElementById('cbIntro')||++n>150){clearInterval(iv);cb()} },120);
  }

  /* ---------- الهيرو: تيرمنال بيكتب لوحده ---------- */
  var hero=$('#chHero'), term=$('#chTermBody');
  if(hero){
    var fnd=T('foundations'), fh=fnd?fnd.hours:'60 ساعة';
    var script=[
      {c:'whoami'},{o:'student@cobra7'},
      {c:'ls ./after-the-course'},{o:'soc-analyst/  pentester/  bug-hunter/  secure-dev/',hi:1},
      {c:'cat next-step.txt'},{a:'ابدأ بمسار التأسيس ('+fh+')، وجرّب أول لاب النهاردة.'}
    ];
    var run=function(){
      hero.classList.add('ch-go'); if(!term) return;
      term.textContent='';
      var caret=document.createElement('span'); caret.className='ch-caret';
      var addPrompt=function(){var p=document.createElement('span');p.className='p';p.textContent='$ ';term.appendChild(p)};
      var i=0;
      var step=function(){
        if(i>=script.length){addPrompt();term.appendChild(caret);return}
        var s=script[i++];
        if(s.c!==undefined){
          addPrompt(); var span=document.createElement('span'); term.appendChild(span); term.appendChild(caret);
          if(reduce){span.textContent=s.c;term.appendChild(document.createTextNode('\n'));return step()}
          var k=0; (function typ(){ span.textContent=s.c.slice(0,++k); if(k<s.c.length) setTimeout(typ,42+Math.random()*50); else {term.appendChild(document.createTextNode('\n'));setTimeout(step,260)} })();
        }else{
          if(caret.parentNode) caret.parentNode.removeChild(caret);
          var o=document.createElement('span');
          if(s.a){o.className='ar';o.textContent=s.a}else{o.className='o'+(s.hi?' hi':'');o.textContent=s.o+'\n'}
          term.appendChild(o);
          if(reduce) step(); else setTimeout(step,s.a?0:320);
        }
      };
      step();
    };
    afterIntro(run);
    /* ضوء بيمشي ورا الماوس (ديسكتوب بس) */
    var spot=$('.ch-spot',hero);
    if(spot&&!reduce&&matchMedia('(hover:hover)').matches){
      hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();spot.style.setProperty('--mx',(e.clientX-r.left)+'px');spot.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
    }
  }

  /* ---------- الأرقام (حقيقية من بيانات الموقع) ---------- */
  var stats=$('#chStats');
  if(stats&&typeof TRACKS!=='undefined'){
    var totalH=TRACKS.reduce(function(n,t){return n+hrs(t)},0);
    var items=[[TRACKS.length,'كورس في الأكاديمية'],[window.CobraProgress?CobraProgress.LABS.length:8,'لابات عملية شغالة دلوقتي'],[totalH,'ساعة في خطة المحتوى']];
    if(+cfg.studentsCount>0) items.unshift([+cfg.studentsCount,'طالب بيتعلم معانا']);
    stats.innerHTML=items.map(function(x){return '<div class="ch-stat"><b data-n="'+x[0]+'">'+(reduce?x[0].toLocaleString('en'):'0')+'</b><span>'+esc(x[1])+'</span></div>'}).join('');
    var counted=false, go=function(){
      if(counted)return; counted=true;
      if(reduce)return;
      $$('[data-n]',stats).forEach(function(el){var to=+el.dataset.n,t0=performance.now(),d=1100;(function f(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e).toLocaleString('en');if(p<1)requestAnimationFrame(f)})(t0)});
    };
    if('IntersectionObserver' in window) new IntersectionObserver(function(es,ob){if(es.some(function(e){return e.isIntersecting})){go();ob.disconnect()}},{threshold:.4}).observe(stats); else go();
  }

  /* ---------- الشغل اللي هتقدر تعمله بعد الكورس ---------- */
  var ROLES=[
    {ic:'🛡️',t:'محلل SOC',s:'بتراقب الهجمات وتتصرف قبل ما تكبر',
      does:['تتابع التنبيهات الأمنية وتفرّق بين الإنذار الكاذب والهجوم الحقيقي.','تحلل اللوجات وتكتب قواعد كشف في أنظمة الـSIEM.','تشارك في احتواء الحادث وكتابة تقريره.'],
      path:['foundations','soc-analyst','siem-detection','incident-response']},
    {ic:'🎯',t:'مختبر اختراق (Pentester)',s:'بتهاجم الأنظمة بتصريح عشان تقفل الثغرات',
      does:['تفحص تطبيقات وشبكات الشركات بتفويض مكتوب.','تستغل الثغرات في بيئة آمنة وتثبت خطورتها.','تكتب تقرير واضح بالحل لكل ثغرة.'],
      path:['foundations','pentest','ad-attacks']},
    {ic:'🐞',t:'صائد ثغرات (Bug Bounty)',s:'بتدوّر على ثغرات في مواقع حقيقية وبتتدفع عليها',
      does:['تفحص مواقع ضمن برامج Bug Bounty المسموحة.','تفهم ثغرات الويب زي XSS وIDOR وSQL Injection.','تكتب تقرير مقنع بيتقبل من فريق الأمن.'],
      path:['foundations','owasp-web','bugbounty']},
    {ic:'💻',t:'مطوّر بيكتب كود آمن',s:'بتبني مواقع وتطبيقات من غير ثغرات من الأول',
      does:['تبني مواقع وAPIs بلغة تتقنها.','تتجنب أخطاء الأمان الشائعة وقت الكتابة مش بعدها.','تراجع كود زمايلك من ناحية الأمان.'],
      path:['javascript','sql','owasp-web']},
    {ic:'🔍',t:'محقق جنائي رقمي',s:'بتتتبع اللي حصل بعد الاختراق وتجمع الأدلة',
      does:['تحلل أجهزة وذاكرة وسجلات بعد حادثة.','تحافظ على الأدلة بشكل سليم.','تعيد بناء خط زمني للهجوم.'],
      path:['foundations','digital-forensics','memory-forensics']},
    {ic:'🌐',t:'مهندس أمن شبكات',s:'بتأمّن الشبكة وتضبط الجدران النارية',
      does:['تصمم وتأمّن شبكات الشركة.','تضبط الجدران النارية وأنظمة كشف التسلل.','تراقب الحركة وتكتشف الشذوذ.'],
      path:['foundations','network-security','firewall-ids']}
  ];
  var rolesBox=$('#chRoles');
  if(rolesBox&&typeof TRACKS!=='undefined'){
    rolesBox.innerHTML=ROLES.map(function(r,i){
      var ts=r.path.map(T).filter(Boolean), h=ts.reduce(function(n,t){return n+hrs(t)},0);
      var steps=ts.map(function(t,k){return (k?'<span class="ar">←</span>':'')+'<a href="track.html?t='+encodeURIComponent(t.id)+'">'+esc(t.icon+' '+t.title.split(' — ')[0])+'</a>'}).join('');
      return '<button class="ch-role" type="button" aria-expanded="false" aria-controls="chrp'+i+'" id="chr'+i+'"><span class="ic" aria-hidden="true">'+r.ic+'</span><span><h3>'+esc(r.t)+'</h3><p>'+esc(r.s)+'</p></span><span class="tog" aria-hidden="true">+</span></button>'+
      '<div class="ch-rp" id="chrp'+i+'" role="region" aria-labelledby="chr'+i+'"><div class="ch-rp-grid"><div><h4>هتعمل إيه في الشغل</h4><ul>'+r.does.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></div><div><h4>المسار اللي بيوصّلك (حوالي '+h+' ساعة)</h4><div class="ch-steps">'+steps+'</div><a class="ch-btn" href="track.html?t='+encodeURIComponent(ts[0]?ts[0].id:'foundations')+'">ابدأ المسار ده</a></div></div></div>';
    }).join('');
    rolesBox.addEventListener('click',function(e){
      var b=e.target.closest('.ch-role'); if(!b) return;
      var open=b.getAttribute('aria-expanded')==='true';
      $$('.ch-role',rolesBox).forEach(function(x){x.setAttribute('aria-expanded','false');document.getElementById(x.getAttribute('aria-controls')).classList.remove('on')});
      if(!open){b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).classList.add('on')}
    });
    var first=$('.ch-role',rolesBox); if(first) first.click();
  }

  /* ---------- خريطة المسار: أنت هنا ← الخطوة الجاية ---------- */
  var GOALS={
    red:{t:'اختبار اختراق (Red Team)',path:['foundations','pentest','ad-attacks','redteam-ops']},
    blue:{t:'دفاع ومراقبة (Blue Team)',path:['foundations','soc-analyst','siem-detection','incident-response']},
    web:{t:'ثغرات الويب وBug Bounty',path:['foundations','owasp-web','api-sec','bugbounty']}
  };
  var LEVELS=[{id:'zero',t:'لسه مبتدئ خالص',skip:0},{id:'some',t:'عندي أساسيات كمبيوتر وشبكات',skip:1},{id:'dev',t:'بعرف أبرمج',skip:1}];
  var road=$('#chRoad');
  if(road&&typeof TRACKS!=='undefined'){
    var saved=store.get('cobra7_path')||{};
    var st={goal:GOALS[saved.goal]?saved.goal:'red',level:LEVELS.some(function(l){return l.id===saved.level})?saved.level:'zero',next:null};
    if(typeof saved.next==='number') st.next=saved.next;
    var lvlBox=$('#chLevels'), goalBox=$('#chGoals'), pathEl=$('#chPath'), side=$('#chSide');
    lvlBox.innerHTML=LEVELS.map(function(l){return '<button type="button" class="ch-chip" data-l="'+l.id+'" aria-pressed="false">'+esc(l.t)+'</button>'}).join('');
    goalBox.innerHTML=Object.keys(GOALS).map(function(k){return '<button type="button" class="ch-chip" data-g="'+k+'" aria-pressed="false">'+esc(GOALS[k].t)+'</button>'}).join('');
    var paint=function(){
      var ts=GOALS[st.goal].path.map(T).filter(Boolean), n=ts.length;
      var lv=LEVELS.find(function(l){return l.id===st.level});
      var next=st.next==null?Math.min(lv.skip,n-1):Math.max(0,Math.min(st.next,n-1));
      $$('[data-l]',lvlBox).forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.l===st.level))});
      $$('[data-g]',goalBox).forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.g===st.goal))});
      var html='';
      if(next===0) html+='<li class="ch-node done" aria-label="نقطة البداية"><span class="ch-dot" aria-hidden="true">●</span><div class="ch-node-b"><b style="color:#fff;font-weight:800">أنت هنا<span class="ch-tag here">البداية</span></b><small>قبل أول خطوة. ابدأ من تحت.</small></div></li>';
      ts.forEach(function(t,i){
        var cls=i<next?'done':(i===next?'next':''), tag=(i===next-1?'<span class="ch-tag here">أنت هنا</span>':'')+(i===next?'<span class="ch-tag go">الخطوة الجاية</span>':'');
        html+='<li class="ch-node '+cls+'"><span class="ch-dot" aria-hidden="true">'+(i<next?'✓':(i+1))+'</span><div class="ch-node-b"><button type="button" data-i="'+i+'" title="اعتبر دي نقطة بدايتك">'+esc(t.icon+' '+t.title.split(' — ')[0])+'</button>'+tag+'<small>'+esc(t.level)+' · '+esc(t.hours||'')+'</small></div></li>';
      });
      pathEl.innerHTML=html;
      /* تعبئة الخط: نخلّيها تتحرك بعد الرسم */
      var fill=n>1?Math.round(next/(n-1)*100):0;
      pathEl.style.setProperty('--fill','0%'); requestAnimationFrame(function(){requestAnimationFrame(function(){pathEl.style.setProperty('--fill',fill+'%')})});
      var nt=ts[next], left=ts.slice(next).reduce(function(a,t){return a+hrs(t)},0);
      side.innerHTML='<h4>خطوتك الجاية</h4><div class="nx">'+esc(nt.icon+' '+nt.title)+'</div><p>'+esc(nt.desc)+'</p><div class="row"><span>المدة</span><b>'+esc(nt.hours||'')+'</b></div><div class="row"><span>باقي في المسار ده</span><b style="direction:rtl;font-family:inherit">'+left+' ساعة</b></div><div class="row"><span>عدد الخطوات اللي قدامك</span><b style="direction:rtl;font-family:inherit">'+(n-next)+'</b></div><a class="ch-btn" href="track.html?t='+encodeURIComponent(nt.id)+'">افتح الخطوة دي</a>';
      store.set('cobra7_path',{goal:st.goal,level:st.level,next:st.next});
    };
    lvlBox.addEventListener('click',function(e){var b=e.target.closest('[data-l]');if(!b)return;st.level=b.dataset.l;st.next=null;paint()});
    goalBox.addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(!b)return;st.goal=b.dataset.g;st.next=null;paint()});
    pathEl.addEventListener('click',function(e){var b=e.target.closest('[data-i]');if(!b)return;st.next=+b.dataset.i;paint()});
    paint();
  }

  /* ---------- معاينة مجانية: لابات شغالة دلوقتي ---------- */
  var labsBox=$('#chLabs');
  if(labsBox){
    var PREVIEW=[
      {id:'cobra-lab-01',file:'lab-01.html',lv:'مبتدئ',time:'5 دقايق',t:'استخراج البيانات المخفية',d:'اكتشف إن أي حاجة وصلت للمتصفح تقدر تتشاف، وهات أول Flag ليك.'},
      {id:'cobra-lab-05',file:'lab-05.html',lv:'مبتدئ',time:'5 دقايق',t:'فك الشفرة (Base64)',d:'رسالة اتعترضت بين عضوين في الفريق. فكّها وطلّع الـFlag.'},
      {id:'cobra-lab-02',file:'lab-02.html',lv:'متوسط',time:'10 دقايق',t:'تجاوز تسجيل الدخول',d:'صفحة دخول التحقق فيها في كود الصفحة نفسه. اكتشف بيانات الدخول من السورس.'}
    ];
    var doneLabs=store.get('cobra7_labs')||{};
    labsBox.innerHTML=PREVIEW.map(function(l){
      var done=!!doneLabs[l.id];
      return '<a class="ch-lab'+(done?' done':'')+'" href="'+l.file+'"><span class="lv">'+esc(l.lv)+' · '+esc(l.time)+'</span><h3>'+esc(l.t)+'</h3><p>'+esc(l.d)+'</p><span class="go">'+(done?'✓ خلصته. افتحه تاني':'جرّبه من غير تسجيل ←')+'</span></a>';
    }).join('');
  }

  /* ---------- آراء الطلاب: الحقيقية بس ---------- */
  var proof=$('#chProof');
  if(proof){
    var all=(typeof REVIEWS!=='undefined'&&Array.isArray(REVIEWS)?REVIEWS:[]).filter(function(r){return r&&r.rating>=1&&r.rating<=5&&r.text});
    if(all.length){
      var safeImg=function(u){u=String(u||'');return /^(https:\/\/[^\s"'<>]+|[\w\-\/.]+\.(jpe?g|png|webp|avif))$/i.test(u)?u:''};
      var hue=function(n){var h=0;String(n).split('').forEach(function(c){h=(h*31+c.codePointAt(0))%360});return h};
      var av=function(r,big){var u=safeImg(r.photo),nm=r.name||'؟';return u?'<img class="ch-av'+(big?' lg':'')+'" src="'+esc(u)+'" alt="'+esc(nm)+'" loading="lazy" width="'+(big?92:52)+'" height="'+(big?92:52)+'">':'<span class="ch-av'+(big?' lg':'')+'" style="--h:'+hue(nm)+'" aria-hidden="true">'+esc(Array.from(nm.trim())[0]||'؟')+'</span>'};
      var stars=function(n){return '★'.repeat(n)+'☆'.repeat(5-n)};
      var tn=function(r){if(r.course){var t=T(r.course);if(t)return t.title.split(' — ')[0]}return r.target||''};
      var meta=function(r){return '<b>'+esc(r.name||'مجهول')+'</b><small>'+esc([r.role,tn(r)].filter(Boolean).join(' · '))+'</small>'};
      var feat=all.find(function(r){return r.featured})||all.slice().sort(function(a,b){return b.rating-a.rating||b.text.length-a.text.length})[0];
      var rest=all.filter(function(r){return r!==feat}).slice(0,6);
      var avg=all.reduce(function(n,r){return n+r.rating},0)/all.length;
      $('#chProofBody').innerHTML=
        '<div class="ch-feat">'+av(feat,true)+'<div><blockquote>'+esc(feat.text)+'</blockquote><div class="ch-who"><div>'+meta(feat)+'</div><span class="ch-stars" aria-label="'+feat.rating+' من 5">'+stars(feat.rating)+'</span></div></div></div>'+
        (rest.length?'<div class="ch-quotes">'+rest.map(function(r){return '<div class="ch-q1"><span class="ch-stars" aria-label="'+r.rating+' من 5">'+stars(r.rating)+'</span><p>'+esc(r.text)+'</p><div class="ch-who">'+av(r)+'<div>'+meta(r)+'</div></div></div>'}).join('')+'</div>':'')+
        '<p class="ch-note" style="margin-top:18px">متوسط '+avg.toFixed(1)+' من 5 من '+all.length+' تقييم. كل التقييمات بتتراجع قبل النشر.</p>';
      proof.hidden=false;
    }
  }

  /* ---------- القائمة البريدية + الهدية ---------- */
  var form=$('#chGift');
  if(form){
    var msg=$('.ch-msg',form), btn=$('button[type=submit]',form), file=cfg.giftFile||'cobra7-linux-cheatsheet.pdf';
    var say=function(t,k){msg.textContent=t;msg.className='ch-msg '+(k||'')};
    var download=function(){var a=document.createElement('a');a.href=file;a.download='';document.body.appendChild(a);a.click();a.remove()};
    if(store.get('cobra7_gift')) say('أنت أخدت الهدية قبل كده. لو احتجتها تاني اضغط تنزيل تاني.','ok');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if($('.ch-hp input',form).value) return;
      var mail=$('input[type=email]',form).value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return say('الإيميل مش مكتوب صح. راجعه وجرّب تاني.','err');
      if(!$('input[type=checkbox]',form).checked) return say('وافق على استلام الإيميلات عشان نبعتلك الهدية.','err');
      btn.disabled=true; say('ثانية واحدة...');
      var done=function(){store.set('cobra7_gift',1);say('تمام! التنزيل بدأ. لو ماحصلش، اضغط هنا: ','ok');var a=document.createElement('a');a.href=file;a.download='';a.textContent='نزّل الـPDF';a.style.color='#39ff14';msg.appendChild(a);download();btn.disabled=false;form.reset()};
      if(cfg.emailEndpoint){
        fetch(cfg.emailEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:mail,source:'home-gift',_subject:'مشترك جديد في قائمة Cobra7'})})
          .then(function(r){if(!r.ok) throw 0;done()})
          .catch(function(){btn.disabled=false;say('حصلت مشكلة في الإرسال. جرّب تاني بعد شوية.','err')});
      }else{
        /* مفيش رابط استلام متظبط: نفتح تيليجرام برسالة جاهزة بدل ما الإيميل يضيع */
        var tg=cfg.telegramContact||cfg.telegramGroup;
        if(tg) window.open(tg+(tg.indexOf('?')<0?'?':'&')+'text='+encodeURIComponent('عايز هدية Cobra7. إيميلي: '+mail),'_blank','noopener');
        done();
      }
    });
  }

  /* ---------- شريط الشراء الثابت للموبايل ---------- */
  var sticky=$('#chSticky'), cta=$('#chHeroCta');
  if(sticky&&cta&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){var e=es[0];sticky.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)},{threshold:0}).observe(cta);
  }
})();

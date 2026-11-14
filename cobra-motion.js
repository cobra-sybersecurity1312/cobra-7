/* COBRA7 — حركة الهيرو + خريطة الأدوار التفاعلية. بيعتمد على cobra-home.js (بيعرّف window.CobraRoles) */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible=function(el,cb,th){
    if(!('IntersectionObserver' in window)){cb(true);return}
    new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting)})},{threshold:th||.15}).observe(el);
  };
  function afterIntro(cb){
    if(!document.getElementById('cbIntro')) return cb();
    var n=0,iv=setInterval(function(){if(!document.getElementById('cbIntro')||++n>150){clearInterval(iv);cb()}},120);
  }

  /* ---------- مطر الأكواد (خفيف، بيقف لما يخرج من الشاشة) ---------- */
  var cv=$('#cmRain');
  if(cv&&cv.getContext&&!reduce&&window.innerWidth>860){
    var c=cv.getContext('2d'),W=0,H=0,fs=16,cols=0,drops=[],last=0,run=false;
    var size=function(){var r=cv.parentNode.getBoundingClientRect();W=cv.width=Math.max(1,r.width|0);H=cv.height=Math.max(1,r.height|0);cols=Math.ceil(W/(fs*1.15));drops=[];for(var i=0;i<cols;i++)drops.push(Math.random()*H/fs)};
    var chars='01{}<>/$#';
    var draw=function(t){
      if(!run)return; requestAnimationFrame(draw);
      if(t-last<60)return; last=t;
      c.fillStyle='rgba(3,5,6,.17)';c.fillRect(0,0,W,H);c.font=fs+'px monospace';
      for(var i=0;i<cols;i++){
        c.fillStyle=Math.random()>.975?'#d9ffd0':'#39ff1499';
        c.fillText(chars.charAt(Math.random()*chars.length|0),i*fs*1.15,drops[i]*fs);
        if(drops[i]*fs>H&&Math.random()>.972)drops[i]=0; drops[i]+=1;
      }
    };
    size(); window.addEventListener('resize',size);
    visible(cv.parentNode,function(v){if(v&&!run){run=true;requestAnimationFrame(draw)}else if(!v)run=false},.05);
  }

  /* ---------- أرقام عايمة حوالين الجرافيك (حقيقية من بيانات الموقع) ---------- */
  var R=window.CobraRoles;
  var statEls=$$('.cm-stat');
  if(statEls.length&&typeof TRACKS!=='undefined'){
    var hrs=R?R.hrs:function(t){return parseInt(String(t&&t.hours||'').replace(/[^\d]/g,''))||0};
    var labs=(window.CobraProgress&&CobraProgress.LABS)?CobraProgress.LABS.length:8;
    var vals=[[TRACKS.length,'كورس'],[labs,'لابات عملية'],[TRACKS.reduce(function(n,t){return n+hrs(t)},0),'ساعة محتوى']];
    statEls.forEach(function(el,i){
      var v=vals[i]; if(!v)return;
      el.innerHTML='<b data-n="'+v[0]+'">'+(reduce?v[0].toLocaleString('en'):'0')+'</b><span>'+esc(v[1])+'</span>';
    });
    if(!reduce)afterIntro(function(){
      $$('.cm-stat b').forEach(function(el,i){
        var to=+el.dataset.n,t0=performance.now()+i*160,d=1300;
        (function f(t){var p=Math.max(0,Math.min(1,(t-t0)/d)),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e).toLocaleString('en');if(p<1)requestAnimationFrame(f)})(t0);
      });
    });
  }

  /* ---------- خريطة الأدوار ---------- */
  var box=$('#cmMap');
  if(!box||!R||typeof TRACKS==='undefined')return;
  var ROLES=R.ROLES,T=R.T,hrsOf=R.hrs,N=ROLES.length,cur=0,auto=!reduce,timer=null,DUR=6000;
  var pos=ROLES.map(function(_,i){var a=(-90+i*360/N)*Math.PI/180;return {x:50+37*Math.cos(a),y:50+37*Math.sin(a)}});
  var svg='<svg class="cm-svg" viewBox="0 0 100 100" aria-hidden="true"><circle class="ring" cx="50" cy="50" r="37"/><circle class="ring b" cx="50" cy="50" r="24"/>'+
    pos.map(function(p,i){return '<line class="link" data-i="'+i+'" x1="50" y1="50" x2="'+p.x.toFixed(2)+'" y2="'+p.y.toFixed(2)+'"/>'}).join('')+
    (reduce?'':pos.map(function(p,i){return '<circle class="pulse" r="1.1"><animateMotion dur="'+(2.6+i*.35)+'s" begin="'+(i*.45)+'s" repeatCount="indefinite" path="M50,50 L'+p.x.toFixed(2)+','+p.y.toFixed(2)+'"/></circle>'}).join(''))+'</svg>';
  var nodes=ROLES.map(function(r,i){
    var short=r.t.replace(/\s*\(.*\)/,'').replace('مطوّر بيكتب كود آمن','مطوّر آمن');
    return '<button class="cm-node" type="button" data-i="'+i+'" aria-pressed="false" aria-controls="cmPanel" style="--x:'+pos[i].x.toFixed(2)+'%;--y:'+pos[i].y.toFixed(2)+'%;--d:'+(i*.5)+'s" aria-label="'+esc(r.t)+'"><span aria-hidden="true">'+esc(r.ic)+'</span><small>'+esc(short)+'</small></button>';
  }).join('');
  box.innerHTML='<div class="cm-graph" id="cmGraph">'+svg+'<div class="cm-center"><img src="cobra-logo.jpg" alt="" loading="lazy"></div>'+nodes+'</div><div class="cm-panel" id="cmPanel" role="region" aria-live="polite"><div id="cmBody"></div><div class="cm-dots" id="cmDots">'+ROLES.map(function(){return '<i></i>'}).join('')+'</div></div>';
  var body=$('#cmBody'),dots=$$('#cmDots i'),links=$$('.cm-svg .link',box),btns=$$('.cm-node',box);
  function show(i,fromUser){
    cur=(i+N)%N; var r=ROLES[cur];
    var ts=r.path.map(T).filter(Boolean),h=ts.reduce(function(n,t){return n+hrsOf(t)},0);
    var steps=ts.map(function(t,k){return (k?'<span class="ar">←</span>':'')+'<a href="track.html?t='+encodeURIComponent(t.id)+'">'+esc(t.icon+' '+t.title.split(' — ')[0])+'</a>'}).join('');
    body.innerHTML='<div class="cm-pin"><div class="cm-ph"><span class="ic" aria-hidden="true">'+esc(r.ic)+'</span><h3>'+esc(r.t)+'</h3></div><p class="s">'+esc(r.s)+'</p><h4>هتعمل إيه في الشغل</h4><ul>'+r.does.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul><h4>المسار اللي بيوصّلك (حوالي '+h+' ساعة)</h4><div class="cm-path">'+steps+'</div><a class="ch-btn" href="track.html?t='+encodeURIComponent(ts[0]?ts[0].id:'foundations')+'">ابدأ المسار ده</a></div>';
    btns.forEach(function(b,k){var on=k===cur;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false')});
    links.forEach(function(l,k){l.classList.toggle('on',k===cur)});
    dots.forEach(function(d,k){d.className=k<cur?'done':(k===cur?'on':'');d.style.setProperty('--dur',DUR+'ms')});
    $('#cmDots').classList.toggle('paused',!auto);
  }
  function loop(){clearTimeout(timer);if(!auto)return;timer=setTimeout(function(){show(cur+1);loop()},DUR)}
  function stop(){auto=false;clearTimeout(timer);$('#cmDots').classList.add('paused')}
  box.addEventListener('click',function(e){var b=e.target.closest('.cm-node');if(!b)return;stop();show(+b.dataset.i,true)});
  box.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&auto){clearTimeout(timer)}},true);
  box.addEventListener('pointerleave',function(){if(auto)loop()});
  box.addEventListener('focusin',function(){clearTimeout(timer)});
  show(0);
  if(auto)visible(box,function(v){if(v)loop();else clearTimeout(timer)},.3);
})();

/* COBRA7 — هيرو الخدمات والاستشارات: ريتج 3D + جزيئات + سكرامبل. بيعتمد على services-data.js و consulting-data.js (window.CATALOGS) */
(function(){
  'use strict';
  var root=document.getElementById('fxHero'); if(!root) return;
  var $=function(s,r){return (r||root).querySelector(s)};
  var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover)').matches;
  var C=window.CATALOGS||{}, S=C.services, K=C.consulting;
  var tg=(typeof SITE!=='undefined'&&/^https:\/\/t\.me\//i.test(SITE.telegramContact||''))?SITE.telegramContact:'https://t.me/cobra7_com';
  var tgBtn=$('#fxTg'); if(tgBtn) tgBtn.href=tg;
  var onScreen=true;
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){onScreen=es.some(function(e){return e.isIntersecting})},{threshold:.02}).observe(root);
  function afterIntro(cb){
    if(!document.getElementById('cbIntro')) return cb();
    var n=0,iv=setInterval(function(){if(!document.getElementById('cbIntro')||++n>150){clearInterval(iv);cb()}},120);
  }
  root.classList.add('fx-pre');
  setTimeout(function(){root.classList.remove('fx-pre')},8000); /* أمان: لو حصل أي خطأ الكلام ميفضلش مخفي */

  /* ---------- سكرامبل للنصوص ---------- */
  function scramble(el,final,dur,done){
    if(reduce){el.textContent=final;if(done)done();return}
    var g='▓▒░<>/\\|{}01$#@%&*',t0=performance.now(),len=final.length;
    (function f(t){
      var p=Math.min(1,(t-t0)/dur),n=Math.floor(p*len),out=final.slice(0,n);
      for(var i=n;i<len;i++) out+=final.charAt(i)===' '?' ':g.charAt(Math.random()*g.length|0);
      el.textContent=out;
      if(p<1) requestAnimationFrame(f); else {el.textContent=final;if(done)done()}
    })(t0);
  }

  /* ---------- كروت الريتج ---------- */
  var items=[];
  if(S&&K){
    var pick=function(cat,ids){return ids.map(function(id){return cat.items.filter(function(i){return i.id===id})[0]}).filter(Boolean)};
    var sv=pick(S,['landing','store','webapp','web-pentest','server-hardening']);
    var ks=pick(K,['tutor-cyber','tutor-code','sec-session','tech-plan','career-path']);
    if(sv.length<3) sv=S.items.slice(0,5); if(ks.length<3) ks=K.items.slice(0,5);
    for(var i=0;i<Math.max(sv.length,ks.length);i++){
      if(sv[i]) items.push({d:sv[i],t:'s'});
      if(ks[i]) items.push({d:ks[i],t:'k'});
    }
    var cnt=$('#fxCounts');
    if(cnt) cnt.innerHTML='<span><b>'+S.items.length+'</b>خدمة</span><span><b>'+K.items.length+'</b>استشارة وجلسة</span><span><b>1:1</b>تواصل مباشر</span>';
    /* شريط متحرك */
    var mq=$('#fxMq');
    if(mq){
      var row=function(list,cls,tcls){var h=list.map(function(x){return '<span class="fx-pill'+tcls+'">'+esc(x.icon)+' '+esc(x.title)+'</span>'}).join('');return '<div class="fx-row'+cls+'">'+h+h+'</div>'};
      mq.innerHTML=row(S.items,'','')+row(K.items,' r',' k');
    }
  }
  var stage=$('#fxStage'),ring=$('#fxRing'),tilt=$('#fxTilt');
  var N=items.length, cards=[];
  if(N>=3&&ring&&stage){
    ring.innerHTML=items.map(function(it,i){
      var d=it.d,tags=(d.tags||[]).slice(0,2).join(' · ');
      return '<a class="fx-card '+it.t+'" href="'+(it.t==='s'?'services.html':'consulting.html')+'" style="--sd:'+(i*.55).toFixed(2)+'s"><span class="fx-tag">'+(it.t==='s'?'🛠️ خدمة':'🎓 استشارة')+'</span><span class="fx-ic" aria-hidden="true">'+esc(d.icon)+'</span><h3>'+esc(d.title)+'</h3><p>'+esc(tags||d.who)+'</p><span class="fx-go">استعرض ←</span></a>';
    }).join('');
    cards=Array.prototype.slice.call(ring.children);
  } else if(stage){ stage.style.display='none'; var hh=$('.fx-hint'); if(hh) hh.style.display='none'; }

  var ang=0,vel=0,spread=reduce?1:0,speedT=7,R=300,W=230,H=270,step=360/Math.max(N,1),drag=false,lastX=0,moved=0,hover=false,tx=0,ty=0,cx=0,cy=0,started=reduce,tStart=0,lastFront=[];
  function layout(){
    var vw=root.clientWidth||window.innerWidth;
    W=vw<700?176:(vw<1100?210:236); H=vw<700?236:272;
    R=Math.round((W/2)/Math.tan(Math.PI/Math.max(N,3)))+14;
    ring.style.setProperty('--w',W+'px'); ring.style.setProperty('--h',H+'px');
    paint(true);
  }
  function paint(force){
    if(!N) return;
    var eff=R*spread;
    for(var i=0;i<N;i++){
      var th=i*step+ang, f=Math.cos(th*Math.PI/180), c=cards[i];
      if(force||spread<1) c.style.transform='rotateY('+(i*step)+'deg) translateZ('+eff.toFixed(1)+'px)';
      var op=(0.18+0.82*Math.max(0,Math.min(1,(f+0.15)/1.15))).toFixed(2); if(c._op!==op){c._op=op;c.style.opacity=op}
      var front=f>0.3; if(lastFront[i]!==front){lastFront[i]=front;c.style.pointerEvents=front?'auto':'none';c.tabIndex=front?0:-1}
    }
    ring.style.transform='translateZ('+(-eff*0.15).toFixed(1)+'px) rotateY('+ang.toFixed(2)+'deg)';
  }
  var last=0;
  function loop(t){
    requestAnimationFrame(loop);
    if(!onScreen||!N||!started){last=t;return}
    var dt=Math.min(.05,(t-last)/1000||0);last=t;
    if(spread<1){var p=Math.min(1,(t-tStart)/2000);spread=1-Math.pow(1-p,3);ang+=dt*(260*(1-p)+0)}
    if(!drag){
      var target=reduce?0:(hover?0:speedT);
      vel+=(target-vel)*Math.min(1,dt*2.2); ang+=vel*dt;
    }
    cx+=(tx-cx)*.08; cy+=(ty-cy)*.08;
    tilt.style.transform='rotateX('+(cy*-5).toFixed(2)+'deg) rotateY('+(cx*7).toFixed(2)+'deg)';
    paint(false);
  }
  if(N>=3&&ring){
    layout(); window.addEventListener('resize',layout);
    stage.addEventListener('pointerdown',function(e){drag=true;lastX=e.clientX;moved=0;stage.classList.add('drag')});
    window.addEventListener('pointermove',function(e){
      if(drag){var dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);ang+=dx*.32;vel=dx*.32/0.016*0.25}
      if(fine&&onScreen){var r=root.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2}
    },{passive:true});
    window.addEventListener('pointerup',function(){if(drag){drag=false;stage.classList.remove('drag')}});
    ring.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
    stage.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hover=true});
    stage.addEventListener('pointerleave',function(){hover=false});
    requestAnimationFrame(loop);
  }

  /* ---------- جزيئات الشبكة ---------- */
  /* متحسّنة: الخطوط والنقط بتترسم على دفعات (كام أمر رسم بدل مئات)، بـ30 فريم/ثانية، وبتقلّ تلقائيًا في الوضع الخفيف. */
  var cv=$('.fx-cv');
  if(cv&&cv.getContext&&!reduce){
    var x=cv.getContext('2d'),w=0,h=0,pts=[],mx=-999,my=-999,prevT=0;
    var isLite=function(){return document.documentElement.classList.contains('pf-lite')};
    var size=function(){
      var r=root.getBoundingClientRect();w=cv.width=Math.max(1,r.width|0);h=cv.height=Math.max(1,r.height|0);
      var lite=isLite(),n=Math.min(lite?24:46,Math.floor(w*h/(lite?32000:19000)));
      pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.7,vy:(Math.random()-.5)*.7,r:Math.random()*1.6+.5,g:Math.random()>.7});
    };
    size(); window.addEventListener('resize',size); window.addEventListener('cobra-lite',size);
    root.addEventListener('pointermove',function(e){var r=root.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
    root.addEventListener('pointerleave',function(){mx=my=-999});
    var LINK=12000, BUCKETS=4, alphas=[.04,.08,.12,.16];
    (function draw(t){
      requestAnimationFrame(draw); if(!onScreen) return;
      if(isLite()) return;                                     /* الوضع الخفيف: الكانفس مخفي ومفيش رسم */
      if(t-prevT<32) return;                                   /* 30 فريم/ثانية كفاية للجزيئات */
      var k=Math.min(3,(t-prevT)/16.7||1); prevT=t;            /* نفس السرعة بصرف النظر عن عدد الفريمات */
      x.clearRect(0,0,w,h);
      var lines=[[],[],[],[]],green=[],purple=[],i,j,p,q;
      for(i=0;i<pts.length;i++){
        p=pts[i]; p.x+=p.vx*k; p.y+=p.vy*k; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
        (p.g?purple:green).push(p);
        for(j=i+1;j<pts.length;j++){q=pts[j];var dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy; if(d<LINK){var b=Math.min(BUCKETS-1,Math.floor((1-d/LINK)*BUCKETS));lines[b].push(p.x,p.y,q.x,q.y)}}
      }
      x.lineWidth=1;
      for(i=0;i<BUCKETS;i++){var L=lines[i]; if(!L.length)continue; x.strokeStyle='rgba(57,255,20,'+alphas[i]+')'; x.beginPath(); for(j=0;j<L.length;j+=4){x.moveTo(L[j],L[j+1]);x.lineTo(L[j+2],L[j+3])} x.stroke()}
      /* خطوط الماوس */
      if(mx>-900){x.strokeStyle='rgba(255,255,255,.22)';x.beginPath();for(i=0;i<pts.length;i++){p=pts[i];var ddx=p.x-mx,ddy=p.y-my;if(ddx*ddx+ddy*ddy<26000){x.moveTo(p.x,p.y);x.lineTo(mx,my)}}x.stroke()}
      /* النقط: لونين = أمرين رسم */
      x.fillStyle='rgba(57,255,20,.8)';x.beginPath();for(i=0;i<green.length;i++){p=green[i];x.moveTo(p.x+p.r,p.y);x.arc(p.x,p.y,p.r,0,6.2832)}x.fill();
      x.fillStyle='rgba(168,85,247,.85)';x.beginPath();for(i=0;i<purple.length;i++){p=purple[i];x.moveTo(p.x+p.r,p.y);x.arc(p.x,p.y,p.r,0,6.2832)}x.fill();
    })(0);
  }

  /* ---------- أزرار مغناطيسية ---------- */
  if(fine&&!reduce) Array.prototype.forEach.call(root.querySelectorAll('.fx-btn'),function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*10+'px');b.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*8+'px')});
    b.addEventListener('pointerleave',function(){b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')});
  });

  /* ---------- تشغيل الدخول بعد الانترو ---------- */
  afterIntro(function(){
    root.classList.remove('fx-pre'); root.classList.add('fx-go-in');
    tStart=performance.now(); started=true;
    var k=$('#fxKick'),h=$('#fxH');
    if(k) scramble(k,'SERVICES × CONSULTING',900);
    if(h){var fin=h.getAttribute('data-text')||h.textContent; scramble(h,fin,1100,function(){h.setAttribute('data-text',fin)})}
  });
})();

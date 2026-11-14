/* COBRA7 — منطق التقدم والنقاط والإنجازات المشترك (الصفحة الرئيسية + الملف الشخصي).
   بيقرا من نفس مفاتيح التخزين اللي بيستخدمها الموقع، فالنقاط هنا = نفس نقاط المتصدرين. */
(function(){
  var W='cobra7_watched', L='cobra7_labs', VIDEO_PTS=10, LAB_PTS=50;
  var LABS=[
    {id:'cobra-lab-01',file:'lab-01.html',title:'أساسيات استخراج البيانات',level:'مبتدئ',cat:'أساسيات'},
    {id:'cobra-lab-02',file:'lab-02.html',title:'تجاوز المصادقة',level:'متوسط',cat:'ويب'},
    {id:'cobra-lab-03',file:'lab-03.html',title:'استغلال ثغرة XSS',level:'متقدم',cat:'ويب'},
    {id:'cobra-lab-04',file:'lab-04.html',title:'تزوير JWT',level:'محترف',cat:'ويب'},
    {id:'cobra-lab-05',file:'lab-05.html',title:'فك الشفرة',level:'مبتدئ',cat:'أساسيات'},
    {id:'cobra-lab-06',file:'lab-06.html',title:'IDOR',level:'متوسط',cat:'ويب'},
    {id:'cobra-lab-07',file:'lab-07.html',title:'SQL Injection',level:'متقدم',cat:'ويب'},
    {id:'cobra-lab-08',file:'lab-08.html',title:'Path Traversal',level:'محترف',cat:'ويب'}
  ];
  var LEVELS=[
    {xp:0,name:'مستجد'},{xp:50,name:'متعلّم'},{xp:150,name:'مستكشف'},
    {xp:300,name:'محلل'},{xp:600,name:'مخترق أخلاقي'},{xp:1000,name:'كوبرا'}
  ];
  /* شارات: cond بيتحسب من الحالة. hint بيظهر لو لسه مقفولة */
  var BADGES=[
    {id:'v1',icon:'▶',title:'أول فيديو',hint:'خلّص أول فيديو',cond:function(s){return s.videos>=1}},
    {id:'v10',icon:'📚',title:'10 فيديوهات',hint:'خلّص 10 فيديوهات',cond:function(s){return s.videos>=10}},
    {id:'l1',icon:'🧪',title:'أول لاب',hint:'حل أي لاب من لابات كوبرا',cond:function(s){return s.labsDone.length>=1}},
    {id:'lweb',icon:'🕷️',title:'كاسر ويب',hint:'حل 3 لابات ويب',cond:function(s){return s.labsDone.filter(function(l){return l.cat==='ويب'}).length>=3}},
    {id:'lpro',icon:'🔥',title:'مستوى محترف',hint:'حل لاب بمستوى محترف',cond:function(s){return s.labsDone.some(function(l){return l.level==='محترف'})}},
    {id:'lall',icon:'🐍',title:'سيد اللابات',hint:'حل اللابات الـ 8 كلها',cond:function(s){return s.labsDone.length===LABS.length}},
    {id:'p100',icon:'⭐',title:'100 نقطة',hint:'اجمع 100 نقطة',cond:function(s){return s.points>=100}},
    {id:'p500',icon:'💎',title:'500 نقطة',hint:'اجمع 500 نقطة',cond:function(s){return s.points>=500}}
  ];
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')||{}}catch(e){return {}}}
  function state(){
    var w=read(W), l=read(L);
    var videos=Object.keys(w).length;
    var labsDone=LABS.filter(function(x){return l[x.id]});
    var points=videos*VIDEO_PTS+labsDone.length*LAB_PTS;
    var idx=0; LEVELS.forEach(function(v,i){if(points>=v.xp)idx=i});
    var cur=LEVELS[idx], nxt=LEVELS[idx+1]||null;
    var pct=nxt?Math.round((points-cur.xp)/(nxt.xp-cur.xp)*100):100;
    var s={videos:videos,labsDone:labsDone,points:points,level:cur,levelNo:idx+1,next:nxt,pct:pct,toNext:nxt?nxt.xp-points:0};
    s.badges=BADGES.map(function(b){return {id:b.id,icon:b.icon,title:b.title,hint:b.hint,got:!!b.cond(s)}});
    s.labNext=LABS.find(function(x){return !l[x.id]})||null;
    return s;
  }
  window.CobraProgress={LABS:LABS,LEVELS:LEVELS,BADGES:BADGES,state:state,VIDEO_PTS:VIDEO_PTS,LAB_PTS:LAB_PTS};
})();

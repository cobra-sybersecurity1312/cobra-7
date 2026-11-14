/* COBRA7 — واجهة التقييمات (متغيرهاش). البيانات في reviews-data.js والإعدادات في about-data.js */
(function(){
  const esc=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const stars=n=>"★".repeat(n)+"☆".repeat(5-n);
  const all=()=>typeof REVIEWS!=="undefined"&&Array.isArray(REVIEWS)?REVIEWS.filter(r=>r&&r.rating>=1&&r.rating<=5&&r.text):[];
  const siteCfg=()=>typeof SITE!=="undefined"?SITE:{};
  let seq=0;

  if(!document.getElementById("cobra-reviews-css")){
    const st=document.createElement("style");st.id="cobra-reviews-css";
    st.textContent=`
    .rv{max-width:1000px;margin:0 auto;text-align:right}
    .rv-sum{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:22px;color:#cfd5d1}
    .rv-sum b{font-size:34px;color:#39ff14}.rv-sum .st{color:#ffc83d;font-size:22px;letter-spacing:2px}
    .rv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:26px}
    .rv-card{background:linear-gradient(145deg,#0d110e,#10081a);border:1px solid #7c3aed66;border-radius:14px;padding:18px}
    .rv-card .st{color:#ffc83d;letter-spacing:2px}.rv-card p{color:#d9dde0;line-height:1.8;margin:8px 0 12px}
    .rv-card small{color:#9aa3a0}.rv-card small b{color:#fff}
    .rv-empty{padding:26px;border:1px dashed #5b4a78;border-radius:14px;color:#aab;text-align:center;margin-bottom:26px}
    .rv-form{background:linear-gradient(145deg,#0d110e,#10081a);border:1px solid #39ff1455;border-radius:16px;padding:22px}
    .rv-form h4{color:#39ff14;font-size:20px;margin-bottom:6px}.rv-form .hint{color:#9aa3a0;font-size:14px;margin-bottom:14px;line-height:1.7}
    .rv-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
    .rv-form label{display:block;color:#cfd5d1;font-size:14px;margin-bottom:5px}
    .rv-form input[type=text],.rv-form select,.rv-form textarea{width:100%;padding:11px 12px;border-radius:8px;border:1px solid #33433a;background:#070908;color:#fff;font-size:15px;font-family:inherit}
    .rv-form textarea{min-height:110px;resize:vertical}.rv-form input:focus,.rv-form select:focus,.rv-form textarea:focus{outline:2px solid #39ff14;outline-offset:1px}
    .rv-stars{display:flex;gap:4px;direction:ltr;justify-content:flex-end;margin-bottom:12px}
    .rv-stars button{background:none;border:0;font-size:34px;line-height:1;color:#3a3f3c;cursor:pointer;padding:0 2px}.rv-stars button.on{color:#ffc83d}
    .rv-chk{display:flex;gap:8px;align-items:flex-start;color:#aab;font-size:13px;margin:10px 0 14px;line-height:1.6}.rv-chk input{margin-top:4px}
    .rv-send{padding:12px 28px;border:0;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer;background:linear-gradient(135deg,#39ff14,#12c94b);color:#031006}
    .rv-send:disabled{opacity:.5;cursor:not-allowed}
    .rv-msg{margin-top:12px;font-size:14px;line-height:1.7}.rv-msg.ok{color:#39ff14}.rv-msg.err{color:#ff6b81}
    .rv-hp{position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden}
    @media(max-width:600px){.rv-row{grid-template-columns:1fr}}`;
    document.head.appendChild(st);
  }

  function targetName(r){
    if(r.course&&typeof TRACKS!=="undefined"){const t=TRACKS.find(x=>x.id===r.course);if(t)return t.title}
    return r.target||"";
  }
  function listHTML(opts){
    opts=opts||{};
    let rs=all().filter(r=>!opts.course||r.course===opts.course);
    if(opts.limit)rs=rs.slice(0,opts.limit);
    if(!rs.length)return opts.emptyText===null?"":'<div class="rv-empty">'+esc(opts.emptyText||"لسه مفيش تقييمات منشورة. كن أول من يقيّم!")+'</div>';
    const avg=rs.reduce((n,r)=>n+r.rating,0)/rs.length;
    const sum='<div class="rv-sum"><b>'+avg.toFixed(1)+'</b><span class="st">'+stars(Math.round(avg))+'</span><span>('+rs.length+' تقييم)</span></div>';
    return sum+'<div class="rv-grid">'+rs.map(r=>'<div class="rv-card"><div class="st">'+stars(r.rating)+'</div><p>'+esc(r.text)+'</p><small><b>'+esc(r.name||"مجهول")+'</b>'+(r.role?' · '+esc(r.role):'')+(targetName(r)?' · '+esc(targetName(r)):'')+(r.date?' · '+esc(r.date):'')+'</small></div>').join("")+'</div>';
  }
  function targetOptions(){
    let o='<optgroup label="الأكاديمية">';
    if(typeof TRACKS!=="undefined")o+=TRACKS.map(t=>'<option value="course:'+esc(t.id)+'">'+esc(t.title)+'</option>').join("");
    o+='</optgroup><optgroup label="خدمات أخرى"><option value="other:ورشة عمل">ورشة عمل</option><option value="other:استشارة أمنية">استشارة أمنية</option><option value="other:خدمة تطوير مواقع/تطبيقات">خدمة تطوير مواقع/تطبيقات</option><option value="other:أخرى">أخرى</option></optgroup>';
    return o;
  }
  function formHTML(opts,id){
    opts=opts||{};
    const fixed=opts.course?'<input type="hidden" data-f="target" value="course:'+esc(opts.course)+'">':'';
    const pick=opts.course?'':'<div><label for="'+id+'t">التقييم عن</label><select id="'+id+'t" data-f="target">'+targetOptions()+'</select></div>';
    return '<form class="rv-form" id="'+id+'" novalidate><h4>'+esc(opts.heading||"قيّم تجربتك")+'</h4><p class="hint">'+esc(opts.hint||"رأيك بيساعدنا نتحسن ويساعد غيرك يختار. التقييم بيتراجع قبل ما يتنشر.")+'</p>'+fixed+
      '<div class="rv-row"><div><label for="'+id+'n">الاسم (اختياري)</label><input type="text" id="'+id+'n" data-f="name" maxlength="40" autocomplete="name"></div>'+
      '<div><label for="'+id+'r">أنت</label><select id="'+id+'r" data-f="role"><option>طالب</option><option>عميل</option></select></div></div>'+
      (pick?'<div style="margin-bottom:12px">'+pick+'</div>':'')+
      '<label>تقييمك</label><div class="rv-stars" role="radiogroup" aria-label="التقييم من 5">'+[1,2,3,4,5].map(n=>'<button type="button" data-star="'+n+'" aria-label="'+n+' من 5">★</button>').join("")+'</div>'+
      '<label for="'+id+'c">تعليقك</label><textarea id="'+id+'c" data-f="text" maxlength="500" placeholder="إيه اللي عجبك؟ وإيه اللي نقدر نحسنه؟"></textarea>'+
      '<div class="rv-hp"><label>سيبه فاضي<input type="text" data-f="website" tabindex="-1" autocomplete="off"></label></div>'+
      '<label class="rv-chk"><input type="checkbox" data-f="consent"><span>أوافق على نشر تقييمي (باسمي المكتوب فقط) على موقع Cobra7.</span></label>'+
      '<button class="rv-send" type="submit">إرسال التقييم</button><div class="rv-msg" role="status" aria-live="polite"></div></form>';
  }
  function bindForm(id,opts){
    const f=document.getElementById(id); if(!f)return;
    let rating=0;const btns=[...f.querySelectorAll("[data-star]")],msg=f.querySelector(".rv-msg"),send=f.querySelector(".rv-send");
    const paint=n=>btns.forEach(b=>b.classList.toggle("on",+b.dataset.star<=n));
    btns.forEach(b=>{b.onclick=()=>{rating=+b.dataset.star;paint(rating)};b.onmouseenter=()=>paint(+b.dataset.star);b.onmouseleave=()=>paint(rating)});
    const get=k=>{const e=f.querySelector('[data-f="'+k+'"]');return e?(e.type==="checkbox"?e.checked:e.value.trim()):""};
    const say=(t,c)=>{msg.textContent=t;msg.className="rv-msg "+(c||"")};
    f.onsubmit=async e=>{
      e.preventDefault();
      if(get("website"))return;                       // فخ للروبوتات
      if(!rating)return say("اختار عدد النجوم الأول.","err");
      if(get("text").length<10)return say("اكتب تعليق من 10 حروف على الأقل.","err");
      if(!get("consent"))return say("لازم توافق على نشر التقييم.","err");
      const [kind,val]=String(get("target")).split(/:(.*)/s);
      let target=val||"";if(kind==="course"&&typeof TRACKS!=="undefined"){const t=TRACKS.find(x=>x.id===val);if(t)target=t.title}
      const payload={name:get("name")||"مجهول",role:get("role"),course:kind==="course"?val:"",target,rating,text:get("text"),page:location.href};
      const ep=siteCfg().reviewEndpoint;
      send.disabled=true;
      if(ep){
        try{
          const r=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload)});
          if(!r.ok)throw new Error(r.status);
          f.reset();rating=0;paint(0);say("شكرًا ليك! وصلنا تقييمك وهيتراجع قبل النشر. 💚","ok");
        }catch(err){say("حصلت مشكلة في الإرسال. حاول تاني بعد شوية.","err")}
      }else{
        const text="⭐ تقييم Cobra7\nالتقييم: "+rating+"/5\nعن: "+target+"\nالاسم: "+payload.name+" ("+payload.role+")\n"+payload.text;
        try{await navigator.clipboard.writeText(text)}catch(_){}
        const tg=siteCfg().telegramContact;if(tg)window.open(tg,"_blank","noopener");
        say("نسخنا تقييمك. الصقه في محادثة تيليجرام اللي اتفتحت وابعته لنا. شكرًا! 💚","ok");
      }
      send.disabled=false;
    };
  }
  function mount(elId,opts){
    const el=document.getElementById(elId); if(!el)return;
    opts=opts||{};const id="rvf"+(++seq);
    el.innerHTML='<div class="rv">'+listHTML(opts)+(opts.noForm?"":formHTML(opts,id))+'</div>';
    if(!opts.noForm)bindForm(id,opts);
  }
  window.CobraReviews={mount,listHTML,formHTML,_count:()=>all().length};
})();

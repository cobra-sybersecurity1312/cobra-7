/* COBRA7 — محرك صفحتي الخدمات والاستشارات. الإعدادات في window.CATALOG (من ملف البيانات). متغيرهوش. */
(function(){
const C=window.CATALOG,$=id=>document.getElementById(id);
const esc=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
const BASE=(typeof SITE!=="undefined"&&/^https:\/\/t\.me\//i.test(SITE.telegramContact||""))?SITE.telegramContact:C.contact;
const link=t=>BASE+(t?"?text="+encodeURIComponent(C.msg+t):"");
$("note").textContent="⚠️ "+C.note;
document.querySelectorAll("a[data-tg]").forEach(a=>{a.href=link("")});
/* أيقونات عايمة */
$("fl").innerHTML=(C.float||["✨"]).map((e,i)=>'<span style="--s:'+(26+(i*7)%30)+'px;--t:'+(7+(i*3)%6)+'s;--d:-'+(i*1.3)+'s;left:'+((i*37+8)%92)+'%;top:'+((i*23+10)%75)+'%">'+esc(e)+'</span>').join("");
/* عدادات */
$("stats").innerHTML=C.stats().map(s=>'<div class="stat"><b data-n="'+s.n+'">0</b><small>'+esc(s.l)+'</small></div>').join("");
function countUp(){document.querySelectorAll("[data-n]").forEach(el=>{const to=+el.dataset.n;if(still){el.textContent=to;return}const t0=performance.now();const f=t=>{const p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
countUp();
/* فلاتر */
let cat="",qv="";
const cnt=k=>C.items.filter(s=>!k||s.cat===k).length;
$("filters").innerHTML='<button class="chip on" data-k="">الكل <small>'+cnt("")+'</small></button>'+C.cats.map(c=>'<button class="chip" data-k="'+esc(c.k)+'">'+esc(c.ic)+' '+esc(c.n)+' <small>'+cnt(c.k)+'</small></button>').join("");
$("filters").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.k;document.querySelectorAll("#filters .chip").forEach(x=>x.classList.toggle("on",x===b));render()});
/* ظهور تدريجي */
const io="IntersectionObserver"in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1}):null;
const reveal=(el,i)=>{el.style.setProperty("--d",(i%3)*.09+"s");io?io.observe(el):el.classList.add("in")};
function card(s){
  const c=C.cats.find(x=>x.k===s.cat)||{n:""};
  return '<article class="card">'+(s.hot?'<span class="hot">🔥 الأكثر طلبًا</span>':'')+'<span class="ic">'+esc(s.icon)+'</span><span class="ct">'+esc(c.n)+'</span><h3>'+esc(s.title)+'</h3>'+
  ((s.tags&&s.tags.length)?'<div class="tags">'+s.tags.map(t=>'<i>'+esc(t)+'</i>').join("")+'</div>':'')+
  '<h4>مناسبة لمين؟</h4><p>'+esc(s.who)+'</p><h4>'+esc(C.whatLabel)+'</h4><p>'+esc(s.what)+'</p>'+
  '<h4>هتاخد إيه؟</h4><ul>'+s.gets.map(g=>'<li>'+esc(g)+'</li>').join("")+'</ul>'+
  '<div class="price"><span>💰 '+(s.price?esc(s.price):"السعر حسب الاتفاق، كلمني وهنتفق")+'</span>'+(s.time?'<em>⏱ '+esc(s.time)+'</em>':'')+'</div>'+
  '<div class="act"><a class="tg" href="'+esc(link(s.title))+'" target="_blank" rel="noopener noreferrer">✈ '+esc(C.btn)+'</a></div></article>';
}
function render(){
  const ord=k=>C.cats.findIndex(c=>c.k===k),q=qv.trim().toLowerCase();
  const list=C.items.filter(s=>(!cat||s.cat===cat)&&(!q||[s.title,s.who,s.what,(s.tags||[]).join(" ")].join(" ").toLowerCase().includes(q))).sort((a,b)=>ord(a.cat)-ord(b.cat));
  $("count").textContent=list.length+" "+C.unit;
  const g=$("grid");g.innerHTML=list.length?list.map(card).join(""):'<p style="grid-column:1/-1;text-align:center;color:#a9b0ac;padding:30px">مفيش نتيجة مطابقة، جرّب كلمة تانية أو كلمني وهنحلّها سوا 👌</p>';
  g.querySelectorAll(".card").forEach(reveal);
  if(!still&&matchMedia("(pointer:fine)").matches)g.querySelectorAll(".card").forEach(el=>{
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty("--mx",x*100+"%");el.style.setProperty("--my",y*100+"%");el.style.setProperty("--ry",(x-.5)*5+"deg");el.style.setProperty("--rx",(.5-y)*5+"deg")});
    el.addEventListener("pointerleave",()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")});
  });
}
render();
if($("q"))$("q").addEventListener("input",e=>{qv=e.target.value;render()});
if($("pnote")&&C.priceNote)$("pnote").textContent="💡 "+C.priceNote;
if(C.bundles&&$("bundles")){$("bundles").innerHTML=C.bundles.map(b=>'<div class="bd"><span class="bi">'+esc(b.icon)+'</span><h3>'+esc(b.name)+'</h3><p>'+esc(b.desc)+'</p><ul>'+b.includes.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><div class="bp"><s>'+esc(b.was)+'</s><b>'+esc(b.price)+'</b><small>'+esc(b.save)+'</small></div><a class="tg" href="'+esc(link(b.name))+'" target="_blank" rel="noopener noreferrer">✈ '+esc(C.btn)+'</a></div>').join("");document.querySelectorAll("#bundles .bd").forEach(reveal)}
$("steps").innerHTML=C.steps.map(s=>'<div class="st"><b>'+esc(s[0])+'</b>'+esc(s[1])+'</div>').join("");
document.querySelectorAll(".st").forEach((el,i)=>{el.style.transitionDelay=i*.12+"s";io?io.observe(el):el.classList.add("in")});
})();

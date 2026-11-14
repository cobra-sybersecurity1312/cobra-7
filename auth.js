/* COBRA7 — الحسابات + حفظ التقدم + نقاط المتصدرين (Firebase). متغيرهوش.
   بيشتغل بس لو firebase-config.js فيه إعدادات. الباسوورد بيتخزن عند Firebase مشفّر، مش عندنا. */
const cfg = window.FIREBASE_CONFIG || {};
const enabled = !!(cfg.apiKey && cfg.projectId);
const POINTS_PER_VIDEO = 10;
window.CobraAuth = { enabled, POINTS_PER_VIDEO, LAB_POINTS: 50, ready: Promise.resolve(null) };

if (enabled) {
  window.CobraAuth.ready = boot().catch(err => { console.error("Cobra auth failed to load", err); return null; });
}

async function boot() {
  const base = "https://www.gstatic.com/firebasejs/10.12.2/";
  const [{ initializeApp }, A, F] = await Promise.all([
    import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")
  ]);
  const app = initializeApp(cfg), auth = A.getAuth(app), db = F.getFirestore(app);
  const esc = x => String(x == null ? "" : x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ERR = {
    "auth/invalid-email": "الإيميل مش مكتوب صح.", "auth/missing-password": "اكتب الباسوورد.",
    "auth/invalid-credential": "الإيميل أو الباسوورد غلط.", "auth/wrong-password": "الإيميل أو الباسوورد غلط.", "auth/user-not-found": "الإيميل أو الباسوورد غلط.",
    "auth/email-already-in-use": "الإيميل ده مسجّل قبل كده. جرّب تسجيل الدخول.", "auth/weak-password": "الباسوورد ضعيف.",
    "auth/too-many-requests": "محاولات كتير. استنى شوية وجرّب تاني.", "auth/network-request-failed": "مشكلة في الاتصال بالإنترنت.",
    "auth/unauthorized-domain": "الدومين ده مش مضاف في إعدادات Firebase.", "auth/popup-blocked": "المتصفح منع النافذة. اسمح بالـ popups وجرّب تاني."
  };
  const errMsg = e => (e && e.code === "auth/popup-closed-by-user") ? "" : (ERR[e && e.code] || "حصلت مشكلة. جرّب تاني.");

  /* ---------- التقدم المحلي ---------- */
  const readLocal = () => { try { return JSON.parse(localStorage.getItem("cobra7_watched") || "{}") || {}; } catch (e) { return {}; } };
  const writeLocal = o => { try { localStorage.setItem("cobra7_watched", JSON.stringify(o)); } catch (e) {} };
  const LAB_PTS = 50, LAB_RE = /^cobra-lab-\d{2}$/;
  const readLabsAll = () => { try { return JSON.parse(localStorage.getItem("cobra7_labs") || "{}") || {}; } catch (e) { return {}; } };
  const ownLabs = o => Object.keys(o).filter(k => LAB_RE.test(k));
  const points = () => Object.keys(readLocal()).length * POINTS_PER_VIDEO + ownLabs(readLabsAll()).length * LAB_PTS;

  /* ---------- الواجهة ---------- */
  const st = document.createElement("style");
  st.textContent = `
  #authSlot{position:relative;display:flex;align-items:center}
  .au-btn{padding:9px 18px;border-radius:9px;border:1px solid #39ff14;background:#0b0f0c;color:#39ff14;font-weight:900;font-size:15px;cursor:pointer;font-family:inherit}
  .au-btn:hover{background:#39ff14;color:#031006}
  .au-menu{position:absolute;top:calc(100% + 8px);left:0;min-width:240px;background:#0b0f0c;border:1px solid #39ff1466;border-radius:12px;padding:12px;z-index:200;box-shadow:0 12px 40px #000c;display:none}
  .au-menu.show{display:block}.au-menu .nm{color:#fff;font-weight:900;margin-bottom:2px;overflow-wrap:anywhere}.au-menu .pt{color:#39ff14;font-size:14px;margin-bottom:10px}
  .au-menu a,.au-menu button{display:block;width:100%;text-align:right;padding:9px 10px;border-radius:8px;border:0;background:none;color:#e8eee9;text-decoration:none;font-size:14px;cursor:pointer;font-family:inherit}
  .au-menu a:hover,.au-menu button:hover{background:#39ff1420;color:#39ff14}.au-warn{color:#ffc83d;font-size:12.5px;line-height:1.6;margin:0 0 8px;padding:8px;border:1px dashed #ffc83d66;border-radius:8px}
  .au-ov{position:fixed;inset:0;background:#000d;z-index:3000;display:none;align-items:center;justify-content:center;padding:16px;overflow:auto}.au-ov.show{display:flex}
  .au-box{width:100%;max-width:410px;background:linear-gradient(145deg,#0d110e,#12081f);border:1px solid #7c3aed;border-radius:18px;padding:26px;box-shadow:0 0 40px #7c3aed44;color:#eef2f5;text-align:right}
  .au-box h3{color:#39ff14;font-size:22px;margin-bottom:4px}.au-box .sub{color:#9aa3a0;font-size:13.5px;margin-bottom:14px;line-height:1.7}
  .au-tabs{display:flex;gap:6px;margin-bottom:16px}.au-tabs button{flex:1;padding:10px;border-radius:9px;border:1px solid #33433a;background:#070908;color:#cfd5d1;font-weight:800;cursor:pointer;font-family:inherit}.au-tabs button.on{border-color:#39ff14;color:#39ff14;background:#39ff1412}
  .au-box label{display:block;font-size:13.5px;color:#cfd5d1;margin:10px 0 5px}.au-box input{width:100%;padding:11px 12px;border-radius:8px;border:1px solid #33433a;background:#070908;color:#fff;font-size:15px;font-family:inherit}.au-box input:focus{outline:2px solid #39ff14;outline-offset:1px}
  .au-go{width:100%;margin-top:16px;padding:12px;border:0;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer;background:linear-gradient(135deg,#39ff14,#12c94b);color:#031006;font-family:inherit}.au-go:disabled{opacity:.5}
  .au-g{width:100%;margin-top:10px;padding:11px;border-radius:10px;border:1px solid #4d5b53;background:#fff;color:#222;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit}
  .au-or{text-align:center;color:#778;font-size:13px;margin:14px 0 0}.au-msg{margin-top:12px;font-size:13.5px;line-height:1.7;min-height:18px}.au-msg.err{color:#ff6b81}.au-msg.ok{color:#39ff14}
  .au-x{float:left;background:none;border:0;color:#aab;font-size:22px;cursor:pointer}.au-lnk{background:none;border:0;color:#a855f7;cursor:pointer;font-size:13px;padding:0;margin-top:10px;font-family:inherit;text-decoration:underline}
  @media(max-width:760px){
    header{position:static!important;padding:10px 14px!important;gap:6px 10px!important;justify-content:space-between!important;align-items:center!important}
    header h1{font-size:19px!important;letter-spacing:1px!important;margin:0!important}
    header nav{order:3;width:100%;flex-wrap:nowrap!important;overflow-x:auto;gap:16px!important;justify-content:flex-start!important;padding:2px 0 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    header nav::-webkit-scrollbar{display:none}
    header nav a{white-space:nowrap;font-size:15px!important}
    #authSlot{margin:0}#authSlot button{padding:6px 12px!important;font-size:13px!important}
  }
  @media(max-width:700px){.au-menu{left:auto;right:0}}`;
  document.head.appendChild(st);

  const hdr = document.querySelector("header");
  const slot = document.createElement("div"); slot.id = "authSlot";
  if (hdr) hdr.appendChild(slot);

  const ov = document.createElement("div"); ov.className = "au-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
  ov.innerHTML = `<div class="au-box"><button class="au-x" aria-label="إغلاق">×</button>
    <h3 id="auT">أهلًا بيك في Cobra7</h3><p class="sub" id="auS">سجّل دخولك عشان تحفظ تقدمك وتدخل منافسة المتصدرين.</p>
    <div class="au-tabs"><button data-m="in" class="on">دخول</button><button data-m="up">حساب جديد</button></div>
    <form id="auF" novalidate>
      <div id="auNameW" hidden><label for="auName">الاسم اللي هيظهر في المتصدرين</label><input id="auName" maxlength="30" autocomplete="nickname" placeholder="ممكن اسم مستعار"></div>
      <label for="auMail">الإيميل</label><input id="auMail" type="email" autocomplete="email" dir="ltr" placeholder="name@gmail.com">
      <label for="auPass">الباسوورد</label><input id="auPass" type="password" autocomplete="current-password" dir="ltr" placeholder="8 حروف على الأقل">
      <button class="au-go" id="auGo" type="submit">دخول</button>
    </form>
    <div class="au-or">أو</div><button class="au-g" id="auG" type="button">الدخول بحساب جوجل</button>
    <button class="au-lnk" id="auReset" type="button">نسيت الباسوورد؟</button>
    <div class="au-msg" id="auMsg" role="status" aria-live="polite"></div></div>`;
  document.body.appendChild(ov);
  const $ = id => document.getElementById(id);
  let mode = "in", busy = false;
  const say = (t, c) => { $("auMsg").textContent = t; $("auMsg").className = "au-msg " + (c || ""); };
  function setMode(m) {
    mode = m; $("auNameW").hidden = m !== "up"; $("auGo").textContent = m === "up" ? "إنشاء الحساب" : "دخول";
    $("auPass").autocomplete = m === "up" ? "new-password" : "current-password"; $("auReset").hidden = m === "up"; say("");
    ov.querySelectorAll(".au-tabs button").forEach(b => b.classList.toggle("on", b.dataset.m === m));
  }
  const open = m => { setMode(m || "in"); ov.classList.add("show"); setTimeout(() => $(m === "up" ? "auName" : "auMail").focus(), 50); };
  const close = () => ov.classList.remove("show");
  ov.querySelector(".au-x").onclick = close; ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  ov.querySelectorAll(".au-tabs button").forEach(b => b.onclick = () => setMode(b.dataset.m));

  async function run(fn) { if (busy) return; busy = true; $("auGo").disabled = true; try { await fn(); } catch (e) { const m = errMsg(e); if (m) say(m, "err"); } busy = false; $("auGo").disabled = false; }
  $("auF").onsubmit = ev => { ev.preventDefault(); run(async () => {
    const mail = $("auMail").value.trim(), pass = $("auPass").value;
    if (!mail || !pass) return say("اكتب الإيميل والباسوورد.", "err");
    if (mode === "up") {
      const name = $("auName").value.trim();
      if (name.length < 2) return say("اكتب اسم من حرفين على الأقل.", "err");
      if (pass.length < 8 || !/[A-Za-z]/.test(pass) || !/\d/.test(pass)) return say("الباسوورد لازم 8 حروف على الأقل وفيه حروف وأرقام.", "err");
      const cred = await A.createUserWithEmailAndPassword(auth, mail, pass);
      await A.updateProfile(cred.user, { displayName: name });
      try { await A.sendEmailVerification(cred.user); } catch (e) {}
      say("اتعمل الحساب. بعتنالك رابط تفعيل على إيميلك، فعّله عشان تظهر في المتصدرين.", "ok"); setTimeout(close, 2600);
    } else { await A.signInWithEmailAndPassword(auth, mail, pass); close(); }
  }); };
  $("auG").onclick = () => run(async () => { await A.signInWithPopup(auth, new A.GoogleAuthProvider()); close(); });
  $("auReset").onclick = () => run(async () => {
    const mail = $("auMail").value.trim(); if (!mail) return say("اكتب إيميلك فوق الأول.", "err");
    await A.sendPasswordResetEmail(auth, mail); say("لو الإيميل مسجّل هيوصلك رابط إعادة تعيين الباسوورد.", "ok");
  });

  /* ---------- القايمة بعد الدخول ---------- */
  function render(user) {
    if (!user) { slot.innerHTML = '<button class="au-btn" id="auOpen">تسجيل الدخول</button>'; $("auOpen").onclick = () => open("in"); return; }
    const name = esc(user.displayName || (user.email || "").split("@")[0] || "مستخدم");
    slot.innerHTML = '<button class="au-btn" id="auMe" aria-haspopup="true">👤 ' + name + ' ▾</button><div class="au-menu" id="auMenu"><div class="nm">' + name + '</div><div class="pt">⭐ نقاطك: <span id="auPts">' + points() + '</span></div>' +
      (user.emailVerified ? "" : '<p class="au-warn">فعّل إيميلك (راجع صندوق الوارد) عشان تظهر في لوحة المتصدرين.</p><button id="auVer">إعادة إرسال رابط التفعيل</button>') +
      '<a href="profile.html">👤 ملفي الشخصي</a><a href="leaderboard.html">🏆 لوحة المتصدرين</a><button id="auOut">تسجيل الخروج</button></div>';
    $("auMe").onclick = e => { e.stopPropagation(); $("auMenu").classList.toggle("show"); };
    $("auOut").onclick = () => A.signOut(auth);
    const v = $("auVer"); if (v) v.onclick = async () => { try { await A.sendEmailVerification(user); v.textContent = "اتبعت ✓"; } catch (e) { v.textContent = "حاول بعد شوية"; } };
  }
  document.addEventListener("click", e => { const m = $("auMenu"); if (m && !slot.contains(e.target)) m.classList.remove("show"); });

  /* ---------- مزامنة التقدم والنقاط ---------- */
  let timer = null;
  const nameOf = u => String(u.displayName || (u.email || "").split("@")[0] || "مستخدم").slice(0, 30);
  async function push(user) {
    const w = readLocal(), keys = Object.keys(w).slice(0, 1000), map = {}; keys.forEach(k => map[k] = true);
    const lk = ownLabs(readLabsAll()).slice(0, 100), lmap = {}; lk.forEach(k => lmap[k] = true);
    const total = keys.length * POINTS_PER_VIDEO + lk.length * LAB_PTS;
    const batch = F.writeBatch(db);
    batch.set(F.doc(db, "users", user.uid), { name: nameOf(user), watched: map, labs: lmap, updatedAt: F.serverTimestamp() });
    if (user.emailVerified) batch.set(F.doc(db, "leaderboard", user.uid), { name: nameOf(user), points: total, updatedAt: F.serverTimestamp() });
    await batch.commit(); const p = $("auPts"); if (p) p.textContent = total;
  }
  const schedule = () => { const u = auth.currentUser; if (!u) return; clearTimeout(timer); timer = setTimeout(() => push(u).catch(e => console.warn("sync failed", e.code)), 2000); };
  window.addEventListener("cobra:watched", schedule);
  window.addEventListener("cobra:labs", schedule);

  A.onAuthStateChanged(auth, async user => {
    render(user); if (!user) return;
    try {
      await user.reload(); render(auth.currentUser || user);
      const snap = await F.getDoc(F.doc(db, "users", user.uid));
      const remote = snap.exists() ? (snap.data().watched || {}) : {}, local = readLocal(), merged = { ...remote, ...local };
      if (Object.keys(merged).length !== Object.keys(local).length) { writeLocal(merged); window.dispatchEvent(new CustomEvent("cobra:synced")); }
      const rl = snap.exists() ? (snap.data().labs || {}) : {}, ll = readLabsAll(), ml = { ...ll, ...rl };
      if (Object.keys(ml).length !== Object.keys(ll).length) { try { localStorage.setItem("cobra7_labs", JSON.stringify(ml)); } catch (e) {} window.dispatchEvent(new CustomEvent("cobra:synced")); }
      await push(auth.currentUser || user); render(auth.currentUser || user);
    } catch (e) { console.warn("account sync failed", e.code || e); }
  });
  window.CobraAuth.auth = auth; window.CobraAuth.db = db; window.CobraAuth.F = F; window.CobraAuth.open = open;
  return window.CobraAuth;
}

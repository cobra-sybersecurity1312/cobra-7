/* =====================================================================
   COBRA7 — بيانات صفحة "عنّا" (الملف ده اللي بتعدل فيه، مش محتاج تلمس HTML)
   - كل قايمة فاضية [] هتظهر في الموقع بعبارة "هتتضاف قريبًا". أول ما تضيف عنصر بيظهر لوحده.
   - الروابط لازم تبدأ بـ https://
   ===================================================================== */
const SITE = {
  telegramGroup: "https://t.me/cobra7_com",   // 👈 غيّره لرابط جروب التليجرام بتاعك
  telegramContact: "https://t.me/cobra7_com", // رابط التواصل المباشر معاك
  reviewEndpoint: "",                         // 👈 رابط استلام التقييمات (شرحه تحت في reviews-data.js)

  /* ---------- إعدادات الصفحة الرئيسية (زرار الشراء + القائمة البريدية) ---------- */
  buyUrl: "",            // 👈 رابط الدفع/الاشتراك (Paymob / Gumroad / ... ). فاضي = الزرار بيودّي لصفحة الكورسات.
  buyLabel: "ابدأ التعلّم الآن",   // نص الزرار الرئيسي (مثلًا: "اشترك الآن")
  price: "",             // 👈 السعر اللي يظهر جنب الزرار (مثلًا: "499 جنيه"). فاضي = مش بيظهر.
  studentsCount: 0,      // 👈 عدد الطلاب الحقيقي. 0 = الرقم مش بيظهر (متكتبش رقم مش حقيقي).
  emailEndpoint: "",     // 👈 رابط Formspree (أو أي خدمة) لاستلام إيميلات القائمة البريدية.
  giftFile: "cobra7-linux-cheatsheet.pdf"  // الهدية اللي بتتنزل بعد التسجيل بالإيميل
};

const ABOUT = {
  /* حساباتك على المنصات: اللي رابطه فاضي مش بيظهر */
  profiles: [
    {name:"TryHackMe",    icon:"🧪", url:"https://tryhackme.com/p/cobra13",            desc:"تحديات عملية في الاختراق الأخلاقي وأمن الويب"},
    {name:"LinkedIn",     icon:"💼", url:"https://www.linkedin.com/in/islam-ali-32598a3a6", desc:"خبراتي المهنية وشبكة التواصل"},
    {name:"Coddy",        icon:"💻", url:"https://coddy.tech/user/cor7",               desc:"تعلّم البرمجة خطوة بخطوة"},
    {name:"Hack The Box", icon:"📦", url:"", desc:""},
    {name:"GitHub",       icon:"🐙", url:"", desc:""}
  ],

  /* الخبرات — مثال: {title:"Web Pentester", org:"اسم الجهة", period:"2025 - الآن", desc:"وصف قصير"} */
  experience: [],

  /* الشهادات — الحقول: title, issuer, year, date, img (معاينة), pdf (الملف), url (رابط التحقق اختياري), skills */
  certificates: [
    {title:"أساسيات أجهزة الكمبيوتر", en:"Computer Hardware Basics", issuer:"Cisco Networking Academy", year:"2026", date:"12 نوفمبر 2026",
     img:"cert-preview-hardware.jpg", pdf:"cisco-computer-hardware-basics.pdf", url:"",
     skills:[
       "تركيب مكونات الكمبيوتر وبناؤه وصيانته وترقيته",
       "وصف مكونات الأجهزة الشائعة والصيانة الوقائية",
       "شرح مميزات اللابتوبات ووظائفها",
       "شرح مميزات الأجهزة المحمولة ووظائفها",
       "تحديد معايير السلامة العامة ومعايير الحرائق"
     ]},
    {title:"أساسيات الشبكات", en:"Networking Basics", issuer:"Cisco Networking Academy", year:"2026", date:"10 نوفمبر 2026",
     img:"cert-preview-networking.jpg", pdf:"cisco-networking-basics.pdf", url:"",
     skills:[
       "شرح مفاهيم الاتصال بالشبكات وأنواعها ومكوناتها",
       "شرح أهمية المعايير والبروتوكولات في الشبكات",
       "شرح طريقة الاتصال عبر شبكات Ethernet",
       "شرح خصائص عناوين IP وعناوين IPv4 واستخدامها",
       "شرح مميزات عناوين IPv6",
       "شرح طريقة ربط الراوترات للشبكات ببعض",
       "استخدام أدوات اختبار الاتصال بالشبكة واستكشاف أعطالها",
       "إعداد راوتر لاسلكي وجهاز عميل للاتصال بالإنترنت بأمان"
     ]}
  ],

  /* الإنجازات — مثال: {title:"Top 1% على TryHackMe", platform:"TryHackMe", date:"2026", desc:"تفاصيل", url:"رابط (اختياري)", badge:"🏆"} */
  achievements: []
};

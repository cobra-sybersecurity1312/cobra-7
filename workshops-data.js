/* =====================================================================
   COBRA7 — بيانات الورش واللابات (الملف ده اللي بتعدل فيه، مش محتاج تلمس HTML)
   كل عنصر = كارت في صفحة الورش. الترتيب هنا = الترتيب المقترح للتعلم (من الأسهل).
   - cost: "free" مجاني | "freemium" مجاني بحدود/أجزاء مدفوعة | "paid" مدفوع
   - الروابط لازم تبدأ بـ https://
   - embed:"no" (مع embedNote) معناه اللاب مينفعش يتفتح جوه الموقع (SSH/VPN مثلاً) فبيظهر له زر فتح خارجي بس.
     من غيرها: الموقع بيحاول يفتحه جوه الموقع، ولو المنصة بتمنع ده بيظهر للزائر زر "فتح في تبويب جديد".
   - لو ضفت لاب جديد: اتأكد إن الرابط شغال وإن اللاب قانوني ومتاح للتدريب.
   - المنصات بتغير الأسعار والمحتوى، فراجع الكروت كل فترة.
   ===================================================================== */
const PLATFORMS = {
  tryhackme: {name:"TryHackMe",      icon:"🧪", url:"https://tryhackme.com"},
  portswigger:{name:"PortSwigger Academy", icon:"🕷️", url:"https://portswigger.net/web-security"},
  htb:       {name:"Hack The Box",   icon:"📦", url:"https://www.hackthebox.com"},
  otw:       {name:"OverTheWire",    icon:"🐧", url:"https://overthewire.org/wargames/"},
  picoctf:   {name:"picoCTF",        icon:"🚩", url:"https://play.picoctf.org"},
  coddy:     {name:"Coddy",          icon:"💻", url:"https://coddy.tech"},
  cobra7:    {name:"Cobra7 Labs",    icon:"🐍", url:""}
};

const LABS = [
  { id:"otw-bandit", platform:"otw", type:"لاب", cat:"لينكس", level:"مبتدئ", cost:"free",
    title:"Bandit — أساسيات لينكس بالتطبيق", url:"https://overthewire.org/wargames/bandit/",
    time:"34 مستوى", what:"لعبة بتتصل فيها بسيرفر لينكس حقيقي عن طريق SSH، وكل مستوى لغز بتحله بأوامر الطرفية عشان توصل للباسوورد بتاع المستوى اللي بعده.",
    gain:["تتقن أوامر لينكس الأساسية (التنقل، قراءة الملفات، البحث، الصلاحيات).","تتعود على الاتصال بسيرفر بعيد بـ SSH.","تبني الأساس اللي محتاجه أي حد في الاختراق الأخلاقي."],
    prereq:"مفيش، ابدأ من الصفر.",
    embed:"no", embedNote:"اللاب ده بيشتغل عن طريق اتصال SSH من الطرفية عندك، فمينفعش يتفتح جوه صفحة ويب." },

  { id:"htb-academy-t0", platform:"htb", type:"مسار", cat:"أساسيات", level:"مبتدئ", cost:"free",
    title:"HTB Academy — موديولات Tier 0 المجانية", url:"https://academy.hackthebox.com",
    time:"حسب سرعتك", what:"موديولات تعليمية مجانية من Hack The Box بتشرح الأساسيات بالشرح والتمارين، زي Linux Fundamentals وIntroduction to Networking وWeb Requests.",
    gain:["تفهم الشبكات والـ Web Requests اللي أي اختراق ويب بيعتمد عليها.","تتعلم لينكس بشكل منظم.","تبدأ تتعود على أسلوب Hack The Box قبل الأجهزة."],
    prereq:"حساب مجاني. موديولات Tier 0 بتتفتح بالـ Cubes وبترجعلك بعد ما تخلصها." },

  { id:"thm-presec", platform:"tryhackme", type:"مسار", cat:"أساسيات", level:"مبتدئ", cost:"freemium",
    title:"Pre Security — مسار البداية", url:"https://tryhackme.com",
    time:"حسب سرعتك", what:"مسار للي لسه بيبدأ: بيشرح إزاي الإنترنت والشبكات وأنظمة التشغيل والويب بتشتغل، قبل ما تتعلم تخترق أي حاجة. ابحث عن «Pre Security» جوه الموقع.",
    gain:["تفهم الأساس اللي كل الاختراق مبني عليه.","تتعلم بطريقة الغرف التفاعلية (Rooms) المرتبة.","تعرف تبدأ من فين من غير ما تتوه."],
    prereq:"مفيش. أغلب المحتوى المبتدئ مجاني، وبعض الغرف والأدوات للمشتركين." },

  { id:"coddy-python", platform:"coddy", type:"مسار", cat:"برمجة", level:"مبتدئ", cost:"freemium",
    title:"Coddy — مسار بايثون", url:"https://coddy.tech/python",
    time:"حسب سرعتك", what:"منصة بتعلمك البرمجة بالتطبيق: بتكتب الكود وتشغله في المتصفح وتاخد نتيجة فورية. بتغطي بايثون وجافاسكريبت ولغات تانية.",
    gain:["تكتب سكريبتات بايثون بسيطة، وهي لغة الأدوات الأمنية الأولى.","تتعود تحل مشاكل بالكود بدل ما تحفظ.","تاخد شهادات إتمام مجانية وتحافظ على عادة يومية."],
    prereq:"مفيش. المنصة مجانية، مع حد يومي على الجلسات الطويلة." },

  { id:"coddy-daily", platform:"coddy", type:"تحدي", cat:"برمجة", level:"مبتدئ", cost:"freemium",
    title:"Coddy — التحدي اليومي", url:"https://coddy.tech/challenges/daily",
    time:"10–20 دقيقة", what:"تحدي برمجة جديد كل يوم بتحله في المتصفح. حل صغير كل يوم أحسن من ساعات متقطعة.",
    gain:["تبني مهارة حل المشاكل بالكود.","تحافظ على الاستمرارية (Streak).","تجهّز نفسك لكتابة أدواتك الأمنية بعدين."],
    prereq:"أساسيات لغة واحدة (ابدأ بمسار بايثون)." },

  { id:"thm-owasp10", platform:"tryhackme", type:"لاب", cat:"ويب", level:"مبتدئ", cost:"freemium",
    title:"OWASP Top 10 — أخطر ثغرات الويب", url:"https://tryhackme.com/room/owasptop10",
    time:"حوالي 120 دقيقة", what:"غرفة بتشرح أخطر 10 ثغرات في المواقع (زي الـ Injection وBroken Authentication وXSS وBroken Access Control)، وبعد كل واحدة بتجرب استغلالها على جهاز افتراضي.",
    gain:["تفهم إزاي كل ثغرة بتحصل وإزاي تتصلح.","تجرب الهجوم عملياً في بيئة قانونية.","تكسب خريطة ذهنية لأهم ثغرات الويب اللي هتقابلها في أي اختبار اختراق."],
    prereq:"الغرفة معمولة للمبتدئين. تقدر تتصل بـ OpenVPN مجاناً، والـ AttackBox المدمج للمشتركين." },

  { id:"ps-sqli-login", platform:"portswigger", type:"لاب", cat:"ويب", level:"مبتدئ", cost:"free",
    title:"SQL Injection — تخطي تسجيل الدخول", url:"https://portswigger.net/web-security/sql-injection/lab-login-bypass",
    time:"حسب سرعتك", what:"لاب بيديك موقع فيه صفحة دخول ضعيفة، وهدفك تدخل كأدمن من غير ما تعرف الباسوورد عن طريق التلاعب بالاستعلام اللي بيتبعت لقاعدة البيانات.",
    gain:["تفهم ليه الـ SQL Injection لسه من أخطر الثغرات.","تعرف إزاي مدخلات المستخدم بتبوّظ الاستعلام.","تتعلم إزاي المطور يمنعها (Prepared Statements)."],
    prereq:"حساب مجاني على PortSwigger وبرنامج Burp Suite Community المجاني." },

  { id:"ps-path-traversal", platform:"portswigger", type:"لاب", cat:"ويب", level:"مبتدئ", cost:"free",
    title:"Path Traversal — قراءة ملفات السيرفر", url:"https://portswigger.net/web-security/path-traversal",
    time:"حسب سرعتك", what:"شرح ولابات عن ثغرة بتخلي المهاجم يخرج برا مجلد الموقع ويقرا ملفات تانية على السيرفر، وإزاي بتتخطى فلاتر الحماية البسيطة.",
    gain:["تفهم إزاي المسارات (Paths) بتتعالج في الويب.","تتدرب على تخطي الفلاتر الضعيفة.","تعرف تكتب كود بيمنع الثغرة دي."],
    prereq:"تفهم أساسيات HTTP. يفضل تعمل لاب الـ SQL Injection الأول." },

  { id:"ps-cmd-injection", platform:"portswigger", type:"لاب", cat:"ويب", level:"متوسط", cost:"free",
    title:"OS Command Injection — تنفيذ أوامر على السيرفر", url:"https://portswigger.net/web-security/command-injection",
    time:"حسب سرعتك", what:"ثغرة بتخلي المهاجم يحقن أوامر نظام تشغيل في مدخلات الموقع، فتتنفذ على السيرفر نفسه. اللابات بتدربك على اكتشافها واستغلالها.",
    gain:["تفهم ليه تمرير مدخلات المستخدم لأوامر النظام خطر.","تتعلم تفرق بين الأنواع الظاهرة والعمياء (Blind).","تعرف الدفاع الصح ضدها."],
    prereq:"أساسيات لينكس وHTTP." },

  { id:"ps-file-upload", platform:"portswigger", type:"لاب", cat:"ويب", level:"متوسط", cost:"free",
    title:"File Upload — ثغرات رفع الملفات", url:"https://portswigger.net/web-security/file-upload",
    time:"حسب سرعتك", what:"لابات عن المواقع اللي بتسمح برفع ملفات، وإزاي المهاجم بيتخطى فلاتر الرفع الضعيفة عشان يرفع ملف ما كانش المفروض يترفع.",
    gain:["تفهم مخاطر رفع الملفات في أي موقع.","تتدرب على تخطي فلاتر الامتداد والنوع.","تتعلم أفضل ممارسات تأمين الرفع."],
    prereq:"أساسيات الويب وBurp Suite." },

  { id:"htb-startingpoint", platform:"htb", type:"لاب", cat:"اختراق", level:"مبتدئ", cost:"freemium",
    title:"Starting Point — أول أجهزة تهاجمها", url:"https://help.hackthebox.com/en/articles/6007919-introduction-to-starting-point",
    time:"حسب سرعتك", what:"أجهزة سهلة ومشروحة خطوة بخطوة بتدخلها تتدرب فيها على مهاجمة جهاز كامل. الـ Tier 0 فيه أجهزة مجانية زي Meow وFawn وDancing وRedeemer، وكل جهاز معاه Writeup بيشرح المفاهيم.",
    gain:["تتعلم دورة الهجوم كاملة: استكشاف، استغلال، وصول.","تتعود تتعامل مع VPN وأجهزة افتراضية.","تحس بشغل الاختراق الحقيقي بأمان وبشرح."],
    prereq:"أساسيات لينكس والشبكات. بعض أجهزة الـ Tier 0 وبعض المستويات الأعلى للمشتركين (VIP)." },

  { id:"thm-web-module", platform:"tryhackme", type:"مسار", cat:"ويب", level:"مبتدئ", cost:"freemium",
    title:"Web Hacking — مسار اختراق الويب", url:"https://tryhackme.com/module/web-hacking",
    time:"حسب سرعتك", what:"مجموعة غرف بتغطي أساسيات تطبيقات الويب وجافاسكريبت وSQL، وبعدها Burp Suite وأخطر 10 ثغرات OWASP.",
    gain:["تبني فهم متكامل لاختراق الويب بترتيب منطقي.","تتعلم تستخدم Burp Suite، أهم أداة في المجال.","تجهّز نفسك لكورس اختبار اختراق الويب في أكاديميتنا."],
    prereq:"أساسيات HTTP. بعض الغرف في المسار للمشتركين." },

  { id:"thm-burp", platform:"tryhackme", type:"لاب", cat:"ويب", level:"مبتدئ", cost:"paid",
    title:"Burp Suite: The Basics", url:"https://tryhackme.com/room/burpsuitebasics",
    time:"حوالي 60 دقيقة", what:"مقدمة لأداة Burp Suite اللي بتستخدمها كل فرق اختبار اختراق الويب لاعتراض الطلبات وتعديلها وتحليلها.",
    gain:["تتعلم الواجهة والـ Proxy والـ Repeater.","تفهم إزاي بتشوف وتعدّل الطلبات بين المتصفح والموقع.","تبقى جاهز لأي لاب ويب بعد كده."],
    prereq:"الغرفة دي للمشتركين (Premium) على TryHackMe. بديلها المجاني: لابات PortSwigger مع Burp Community." },

  { id:"otw-natas", platform:"otw", type:"لاب", cat:"ويب", level:"متوسط", cost:"free",
    title:"Natas — ألغاز اختراق الويب", url:"https://overthewire.org/wargames/",
    time:"مستويات متدرجة", what:"لعبة ويب من OverTheWire: كل مستوى صفحة ويب فيها ثغرة أو سر مخفي، وبتوصل لباسوورد المستوى اللي بعده. اختار Natas من قايمة الألعاب.",
    gain:["تتعلم تقرا الكود المصدري وتتتبع الطلبات.","تتدرب على التفكير زي المهاجم.","تكمل بيها بعد Bandit كخطوة من لينكس للويب."],
    prereq:"يفضل تخلص Bandit وتعرف أساسيات HTML وHTTP." },

  { id:"picoctf-gym", platform:"picoctf", type:"تحدي", cat:"CTF", level:"مبتدئ", cost:"free",
    title:"picoGym — تدريب CTF مجاني من جامعة كارنيجي ميلون", url:"https://play.picoctf.org",
    time:"حسب سرعتك", what:"منصة تحديات (CTF) مجانية عملتها جامعة Carnegie Mellon، مناسبة للمبتدئين. التحديات في أقسام زي المهارات العامة والويب والتشفير والتحليل الجنائي، وبتتدرج من السهل.",
    gain:["تجرب أول CTF لك بأمان.","تتدرب على مجالات مختلفة وتعرف تحب أنهي واحد.","تبني عادة حل المشاكل الأمنية بنفسك."],
    prereq:"مفيش. سجّل حساب مجاني وابدأ من التحديات السهلة." },

  { id:"ps-ssrf", platform:"portswigger", type:"لاب", cat:"ويب", level:"متقدم", cost:"free",
    title:"SSRF — خلّي السيرفر يطلب بدالك", url:"https://portswigger.net/web-security/ssrf",
    time:"حسب سرعتك", what:"ثغرة بتخلي المهاجم يجبر السيرفر يبعت طلبات لأماكن داخلية ما كانش المفروض توصلها. اللابات بتدربك من الأساسي لحد تخطي الفلاتر.",
    gain:["تفهم إزاي السيرفر نفسه يتحول لأداة هجوم.","تتدرب على تخطي القوائم البيضاء والسوداء.","تعرف طرق الحماية على مستوى الشبكة والكود."],
    prereq:"أساسيات HTTP وBurp Suite، ويفضل تخلص لابات المستوى المتوسط." },

  { id:"ps-deserialization", platform:"portswigger", type:"لاب", cat:"ويب", level:"متقدم", cost:"free",
    title:"Insecure Deserialization — فك تسلسل غير آمن", url:"https://portswigger.net/web-security/deserialization",
    time:"حسب سرعتك", what:"لابات عن تطبيقات بتستقبل بيانات متسلسلة (Serialized) من المستخدم وبتثق فيها، فالمهاجم يعدّلها ويوصل لتنفيذ أوامر أو رفع صلاحيات.",
    gain:["تفهم ليه الثقة في بيانات جاية من العميل خطر.","تتدرب على تعديل الكائنات المتسلسلة.","تتعلم إزاي المطور يتجنبها."],
    prereq:"فهم كويس لأساسيات الويب ولغة برمجة واحدة على الأقل." },

  { id:"ps-smuggling", platform:"portswigger", type:"لاب", cat:"ويب", level:"محترف", cost:"free",
    title:"HTTP Request Smuggling — تهريب الطلبات", url:"https://portswigger.net/web-security/request-smuggling",
    time:"حسب سرعتك", what:"من أصعب ثغرات الويب: اختلاف بين فهم الـ Proxy وفهم السيرفر لحدود الطلب، فبيتهرّب طلب مخفي جوه طلب سليم. اللابات بتمشيك من النظرية للاستغلال.",
    gain:["تفهم الفرق بين Content-Length وTransfer-Encoding.","تتدرب على تقنيات الهجمات المتقدمة اللي بتظهر في Bug Bounty.","ترفع مستواك لمستوى المحترفين."],
    prereq:"إتقان HTTP وBurp Suite، ويفضل تكون خلصت معظم لابات PortSwigger الأساسية." },

  { id:"htb-prolabs", platform:"htb", type:"مسار", cat:"اختراق", level:"محترف", cost:"paid",
    title:"HTB Pro Labs — شبكات مؤسسات كاملة", url:"https://www.hackthebox.com/hacker/pro-labs",
    time:"أسابيع", what:"بيئات تحاكي شبكات شركات حقيقية فيها Active Directory وعدة أجهزة، وهدفك تخترقها خطوة بخطوة من أول نقطة لحد السيطرة الكاملة.",
    gain:["تتدرب على سيناريوهات Red Team واقعية.","تتعلم التنقل الجانبي ورفع الصلاحيات في الشبكات.","تجهّز نفسك لشغل اختبار الاختراق الاحترافي."],
    prereq:"اشتراك مدفوع، وخبرة قوية في لينكس وويندوز وActive Directory." }
];

/* ===================== مستويات الورش (الترتيب = ترتيب الأقسام في الصفحة) ===================== */
const LEVELS = [
  {k:"مبتدئ", id:"beginner", ic:"🟢", c:"#39ff14", d:"لو لسه بتبدأ: أساسيات لينكس والشبكات والبرمجة وأول لابات ويب."},
  {k:"متوسط", id:"intermediate", ic:"🟡", c:"#ffc83d", d:"عندك الأساس: دلوقتي بتطبّق ثغرات حقيقية وتتعود على الأدوات."},
  {k:"متقدم", id:"advanced", ic:"🟠", c:"#ff9a3d", d:"ثغرات أعمق وتفكير أقرب لاختبار الاختراق الفعلي."},
  {k:"محترف", id:"pro", ic:"🔴", c:"#ff5c7a", d:"تقنيات المحترفين وبيئات تحاكي شبكات شركات كاملة."}
];

/* ===================== لابات Cobra7 الخاصة (بتتفتح جوه صفحة الورش) =====================
   كل لاب = ملف HTML في نفس الفولدر. عشان تضيف لاب جديد: اعمل ملف lab-05.html وضيف سطر هنا. */
const COBRA_LABS = [
  { id:"cobra-lab-01", flagHash:"9fb6684af971d3249d59cfe898629b2319a2ee8694f98ea91613ae24ffca6af7", file:"lab-01.html", url:"lab-01.html", level:"مبتدئ", cat:"أساسيات",
    title:"لاب 1 — استخراج البيانات المخفية", time:"5 دقايق",
    what:"لاب بسيط بيعلمك إن البيانات اللي بتتحمل في صفحة الويب ممكن تتقرا، وإزاي تجيب بيانات من كائن مخفي في الخلفية.",
    gain:["تفهم إن أي حاجة وصلت للمتصفح تقدر تتشاف.","تتعود على فكرة الـ Object والبيانات المخزنة.","تجيب أول Flag ليك."],
    prereq:"مفيش." },
  { id:"cobra-lab-02", flagHash:"9f8baebe2ba77bf5c03dc55c31aa7e8fbf4f55d4553e9c73280fc66e4c514812", file:"lab-02.html", url:"lab-02.html", level:"متوسط", cat:"ويب",
    title:"لاب 2 — تجاوز تسجيل الدخول", time:"10 دقايق",
    what:"صفحة دخول التحقق فيها بيتم في كود الصفحة نفسه (Hardcoded Credentials). مهمتك تكتشف بيانات الدخول من السورس كود.",
    gain:["تفهم ليه التحقق من جهة العميل مش أمان.","تتعود تفتح Inspect وتقرا السورس.","تعرف الصح: التحقق دايماً على السيرفر."],
    prereq:"أساسيات HTML وجافاسكريبت." },
  { id:"cobra-lab-03", flagHash:"aa61c0c15d609c490c58e0f1a421017604e3b6e0cabadee6e88c7ffb8b2f1a82", file:"lab-03.html", url:"lab-03.html", level:"متقدم", cat:"ويب",
    title:"لاب 3 — ثغرة XSS في التعليقات", time:"15 دقيقة",
    what:"صندوق تعليقات بيدخل مدخلاتك في الصفحة من غير تعقيم. جرّب تحقن كود جافاسكريبت وشوف إزاي الصفحة بتنفذه.",
    gain:["تفهم إزاي بتحصل ثغرة XSS.","تتعلم الفرق بين innerHTML وtextContent.","تعرف إزاي تعقّم المدخلات وتمنعها."],
    prereq:"أساسيات HTML وDOM." },
  { id:"cobra-lab-04", flagHash:"86b3d9b4b91ff61769290f6b99d0080b300ae6d69a911df2cb5f76d8dc75fa27", file:"lab-04.html", url:"lab-04.html", level:"محترف", cat:"ويب",
    title:"لاب 4 — تزوير JWT بخوارزمية none", time:"20 دقيقة",
    what:"سيرفر وهمي بيتحقق من توكن JWT بس بيقبل خوارزمية none من غير توقيع. مهمتك تفك التوكن وتعدّل الصلاحية وتبني توكن مزوّر تدخل بيه كأدمن.",
    gain:["تفهم بنية JWT (Header.Payload.Signature).","تتدرب على Base64URL وتعديل الـ Claims.","تعرف ليه لازم السيرفر يرفض alg=none ويثبّت الخوارزمية."],
    prereq:"فهم Base64 وأساسيات المصادقة. تقدر تستخدم الـ Console في المتصفح." },

  { id:"cobra-lab-05", flagHash:"b1678125b108f38d7891f52d1df9feef0064ff09ef6d9d2c9bf742ea1cf290d6", file:"lab-05.html", url:"lab-05.html", level:"مبتدئ", cat:"أساسيات",
    title:"لاب 5 — فك الشفرة (Base64)", time:"5 دقايق",
    what:"رسالة مشفرة بـ Base64 اعترضناها بين عضوين في الفريق. مهمتك تفكها وتطلع الـ Flag.",
    gain:["تفهم إن Base64 ترميز مش تشفير.","تستخدم أدوات فك الترميز.","تتعود تمييز شكل Base64."], prereq:"مفيش." },
  { id:"cobra-lab-06", flagHash:"d4221541c1cbc96adf98644bc8bce8046df168c97bd82336dd1133037467f3e5", file:"lab-06.html", url:"lab-06.html", level:"متوسط", cat:"ويب",
    title:"لاب 6 — IDOR: بيانات مستخدم تاني", time:"10 دقايق",
    what:"تطبيق بيجيب الملف الشخصي بالـ id من غير تحقق من الصلاحية. غيّر الـ id وشوف بيانات الأدمن.",
    gain:["تفهم ثغرة Insecure Direct Object Reference.","تتعلم تراقب الطلبات وتعدّل المعاملات.","تعرف إن التحقق من الصلاحية لازم يبقى على السيرفر."], prereq:"أساسيات HTTP." },
  { id:"cobra-lab-07", flagHash:"60367ee7eeca0160ee9fba1288a51c2e4490b104629f17e4f00711ecc42f3575", file:"lab-07.html", url:"lab-07.html", level:"متقدم", cat:"ويب",
    title:"لاب 7 — SQL Injection في الدخول", time:"15 دقيقة",
    what:"صفحة دخول بتبني استعلام SQL من مدخلاتك. اتلاعب بالاستعلام وادخل كأدمن من غير الباسوورد، وشوف الاستعلام النهائي قدامك.",
    gain:["تفهم إزاي المدخلات بتغيّر معنى الاستعلام.","تتدرب على حقن الشروط والتعليقات.","تعرف الحل: Prepared Statements."], prereq:"أساسيات SQL." },
  { id:"cobra-lab-08", flagHash:"591fd1ae0bbea8f956c48cd6d37237baf286d63062524107016e3d553029176c", file:"lab-08.html", url:"lab-08.html", level:"محترف", cat:"ويب",
    title:"لاب 8 — تخطي فلتر Path Traversal", time:"20 دقيقة",
    what:"عارض ملفات فيه فلتر ضعيف بيشيل ../ مرة واحدة. اتخطى الفلتر واقرا ملف الـ Flag السري.",
    gain:["تفهم ليه الفلاتر بالاستبدال ضعيفة.","تتدرب على تقنيات تخطي الفلاتر.","تتعلم الأفضل: تطبيع المسار والقائمة البيضاء."], prereq:"أساسيات المسارات في لينكس." }
];


/* ملحوظات الأمان القانونية اللي بتظهر في الصفحة */
const LABS_NOTE = "اتدرب بس على اللابات اللي المنصات بتوفرها لك. ممنوع تجرب أي أداة أو هجوم على موقع أو شبكة حقيقية من غير تصريح مكتوب من صاحبها.";

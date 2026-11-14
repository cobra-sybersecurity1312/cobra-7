/* COBRA7 — بيانات المكتبة (الملف ده اللي بتعدل فيه). عشان تضيف ملف: حطه في مجلد library وانسخ سطر من القايمة.
   - file: مسار الـPDF   - md: نسخة قابلة للتعديل (اختياري)   - tool: رابط أداة بدل ملف
   - free:false + price:"99 ج.م" + buy:"رابط الدفع" لو عايز ملف يبقى مدفوع (الزرار بيفتح رابط الدفع بدل التحميل) */
window.LIB={
  cats:[{k:"summaries",ic:"📘",n:"ملخصات"},{k:"checklists",ic:"✅",n:"قوائم فحص"},{k:"templates",ic:"🧩",n:"قوالب"},{k:"reports",ic:"📑",n:"تقارير اختراق"},{k:"tools",ic:"🛠️",n:"أدوات"}],
  items:[
 {
  "id": "owasp-top10",
  "cat": "summaries",
  "icon": "🕷️",
  "title": "ملخص OWASP Top 10 (إصدار 2021)",
  "desc": "العشرة مخاطر الأشهر في أمن الويب: يعني إيه كل خطر، مثال عليه، وإزاي تتجنبه.",
  "file": "library/owasp-top10-summary.pdf",
  "level": "مبتدئ",
  "tags": [
   "ويب",
   "OWASP"
  ],
  "pages": 2,
  "kb": 64
 },
 {
  "id": "nmap-ports",
  "cat": "summaries",
  "icon": "📡",
  "title": "ملخص Nmap وأشهر البورتات",
  "desc": "أوامر الفحص الأكتر استخداما مع جدول بالبورتات والخدمات اللي لازم تحفظها.",
  "file": "library/nmap-ports-summary.pdf",
  "level": "مبتدئ",
  "tags": [
   "شبكات",
   "Nmap"
  ],
  "pages": 2,
  "kb": 50
 },
 {
  "id": "linux-cheat",
  "cat": "summaries",
  "icon": "🐧",
  "title": "ورقة أوامر لينكس للمبتدئين",
  "desc": "30 أمر هتستخدمهم كل يوم في الأمن السيبراني، مقسمين ومشروحين.",
  "file": "cobra7-linux-cheatsheet.pdf",
  "level": "مبتدئ",
  "tags": [
   "لينكس"
  ],
  "pages": 2,
  "kb": 58
 },
 {
  "id": "web-checklist",
  "cat": "checklists",
  "icon": "✅",
  "title": "قائمة فحص أمان تطبيقات الويب",
  "desc": "9 مراحل من الاستطلاع لحد التقرير، تطبعها وتعلّم على اللي خلصته.",
  "file": "library/web-pentest-checklist.pdf",
  "level": "متوسط",
  "tags": [
   "ويب",
   "اختراق"
  ],
  "pages": 2,
  "kb": 59
 },
 {
  "id": "linux-hardening",
  "cat": "checklists",
  "icon": "🔒",
  "title": "قائمة تقوية سيرفر لينكس",
  "desc": "أوامر وخطوات عملية لتأمين SSH والجدار الناري والصلاحيات، مع قائمة مراجعة.",
  "file": "library/linux-hardening-checklist.pdf",
  "level": "متوسط",
  "tags": [
   "لينكس",
   "دفاع"
  ],
  "pages": 2,
  "kb": 56
 },
 {
  "id": "report-template",
  "cat": "templates",
  "icon": "🧩",
  "title": "قالب تقرير اختبار اختراق",
  "desc": "هيكل احترافي جاهز للتعبئة: ملخص تنفيذي ونطاق ونتائج وتوصيات. معاه نسخة قابلة للتعديل.",
  "file": "library/pentest-report-template.pdf",
  "md": "library/pentest-report-template.md",
  "level": "متوسط",
  "tags": [
   "تقارير"
  ],
  "pages": 2,
  "kb": 51
 },
 {
  "id": "roe-template",
  "cat": "templates",
  "icon": "📝",
  "title": "قالب اتفاق نطاق الفحص (RoE)",
  "desc": "التصريح المكتوب اللي بيحميك وبيحمي العميل قبل أي فحص. معاه نسخة قابلة للتعديل.",
  "file": "library/rules-of-engagement-template.pdf",
  "md": "library/rules-of-engagement-template.md",
  "level": "متوسط",
  "tags": [
   "قانوني",
   "تقارير"
  ],
  "pages": 2,
  "kb": 43
 },
 {
  "id": "sample-report",
  "cat": "reports",
  "icon": "📑",
  "title": "تقرير اختراق نموذجي (Demo Shop)",
  "desc": "مثال كامل لتقرير احترافي بخمس نتائج بخطورات مختلفة. البيانات خيالية للتعلم.",
  "file": "library/sample-pentest-report.pdf",
  "level": "متوسط",
  "tags": [
   "تقارير",
   "ويب"
  ],
  "pages": 3,
  "kb": 77
 },
 {
  "id": "t-encode",
  "cat": "tools",
  "icon": "🔤",
  "title": "مشفّر ومفكّك الترميز",
  "desc": "Base64 وURL وHex. بتشتغل جوه متصفحك والنص مش بيتبعت لأي مكان.",
  "tool": "tools.html#encode",
  "level": "مبتدئ",
  "tags": [
   "أداة"
  ]
 },
 {
  "id": "t-hash",
  "cat": "tools",
  "icon": "#️⃣",
  "title": "مولّد الهاش",
  "desc": "SHA-1 وSHA-256 وSHA-384 وSHA-512 لأي نص، لحظيًا.",
  "tool": "tools.html#hash",
  "level": "مبتدئ",
  "tags": [
   "أداة"
  ]
 },
 {
  "id": "t-jwt",
  "cat": "tools",
  "icon": "🎫",
  "title": "قارئ JWT",
  "desc": "بيفك الهيدر والبيانات ويعرض تاريخ الانتهاء. للقراءة فقط، من غير تحقق من التوقيع.",
  "tool": "tools.html#jwt",
  "level": "متوسط",
  "tags": [
   "أداة",
   "ويب"
  ]
 },
 {
  "id": "t-pass",
  "cat": "tools",
  "icon": "🔑",
  "title": "مولّد باسوورد وقياس القوة",
  "desc": "باسوورد عشوائي بقوة تشفير المتصفح، مع حساب قوته بالبت.",
  "tool": "tools.html#password",
  "level": "مبتدئ",
  "tags": [
   "أداة"
  ]
 },
 {
  "id": "t-cidr",
  "cat": "tools",
  "icon": "🧮",
  "title": "حاسبة الشبكات (CIDR)",
  "desc": "اكتب 192.168.1.10/24 وهات الشبكة والبرودكاست والماسك وعدد الأجهزة.",
  "tool": "tools.html#cidr",
  "level": "متوسط",
  "tags": [
   "أداة",
   "شبكات"
  ]
 }
]
};

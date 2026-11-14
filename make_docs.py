# -*- coding: utf-8 -*-
# بيولّد ملفات PDF والقوالب (Markdown) بتاعة المكتبة. شغّله: python3 make_docs.py  (محتاج playwright + chromium)
import html, os
from playwright.sync_api import sync_playwright
E=html.escape
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','library')
CSS='''@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DejaVu Sans',Tahoma,sans-serif;color:#0b1a12;background:#fff;width:210mm;font-size:9.4pt;line-height:1.85}
.top{background:#06100a;color:#fff;padding:13mm 14mm 9mm;border-bottom:3mm solid #39ff14}
.top small{color:#39ff14;font:600 8.5pt 'DejaVu Sans Mono',monospace;direction:ltr;display:block;margin-bottom:2.5mm}
.top h1{font-size:19pt;line-height:1.5}.top p{margin-top:2mm;color:#b9c9bf;font-size:9.5pt}
.pg{padding:8mm 14mm 4mm}.cols{columns:2;column-gap:8mm}
h2{font-size:11.5pt;color:#0a6b22;border-bottom:.4mm solid #39ff14;padding-bottom:1mm;margin:5mm 0 2mm;break-after:avoid}
h3{font-size:10pt;color:#06100a;margin:3mm 0 1mm}
p{margin:1.2mm 0;color:#26342b}
.it{break-inside:avoid;margin-bottom:3.2mm;padding:2.4mm 3mm;border:.25mm solid #dbe6de;border-right:1.2mm solid #39ff14;border-radius:1.5mm}
.it b{display:block;color:#06100a}.it .m{color:#4d5d54;font-size:8.6pt}.it .f{color:#0a6b22;font-size:8.6pt}
.sev{display:inline-block;padding:.2mm 2.2mm;border-radius:2mm;font-size:8pt;font-weight:bold;color:#fff;margin-inline-start:2mm}
.s-h{background:#c62828}.s-m{background:#e08a00}.s-l{background:#2e7d32}.s-i{background:#546e7a}
code,pre{font-family:'DejaVu Sans Mono',monospace;direction:ltr;text-align:left}
code{background:#eef6f0;padding:.2mm 1.2mm;border-radius:1mm;font-size:8.2pt}
pre{display:block;background:#0b130e;color:#cdeed6;padding:2.2mm 3mm;border-radius:1.5mm;font-size:8pt;line-height:1.6;margin:1.5mm 0;white-space:pre-wrap;word-break:break-all;break-inside:avoid}
ul.ck{list-style:none}ul.ck li{padding:.9mm 0 .9mm 0;border-bottom:.2mm solid #e8efe9;break-inside:avoid}
ul.ck li:before{content:"";display:inline-block;width:3.2mm;height:3.2mm;border:.4mm solid #0a6b22;border-radius:.6mm;margin-inline-end:2.2mm;vertical-align:-.5mm}
table{width:100%;border-collapse:collapse;margin:2mm 0;font-size:8.6pt;break-inside:avoid}th{background:#0b130e;color:#fff;padding:1.4mm 2mm;text-align:right}td{border:.25mm solid #dbe6de;padding:1.3mm 2mm;vertical-align:top}
td.c{direction:ltr;text-align:left;font-family:'DejaVu Sans Mono',monospace;font-size:8.2pt;white-space:nowrap}
.line{border-bottom:.3mm solid #9aa;height:6.5mm;margin:1mm 0}.lbl{color:#4d5d54;font-size:8.6pt}
.note{margin:4mm 0 0;padding:3mm 4mm;border:.4mm solid #c44;border-radius:2mm;background:#fff6f6;font-size:8.6pt;color:#5a1a1a;line-height:1.85}
.tip{margin:3mm 0;padding:2.6mm 4mm;border:.4mm solid #39ff14;border-radius:2mm;background:#f2fff0;font-size:8.8pt}
.foot{margin:5mm 14mm 4mm;display:flex;justify-content:space-between;font-size:8pt;color:#5d6b63}.foot b{color:#0a6b22}.foot span:last-child{direction:ltr;font-family:'DejaVu Sans Mono',monospace}
.pb{break-before:page}'''
def doc(kicker,title,sub,body,cols=False,legal=True):
    note='<div class="note"><b>تنبيه قانوني:</b> المحتوى ده للتعليم والعمل المصرّح بيه فقط. اختبار أو فحص أنظمة مش بتملكها من غير تصريح كتابي صريح مخالف للقانون.</div>' if legal else ''
    return f'<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>{E(title)}</title><style>{CSS}</style></head><body><div class="top"><small>{E(kicker)}</small><h1>{E(title)}</h1><p>{E(sub)}</p></div><div class="pg{" cols" if cols else ""}">{body}</div>{note and "<div style=\'padding:0 14mm\'>"+note+"</div>"}<div class="foot"><span><b>Cobra7</b> — أكاديمية الأمن السيبراني والبرمجة</span><span>t.me/cobra7_com</span></div></body></html>'
def items(lst): return ''.join(f'<li>{E(x)}</li>' for x in lst)
def ck(title,lst): return f'<h2>{E(title)}</h2><ul class="ck">{items(lst)}</ul>'
def cmdtable(rows,h=('الأمر','بيعمل إيه')): return '<table><tr><th>'+h[1]+'</th><th style="text-align:left">'+h[0]+'</th></tr>'+''.join(f'<tr><td>{E(d)}</td><td class="c">{E(c)}</td></tr>' for c,d in rows)+'</table>'
docs={}

# 1) OWASP Top 10
ow=[("A01","Broken Access Control","كسر التحكم في الصلاحيات","مستخدم يوصل لبيانات أو وظايف مش من حقه.","تغيير رقم id في الرابط يفتح طلب عميل تاني (IDOR).","تحقق من الصلاحية على السيرفر في كل طلب، والافتراضي منع."),
("A02","Cryptographic Failures","فشل التشفير","بيانات حساسة من غير تشفير أو بتشفير ضعيف.","باسوورد متخزن بـ MD5 من غير salt، أو موقع شغال على HTTP.","فعّل TLS، وخزّن الباسوورد بـ bcrypt أو Argon2، ومتخزنش اللي مش محتاجه."),
("A03","Injection","الحقن","بيانات المستخدم بتتفسّر كأنها أمر (SQL, OS, XSS).","كتابة ' OR '1'='1 في حقل الدخول.","استخدم Parameterized Queries، ورمّز المخرجات، وافحص المدخلات."),
("A04","Insecure Design","تصميم غير آمن","العيب في فكرة النظام نفسها مش في سطر كود.","استرجاع باسوورد بسؤال سهل التخمين، أو من غير حد للمحاولات.","Threat Modeling من أول التصميم، وحدود واضحة لكل عملية حساسة."),
("A05","Security Misconfiguration","ضبط غير آمن","إعدادات افتراضية أو خدمات مفتوحة أو رسائل أخطاء مفصلة.","صفحة أدمن شغالة بباسوورد افتراضي، أو Stack Trace ظاهر للزائر.","Hardening، شيل غير المستخدم، ومراجعة دورية للإعدادات."),
("A06","Vulnerable and Outdated Components","مكتبات قديمة فيها ثغرات","استخدام مكتبات أو إطارات عمل فيها ثغرات معروفة.","موقع شغال على إصدار قديم من مكتبة اتصلّحت فيها ثغرة من سنين.","اعمل جرد للمكتبات، وحدّث باستمرار، واستخدم أدوات فحص الـDependencies."),
("A07","Identification and Authentication Failures","ضعف تسجيل الدخول","تخمين الباسوورد، أو جلسات غير محمية، أو غياب MFA.","السماح بمحاولات دخول لا نهائية.","فعّل MFA، وحدّد عدد المحاولات، وأدر الجلسات صح."),
("A08","Software and Data Integrity Failures","سلامة البرمجيات والبيانات","تحديثات أو مكتبات من مصدر غير موثوق، أو Deserialization غير آمن.","سكريبت خارجي بيتحمّل من غير التحقق منه.","تحقق من التوقيع والمصدر، وأمّن خط الـCI/CD."),
("A09","Security Logging and Monitoring Failures","ضعف التسجيل والمراقبة","الهجوم بيحصل ومحدش بيشوفه.","محاولات دخول فاشلة بالآلاف من غير أي تنبيه.","سجّل الأحداث الحساسة، وركّب تنبيهات، وراجع اللوجات."),
("A10","Server-Side Request Forgery (SSRF)","تزوير الطلبات من السيرفر","السيرفر بيطلب رابط يحدده المهاجم فيوصل لخدمات داخلية.","رابط معاينة صورة بيخلي السيرفر يزور خدمة داخلية.","قائمة بيضاء للوجهات، وامنع الوصول للشبكة الداخلية من الخدمة.")]
b='<p>ملخص لأهم 10 مخاطر في تطبيقات الويب حسب إصدار OWASP Top 10 لسنة 2021. لكل خطر: يعني إيه، مثال، والحل.</p>'
for c,en,ar,what,ex,fix in ow:
    b+=f'<div class="it"><b>{c} — {E(ar)} <span style="direction:ltr;unicode-bidi:embed;color:#0a6b22;font-size:8.6pt">({E(en)})</span></b><div class="m">{E(what)}</div><div class="m"><u>مثال:</u> {E(ex)}</div><div class="f"><u>الحل:</u> {E(fix)}</div></div>'
docs['owasp-top10-summary']=doc('COBRA7 | SUMMARY','ملخص OWASP Top 10 (إصدار 2021)','العشرة مخاطر الأشهر في أمن تطبيقات الويب بشكل مبسط','<style>.it{margin-bottom:2.6mm}</style>'+b,cols=False,legal=False)

# 2) Web checklist
W=[("1) الاستطلاع والتحضير",["تصريح كتابي بالنطاق والوقت.","تحديد الصفحات والـAPIs والـParameters.","معرفة التقنيات المستخدمة (سيرفر، إطار عمل، قاعدة بيانات)."]),
("2) تسجيل الدخول",["حد لعدد محاولات الدخول الفاشلة.","سياسة باسوورد معقولة (طول وليس تعقيد فقط).","وجود MFA للحسابات الحساسة.","استرجاع الباسوورد بتوكن مرة واحدة وله مدة انتهاء.","رسالة خطأ موحدة لا تكشف إن كان المستخدم موجود."]),
("3) الجلسات (Sessions)",["الكوكيز عليها Secure وHttpOnly وSameSite.","تجديد معرّف الجلسة بعد تسجيل الدخول.","إنهاء الجلسة فعليًا عند تسجيل الخروج.","انتهاء الجلسة بعد فترة خمول."]),
("4) الصلاحيات",["تجربة تغيير كل id في الطلبات (IDOR).","الوصول لصفحات الأدمن بحساب عادي وبدون حساب.","تجربة HTTP Methods مختلفة على نفس الرابط.","التحقق من الصلاحية على السيرفر مش على الواجهة فقط."]),
("5) المدخلات",["SQL Injection في كل Parameter.","XSS (Reflected وStored وDOM).","Command Injection وPath Traversal.","رفع الملفات: نوع وحجم ومكان التخزين واسم الملف.","Template Injection (SSTI) لو فيه قوالب."]),
("6) منطق التطبيق",["تخطي خطوات (دفع أو تأكيد).","قيم سالبة أو كبيرة جدًا.","تكرار نفس الطلب في نفس اللحظة (Race Condition).","استخدام كود خصم أكتر من مرة."]),
("7) الـAPI",["مصادقة على كل Endpoint.","حد لعدد الطلبات (Rate Limit).","Mass Assignment: إرسال حقول زيادة.","الرد مفيهوش بيانات أكتر من اللازم."]),
("8) الإعدادات",["HTTPS مفعّل مع HSTS.","Headers: CSP وX-Content-Type-Options وX-Frame-Options.","رسائل الأخطاء مش بتكشف تفاصيل داخلية.","ملفات حساسة مكشوفة (.git, .env, نسخ احتياطية).","إعدادات CORS مش مفتوحة للكل."]),
("9) التقرير",["كل ثغرة موثقة بخطوات وإثبات.","تصنيف الخطورة والأثر.","توصية واضحة للحل لكل ثغرة."])]
b='<p>قائمة مرجعية لفحص تطبيق ويب بتصريح. اطبعها وعلّم على اللي خلصته.</p><div class="cols">'+''.join(ck(t,l) for t,l in W)+'</div>'
docs['web-pentest-checklist']=doc('COBRA7 | CHECKLIST','قائمة فحص أمان تطبيقات الويب','9 مراحل من الاستطلاع لحد التقرير',b)

# 3) Linux hardening
b='<p>خطوات أساسية لتقوية سيرفر لينكس (أمثلة على Ubuntu/Debian). جرّبها على جهاز تجريبي الأول.</p>'
H=[("تحديث النظام","sudo apt update && sudo apt upgrade -y"),("تأمين SSH — في /etc/ssh/sshd_config","PermitRootLogin no\nPasswordAuthentication no   # بعد ما تجهّز مفتاح SSH\nAllowUsers youruser\n# ثم: sudo systemctl restart ssh"),("جدار ناري بسيط","sudo ufw default deny incoming\nsudo ufw allow 22/tcp\nsudo ufw enable"),("الخدمات الشغالة والبورتات","systemctl list-units --type=service --state=running\nss -tulpn"),("ملفات بصلاحيات خطرة","find / -perm -4000 -type f 2>/dev/null   # SUID\nfind / -perm -0002 -type f 2>/dev/null   # قابلة للكتابة من الكل"),("حسابات من غير باسوورد","sudo awk -F: '($2==\"\"){print $1}' /etc/shadow"),("حماية من التخمين","sudo apt install fail2ban")]
for t,c in H: b+=f'<h3>{E(t)}</h3><pre>{E(c)}</pre>'
b+=ck('قائمة المراجعة',["تحديثات تلقائية للأمان مفعّلة.","دخول root عبر SSH معطّل.","الدخول بمفتاح SSH بدل الباسوورد.","الجدار الناري مفعّل ولا يفتح إلا اللازم.","شيل أي خدمة مش مستخدمة.","مراجعة المستخدمين وصلاحيات sudo.","تسجيل الأحداث (journald/auditd) شغال ومراجَع.","نسخ احتياطي دوري ومجرَّب الاسترجاع منه.","تشفير القرص للأجهزة المحمولة."])
docs['linux-hardening-checklist']=doc('COBRA7 | CHECKLIST','قائمة تقوية سيرفر لينكس','أوامر وخطوات عملية مع قائمة مراجعة',b)

# 4) Nmap + ports
N=[("nmap 192.168.1.10","فحص أشهر 1000 بورت"),("nmap -sn 192.168.1.0/24","اكتشاف الأجهزة الشغالة في الشبكة"),("nmap -p- 192.168.1.10","فحص كل البورتات (65535)"),("nmap -p 80,443 192.168.1.10","فحص بورتات محددة"),("nmap -sV 192.168.1.10","تعريف إصدارات الخدمات"),("nmap -sC 192.168.1.10","تشغيل السكريبتات الافتراضية"),("nmap -O 192.168.1.10","محاولة معرفة نظام التشغيل"),("nmap -A 192.168.1.10","فحص شامل (إصدارات + نظام + سكريبتات)"),("nmap -sS 192.168.1.10","SYN Scan (يحتاج صلاحيات root)"),("nmap -sU -p 53,161 192.168.1.10","فحص UDP لبورتات محددة"),("nmap -Pn 192.168.1.10","تخطي اكتشاف الجهاز لو بيحجب ping"),("nmap -T4 192.168.1.10","سرعة أعلى (من 0 لـ 5)"),("nmap -oN scan.txt 192.168.1.10","حفظ النتيجة في ملف")]
P=[("21","FTP","نقل ملفات (غير مشفر)"),("22","SSH","دخول آمن عن بُعد"),("23","Telnet","دخول عن بُعد غير مشفر"),("25","SMTP","إرسال إيميل"),("53","DNS","ترجمة أسماء الدومين"),("80","HTTP","مواقع ويب"),("110","POP3","استلام إيميل"),("135","RPC","Windows RPC"),("139/445","SMB","مشاركة ملفات في Windows"),("143","IMAP","استلام إيميل"),("443","HTTPS","مواقع ويب مشفرة"),("1433","MSSQL","قاعدة بيانات SQL Server"),("3306","MySQL","قاعدة بيانات MySQL"),("3389","RDP","سطح مكتب بعيد Windows"),("5432","PostgreSQL","قاعدة بيانات PostgreSQL"),("5900","VNC","سطح مكتب بعيد"),("8080","HTTP-alt","ويب بديل / بروكسي")]
b='<h2>أوامر Nmap الأساسية</h2>'+cmdtable(N)+'<h2>أشهر البورتات</h2><table><tr><th style="text-align:left">البورت</th><th>الخدمة</th><th>الوصف</th></tr>'+''.join(f'<tr><td class="c">{a}</td><td class="c" style="text-align:right;direction:ltr">{E(s)}</td><td>{E(d)}</td></tr>' for a,s,d in P)+'</table><div class="tip">نصيحة: ابدأ دايمًا بفحص خفيف، وبعدين زوّد التفاصيل. ومتفحصش غير أجهزة بتملكها أو معاك تصريح كتابي.</div>'
docs['nmap-ports-summary']=doc('COBRA7 | SUMMARY','ملخص Nmap وأشهر البورتات','أوامر الفحص الأكتر استخدامًا وجدول الخدمات',b)

# 5) Report template
sec=[("1) الصفحة الأولى",["اسم المشروع / العميل","تاريخ الفحص","اسم الفاحص","إصدار التقرير ودرجة السرية"]),
("2) الملخص التنفيذي",["نظرة عامة بلغة غير تقنية (فقرة أو اتنين).","أهم النتائج وأخطرها.","التقييم العام للمستوى الأمني."]),
("3) النطاق والمنهجية",["الأنظمة والروابط اللي اتفحصت.","اللي خارج النطاق.","الفترة الزمنية والأدوات والمنهج المتبع."]),
("4) ملخص النتائج",["جدول بعدد الثغرات حسب الخطورة (حرجة / عالية / متوسطة / منخفضة / معلوماتية).","جدول بكل ثغرة: الرقم والعنوان والخطورة والحالة."])]
b='<p>قالب جاهز تملاه بعد كل فحص. ملف Markdown قابل للتعديل متاح معاه: <code>pentest-report-template.md</code></p>'+''.join(ck(t,l) for t,l in sec)
b+='<h2>5) تفاصيل كل ثغرة (كرر القسم ده لكل ثغرة)</h2><table><tr><td style="width:28%">الرقم والعنوان</td><td>F-01 — ...</td></tr><tr><td>الخطورة</td><td>حرجة / عالية / متوسطة / منخفضة / معلوماتية</td></tr><tr><td>المكان المتأثر</td><td>الرابط أو الـParameter أو الجهاز</td></tr><tr><td>الوصف</td><td>إيه الثغرة وليه موجودة</td></tr><tr><td>الأثر</td><td>إيه اللي ممكن يحصل لو اتستغلت</td></tr><tr><td>خطوات إعادة الإنتاج</td><td>1) ... 2) ... 3) ...</td></tr><tr><td>الدليل</td><td>لقطات شاشة / طلب ورد (مع حجب البيانات الحساسة)</td></tr><tr><td>التوصية</td><td>الحل المقترح بخطوات واضحة</td></tr><tr><td>مراجع</td><td>OWASP / CWE / وثائق المنتج</td></tr></table>'
b+=ck('6) الخاتمة',["ملخص التوصيات حسب الأولوية.","خطوات إعادة الفحص بعد الإصلاح."])+ck('7) الملاحق',["مخرجات الأدوات (مختصرة).","قائمة الأنظمة المفحوصة."])
docs['pentest-report-template']=doc('COBRA7 | TEMPLATE','قالب تقرير اختبار اختراق','هيكل احترافي جاهز للتعبئة',b)

# 6) Rules of Engagement template
def ln(l): return f'<div class="lbl">{E(l)}</div><div class="line"></div>'
b='<p>اتفاق مكتوب بين الفاحص وصاحب النظام قبل أي فحص. ده قالب إرشادي، ويفضل مراجعته مع مستشار قانوني قبل الاستخدام الفعلي.</p>'
b+='<h2>1) الأطراف</h2>'+ln('اسم صاحب النظام / الشركة')+ln('اسم الفاحص / الشركة المنفذة')+ln('جهة اتصال لدى صاحب النظام (اسم + رقم)')
b+='<h2>2) النطاق</h2>'+ln('داخل النطاق (دومينات / عناوين IP / تطبيقات)')+ln('خارج النطاق (ممنوع الاقتراب منه)')
b+='<h2>3) التوقيت</h2>'+ln('تاريخ البداية والنهاية')+ln('أوقات الفحص المسموحة (مثلًا خارج ساعات الذروة)')
b+=ck('4) الأنشطة',["مسموح: فحص الثغرات والاستغلال المنضبط داخل النطاق.","ممنوع: هجمات حجب الخدمة (DoS).","ممنوع: الهندسة الاجتماعية إلا بموافقة صريحة.","ممنوع: تعديل أو حذف بيانات حقيقية.","ممنوع: الاحتفاظ ببيانات العملاء بعد انتهاء الفحص."])
b+='<h2>5) الطوارئ والتسليم</h2>'+ln('رقم الطوارئ لإيقاف الفحص فورًا لو حصلت مشكلة')+ln('موعد وطريقة تسليم التقرير وسريته')
b+='<h2>6) الموافقة</h2>'+'<table><tr><td>صاحب النظام: الاسم والتوقيع والتاريخ<div class="line"></div></td><td>الفاحص: الاسم والتوقيع والتاريخ<div class="line"></div></td></tr></table>'
docs['rules-of-engagement-template']=doc('COBRA7 | TEMPLATE','قالب اتفاق نطاق الفحص (Rules of Engagement)','التصريح المكتوب اللي بيحميك وبيحمي العميل',b)

# 7) Sample report (fictional)
F=[("F-01","SQL Injection في خانة البحث","عالية","s-h","/search?q=","الـParameter q بيدخل في استعلام SQL من غير معالجة. كتابة ' OR '1'='1 رجّعت كل المنتجات بدل نتيجة البحث.","قراءة بيانات من قاعدة البيانات، وفي حالات أسوأ تعديلها.","1) افتح /search. 2) اكتب ' OR '1'='1 في الخانة. 3) لاحظ ظهور كل المنتجات.","استخدم Parameterized Queries في كل الاستعلامات، وافحص المدخلات."),
("F-02","IDOR في عرض الطلبات","عالية","s-h","/api/orders/{id}","تغيير رقم الطلب في الرابط بيعرض طلب مستخدم تاني لأن السيرفر مش بيتحقق إن الطلب بتاع صاحب الجلسة.","كشف بيانات عملاء آخرين (أسماء وعناوين).","1) سجّل دخول بحساب A. 2) افتح طلبك /api/orders/101. 3) غيّر الرقم لـ 102 وشوف طلب حساب B.","تحقق إن الطلب يخص المستخدم الحالي في كل طلب على السيرفر."),
("F-03","Stored XSS في تعليقات المنتجات","متوسطة","s-m","/product/7 (التعليقات)","التعليق بيتعرض في الصفحة من غير ترميز، فأي كود HTML/JS بيتنفّذ عند كل زائر.","سرقة جلسات أو تنفيذ أفعال باسم الزائر.","1) اكتب تعليق فيه وسم script بسيط للتجربة. 2) افتح الصفحة من متصفح تاني وشوف إنه اتنفّذ.","رمّز المخرجات (Output Encoding)، وأضف سياسة CSP."),
("F-04","غياب Security Headers","منخفضة","s-l","كل الصفحات","الردود مفيهاش CSP أو X-Frame-Options أو HSTS.","بيسهّل هجمات مثل Clickjacking وبيضعف الحماية العامة.","فحص Headers الردود بأداة المتصفح.","أضف الـHeaders الأساسية في إعدادات السيرفر."),
("F-05","رسائل خطأ مفصلة","معلوماتية","s-i","/api/*","أخطاء السيرفر بتعرض Stack Trace بأسماء ملفات ومكتبات.","بتساعد المهاجم يعرف تفاصيل داخلية.","إرسال طلب غير صالح لأي Endpoint.","اعرض رسالة عامة للمستخدم، وسجّل التفاصيل في اللوج فقط.")]
b='<div class="tip"><b>تقرير نموذجي للتعلّم:</b> الموقع والبيانات هنا خيالية بالكامل (متجر تدريبي اسمه Demo Shop)، والهدف تشوف شكل التقرير الاحترافي.</div>'
b+='<h2>الملخص التنفيذي</h2><p>اتفحص تطبيق متجر إلكتروني تدريبي بتصريح كتابي. اتكتشفت 5 نتائج: ثغرتين بخطورة عالية، وواحدة متوسطة، وواحدة منخفضة، وملاحظة معلوماتية. أخطر نتيجتين بتسمحوا بالوصول لبيانات العملاء، ومطلوب إصلاحهم قبل أي إطلاق فعلي.</p>'
b+='<h2>النطاق والمنهجية</h2><p><b>داخل النطاق:</b> demo-shop.example (بيئة تدريب). <b>المنهج:</b> فحص يدوي حسب قائمة OWASP، بدون أي هجمات حجب خدمة.</p>'
b+='<h2>ملخص النتائج</h2><table><tr><th>الرقم</th><th>العنوان</th><th>الخطورة</th></tr>'+''.join(f'<tr><td class="c">{a}</td><td>{E(t)}</td><td>{E(s)}</td></tr>' for a,t,s,_,_,_,_,_,_ in F)+'</table><div class="pb"></div><h2>تفاصيل النتائج</h2>'
for a,t,s,cl,loc,d,imp,rep,fix in F:
    b+=f'<div class="it" style="border-right-color:#999"><b>{a} — {E(t)} <span class="sev {cl}">{E(s)}</span></b><div class="m"><u>المكان:</u> <code>{E(loc)}</code></div><div class="m"><u>الوصف:</u> {E(d)}</div><div class="m"><u>الأثر:</u> {E(imp)}</div><div class="m"><u>إعادة الإنتاج:</u> {E(rep)}</div><div class="f"><u>التوصية:</u> {E(fix)}</div></div>'
b+='<h2>التوصيات حسب الأولوية</h2><ul class="ck">'+items(["إصلاح F-01 وF-02 فورًا قبل أي إطلاق.","إصلاح F-03 خلال الدورة القادمة.","تطبيق F-04 وF-05 ضمن تحسينات الإعدادات.","إعادة الفحص بعد الإصلاح للتأكد."])+'</ul>'
docs['sample-pentest-report']=doc('COBRA7 | SAMPLE REPORT','تقرير اختبار اختراق نموذجي','مثال كامل على تقرير احترافي (بيانات خيالية)',b)

os.makedirs('/tmp/libhtml',exist_ok=True)
with sync_playwright() as p:
    br=p.chromium.launch()
    for name,h in docs.items():
        f=f'/tmp/libhtml/{name}.html'; open(f,'w',encoding='utf-8').write(h)
        pg=br.new_page(); pg.goto('file://'+f); pg.pdf(path=os.path.join(OUT,name+'.pdf'),format='A4',print_background=True,prefer_css_page_size=True); pg.close()
    br.close()

# Markdown قابل للتعديل
md={'pentest-report-template.md':'''# تقرير اختبار اختراق — [اسم المشروع]

| | |
|---|---|
| العميل | |
| تاريخ الفحص | |
| الفاحص | |
| الإصدار / السرية | |

## 1) الملخص التنفيذي
(نظرة عامة بلغة غير تقنية + أهم النتائج + التقييم العام)

## 2) النطاق والمنهجية
- داخل النطاق:
- خارج النطاق:
- الفترة والأدوات والمنهج:

## 3) ملخص النتائج
| الخطورة | العدد |
|---|---|
| حرجة | |
| عالية | |
| متوسطة | |
| منخفضة | |
| معلوماتية | |

## 4) التفاصيل
### F-01 — [عنوان الثغرة]
- **الخطورة:**
- **المكان المتأثر:**
- **الوصف:**
- **الأثر:**
- **خطوات إعادة الإنتاج:**
  1.
  2.
- **الدليل:** (لقطات شاشة مع حجب البيانات الحساسة)
- **التوصية:**
- **مراجع:**

## 5) الخاتمة والتوصيات حسب الأولوية

## 6) الملاحق
''','rules-of-engagement-template.md':'''# اتفاق نطاق الفحص (Rules of Engagement)

> قالب إرشادي. راجعه مع مستشار قانوني قبل الاستخدام الفعلي.

## 1) الأطراف
- صاحب النظام / الشركة:
- الفاحص / الشركة المنفذة:
- جهة اتصال لدى صاحب النظام:

## 2) النطاق
- داخل النطاق (دومينات / IP / تطبيقات):
- خارج النطاق:

## 3) التوقيت
- تاريخ البداية والنهاية:
- أوقات الفحص المسموحة:

## 4) الأنشطة
- مسموح: فحص الثغرات والاستغلال المنضبط داخل النطاق.
- ممنوع: هجمات حجب الخدمة (DoS).
- ممنوع: الهندسة الاجتماعية إلا بموافقة صريحة.
- ممنوع: تعديل أو حذف بيانات حقيقية.
- ممنوع: الاحتفاظ ببيانات العملاء بعد انتهاء الفحص.

## 5) الطوارئ والتسليم
- رقم الطوارئ لإيقاف الفحص فورًا:
- موعد وطريقة تسليم التقرير:

## 6) الموافقة
- صاحب النظام (الاسم / التوقيع / التاريخ):
- الفاحص (الاسم / التوقيع / التاريخ):
'''}
for n,t in md.items(): open(os.path.join(OUT,n),'w',encoding='utf-8').write(t)
print('built',len(docs),'pdfs +',len(md),'md')

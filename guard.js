/* COBRA7 — منع تضمين الموقع داخل صفحة تانية (Clickjacking). متغيرهوش. */
(function(){try{if(window.top!==window.self){try{window.top.location=window.self.location.href}catch(e){document.documentElement.style.display="none"}}}catch(e){}})();

(function() {
    'use strict';

    // 1. تجميد الكونسول (Console API) ومنع استخدامه نهائياً
    const noop = () => {};
    const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 'table'];
    methods.forEach(m => { console[m] = noop; });

    // منع إعادة تعريف الكونسول من قبل المستخدم
    Object.defineProperty(window, 'console', {
        get: () => {
            const dummy = {};
            methods.forEach(m => dummy[m] = noop);
            return dummy;
        },
        set: () => {},
        configurable: false
    });

    // 2. تقنية "فخ التصحيح" (Debugger Trap)
    // هذه الوظيفة تجعل المتصفح يتوقف تماماً (Freeze) إذا حاول المستخدم فتح أدوات المطور
    const checkDevTools = function() {
        const start = performance.now();
        debugger; // سيتوقف التنفيذ هنا فقط إذا كانت الأدوات مفتوحة
        const end = performance.now();
        if (end - start > 100) {
            // إذا كان هناك تأخير، فهذا يعني أن المتصفح توقف عند debugger
            triggerLockdown();
        }
    };
    setInterval(checkDevTools, 500);

    // 3. منع اختصارات لوحة المفاتيح (نسخة موسعة)
    document.addEventListener('keydown', function(e) {
        const forbidden = ['F12', 'I', 'J', 'C', 'U', 'S', 'P', 'K'];
        if (forbidden.includes(e.key.toUpperCase()) && (e.ctrlKey || e.shiftKey || e.key === 'F12')) {
            e.preventDefault();
            return false;
        }
    });

    // 4. وظيفة الإغلاق الفوري (Lockdown)
    function triggerLockdown() {
        // مسح محتوى الصفحة تماماً ومنع الوصول للبيانات
        document.body.innerHTML = `
            <div style="background:#000;color:#f00;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:sans-serif;text-align:center;padding:20px;">
                <h1>⚠️ تم تفعيل نظام الحماية القسري</h1>
                <p>تم اكتشاف محاولة وصول غير مصرح بها لأدوات المطور أو تلاعب بالصفحة.</p>
                <button onclick="location.reload()" style="padding:10px 20px;cursor:pointer;border-radius:8px;border:none;background:#28a745;color:white;">إعادة تحميل النظام</button>
            </div>`;
        localStorage.clear();
        sessionStorage.clear();
        throw new Error("Security Lockdown Activated");
    }

    // 5. العلامة المائية "غير القابلة للإزالة" (Invisible Persistent Watermark)
    const applyWatermark = () => {
        let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const info = `${user.first_name || 'مراقب'} | ${user.station || 'مركز'} | ${new Date().toLocaleString('ar-SA')}`;
        
        const div = document.createElement('div');
        div.id = 'sec-mask';
        div.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 999999;
            opacity: 0.08; font-size: 14px; color: #000;
            display: flex; flex-wrap: wrap; gap: 80px; padding: 20px;
            user-select: none;
        `;
        
        for(let i=0; i<30; i++) {
            const span = document.createElement('span');
            span.innerText = info;
            div.appendChild(span);
        }
        document.body.appendChild(div);
    };

    // حماية العلامة المائية من الحذف عبر العناصر (Inspect Element)
    const observer = new MutationObserver(() => {
        if (!document.getElementById('sec-mask')) applyWatermark();
    });
    observer.observe(document.body, { childList: true });

    // تشغيل الحماية عند التحميل
    window.addEventListener('DOMContentLoaded', () => {
        applyWatermark();
        document.body.style.userSelect = 'none';
        document.body.oncontextmenu = () => false;
    });

})();
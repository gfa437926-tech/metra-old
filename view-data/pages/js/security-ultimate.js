(function() {
    'use strict';

    // 1. إضافة نمط التشويش (CSS) برمجياً
    const style = document.createElement('style');
    style.innerHTML = `
        .content-blur {
            filter: blur(15px) grayscale(100%);
            transition: filter 0.3s ease;
            pointer-events: none;
            user-select: none;
        }
        #security-lock-msg {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000000;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            font-family: sans-serif;
            border: 2px solid red;
        }
    `;
    document.head.appendChild(style);

    // 2. إنشاء رسالة التحذير
    const msg = document.createElement('div');
    msg.id = 'security-lock-msg';
    msg.innerHTML = '<h3>⚠️ محتوى محمي</h3><p>لا يمكن عرض البيانات أثناء محاولة التصوير أو الخروج من النافذة</p>';
    document.body.appendChild(msg);

    const mainContent = document.body;

    // 3. وظائف التشويش والإغلاق
    function applyProtection() {
        mainContent.classList.add('content-blur');
        msg.style.display = 'block';
    }

    function removeProtection() {
        mainContent.classList.remove('content-blur');
        msg.style.display = 'none';
    }

    // 4. منع تصوير الشاشة عبر مراقبة التركيز (Visibility & Focus)
    // عند محاولة الضغط على PrtScn أو فتح أداة قص، يفقد المتصفح التركيز غالباً
    window.addEventListener('blur', applyProtection);
    window.addEventListener('focus', removeProtection);
    
    // التشويش عند خروج الماوس من النافذة (لمنع أدوات التصوير الخارجية)
    document.addEventListener('mouseleave', applyProtection);
    document.addEventListener('mouseenter', removeProtection);

    // 5. فخ التصحيح (Debugger Trap) - يمنع فتح الكونسول
    setInterval(function() {
        const start = performance.now();
        debugger; 
        if (performance.now() - start > 100) {
            applyProtection();
            setTimeout(() => { location.reload(); }, 2000);
        }
    }, 500);

    // 6. منع النقر الأيمن والاختصارات (F12, Ctrl+Shift+I, Ctrl+S, Ctrl+P)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        const forbiddenKeys = ['F12', 'I', 'J', 'C', 'U', 'S', 'P'];
        if (forbiddenKeys.includes(e.key.toUpperCase()) && (e.ctrlKey || e.shiftKey || e.key === 'F12')) {
            e.preventDefault();
            alert('الإجراء محظور لأسباب أمنية');
            return false;
        }
    });

    // 7. العلامة المائية الديناميكية (Invisible Watermark)
    const addWatermark = () => {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{"first_name":"مستخدم"}');
        const text = `نظام الأرصاد - ${user.first_name} - ${new Date().toLocaleTimeString()}`;
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 999999; opacity: 0.05;
            display: flex; flex-wrap: wrap; gap: 50px; padding: 10px;
        `;
        for(let i=0; i<40; i++) {
            const s = document.createElement('span');
            s.innerText = text;
            overlay.appendChild(s);
        }
        document.body.appendChild(overlay);
    };
    window.addEventListener('load', addWatermark);

})();
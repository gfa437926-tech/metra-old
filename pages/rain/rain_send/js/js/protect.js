// ============================================================
//  سكريبت الحماية المتكاملة - منع النسخ، التصوير، الكونسول، وسحب البيانات
// ============================================================

(function() {
    'use strict';

    // 1. منع النقر بزر الماوس الأيمن (Context Menu)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // 2. منع تحديد النص وسحبه
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    // منع النسخ والقص واللصق عبر الحافظة
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });

    // 3. منع اختصارات لوحة المفاتيح (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+C, Ctrl+V, Ctrl+X, PrintScreen)
    function blockShortcuts(e) {
        // منع F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U') ||
            (e.ctrlKey && e.key === 's') ||
            (e.ctrlKey && e.key === 'c') ||
            (e.ctrlKey && e.key === 'x') ||
            (e.ctrlKey && e.key === 'v') ||
            (e.key === 'PrintScreen')) {
            e.preventDefault();
            return false;
        }
    }
    document.addEventListener('keydown', blockShortcuts);
    document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            return false;
        }
    });

    // 4. تعطيل وظائف console.log, console.error, etc. (منع القرصنة عبر الكونسول)
    if (window.console) {
        window.console.log = function() {};
        window.console.warn = function() {};
        window.console.error = function() {};
        window.console.info = function() {};
        window.console.debug = function() {};
        window.console.table = function() {};
        window.console.clear = function() {};
    }

    // 5. كشف فتح أدوات المطور (DevTools) وإعادة التحميل أو مسح الصفحة
    let devtoolsOpen = false;
    const checkDevTools = function() {
        const threshold = 160; // فرق الارتفاع / العرض للكشف
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > threshold || heightDiff > threshold || (Math.abs(widthDiff) > 20 && Math.abs(heightDiff) > 20)) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // يمكن إعادة توجيه الصفحة أو عرض رسالة أو تفريغ المحتوى
                document.body.innerHTML = '<div style="text-align:center; padding:50px; background:red; color:white;">تم اكتشاف أدوات المطور! الصفحة غير متاحة.</div>';
                setTimeout(() => { window.location.reload(); }, 1000);
            }
        } else {
            devtoolsOpen = false;
        }
    };
    setInterval(checkDevTools, 1000);

    // 6. منع سحب البيانات (DataTransfer) من العناصر
    const disableDragDrop = function() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.setAttribute('draggable', 'false');
            el.ondragstart = function(e) { e.preventDefault(); return false; };
            el.ondrop = function(e) { e.preventDefault(); return false; };
        });
    };
    disableDragDrop();
    // مراقبة إضافة عناصر جديدة (مثل المحتوى الديناميكي)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                disableDragDrop();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 7. تشفير البيانات الحساسة (مثال: تشفير النصوص المخزنة في عناصر ذات كلاس "encrypt-me")
    // استخدام خوارزمية تشفير بسيطة (XOR) - يمكن استبدالها بـ AES عبر Web Crypto API
    function encryptData(text, key = 'mySecretKey123') {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return btoa(result); // ترميز Base64
    }

    function decryptData(encryptedBase64, key = 'mySecretKey123') {
        const encrypted = atob(encryptedBase64);
        let result = '';
        for (let i = 0; i < encrypted.length; i++) {
            const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    // تطبيق التشفير على أي عنصر يحتوي على خاصية data-encrypt أو class="encrypt-data"
    document.querySelectorAll('[data-encrypt], .encrypt-data').forEach(el => {
        const originalText = el.innerText;
        if (originalText && !el.getAttribute('data-decrypted')) {
            const encrypted = encryptData(originalText);
            el.setAttribute('data-encrypted', encrypted);
            el.innerText = '[بيانات مشفرة]'; // أو يمكن عرض نص placeholder
            el.setAttribute('data-decrypted', 'false');
            // يمكن إضافة حدث فك التشفير عند الحاجة (مثل بعد التحقق)
        }
    });

    // 8. منع أخذ لقطة شاشة عبر keyboard (قد لا يمنع بالكامل لكن يمنع الإجراءات)
    window.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            alert('لقطة الشاشة غير مسموحة في هذا الموقع');
            e.preventDefault();
            return false;
        }
    });

    // 9. منع سحب الصور أو الملفات خارج الصفحة
    window.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    window.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    });

    // 10. حماية إضافية: منع فتح أدوات المطور عبر الضغط المطول (متصفحات الموبايل)
    let touchTimer;
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) { // لمسة مزدوجة تشبه فتح القائمة
            e.preventDefault();
        }
        touchTimer = setTimeout(() => {}, 500);
    });
    document.addEventListener('touchend', function() {
        clearTimeout(touchTimer);
    });

    console.log('تم تفعيل جميع إجراءات الحماية بنجاح.');
})();
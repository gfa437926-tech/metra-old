// whatsapp-handler.js - نظام إرسال التقارير عبر واتساب للنشرات المناخية الساعية
console.log('📱 تحميل نظام إرسال الواتساب...');

// دالة تهيئة نظام الواتساب
function initializeWhatsAppSystem() {
    console.log('🔧 تهيئة نظام الواتساب...');
    
    // إنشاء زر الواتساب إذا لم يكن موجوداً
    createWhatsAppButtonIfNeeded();
    
    // إعداد معالج الأحداث
    setupWhatsAppButtonHandler();
    
    // إضافة أنماط الواتساب
    addWhatsAppStyles();
    
    console.log('✅ تم تهيئة نظام الواتساب');
}

// إنشاء زر الواتساب إذا لم يكن موجوداً
function createWhatsAppButtonIfNeeded() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (!whatsappBtn) {
        console.log('🔄 إنشاء زر الواتساب...');
        
        const buttonContainer = document.querySelector('.text-center.mt-4');
        if (buttonContainer) {
            const newButton = document.createElement('button');
            newButton.type = 'button';
            newButton.className = 'btn btn-success btn-custom';
            newButton.id = 'whatsappBtn';
            newButton.innerHTML = '<i class="fab fa-whatsapp me-1"></i>إرسال عبر واتساب';
            
            // إضافة الزر قبل زر إرسال التقرير
            const submitBtn = document.getElementById('submitReportBtn');
            if (submitBtn) {
                buttonContainer.insertBefore(newButton, submitBtn.nextSibling);
            } else {
                buttonContainer.appendChild(newButton);
            }
            
            console.log('✅ تم إنشاء زر الواتساب');
        }
    }
}

// إعداد معالج أحداث زر الواتساب
function setupWhatsAppButtonHandler() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', handleWhatsAppSubmission);
        console.log('✅ تم إعداد معالج زر الواتساب');
    } else {
        console.error('❌ لم يتم العثور على زر الواتساب');
    }
}

// معالجة إرسال الواتساب
function handleWhatsAppSubmission() {
    console.log('📤 معالجة إرسال عبر واتساب...');
    
    // التحقق من المصادقة أولاً
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!userData || !userData.id) {
        showWhatsAppAlert('❌ يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    // التحقق من صحة البيانات
    if (!validateFormForWhatsApp()) {
        showWhatsAppAlert('❌ يرجى تصحيح الأخطاء في النموذج قبل الإرسال', 'error');
        return;
    }
    
    // التحقق من موافقة المسؤولية
    const responsibilityAgreement = document.getElementById('responsibilityAgreement');
    if (!responsibilityAgreement || !responsibilityAgreement.checked) {
        showWhatsAppAlert('❌ يجب الموافقة على بيان المسؤولية قبل الإرسال', 'error');
        return;
    }
    
    // جمع البيانات
    const formData = collectFormDataForWhatsApp();
    
    // عرض خيارات الإرسال
    showWhatsAppOptions(formData, userData);
}

// التحقق من صحة النموذج للواتساب
function validateFormForWhatsApp() {
    console.log('🔍 التحقق من صحة النموذج للواتساب...');
    
    // استخدام دالات التحقق الموجودة أو إنشاء نسخة مبسطة
    if (typeof validateAllInputs === 'function') {
        return validateAllInputs();
    }
    
    // التحقق الأساسي إذا لم تكن الدوال موجودة
    const requiredFields = [
        'localTime', 'dryTemp', 'wetTemp', 'relativeHumidity',
        'windDirection', 'windSpeed'
    ];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            console.error(`❌ الحقل ${fieldId} مطلوب`);
            return false;
        }
    }
    
    return true;
}

// جمع بيانات النموذج للواتساب
function collectFormDataForWhatsApp() {
    console.log('📊 جمع بيانات النموذج للواتساب...');
    
    return {
        localTime: document.getElementById('localTime')?.value || '',
        utcTime: document.getElementById('utcTime')?.value || '',
        dryTemp: document.getElementById('dryTemp')?.value || '',
        wetTemp: document.getElementById('wetTemp')?.value || '',
        relativeHumidity: document.getElementById('relativeHumidity')?.value || '',
        vaporPressure: document.getElementById('vaporPressure')?.value || '',
        dewPoint: document.getElementById('dewPoint')?.value || '',
        windDirection: document.getElementById('windDirection')?.value || '',
        windSpeed: document.getElementById('windSpeed')?.value || '',
        avgWindDirection: document.getElementById('avgWindDirection')?.value || '',
        avgWindSpeed: document.getElementById('avgWindSpeed')?.value || '',
        totalCloudCover: document.getElementById('totalCloudCover')?.value || '',
        observerNotes: document.getElementById('observerNotes')?.value || ''
    };
}

// عرض خيارات الإرسال عبر واتساب
function showWhatsAppOptions(formData, userData) {
    console.log('📱 عرض خيارات الواتساب...');
    
    // إنشاء رسالة الواتساب
    const message = createWhatsAppMessage(formData, userData);
    
    // إنشاء نافذة خيارات
    const optionsHTML = `
        <div class="whatsapp-options-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div class="whatsapp-options-content" style="background: white; border-radius: 15px; width: 90%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div class="whatsapp-options-header" style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: white; padding: 20px; border-radius: 15px 15px 0 0;">
                    <h4 class="mb-0"><i class="fab fa-whatsapp me-2"></i>إرسال التقرير عبر واتساب</h4>
                </div>
                
                <div class="whatsapp-options-body" style="padding: 25px;">
                    <div class="mb-4">
                        <h5 class="text-success mb-3">📋 معاينة التقرير</h5>
                        <div class="whatsapp-preview" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 15px; max-height: 300px; overflow-y: auto;">
                            ${createWhatsAppPreviewHTML(formData, userData)}
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h5 class="text-success mb-3">📱 اختر طريقة الإرسال</h5>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-outline-success w-100 whatsapp-option-btn" data-type="phone">
                                    <i class="fas fa-mobile-alt me-2"></i>إرسال إلى رقم
                                </button>
                            </div>
                            <div class="col-md-6 mb-3">
                                <button class="btn btn-outline-primary w-100 whatsapp-option-btn" data-type="copy">
                                    <i class="fas fa-copy me-2"></i>نسخ النص
                                </button>
                            </div>
                        </div>
                        
                        <div class="whatsapp-phone-input mt-3" style="display: none;">
                            <label class="form-label">رقم الواتساب</label>
                            <div class="input-group">
                                <span class="input-group-text bg-success text-white">+966</span>
                                <input type="tel" class="form-control" id="whatsappPhoneInput" placeholder="5XXXXXXXX" maxlength="9" pattern="[0-9]{9}">
                                <button class="btn btn-success" type="button" id="sendToPhoneBtn">
                                    <i class="fab fa-whatsapp"></i>
                                </button>
                            </div>
                            <small class="text-muted">أدخل رقم الجوال السعودي بدون المقدمة الدولية (966)</small>
                        </div>
                    </div>
                    
                    <div class="form-check mb-4">
                        <input class="form-check-input" type="checkbox" id="saveTemplateCheck">
                        <label class="form-check-label" for="saveTemplateCheck">
                            حفظ هذا القالب للإرسالات المستقبلية
                        </label>
                    </div>
                </div>
                
                <div class="whatsapp-options-footer" style="padding: 15px 25px; border-top: 1px solid #e9ecef; display: flex; justify-content: space-between;">
                    <button class="btn btn-secondary" id="cancelWhatsAppBtn">إلغاء</button>
                    <button class="btn btn-success" id="quickSendBtn">
                        <i class="fab fa-whatsapp me-1"></i>إرسال سريع
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة إلى الصفحة
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = optionsHTML;
    document.body.appendChild(modalContainer);
    
    // إعداد الأحداث
    setTimeout(() => {
        setupWhatsAppOptionsEvents(modalContainer, message, formData, userData);
    }, 100);
}

// إعداد أحداث خيارات الواتساب
function setupWhatsAppOptionsEvents(container, message, formData, userData) {
    // زر الإلغاء
    const cancelBtn = container.querySelector('#cancelWhatsAppBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            container.remove();
        });
    }
    
    // زر الإرسال السريع
    const quickSendBtn = container.querySelector('#quickSendBtn');
    if (quickSendBtn) {
        quickSendBtn.addEventListener('click', () => {
            const phoneNumber = prompt('أدخل رقم الواتساب (9665XXXXXXXX):', '966');
            if (phoneNumber && validatePhoneNumber(phoneNumber)) {
                sendWhatsAppMessage(phoneNumber, message);
                container.remove();
                logWhatsAppSubmission(phoneNumber, userData.station, 'quick');
            }
        });
    }
    
    // أزرار الخيارات
    const optionButtons = container.querySelectorAll('.whatsapp-option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            if (type === 'phone') {
                // إظهار حقل إدخال الرقم
                const phoneInput = container.querySelector('.whatsapp-phone-input');
                if (phoneInput) {
                    phoneInput.style.display = 'block';
                    container.querySelector('#whatsappPhoneInput')?.focus();
                }
            } else if (type === 'copy') {
                // نسخ النص
                copyToClipboard(message);
                showWhatsAppAlert('✅ تم نسخ نص التقرير إلى الحافظة', 'success');
            }
        });
    });
    
    // زر إرسال إلى رقم
    const sendToPhoneBtn = container.querySelector('#sendToPhoneBtn');
    if (sendToPhoneBtn) {
        sendToPhoneBtn.addEventListener('click', () => {
            const phoneInput = container.querySelector('#whatsappPhoneInput');
            if (phoneInput && phoneInput.value) {
                const phoneNumber = '966' + phoneInput.value;
                if (validatePhoneNumber(phoneNumber)) {
                    sendWhatsAppMessage(phoneNumber, message);
                    container.remove();
                    logWhatsAppSubmission(phoneNumber, userData.station, 'manual');
                } else {
                    showWhatsAppAlert('❌ رقم غير صحيح. يرجى التأكد من الرقم', 'error');
                }
            }
        });
    }
    
    // حفظ القالب
    const saveTemplateCheck = container.querySelector('#saveTemplateCheck');
    if (saveTemplateCheck) {
        saveTemplateCheck.addEventListener('change', function() {
            if (this.checked) {
                saveWhatsAppTemplate(message);
            }
        });
    }
    
    // إغلاق النافذة بالنقر خارجها
    container.querySelector('.whatsapp-options-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('whatsapp-options-modal')) {
            container.remove();
        }
    });
}

// إنشاء رسالة واتساب
function createWhatsAppMessage(formData, userData) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA');
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    // استخدام رموز تعبيرية لتحسين القراءة
    let message = `*🌤️ تقرير مناخي ساعي*\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    
    message += `*📋 المعلومات الأساسية*\n`;
    message += `📅 التاريخ: ${dateStr}\n`;
    message += `🕐 الوقت: ${timeStr}\n`;
    message += `🏢 المحطة: ${userData.station || 'غير محدد'}\n`;
    message += `👤 الراصد: ${userData.first_name || ''} ${userData.last_name || ''}\n\n`;
    
    message += `*🌡️ درجات الحرارة*\n`;
    message += `🌡️ الحرارة الجافة: ${formData.dryTemp || '0.0'}°C\n`;
    message += `💧 الحرارة الرطبة: ${formData.wetTemp || '0.0'}°C\n`;
    message += `🌫️ درجة الندى: ${formData.dewPoint || '0.0'}°C\n\n`;
    
    message += `*💦 الرطوبة*\n`;
    message += `💧 الرطوبة النسبية: ${formData.relativeHumidity || '000'}%\n`;
    message += `📊 ضغط البخار: ${formData.vaporPressure || '0.0'} مليبار\n\n`;
    
    message += `*💨 الرياح*\n`;
    message += `🧭 الاتجاه: ${formData.windDirection || '00'}°\n`;
    message += `💨 السرعة: ${formData.windSpeed || '00'} م/ثا\n`;
    message += `↔️ متوسط الاتجاه: ${formData.avgWindDirection || '00'}°\n`;
    message += `📈 متوسط السرعة: ${formData.avgWindSpeed || '00'} م/ثا\n\n`;
    
    message += `*☁️ السحب*\n`;
    message += `☁️ التغطية: ${formData.totalCloudCover || '0'}/8\n\n`;
    
    if (formData.observerNotes && formData.observerNotes.trim() !== '') {
        message += `*📝 ملاحظات الراصد*\n`;
        message += `${formData.observerNotes}\n\n`;
    }
    
    message += `━━━━━━━━━━━━━━\n`;
    message += `*📱 نظام إدارة  البيانات الجوية*\n`;
    message += `⏱️ وقت الإنشاء: ${timeStr}\n`;
    message += `🔗 تم إنشاؤه تلقائياً`;
    
    return message;
}

// إنشاء HTML للمعاينة
function createWhatsAppPreviewHTML(formData, userData) {
    return `
        <div class="preview-item">
            <strong>🏢 المحطة:</strong> ${userData.station || 'غير محدد'}
        </div>
        <div class="preview-item">
            <strong>👤 الراصد:</strong> ${userData.first_name || ''} ${userData.last_name || ''}
        </div>
        <div class="preview-item">
            <strong>🌡️ الحرارة:</strong> ${formData.dryTemp || '0.0'}°C (جافة) / ${formData.wetTemp || '0.0'}°C (رطبة)
        </div>
        <div class="preview-item">
            <strong>💦 الرطوبة:</strong> ${formData.relativeHumidity || '000'}%
        </div>
        <div class="preview-item">
            <strong>💨 الرياح:</strong> ${formData.windDirection || '00'}° @ ${formData.windSpeed || '00'} م/ثا
        </div>
        <div class="preview-item">
            <strong>☁️ السحب:</strong> ${formData.totalCloudCover || '0'}/8
        </div>
    `;
}

// التحقق من صحة رقم الهاتف
function validatePhoneNumber(phone) {
    // تنسيق: 9665XXXXXXXX (12 رقم)
    const pattern = /^9665\d{8}$/;
    return pattern.test(phone);
}

// إرسال رسالة واتساب
function sendWhatsAppMessage(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // فتح في نافذة جديدة
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    
    // تسجيل الحدث
    console.log(`📤 تم إرسال التقرير إلى: ${phoneNumber}`);
    
    // إظهار إشعار النجاح
    showWhatsAppAlert('✅ تم فتح واتساب مع التقرير جاهز للإرسال', 'success');
    
    return true;
}

// نسخ إلى الحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('✅ تم النسخ إلى الحافظة');
    }).catch(err => {
        console.error('❌ فشل النسخ:', err);
        // طريقة بديلة
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// تسجيل إرسال الواتساب
function logWhatsAppSubmission(phone, station, method) {
    const logs = JSON.parse(localStorage.getItem('whatsapp_logs') || '[]');
    
    logs.push({
        timestamp: new Date().toISOString(),
        phone: phone,
        station: station,
        method: method,
        type: 'climate_hourly'
    });
    
    // حفظ فقط آخر 50 سجل
    if (logs.length > 50) {
        logs.shift();
    }
    
    localStorage.setItem('whatsapp_logs', JSON.stringify(logs));
}

// حفظ قالب الواتساب
function saveWhatsAppTemplate(message) {
    const templates = JSON.parse(localStorage.getItem('whatsapp_templates') || '[]');
    
    templates.push({
        id: 'template_' + Date.now(),
        message: message,
        saved_at: new Date().toISOString(),
        name: 'قالب مناخي ساعي'
    });
    
    localStorage.setItem('whatsapp_templates', JSON.stringify(templates));
    showWhatsAppAlert('💾 تم حفظ القالب بنجاح', 'info');
}

// إظهار إشعارات الواتساب
function showWhatsAppAlert(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        console.log(`📢 ${message}`);
        alert(message);
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fab fa-whatsapp me-2"></i>${message}
    `;
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// إضافة أنماط الواتساب
function addWhatsAppStyles() {
    const styleId = 'whatsapp-styles';
    if (document.getElementById(styleId)) return;
    
    const styles = `
        /* أنماط زر الواتساب */
        .btn-success.btn-custom {
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            color: white;
            border: none;
            position: relative;
            overflow: hidden;
        }
        
        .btn-success.btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        }
        
        .btn-success.btn-custom:active {
            transform: translateY(0);
        }
        
        .btn-success.btn-custom::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
        }
        
        .btn-success.btn-custom:hover::after {
            left: 100%;
        }
        
        /* أنماط معاينة الواتساب */
        .whatsapp-preview {
            background: #f0f9f0;
            border: 2px solid #25d366;
            border-radius: 12px;
            padding: 20px;
            margin: 15px 0;
        }
        
        .whatsapp-preview .preview-item {
            padding: 8px 0;
            border-bottom: 1px dashed #c8e6c9;
            font-size: 0.95rem;
        }
        
        .whatsapp-preview .preview-item:last-child {
            border-bottom: none;
        }
        
        .whatsapp-preview .preview-item strong {
            color: #128c7e;
            margin-left: 8px;
        }
        
        /* أنماط إضافية */
        .whatsapp-option-btn {
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .whatsapp-option-btn:hover {
            transform: translateY(-2px);
            border-color: #25d366;
        }
        
        /* تلميح الأدوات */
        .whatsapp-tooltip {
            position: absolute;
            background: #25d366;
            color: white;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.85rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .whatsapp-tooltip.show {
            opacity: 1;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل نظام الواتساب...');
    
    // الانتظار قليلاً لتحميل بقية المكونات
    setTimeout(() => {
        initializeWhatsAppSystem();
        
        // إضافة أيقونة واتساب صغيرة في الزاوية
        addWhatsAppFloatingIcon();
        
        console.log('✅ تم تحميل نظام الواتساب بنجاح');
    }, 1000);
});

// إضافة أيقونة واتساب عائمة
function addWhatsAppFloatingIcon() {
    const floatingIcon = document.createElement('div');
    floatingIcon.id = 'whatsappFloatingIcon';
    floatingIcon.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: #25d366; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4); z-index: 999;">
            <i class="fab fa-whatsapp"></i>
        </div>
    `;
    
    document.body.appendChild(floatingIcon);
    
    // إضافة حدث النقر
    floatingIcon.addEventListener('click', () => {
        showWhatsAppAlert('📱 نظام إرسال التقارير عبر واتساب جاهز للاستخدام', 'info');
    });
}

// جعل الدوال متاحة عالمياً لأغراض التصحيح
window.sendViaWhatsApp = handleWhatsAppSubmission;
window.testWhatsAppMessage = function() {
    const testData = {
        localTime: "12",
        dryTemp: "25.5",
        wetTemp: "20.3",
        relativeHumidity: "075",
        windDirection: "15",
        windSpeed: "12"
    };
    
    const testUser = {
        station: "محطة تجريبية",
        first_name: "محمد",
        last_name: "العربي"
    };
    
    const message = createWhatsAppMessage(testData, testUser);
    console.log('🧪 رسالة واتساب تجريبية:', message);
    return message;
};

console.log('📱 تم تحميل نظام إرسال الواتساب بنجاح');
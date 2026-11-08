// js/whatsapp-sender.js - نظام إرسال التقارير عبر واتساب
console.log('🔄 تحميل نظام إرسال واتساب...');

class WhatsAppSender {
    constructor() {
        this.phoneNumber = "0934884157";
        this.backupNumbers = ["0934884157"]; // يمكن إضافة أرقام احتياطية
    }

    async sendReport(reportData) {
        try {
            const message = this.formatMessage(reportData);
            const success = await this.sendViaWhatsApp(message);
            
            if (!success) {
                // محاولة النسخ إلى الحافظة كبديل
                await this.copyToClipboard(message);
                return {
                    success: false,
                    method: 'clipboard',
                    message: 'تم نسخ التقرير إلى الحافظة. يرجى لصقه في واتساب يدوياً.'
                };
            }
            
            return {
                success: true,
                method: 'whatsapp',
                message: 'تم فتح واتساب بنجاح! يرجى إرسال الرسالة'
            };
            
        } catch (error) {
            console.error('Error sending WhatsApp report:', error);
            throw new Error('فشل في إرسال التقرير عبر واتساب');
        }
    }

    formatMessage(reportData) {
        const timestamp = new Date().toLocaleString('ar-SA');
        const reportId = `TR-${Date.now().toString().slice(-6)}`;
        
        return `
🚨 *تقرير مشكلة في النشرة الجوية*
*المركز الوطني للأرصاد الجوية*

👤 *معلومات المبلغ:*
• الاسم: ${reportData.reporterName}
• الصفة: ${reportData.reporterPosition}
• الهاتف: ${reportData.reporterPhone}

📋 *تفاصيل المشكلة:*
• نوع النشرة: ${reportData.bulletinType}
• الحقل المعني: ${reportData.problemField}
• نوع المشكلة: ${reportData.problemType}
• درجة الأهمية: ${reportData.problemUrgency}

📝 *وصف المشكلة:*
${reportData.problemDescription}

${reportData.additionalDetails ? `🔧 *تفاصيل إضافية:*\n${reportData.additionalDetails}\n` : ''}

🕒 *معلومات التقرير:*
• وقت الإرسال: ${timestamp}
• رقم التقرير: ${reportId}
• الفني المختص: إبراهيم زينب

_تم الإرسال عبر نظام الإبلاغ الإلكتروني_
        `.trim();
    }

    async sendViaWhatsApp(message) {
        return new Promise((resolve) => {
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
            
            // فتح واتساب في نافذة جديدة
            const whatsappWindow = window.open(whatsappURL, '_blank');
            
            // التحقق مما إذا تم فتح النافذة بنجاح
            setTimeout(() => {
                if (whatsappWindow && !whatsappWindow.closed) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000);
        });
    }

    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            try {
                // إنشاء عنصر نصي مخفي
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                textarea.style.left = '-999999px';
                textarea.style.top = '-999999px';
                document.body.appendChild(textarea);
                
                // تحديد النص ونسخه
                textarea.select();
                textarea.setSelectionRange(0, 99999); // للجوال
                
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (success) {
                    resolve(true);
                } else {
                    reject(new Error('فشل في نسخ النص'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // دالة لاختبار الاتصال
    async testConnection() {
        try {
            const testMessage = "🔧 *اختبار نظام الإبلاغ*\nهذه رسالة اختبار من نظام الإبلاغ عن المشاكل التقنية.\nالوقت: " + new Date().toLocaleString('ar-SA');
            return await this.sendViaWhatsApp(testMessage);
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    // دالة للحصول على حالة النظام
    getSystemStatus() {
        return {
            phoneNumber: this.phoneNumber,
            hasClipboardSupport: !!document.execCommand,
            timestamp: new Date().toLocaleString('ar-SA')
        };
    }
}

// جعل الكلاس متاحاً عالمياً
window.WhatsAppSender = WhatsAppSender;
console.log('✅ تم تحميل نظام إرسال واتساب بنجاح');
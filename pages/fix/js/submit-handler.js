// js/submit-handler.js - نظام معالجة إرسال النماذج
console.log('🚀 تحميل نظام معالجة الإرسال...');

class SubmitHandler {
    constructor() {
        this.validator = new FormValidator();
        this.supabase = window.supabase.createClient(
            'https://vktcvkwqszehgmhqjrkb.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
        );
    }

    // معالجة إرسال نموذج الهاتف
    async handlePhoneSubmit(formData) {
        try {
            // التحقق من البيانات
            const validation = this.validator.validatePhoneForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة: ' + JSON.stringify(validation.errors));
            }

            // إعداد بيانات الإرسال
            const submissionData = {
                device_type: 'phone',
                phone_type: formData.phoneType,
                brand: formData.phoneBrand,
                problem_type: formData.phoneProblemType,
                description: formData.phoneDescription,
                is_urgent: formData.phoneUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // الإرسال إلى Supabase
            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ عطل الهاتف بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ الهاتف:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // معالجة إرسال نموذج البرج
    async handleTowerSubmit(formData) {
        try {
            const validation = this.validator.validateTowerForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة');
            }

            const submissionData = {
                device_type: 'tower',
                tower_type: formData.towerType,
                tower_height: formData.towerHeight,
                problem_type: formData.towerProblemType,
                description: formData.towerDescription,
                is_urgent: formData.towerUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ عطل البرج بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ البرج:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // معالجة إرسال نموذج القمر الصناعي
    async handleSatelliteSubmit(formData) {
        try {
            const validation = this.validator.validateSatelliteForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة');
            }

            const submissionData = {
                device_type: 'satellite',
                satellite_type: formData.satelliteType,
                brand: formData.satelliteBrand,
                problem_type: formData.satelliteProblemType,
                description: formData.satelliteDescription,
                is_urgent: formData.satelliteUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ عطل القمر الصناعي بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ القمر الصناعي:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // معالجة إرسال نموذج الشبكة اللاسلكية
    async handleWirelessSubmit(formData) {
        try {
            const validation = this.validator.validateWirelessForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة');
            }

            const submissionData = {
                device_type: 'wireless',
                wireless_type: formData.wirelessType,
                brand: formData.wirelessBrand,
                problem_type: formData.wirelessProblemType,
                description: formData.wirelessDescription,
                is_urgent: formData.wirelessUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ عطل الشبكة اللاسلكية بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ الشبكة اللاسلكية:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // معالجة إرسال نموذج الفاكس
    async handleFaxSubmit(formData) {
        try {
            const validation = this.validator.validateFaxForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة');
            }

            const submissionData = {
                device_type: 'fax',
                fax_type: formData.faxType,
                brand: formData.faxBrand,
                problem_type: formData.faxProblemType,
                description: formData.faxDescription,
                is_urgent: formData.faxUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ عطل الفاكس بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ الفاكس:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // معالجة إرسال نموذج الأعطال الأخرى
    async handleOtherTelecomSubmit(formData) {
        try {
            const validation = this.validator.validateOtherTelecomForm(formData);
            if (!validation.isValid) {
                throw new Error('البيانات غير صالحة');
            }

            const submissionData = {
                device_type: 'other',
                other_device_type: formData.otherDeviceType,
                brand: formData.otherBrand,
                problem_type: formData.otherProblemType,
                description: formData.otherDescription,
                is_urgent: formData.otherUrgent || false,
                station: formData.station,
                reporter: formData.reporter,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('telecom_failures')
                .insert([submissionData])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: 'تم إرسال بلاغ العطل بنجاح!'
            };

        } catch (error) {
            console.error('❌ خطأ في إرسال بلاغ العطل:', error);
            return {
                success: false,
                message: 'فشل في إرسال البلاغ: ' + error.message
            };
        }
    }

    // عرض رسالة النجاح أو الفشل
    showMessage(message, isSuccess = true) {
        // إنشاء عنصر الرسالة
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${isSuccess ? 'success' : 'danger'} alert-dismissible fade show`;
        messageElement.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // إضافة الرسالة إلى أعلى الصفحة
        const container = document.querySelector('.main-content-with-sidebar');
        if (container) {
            container.insertBefore(messageElement, container.firstChild);
            
            // إزالة الرسالة تلقائياً بعد 5 ثواني
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    // إعادة تعيين النموذج
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.validator.resetValidation(formId);
        }
    }
}

// جعل الكلاس متاحاً عالمياً
window.SubmitHandler = SubmitHandler;
console.log('✅ تم تحميل نظام معالجة الإرسال بنجاح');
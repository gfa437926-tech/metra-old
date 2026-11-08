// supabase-config.js - ملف تهيئة Supabase للنشرات الزراعية
console.log('🔧 تحميل إعدادات Supabase للنشرات الزراعية...');

// معلومات اتصال Supabase
const SUPABASE_CONFIG = {
    url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
};

// تهيئة Supabase Client
let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ تم تهيئة عميل Supabase');
} catch (error) {
    console.error('❌ فشل تهيئة عميل Supabase:', error);
    supabaseClient = null;
}

// اختبار الاتصال
async function testSupabaseConnection() {
    try {
        console.log('🔗 اختبار اتصال Supabase...');
        
        if (!supabaseClient) {
            console.warn('⚠️ عميل Supabase غير مهيئ');
            return false;
        }
        
        const { data, error } = await supabaseClient
            .from('agricultural_reports')
            .select('id')
            .limit(1);
        
        if (error) {
            // تجاهل خطأ date_format المحدد
            if (error.message.includes('date_format')) {
                console.log('✅ اتصال Supabase نشط (مشكلة في عمود date_format فقط)');
                return true;
            }
            
            // تجاهل خطأ عدم وجود الجدول
            if (error.message.includes('does not exist') || error.code === 'PGRST116') {
                console.log('✅ اتصال Supabase نشط (الجدول غير موجود بعد)');
                return true;
            }
            
            console.warn('⚠️ تحذير في الاتصال بـ Supabase:', error.message);
            return false;
        }
        
        console.log('✅ اتصال Supabase ناجح');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في اتصال Supabase:', error);
        return false;
    }
}

// تهيئة الاتصال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async function() {
    const isConnected = await testSupabaseConnection();
    
    if (isConnected) {
        console.log('🌱 جاهز للربط مع قاعدة البيانات الزراعية');
        
        // تحديث حالة الاتصال في الواجهة
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show';
        notification.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
        notification.innerHTML = `
            <i class="fas fa-database me-2"></i>
            متصل بقاعدة البيانات الزراعية
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            notification.remove();
        }, 5000);
    } else {
        console.warn('⚠️ الاتصال بقاعدة البيانات محدود، سيتم حفظ البيانات محلياً');
        
        // عرض تحذير للمستخدم
        const warning = document.createElement('div');
        warning.className = 'alert alert-warning alert-dismissible fade show';
        warning.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
        warning.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            الاتصال بقاعدة البيانات محدود، سيتم حفظ البيانات محلياً لحين استعادة الاتصال
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(warning);
    }
});

// وظائف مساعدة للتعامل مع Supabase
const SupabaseHelper = {
    // حفظ التقرير
    async saveReport(reportData) {
        try {
            if (!supabaseClient) {
                throw new Error('عميل Supabase غير مهيئ');
            }
            
            // إزالة date_format إذا كان موجوداً
            if (reportData.date_format) {
                delete reportData.date_format;
                console.log('🔧 تم إزالة date_format من البيانات قبل الإرسال');
            }
            
            const { data, error } = await supabaseClient
                .from('agricultural_reports')
                .insert([reportData])
                .select();
            
            if (error) {
                // معالجة خطأ date_format بشكل خاص
                if (error.message.includes('date_format')) {
                    console.log('🔄 معالجة خطأ date_format...');
                    
                    // إزالة date_format ومحاولة مرة أخرى
                    const cleanedData = { ...reportData };
                    delete cleanedData.date_format;
                    
                    const { data: retryData, error: retryError } = await supabaseClient
                        .from('agricultural_reports')
                        .insert([cleanedData])
                        .select();
                    
                    if (retryError) throw retryError;
                    return { success: true, data: retryData };
                }
                throw error;
            }
            
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ خطأ في حفظ التقرير:', error);
            return { success: false, error };
        }
    },
    
    // جلب التقارير
    async getReports(filters = {}) {
        try {
            if (!supabaseClient) {
                throw new Error('عميل Supabase غير مهيئ');
            }
            
            let query = supabaseClient
                .from('agricultural_reports')
                .select('*');
            
            // تطبيق الفلاتر
            if (filters.station) {
                query = query.eq('station', filters.station);
            }
            
            if (filters.user_id) {
                query = query.eq('user_id', filters.user_id);
            }
            
            if (filters.startDate && filters.endDate) {
                query = query.gte('report_date', filters.startDate)
                           .lte('report_date', filters.endDate);
            }
            
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            
            // الترتيب حسب التاريخ
            query = query.order('created_at', { ascending: false });
            
            const { data, error } = await query;
            
            if (error) {
                // تجاهل أخطاء date_format عند جلب البيانات
                if (error.message.includes('date_format')) {
                    console.log('⚠️ تحذير: مشكلة في عمود date_format، إرجاع البيانات المتاحة');
                    
                    // محاولة جلب البيانات بدون عمود date_format
                    const { data: fallbackData, error: fallbackError } = await supabaseClient
                        .from('agricultural_reports')
                        .select('id,user_id,user_name,station,report_date,status')
                        .order('created_at', { ascending: false });
                    
                    if (fallbackError) throw fallbackError;
                    return { success: true, data: fallbackData };
                }
                throw error;
            }
            
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ خطأ في جلب التقارير:', error);
            return { success: false, error };
        }
    },
    
    // تحديث التقرير
    async updateReport(reportId, updates) {
        try {
            if (!supabaseClient) {
                throw new Error('عميل Supabase غير مهيئ');
            }
            
            // إزالة date_format إذا كان موجوداً
            if (updates.date_format) {
                delete updates.date_format;
            }
            
            const { data, error } = await supabaseClient
                .from('agricultural_reports')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', reportId)
                .select();
            
            if (error) throw error;
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ خطأ في تحديث التقرير:', error);
            return { success: false, error };
        }
    },
    
    // حذف التقرير
    async deleteReport(reportId) {
        try {
            if (!supabaseClient) {
                throw new Error('عميل Supabase غير مهيئ');
            }
            
            const { error } = await supabaseClient
                .from('agricultural_reports')
                .delete()
                .eq('id', reportId);
            
            if (error) throw error;
            return { success: true };
            
        } catch (error) {
            console.error('❌ خطأ في حذف التقرير:', error);
            return { success: false, error };
        }
    },
    
    // جلب تقرير واحد
    async getReportById(reportId) {
        try {
            if (!supabaseClient) {
                throw new Error('عميل Supabase غير مهيئ');
            }
            
            const { data, error } = await supabaseClient
                .from('agricultural_reports')
                .select('*')
                .eq('id', reportId)
                .single();
            
            if (error) throw error;
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ خطأ في جلب التقرير:', error);
            return { success: false, error };
        }
    }
};

// جعل المتغيرات والدوال متاحة عالمياً
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.supabaseClient = supabaseClient;
window.SupabaseHelper = SupabaseHelper;

console.log('✅ إعدادات Supabase جاهزة للاستخدام');
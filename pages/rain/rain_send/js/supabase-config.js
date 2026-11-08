// js/supabase-config.js
console.log('🔧 تحميل إعدادات Supabase...');

// إعدادات Supabase
const SUPABASE_CONFIG = {
    url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o',
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
};

// تهيئة Supabase العميل
let supabase;

try {
    // تحميل مكتبة Supabase إذا لم تكن موجودة
    if (typeof createClient === 'undefined') {
        console.log('⚠️ مكتبة Supabase غير محملة، تأكد من إضافة السكريبت');
    }
    
    // إنشاء العميل
    supabase = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey,
        SUPABASE_CONFIG.options
    );
    
    // حفظ في النافذة العالمية
    window.supabase = supabase;
    console.log('✅ تم إنشاء عميل Supabase جديد');
    
    // اختبار الاتصال
    testSupabaseConnection();
    
} catch (error) {
    console.error('❌ خطأ في تهيئة Supabase:', error);
    window.supabase = null;
}

// دالة اختبار الاتصال
async function testSupabaseConnection() {
    try {
        console.log('🔗 اختبار اتصال Supabase...');
        
        const { data, error } = await supabase
            .from('rainfall_reports')
            .select('count', { count: 'exact', head: true })
            .limit(1);
        
        if (error) {
            console.warn('⚠️ تحذير في اختبار الاتصال:', error.message);
            console.log('🎯 يمكن استخدام النظام في وضع التجربة');
            return false;
        } else {
            console.log('✅ اتصال Supabase ناجح');
            return true;
        }
        
    } catch (error) {
        console.warn('⚠️ فشل اختبار الاتصال:', error.message);
        console.log('🎯 سيتم استخدام وضع التجربة كبديل');
        return false;
    }
}

// دالة تحويل التاريخ إلى تنسيق ميلادي
function formatDateForSupabase(date) {
    if (!date) return null;
    
    try {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (error) {
        console.error('❌ خطأ في تحويل التاريخ:', error);
        return null;
    }
}

// دالة للتحقق من بيانات المستخدم
function getUserInfo() {
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            return JSON.parse(userData);
        }
        
        // بيانات افتراضية إذا لم يكن هناك مستخدم
        return {
            id: 'temp-user-' + Date.now(),
            name: 'مستخدم النظام',
            station: 'المحطة الرئيسية',
            role: 'الراصد الجوي',
            email: 'temp@example.com'
        };
    } catch (error) {
        console.error('❌ خطأ في جلب معلومات المستخدم:', error);
        return {
            id: 'error-user',
            name: 'مستخدم النظام',
            station: 'المحطة الرئيسية',
            role: 'الراصد الجوي'
        };
    }
}

// دالة لتحويل التاريخ إلى تنسيق ميلادي مقروء
function formatDateReadable(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// تصدير الوظائف
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.formatDateForSupabase = formatDateForSupabase;
window.formatDateReadable = formatDateReadable;
window.getUserInfo = getUserInfo;

console.log('✅ تم تحميل إعدادات Supabase بنجاح');
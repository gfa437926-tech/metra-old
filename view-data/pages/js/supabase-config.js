// js/supabase-config.js - ملف موحد لتهيئة Supabase
console.log('🔧 تحميل إعدادات Supabase...');

const SUPABASE_CONFIG = {
    url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
};

// عميل Supabase العالمي
let supabaseClient = null;

function initializeSupabase() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    try {
        console.log('🔧 جاري تهيئة Supabase...');
        
        if (typeof window.supabase === 'undefined') {
            console.error('❌ مكتبة Supabase غير محملة');
            return null;
        }
        
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url, 
            SUPABASE_CONFIG.anonKey,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true
                },
                db: {
                    schema: 'public'
                }
            }
        );
        console.log('✅ تم تهيئة Supabase بنجاح');
        return supabaseClient;
    } catch (error) {
        console.error('❌ فشل تهيئة Supabase:', error);
        return null;
    }
}

// دالة مساعدة للتحقق من الاتصال
async function testSupabaseConnection() {
    try {
        const supabase = initializeSupabase();
        if (!supabase) return false;
        
        const { data, error } = await supabase
            .from('agricultural_reports')
            .select('count')
            .limit(1);
            
        return !error;
    } catch (error) {
        console.error('❌ فشل اختبار الاتصال:', error);
        return false;
    }
}

// جعل الدوال متاحة عالمياً
window.initializeSupabase = initializeSupabase;
window.testSupabaseConnection = testSupabaseConnection;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('✅ تم تحميل إعدادات Supabase بنجاح');
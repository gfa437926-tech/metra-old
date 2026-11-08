// js/supabase-config.js - ملف تهيئة Supabase
console.log('🔧 تحميل إعدادات Supabase...');

// إعدادات Supabase
const SUPABASE_CONFIG = {
    url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
};

// تهيئة Supabase
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// جعل supabase متاحًا globally
window.supabase = supabase;

console.log('✅ تم تهيئة Supabase بنجاح');
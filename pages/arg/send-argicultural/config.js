// js/config.js - ملف الإعدادات العامة
window.CONFIG = {
    APP: {
        name: "نظام إدارة البيانات الجوية",
        version: "1.0.0",
        author: "المديرية العامة للأرصاد الجوية",
        year: new Date().getFullYear()
    },
    
    SUPABASE: {
        url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
    },
    
    RAINFALL: {
        minRainAmount: 0,
        maxRainAmount: 1000,
        minSnowAmount: 0,
        maxSnowAmount: 500,
        observationTimes: ['00', '06', '12', '18'],
        stationTypes: ['آلي', 'يدوي', 'رادار', 'أخرى'],
        weatherConditions: [
            'مشمس', 'غائم جزئياً', 'غائم', 'ممطر', 
            'ثلجي', 'ممطر وثلجي', 'عاصف', 'ضباب', 'أخرى'
        ]
    },
    
    STORAGE: {
        maxLocalReports: 100,
        maxDrafts: 20,
        syncInterval: 300000, // 5 دقائق
        backupInterval: 3600000 // ساعة
    }
};

console.log('⚙️ تم تحميل إعدادات النظام');
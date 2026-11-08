// config.js - ملف الإعدادات العامة
window.CONFIG = {
    SUPABASE: {
        url: 'https://vktcvkwqszehgmhqjrkb.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGN2a3dxc3plaGdtaHFqcmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3NTEsImV4cCI6MjA3Nzc0Nzc1MX0.KTX1c8BAJpy1Jp3-IDXFRqb4Jo7SLabiwICBtn_mR5o'
    },
    
    PATHS: {
        HOURLY_REPORTS: 'pages/hourly/hourly_send/hourly_reports.html',
        DAILY_REPORTS: 'pages/daily/daily_send/daily.html',
        RAINFALL_REPORTS: 'pages/rain/rain_send/rainfall_reports.html',
        CLIMATE_HOURLY: 'pages/h_climate/h_climate_send/climate_hourly_reports.html',
        SOIL_TEMPERATURE: 'pages/soil/soil_send/soil-send.html',
        AGRICULTURAL_REPORTS: 'pages/arg/send-argicultural/agricultural_reports.html',
        FIX_EQUIPMENT: 'pages/fix/fix.html',
        FIX_TELECOMM: 'pages/fix/fix-tel.html',
        SOFTWARE_ISSUES: 'pages/software/software_issues.html'
    },
    
    WEATHER_STATIONS: [
        'محطة دمشق',
        'محطة حلب',
        'محطة اللاذقية',
        'محطة طرطوس',
        'محطة حمص',
        'محطة حماه',
        'محطة دير الزور',
        'محطة الحسكة',
        'محطة الرقة',
        'محطة السويداء',
        'محطة درعا',
        'محطة القنيطرة',
        'محطة إدلب'
    ],
    
    USER_ROLES: [
        'راصد جوي',
        'رئيس محطة',
        'مدير مركز',
        'مدير النظام',
        'رئيس الاتصالات',
        'رئيس الورشات',
        'مدقق'
    ],

    // أنواع الأعطال
    FAILURE_TYPES: {
        PHONE: 'phone',
        TOWER: 'tower',
        SATELLITE: 'satellite',
        WIRELESS: 'wireless',
        FAX: 'fax',
        COMPUTER: 'computer',
        LAPTOP: 'laptop',
        PRINTER: 'printer',
        NETWORK: 'network',
        OTHER: 'other'
    },

    // حالات البلاغ
    REPORT_STATUS: {
        PENDING: 'معلق',
        IN_PROGRESS: 'قيد المراجعة',
        RESOLVED: 'تم الإصلاح',
        CANCELLED: 'ملغي'
    },

    // إعدادات التطبيق
    APP_SETTINGS: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        AUTO_LOGOUT_MINUTES: 60,
        ITEMS_PER_PAGE: 10
    }
};

// دالة مساعدة للحصول على المسارات
window.getSystemPath = function(pathKey) {
    return window.CONFIG.PATHS[pathKey] || '';
};

// دالة للحصول على إعدادات Supabase
window.getSupabaseConfig = function() {
    return window.CONFIG.SUPABASE;
};

// دالة للحصول على أنواع الأعطال
window.getFailureTypes = function() {
    return window.CONFIG.FAILURE_TYPES;
};

// دالة للحصول على حالات البلاغ
window.getReportStatus = function() {
    return window.CONFIG.REPORT_STATUS;
};

console.log('✅ تم تحميل إعدادات النظام');
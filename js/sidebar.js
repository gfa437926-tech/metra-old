// js/sidebar.js - نظام القائمة الجانبية الموحد مع المسارات الجديدة
console.log('📁 تحميل القائمة الجانبية الموحدة...');

class SidebarManager {
    constructor() {
        this.currentUser = null;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadSidebarMenu();
        this.setupEventListeners();
    }

    loadUserData() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('✅ تم تحميل بيانات المستخدم:', this.currentUser.email);
            } else {
                console.warn('⚠️ لا توجد بيانات مستخدم، سيتم التوجيه لصفحة تسجيل الدخول');
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
            this.redirectToLogin();
        }
    }

    loadSidebarMenu() {
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (!sidebarMenu || !this.currentUser) return;

        const userRole = this.currentUser.role;
        
        // الحصول على عناصر القائمة حسب الدور
        let menuItems = this.getMenuItemsByRole(userRole);
        
        // بناء القائمة
        const menuHTML = menuItems.map(item => {
            if (item.action === 'logout') {
                return `
                    <li class="nav-item mt-3">
                        <a class="nav-link d-flex align-items-center text-danger logout-btn" href="#" onclick="event.preventDefault(); sidebarManager.logout();">
                            <i class="${item.icon} me-2"></i> ${item.text}
                        </a>
                    </li>
                `;
            }
            
            const isActive = this.isCurrentPage(item.href) ? 'active' : '';
            return `
                <li class="nav-item mb-2">
                    <a class="nav-link d-flex align-items-center ${isActive}" href="${item.href}" onclick="sidebarManager.handleNavigation(event, '${item.href}')">
                        <i class="${item.icon} me-2"></i> ${item.text}
                    </a>
                </li>
            `;
        }).join('');
        
        sidebarMenu.innerHTML = menuHTML;
    }

    getMenuItemsByRole(role) {
        // العناصر الأساسية للجميع
        const baseItems = [
            { 
                icon: 'fas fa-tachometer-alt', 
                text: 'لوحة التحكم', 
                href: '../../main.html' 
            }
        ];
        
        // عناصر حسب الدور
        const roleSpecificItems = [];
        
        if (role === 'مدير النظام') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-crown', 
                    text: 'لوحة المدير', 
                    href: '../managers/manager-dashboard.html' 
                }
            );
        }
        
        if (role === 'رئيس محطة') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-user-tie', 
                    text: 'إدارة المحطة', 
                    href: '../managers/station-manager.html' 
                }
            );
        }
        
        if (role === 'مدير مركز') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-user-cog', 
                    text: 'إدارة المركز', 
                    href: '../managers/center-manager.html' 
                }
            );
        }
        
        if (role === 'مبرمج الدعم الفني') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-laptop-code', 
                    text: 'إدارة الدعم الفني', 
                    href: '../managers/it-manager.html' // الصفة الجديدة
                }
            );
        }
        
        if (role === 'رئيس الاتصالات') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-phone-alt', 
                    text: 'إدارة الاتصالات', 
                    href: '../managers/telecom-manager.html' 
                }
            );
        }
        
        if (role === 'رئيس الورشات') {
            roleSpecificItems.push(
                { 
                    icon: 'fas fa-tools', 
                    text: 'إدارة الورشات', 
                    href: '../managers/workshop-manager.html' 
                }
            );
        }
        
        // عناصر التقارير (للجميع)
        const reportItems = [
            { 
                icon: 'fas fa-clock', 
                text: 'النشرات الساعية', 
                href: '../pages/hourly/hourly_send/hourly_reports.html' 
            },
            { 
                icon: 'fas fa-wind', 
                text: 'المناخ الساعي', 
                href: '../pages/h_climate/h_climate_send/h_climate_send.html' 
            },
            { 
                icon: 'fas fa-calendar-day', 
                text: 'النشرات اليومية', 
                href: '../pages/daily/daily_send/daily.html' 
            },
            { 
                icon: 'fas fa-cloud-rain', 
                text: 'النشرات المطرية', 
                href: '../pages/rain/rain_send/rainfall_reports.html' 
            },
            { 
                icon: 'fas fa-mountain', 
                text: 'حرارة التربة', 
                href: '../pages/soil/soil_send/soil-send.html' 
            },
            { 
                icon: 'fas fa-seedling', 
                text: 'النشرات الزراعية', 
                href: '../pages/arg/send-argicultural/agricultural_reports.html'
            }
        ];
        
        // عناصر الدعم الفني (للجميع)
        const supportItems = [
            { 
                icon: 'fas fa-tools', 
                text: 'أعطال الرصد', 
                href: '../pages/fix/fix.html' 
            },
            { 
                icon: 'fas fa-phone-alt', 
                text: 'أعطال الاتصالات', 
                href: '../pages/fix/fix-tel.html'
            },
            { 
                icon: 'fas fa-laptop-code', 
                text: 'أعطال البرامج (IT)', 
                href: '../pages/fix/it.html' 
            }
        ];
        
        // تجميع جميع العناصر
        const allItems = [
            ...baseItems,
            ...roleSpecificItems,
            ...reportItems,
            ...supportItems,
            { 
                icon: 'fas fa-sign-out-alt', 
                text: 'تسجيل الخروج', 
                action: 'logout' 
            }
        ];
        
        return allItems;
    }

    getCurrentPage() {
        // الحصول على اسم الصفحة الحالية
        try {
            if (window.parent && window.parent.location) {
                const parentPath = window.parent.location.pathname;
                return parentPath.split('/').pop() || 'main.html';
            }
        } catch (e) {
            // إذا لم نستطع الوصول للصفحة الأم
            const path = window.location.pathname;
            return path.split('/').pop() || 'main.html';
        }
        return 'main.html';
    }

    isCurrentPage(href) {
        const hrefPage = href.split('/').pop();
        const currentPage = this.getCurrentPage();
        return hrefPage === currentPage;
    }

    handleNavigation(event, href) {
        event.preventDefault();
        console.log('🧭 التوجيه إلى:', href);
        
        // التحقق من وجود الملف أولاً
        fetch(href, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    this.navigateToPage(href);
                } else {
                    console.error('❌ الملف غير موجود:', href);
                    this.showAlert(`الملف غير موجود: ${href}`, 'error');
                }
            })
            .catch(error => {
                console.error('❌ خطأ في التحقق من الملف:', error);
                this.showAlert(`حدث خطأ في الوصول إلى: ${href}`, 'error');
            });
    }

    navigateToPage(href) {
        // إذا كنا في iframe، نوجه الصفحة الأم
        if (window !== window.parent) {
            try {
                window.parent.location.href = href;
            } catch (e) {
                // إذا فشل التوجيه للصفحة الأم، نوجه الصفحة الحالية
                window.location.href = href;
            }
        } else {
            window.location.href = href;
        }
        
        // إغلاق القائمة الجانبية على الجوال
        this.closeMobileSidebar();
    }

    setupEventListeners() {
        // إضافة أي event listeners إضافية هنا
    }

    closeMobileSidebar() {
        // إغلاق القائمة الجانبية على الجوال
        if (window.parent && window.parent.closeMobileSidebar) {
            window.parent.closeMobileSidebar();
        }
    }

    logout() {
        console.log('🚪 جاري تسجيل الخروج...');
        localStorage.removeItem('currentUser');
        
        // إذا كنا في iframe، نوجه الصفحة الأم
        if (window !== window.parent) {
            try {
                window.parent.location.href = '../index.html';
            } catch (e) {
                window.location.href = '../index.html';
            }
        } else {
            window.location.href = '../index.html';
        }
    }

    redirectToLogin() {
        if (window !== window.parent) {
            try {
                window.parent.location.href = '../index.html';
            } catch (e) {
                window.location.href = '../index.html';
            }
        } else {
            window.location.href = '../index.html';
        }
    }

    showAlert(message, type = 'info') {
        // استخدام alert بسيط أو عرض رسالة في الصفحة الأم
        if (window.parent && window.parent.showAlert) {
            window.parent.showAlert(message, type);
        } else {
            alert(message);
        }
    }
}

// إنشاء نسخة عامة من المدير
const sidebarManager = new SidebarManager();
window.sidebarManager = sidebarManager;

console.log('✅ تم تحميل القائمة الجانبية الموحدة بنجاح');
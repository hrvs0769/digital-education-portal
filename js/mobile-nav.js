/**
 * 移动端导航菜单组件
 * 通用的移动端导航功能，可在所有页面中使用
 */

class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // 获取当前页面
    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        return fileName.replace('.html', '');
    }

    // 创建移动端导航HTML
    createMobileNavHTML() {
        const navigationItems = [
            { id: 'index', icon: 'fas fa-home', label: '首页', href: 'index.html' },
            { id: 'courses', icon: 'fas fa-graduation-cap', label: '系列课程', href: 'courses.html' },
            { id: 'course-collection', icon: 'fas fa-th-large', label: '课程合集', href: 'course-collection.html' },
            { id: 'knowledge', icon: 'fas fa-book', label: '知识成果', href: 'knowledge.html' },
            { id: 'notes', icon: 'fas fa-sticky-note', label: '学习笔记', href: 'notes.html' },
            { id: 'favorites', icon: 'fas fa-heart', label: '我的收藏', href: 'favorites.html' },
            { id: 'dashboard', icon: 'fas fa-chart-line', label: '学习中心', href: 'dashboard.html' }
        ];

        const navItemsHTML = navigationItems.map(item => {
            const isActive = this.currentPage === item.id || 
                           (this.currentPage === '' && item.id === 'index');
            const activeClass = isActive ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:bg-gray-50';
            
            return `
                <a href="${item.href}" class="flex items-center px-4 py-3 ${activeClass} rounded-lg transition-colors">
                    <i class="${item.icon} mr-3 w-5"></i>${item.label}
                </a>
            `;
        }).join('');

        return `
            <div id="mobile-menu" class="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none md:hidden">
                <div class="bg-white w-80 h-full shadow-2xl transform transition-transform duration-300 -translate-x-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-2xl font-black text-gradient">数字教育门户</h2>
                            <button id="mobile-menu-close" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <nav class="space-y-2">
                            ${navItemsHTML}
                        </nav>
                        
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <div id="mobile-user-info" class="hidden">
                                <div class="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-4">
                                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 mobile-user-avatar">U</div>
                                    <div>
                                        <div class="font-semibold mobile-user-name">用户</div>
                                        <div class="text-sm text-gray-600">已登录</div>
                                    </div>
                                </div>
                                <button id="mobile-logout-btn" class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="fas fa-sign-out-alt mr-2"></i>登出
                                </button>
                            </div>
                            <div id="mobile-login-section">
                                <button id="mobile-login-btn" class="w-full btn-primary text-white px-4 py-3 rounded-lg font-semibold">
                                    <i class="fas fa-sign-in-alt mr-2"></i>登录
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 初始化移动端导航
    init() {
        // 创建移动端导航菜单
        const mobileNavHTML = this.createMobileNavHTML();
        
        // 插入到页面中
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.insertAdjacentHTML('afterend', mobileNavHTML);
        }

        // 绑定事件
        this.bindEvents();
        
        // 监听用户状态变化
        this.listenUserStateChanges();
    }

    // 绑定事件
    bindEvents() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

        // 打开菜单按钮
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => this.openMenu());
        }

        // 关闭菜单按钮
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => this.closeMenu());
        }

        // 点击背景关闭菜单
        if (mobileMenu) {
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.closeMenu();
                }
            });
        }

        // 移动端登录按钮
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    this.triggerLogin();
                }, 300);
            });
        }

        // 移动端登出按钮
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    this.triggerLogout();
                }, 300);
            });
        }

        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    // 打开菜单
    openMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuContent = mobileMenu.querySelector('div:first-child');
        
        mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
        mobileMenu.classList.add('pointer-events-auto', 'opacity-100');
        
        setTimeout(() => {
            mobileMenuContent.classList.remove('-translate-x-full');
        }, 50);
        
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    // 关闭菜单
    closeMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuContent = mobileMenu.querySelector('div:first-child');
        
        mobileMenuContent.classList.add('-translate-x-full');
        
        setTimeout(() => {
            mobileMenu.classList.add('pointer-events-none', 'opacity-0');
            mobileMenu.classList.remove('pointer-events-auto', 'opacity-100');
        }, 300);
        
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    // 更新用户状态显示
    updateUserState() {
        const mobileUserInfo = document.getElementById('mobile-user-info');
        const mobileLoginSection = document.getElementById('mobile-login-section');
        const mobileUserAvatar = document.querySelector('.mobile-user-avatar');
        const mobileUserName = document.querySelector('.mobile-user-name');

        if (window.userStateManager && window.userStateManager.isLoggedIn) {
            const user = window.userStateManager.currentUser;
            mobileUserInfo.classList.remove('hidden');
            mobileLoginSection.classList.add('hidden');

            if (user) {
                mobileUserAvatar.textContent = user.username ? user.username.charAt(0).toUpperCase() : 'U';
                mobileUserName.textContent = user.displayName || user.username || '用户';
            }
        } else {
            mobileUserInfo.classList.add('hidden');
            mobileLoginSection.classList.remove('hidden');
        }
    }

    // 监听用户状态变化
    listenUserStateChanges() {
        if (window.userStateManager) {
            window.userStateManager.onLogin(() => this.updateUserState());
            window.userStateManager.onLogout(() => this.updateUserState());
            // 初始化时更新状态
            this.updateUserState();
        }

        // 定期检查用户状态管理器是否已初始化
        const checkUserState = () => {
            if (window.userStateManager && !this.userStateListenerSet) {
                window.userStateManager.onLogin(() => this.updateUserState());
                window.userStateManager.onLogout(() => this.updateUserState());
                this.updateUserState();
                this.userStateListenerSet = true;
            }
        };

        // 延迟检查，确保其他脚本已加载
        setTimeout(checkUserState, 100);
        setTimeout(checkUserState, 500);
        setTimeout(checkUserState, 1000);
    }

    // 触发登录（需要页面自己实现）
    triggerLogin() {
        if (typeof openLoginModal === 'function') {
            openLoginModal();
        } else if (typeof window.openLoginModal === 'function') {
            window.openLoginModal();
        } else {
            // 如果没有登录模态框，跳转到登录页面
            window.location.href = 'register.html';
        }
    }

    // 触发登出（需要页面自己实现）
    triggerLogout() {
        if (window.userStateManager) {
            window.userStateManager.logout();
            this.showNotification('已成功退出登录', 'info');
        } else if (typeof logout === 'function') {
            logout();
        } else if (typeof window.logout === 'function') {
            window.logout();
        }
    }

    // 显示通知（如果页面有通知系统）
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else if (window.PortalUtils && typeof window.PortalUtils.showNotification === 'function') {
            window.PortalUtils.showNotification(message, type);
        }
    }
}

// 自动初始化移动端导航
document.addEventListener('DOMContentLoaded', function() {
    // 确保在DOM加载完成后初始化
    setTimeout(() => {
        if (!window.mobileNavigation) {
            window.mobileNavigation = new MobileNavigation();
        }
    }, 100);
});

// 导出类供其他模块使用
window.MobileNavigation = MobileNavigation;
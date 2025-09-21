// 通用JavaScript功能文件

// 全局用户状态管理系统
class UserStateManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.loginCallbacks = [];
        this.logoutCallbacks = [];
        this.init();
    }

    init() {
        // 从localStorage加载用户状态
        this.loadUserState();
        // 监听storage事件，实现跨页面状态同步
        window.addEventListener('storage', (e) => {
            if (e.key === 'isLoggedIn' || e.key === 'currentUser') {
                this.loadUserState();
                this.updateUI();
            }
        });
        // 页面加载时更新UI
        document.addEventListener('DOMContentLoaded', () => {
            this.updateUI();
        });
    }

    loadUserState() {
        const savedUser = localStorage.getItem('currentUser');
        const loginStatus = localStorage.getItem('isLoggedIn');
        
        this.isLoggedIn = loginStatus === 'true';
        if (savedUser && this.isLoggedIn) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            this.currentUser = null;
            this.isLoggedIn = false;
        }
    }

    login(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        
        // 保存到localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // 触发登录回调
        this.loginCallbacks.forEach(callback => callback(userData));
        
        // 更新UI
        this.updateUI();
        
        return true;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // 清除localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        // 触发登出回调
        this.logoutCallbacks.forEach(callback => callback());
        
        // 更新UI
        this.updateUI();
        
        return true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserLoggedIn() {
        return this.isLoggedIn;
    }

    updateUI() {
        // 更新登录按钮状态
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        
        if (loginBtn && userProfile) {
            if (this.isLoggedIn && this.currentUser) {
                loginBtn.classList.add('hidden');
                userProfile.classList.remove('hidden');
                userProfile.classList.add('flex');
                
                // 更新用户信息显示
                const userNameSpans = userProfile.querySelectorAll('.user-name');
                const userAvatars = userProfile.querySelectorAll('.user-avatar');
                
                userNameSpans.forEach(span => {
                    span.textContent = this.currentUser.username || this.currentUser.realName || '用户';
                });
                
                userAvatars.forEach(avatar => {
                    const firstChar = (this.currentUser.username || this.currentUser.realName || '用').charAt(0);
                    avatar.textContent = firstChar;
                });
            } else {
                loginBtn.classList.remove('hidden');
                userProfile.classList.add('hidden');
                userProfile.classList.remove('flex');
            }
        }
        
        // 更新所有页面的用户信息显示
        this.updateUserInfoDisplay();
    }

    updateUserInfoDisplay() {
        if (!this.isLoggedIn || !this.currentUser) return;
        
        // 更新所有用户名显示
        const userNameElements = document.querySelectorAll('.user-display-name');
        userNameElements.forEach(element => {
            element.textContent = this.currentUser.username || this.currentUser.realName || '用户';
        });
        
        // 更新所有用户头像
        const userAvatarElements = document.querySelectorAll('.user-display-avatar');
        userAvatarElements.forEach(element => {
            const firstChar = (this.currentUser.username || this.currentUser.realName || '用').charAt(0);
            element.textContent = firstChar;
        });
    }

    onLogin(callback) {
        this.loginCallbacks.push(callback);
    }

    onLogout(callback) {
        this.logoutCallbacks.push(callback);
    }

    // 检查是否需要登录，如果未登录则跳转到登录页面
    requireLogin(redirectUrl = null) {
        if (!this.isLoggedIn) {
            if (redirectUrl) {
                localStorage.setItem('redirectAfterLogin', redirectUrl);
            }
            // 可以选择显示登录模态框或跳转到登录页面
            this.showLoginModal();
            return false;
        }
        return true;
    }

    showLoginModal() {
        // 如果首页的登录模态框存在，则显示它
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            const form = document.getElementById('loginForm');
            if (form) {
                setTimeout(() => {
                    form.classList.remove('scale-95', 'opacity-0');
                    form.classList.add('scale-100', 'opacity-100');
                }, 50);
            }
        } else {
            // 如果没有模态框，跳转到首页
            window.location.href = 'index.html';
        }
    }
}

// 创建全局用户状态管理实例
const userStateManager = new UserStateManager();

// 平滑滚动功能
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// 移动端导航切换
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.toggle('hidden');
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    const body = document.body;
    body.classList.add('opacity-0');
    setTimeout(() => {
        body.classList.remove('opacity-0');
        body.classList.add('transition-opacity', 'duration-500', 'opacity-100');
    }, 100);

    // 添加返回顶部按钮
    createBackToTopButton();
    
    // 初始化所有动画元素
    initializeAnimations();
});

// 创建返回顶部按钮
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 opacity-0 pointer-events-none';
    backToTopBtn.id = 'back-to-top';
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopBtn);
    
    // 滚动显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100');
        }
    });
}

// 初始化动画
function initializeAnimations() {
    // 观察器用于触发滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });

    // 观察所有需要动画的元素
    document.querySelectorAll('.card-hover, .lesson-item, .publication-item').forEach(el => {
        observer.observe(el);
    });
}

// 通知功能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    // 根据类型设置样式
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// 模拟登录功能（已废弃，使用userStateManager.login代替）
function simulateLogin(username, password) {
    if (!username || !password) {
        showNotification('请输入用户名和密码', 'warning');
        return false;
    }
    
    showNotification('正在登录...', 'info');
    
    setTimeout(() => {
        // 创建用户数据
        const userData = {
            username: username,
            email: username.includes('@') ? username : `${username}@example.com`,
            loginTime: new Date().toISOString()
        };
        
        // 使用全局状态管理器登录
        userStateManager.login(userData);
        showNotification('登录成功！', 'success');
        
        // 检查是否有重定向URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        }
    }, 1000);
    
    return true;
}

// 更新登录状态（已废弃，使用userStateManager代替）
function updateLoginStatus(isLoggedIn) {
    // 这个函数保留是为了向后兼容，实际使用userStateManager.updateUI()
    if (userStateManager) {
        userStateManager.updateUI();
    }
}

// 搜索功能增强
function enhanceSearch(searchInputId, itemsSelector, searchFields) {
    const searchInput = document.getElementById(searchInputId);
    const items = document.querySelectorAll(itemsSelector);
    
    if (!searchInput || items.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        items.forEach(item => {
            let found = false;
            
            searchFields.forEach(field => {
                const element = item.querySelector(field);
                if (element && element.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            if (found || searchTerm === '') {
                item.style.display = 'block';
                item.classList.remove('opacity-50');
            } else {
                item.style.display = 'none';
            }
        });
        
        // 显示搜索结果统计
        const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
        updateSearchResults(visibleItems.length, items.length);
    });
}

// 更新搜索结果统计
function updateSearchResults(visible, total) {
    let resultsDiv = document.getElementById('search-results');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'search-results';
        resultsDiv.className = 'text-sm text-gray-600 mt-4';
        document.querySelector('.container').appendChild(resultsDiv);
    }
    
    if (visible === total) {
        resultsDiv.textContent = '';
    } else {
        resultsDiv.textContent = `找到 ${visible} 项结果，共 ${total} 项`;
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 收藏管理系统
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.init();
    }

    init() {
        this.loadFavorites();
    }

    // 加载收藏数据
    loadFavorites() {
        const savedFavorites = localStorage.getItem('courseFavorites');
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
        }
    }

    // 保存收藏数据
    saveFavorites() {
        localStorage.setItem('courseFavorites', JSON.stringify(this.favorites));
    }

    // 添加收藏
    addFavorite(courseData) {
        const existingIndex = this.favorites.findIndex(fav => fav.id === courseData.id);
        if (existingIndex === -1) {
            const favoriteItem = {
                ...courseData,
                favoriteAt: new Date().toISOString()
            };
            this.favorites.unshift(favoriteItem);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    // 移除收藏
    removeFavorite(courseId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(fav => fav.id !== courseId);
        if (this.favorites.length < initialLength) {
            this.saveFavorites();
            return true;
        }
        return false;
    }

    // 检查是否已收藏
    isFavorite(courseId) {
        return this.favorites.some(fav => fav.id === courseId);
    }

    // 切换收藏状态
    toggleFavorite(courseData) {
        if (this.isFavorite(courseData.id)) {
            return this.removeFavorite(courseData.id) ? 'removed' : 'error';
        } else {
            return this.addFavorite(courseData) ? 'added' : 'error';
        }
    }

    // 获取所有收藏
    getAllFavorites() {
        return [...this.favorites];
    }

    // 获取收藏数量
    getCount() {
        return this.favorites.length;
    }

    // 清空收藏
    clearAll() {
        this.favorites = [];
        this.saveFavorites();
    }

    // 搜索收藏
    searchFavorites(query) {
        if (!query.trim()) {
            return this.getAllFavorites();
        }
        
        const lowercaseQuery = query.toLowerCase();
        return this.favorites.filter(fav => {
            return fav.title.toLowerCase().includes(lowercaseQuery) ||
                   (fav.description && fav.description.toLowerCase().includes(lowercaseQuery)) ||
                   (fav.category && fav.category.toLowerCase().includes(lowercaseQuery));
        });
    }
}

// 全局收藏管理器实例
const favoritesManager = new FavoritesManager();

// 导出常用功能供其他页面使用
window.PortalUtils = {
    smoothScroll,
    toggleMobileNav,
    showNotification,
    simulateLogin,
    enhanceSearch,
    debounce,
    throttle,
    // 新增的全局状态管理
    userStateManager,
    // 快速访问用户状态的函数
    getCurrentUser: () => userStateManager.getCurrentUser(),
    isUserLoggedIn: () => userStateManager.isUserLoggedIn(),
    requireLogin: (redirectUrl) => userStateManager.requireLogin(redirectUrl),
    login: (userData) => userStateManager.login(userData),
    logout: () => userStateManager.logout(),
    // 收藏管理功能
    favoritesManager,
    // 快速访问收藏功能的函数
    addToFavorites: (courseData) => favoritesManager.addFavorite(courseData),
    removeFromFavorites: (courseId) => favoritesManager.removeFavorite(courseId),
    toggleFavorite: (courseData) => favoritesManager.toggleFavorite(courseData),
    isFavorite: (courseId) => favoritesManager.isFavorite(courseId),
    getFavorites: () => favoritesManager.getAllFavorites(),
    getFavoritesCount: () => favoritesManager.getCount()
};
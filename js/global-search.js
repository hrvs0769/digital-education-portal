/**
 * 全局搜索系统
 * 支持跨页面的课程、知识成果、笔记搜索功能
 */

class GlobalSearchSystem {
    constructor() {
        this.searchData = {
            courses: [],
            knowledge: [],
            notes: [],
            users: []
        };
        this.searchHistory = this.loadSearchHistory();
        this.init();
    }

    // 初始化搜索系统
    init() {
        this.loadSearchData();
        this.createSearchInterface();
        this.bindEvents();
    }

    // 加载搜索数据
    loadSearchData() {
        // 模拟课程数据
        this.searchData.courses = [
            {
                id: 'machine-learning-fundamentals',
                title: '机器学习基础',
                description: '学习机器学习的核心概念和算法，掌握数据驱动的决策方法和实际应用。',
                category: '人工智能',
                level: '初级',
                duration: '12小时',
                rating: 4.8,
                students: 1200,
                tags: ['机器学习', '人工智能', 'Python', '数据科学'],
                url: 'course-detail.html?course=machine-learning-fundamentals',
                type: 'course'
            },
            {
                id: 'react-development',
                title: 'React开发实战',
                description: '深入学习React框架，构建现代化的用户界面，掌握组件化开发思想。',
                category: 'Web开发',
                level: '中级',
                duration: '16小时',
                rating: 4.7,
                students: 980,
                tags: ['React', 'JavaScript', 'Web开发', '前端'],
                url: 'course-detail.html?course=react-development',
                type: 'course'
            },
            {
                id: 'ui-ux-design',
                title: 'UI/UX设计原理',
                description: '掌握用户界面和用户体验设计的核心原理和方法，提升设计思维。',
                category: '设计',
                level: '初级',
                duration: '14小时',
                rating: 4.9,
                students: 1100,
                tags: ['UI设计', 'UX设计', '用户体验', '界面设计'],
                url: 'course-detail.html?course=ui-ux-design',
                type: 'course'
            },
            {
                id: 'python-data-analysis',
                title: 'Python数据分析',
                description: '使用Python进行数据分析，掌握pandas、numpy等数据处理工具。',
                category: '数据科学',
                level: '中级',
                duration: '18小时',
                rating: 4.8,
                students: 1500,
                tags: ['Python', '数据分析', 'Pandas', 'NumPy'],
                url: 'course-detail.html?course=python-data-analysis',
                type: 'course'
            },
            {
                id: 'digital-resource-development',
                title: '数字资源开发基础',
                description: '学习数字资源开发的基本技能，掌握多媒体内容创作与管理。',
                category: '数字教育',
                level: '初级',
                duration: '20小时',
                rating: 4.8,
                students: 1200,
                tags: ['数字资源', '多媒体', '内容创作'],
                url: 'course-detail.html?course=digital-resource-development',
                type: 'course'
            },
            {
                id: 'flutter-development',
                title: 'Flutter跨平台开发',
                description: '学习Flutter框架，开发iOS和Android应用。',
                category: '移动开发',
                level: '中级',
                duration: '20小时',
                rating: 4.6,
                students: 890,
                tags: ['Flutter', '移动开发', 'Dart', '跨平台'],
                url: 'course-detail.html?course=flutter-development',
                type: 'course'
            }
        ];

        // 模拟知识成果数据
        this.searchData.knowledge = [
            {
                id: 'knowledge-1',
                title: 'AI在教育中的应用研究报告',
                description: '深入分析人工智能技术在教育领域的应用现状、挑战和发展趋势。',
                category: '研究报告',
                author: '张教授',
                date: '2024-12-01',
                tags: ['人工智能', '教育技术', '研究报告'],
                url: 'knowledge.html#knowledge-1',
                type: 'knowledge'
            },
            {
                id: 'knowledge-2',
                title: '数字化学习平台设计指南',
                description: '提供数字化学习平台设计的最佳实践和设计原则。',
                category: '设计指南',
                author: '李专家',
                date: '2024-11-15',
                tags: ['平台设计', '用户体验', '学习系统'],
                url: 'knowledge.html#knowledge-2',
                type: 'knowledge'
            }
        ];

        // 从localStorage加载用户笔记
        const savedNotes = localStorage.getItem('learningNotes');
        if (savedNotes) {
            this.searchData.notes = JSON.parse(savedNotes);
        }
    }

    // 创建搜索界面
    createSearchInterface() {
        // 检查是否已存在搜索界面
        if (document.getElementById('global-search-modal')) {
            return;
        }

        const searchModalHTML = `
            <div id="global-search-modal" class="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div class="flex items-start justify-center min-h-screen p-4 pt-20">
                    <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl transform transition-transform duration-300 scale-95">
                        <div class="p-6">
                            <!-- 搜索头部 -->
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-2xl font-bold text-gray-900">全局搜索</h2>
                                <button id="close-search-modal" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <!-- 搜索输入 -->
                            <div class="relative mb-6">
                                <input type="text" id="global-search-input" 
                                       placeholder="搜索课程、知识成果、学习笔记..." 
                                       class="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg">
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <i class="fas fa-search text-gray-400 text-lg"></i>
                                </div>
                                <button id="clear-search" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hidden">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <!-- 搜索筛选 -->
                            <div class="flex items-center space-x-3 mb-6">
                                <span class="text-sm font-medium text-gray-700">筛选：</span>
                                <button class="search-filter-btn active px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all" data-type="all">
                                    全部
                                </button>
                                <button class="search-filter-btn px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all" data-type="course">
                                    课程
                                </button>
                                <button class="search-filter-btn px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all" data-type="knowledge">
                                    知识成果
                                </button>
                                <button class="search-filter-btn px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all" data-type="notes">
                                    学习笔记
                                </button>
                            </div>
                            
                            <!-- 搜索结果 -->
                            <div id="search-results" class="max-h-96 overflow-y-auto">
                                <!-- 初始状态 -->
                                <div id="search-initial" class="text-center py-12">
                                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-search text-gray-400 text-2xl"></i>
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-2">开始搜索</h3>
                                    <p class="text-gray-600 mb-6">输入关键词搜索课程、知识成果或学习笔记</p>
                                    
                                    <!-- 搜索历史 -->
                                    <div id="search-history" class="text-left">
                                        <h4 class="text-sm font-medium text-gray-700 mb-3">最近搜索</h4>
                                        <div id="search-history-list" class="flex flex-wrap gap-2">
                                            <!-- 搜索历史项会动态添加 -->
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 搜索结果列表 -->
                                <div id="search-results-list" class="hidden space-y-4">
                                    <!-- 搜索结果会动态添加 -->
                                </div>
                                
                                <!-- 无结果状态 -->
                                <div id="search-no-results" class="hidden text-center py-12">
                                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-search-minus text-gray-400 text-2xl"></i>
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-2">未找到结果</h3>
                                    <p class="text-gray-600">尝试使用不同的关键词或调整筛选条件</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', searchModalHTML);
    }

    // 绑定事件
    bindEvents() {
        // 绑定全局快捷键 Ctrl/Cmd + K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
        });

        // 搜索按钮（如果页面中有的话）
        const searchButtons = document.querySelectorAll('[data-search="global"]');
        searchButtons.forEach(button => {
            button.addEventListener('click', () => this.openSearchModal());
        });

        // 模态框事件
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-search-modal') {
                this.closeSearchModal();
            }
            if (e.target.id === 'global-search-modal') {
                this.closeSearchModal();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearchModal();
            }
        });
    }

    // 打开搜索模态框
    openSearchModal() {
        const modal = document.getElementById('global-search-modal');
        const content = modal.querySelector('div > div');
        
        modal.classList.remove('pointer-events-none', 'opacity-0');
        modal.classList.add('pointer-events-auto', 'opacity-100');
        
        setTimeout(() => {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 50);
        
        // 聚焦搜索输入
        setTimeout(() => {
            document.getElementById('global-search-input').focus();
        }, 200);
        
        // 绑定模态框内的事件
        this.bindModalEvents();
        
        // 显示搜索历史
        this.displaySearchHistory();
        
        document.body.style.overflow = 'hidden';
    }

    // 关闭搜索模态框
    closeSearchModal() {
        const modal = document.getElementById('global-search-modal');
        const content = modal.querySelector('div > div');
        
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        
        setTimeout(() => {
            modal.classList.add('pointer-events-none', 'opacity-0');
            modal.classList.remove('pointer-events-auto', 'opacity-100');
        }, 150);
        
        document.body.style.overflow = '';
        
        // 清空搜索输入
        document.getElementById('global-search-input').value = '';
        this.resetSearchResults();
    }

    // 绑定模态框内的事件
    bindModalEvents() {
        const searchInput = document.getElementById('global-search-input');
        const clearButton = document.getElementById('clear-search');
        const filterButtons = document.querySelectorAll('.search-filter-btn');

        // 搜索输入事件
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                clearButton.classList.remove('hidden');
                this.performSearch(query);
            } else {
                clearButton.classList.add('hidden');
                this.resetSearchResults();
            }
        });

        // 清空按钮
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.classList.add('hidden');
            this.resetSearchResults();
            searchInput.focus();
        });

        // 筛选按钮
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });
        });

        // 回车键搜索
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.addToSearchHistory(query);
                    this.performSearch(query);
                }
            }
        });
    }

    // 执行搜索
    performSearch(query) {
        const activeFilter = document.querySelector('.search-filter-btn.active')?.getAttribute('data-type') || 'all';
        const results = this.search(query, activeFilter);
        this.displaySearchResults(results, query);
    }

    // 搜索功能
    search(query, type = 'all') {
        const searchTerm = query.toLowerCase();
        let results = [];

        // 搜索函数
        const searchInData = (data, itemType) => {
            return data.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(searchTerm);
                const descMatch = item.description?.toLowerCase().includes(searchTerm);
                const categoryMatch = item.category?.toLowerCase().includes(searchTerm);
                const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
                
                return titleMatch || descMatch || categoryMatch || tagsMatch;
            }).map(item => ({ ...item, type: itemType }));
        };

        // 根据类型筛选
        if (type === 'all' || type === 'course') {
            results = results.concat(searchInData(this.searchData.courses, 'course'));
        }
        if (type === 'all' || type === 'knowledge') {
            results = results.concat(searchInData(this.searchData.knowledge, 'knowledge'));
        }
        if (type === 'all' || type === 'notes') {
            results = results.concat(searchInData(this.searchData.notes, 'notes'));
        }

        // 按相关性排序
        results.sort((a, b) => {
            const aRelevance = this.calculateRelevance(a, searchTerm);
            const bRelevance = this.calculateRelevance(b, searchTerm);
            return bRelevance - aRelevance;
        });

        return results;
    }

    // 计算搜索相关性
    calculateRelevance(item, searchTerm) {
        let score = 0;
        const title = item.title.toLowerCase();
        const description = item.description?.toLowerCase() || '';
        
        // 标题完全匹配
        if (title === searchTerm) score += 100;
        // 标题开头匹配
        else if (title.startsWith(searchTerm)) score += 50;
        // 标题包含
        else if (title.includes(searchTerm)) score += 30;
        
        // 描述匹配
        if (description.includes(searchTerm)) score += 10;
        
        // 标签匹配
        if (item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) {
            score += 20;
        }

        return score;
    }

    // 显示搜索结果
    displaySearchResults(results, query) {
        const initialDiv = document.getElementById('search-initial');
        const resultsDiv = document.getElementById('search-results-list');
        const noResultsDiv = document.getElementById('search-no-results');

        initialDiv.classList.add('hidden');

        if (results.length === 0) {
            resultsDiv.classList.add('hidden');
            noResultsDiv.classList.remove('hidden');
            return;
        }

        noResultsDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        
        resultsDiv.innerHTML = results.map(item => this.createResultItem(item, query)).join('');
        
        // 绑定结果项点击事件
        resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                if (url) {
                    this.closeSearchModal();
                    window.location.href = url;
                }
            });
        });
    }

    // 创建搜索结果项
    createResultItem(item, query) {
        const typeIcons = {
            course: 'fas fa-graduation-cap',
            knowledge: 'fas fa-book',
            notes: 'fas fa-sticky-note'
        };

        const typeLabels = {
            course: '课程',
            knowledge: '知识成果',
            notes: '学习笔记'
        };

        // 高亮搜索词
        const highlightText = (text) => {
            if (!text) return '';
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>');
        };

        return `
            <div class="search-result-item p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all" data-url="${item.url}">
                <div class="flex items-start space-x-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="${typeIcons[item.type]} text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <h3 class="font-semibold text-gray-900">${highlightText(item.title)}</h3>
                            <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">${typeLabels[item.type]}</span>
                        </div>
                        <p class="text-gray-600 text-sm mb-2">${highlightText(item.description || '')}</p>
                        <div class="flex items-center space-x-4 text-xs text-gray-500">
                            ${item.category ? `<span><i class="fas fa-tag mr-1"></i>${item.category}</span>` : ''}
                            ${item.level ? `<span><i class="fas fa-signal mr-1"></i>${item.level}</span>` : ''}
                            ${item.duration ? `<span><i class="fas fa-clock mr-1"></i>${item.duration}</span>` : ''}
                            ${item.rating ? `<span><i class="fas fa-star mr-1"></i>${item.rating}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 重置搜索结果
    resetSearchResults() {
        document.getElementById('search-initial').classList.remove('hidden');
        document.getElementById('search-results-list').classList.add('hidden');
        document.getElementById('search-no-results').classList.add('hidden');
        this.displaySearchHistory();
    }

    // 添加到搜索历史
    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        // 添加到开头
        this.searchHistory.unshift(query);
        // 限制历史记录数量
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        this.saveSearchHistory();
    }

    // 显示搜索历史
    displaySearchHistory() {
        const historyContainer = document.getElementById('search-history-list');
        
        if (this.searchHistory.length === 0) {
            document.getElementById('search-history').style.display = 'none';
            return;
        }
        
        document.getElementById('search-history').style.display = 'block';
        historyContainer.innerHTML = this.searchHistory.map(query => `
            <button class="search-history-item px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors" data-query="${query}">
                ${query}
            </button>
        `).join('');
        
        // 绑定历史记录点击事件
        historyContainer.querySelectorAll('.search-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.getAttribute('data-query');
                document.getElementById('global-search-input').value = query;
                this.performSearch(query);
            });
        });
    }

    // 保存搜索历史
    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    // 加载搜索历史
    loadSearchHistory() {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // 清空搜索历史
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.displaySearchHistory();
    }
}

// 全局快速搜索功能（在导航栏中使用）
function addGlobalSearchToNavigation() {
    // 为导航栏添加搜索按钮
    const navSearchHTML = `
        <button id="nav-search-btn" class="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" data-search="global">
            <i class="fas fa-search text-gray-600"></i>
            <span class="text-gray-600 text-sm">搜索 (Ctrl+K)</span>
        </button>
    `;
    
    // 查找导航栏并添加搜索按钮
    const navContainer = document.querySelector('nav');
    if (navContainer && !document.getElementById('nav-search-btn')) {
        navContainer.insertAdjacentHTML('beforeend', navSearchHTML);
    }
}

// 自动初始化全局搜索系统
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他组件已加载
    setTimeout(() => {
        if (!window.globalSearchSystem) {
            window.globalSearchSystem = new GlobalSearchSystem();
            addGlobalSearchToNavigation();
        }
    }, 500);
});

// 导出类供其他模块使用
window.GlobalSearchSystem = GlobalSearchSystem;
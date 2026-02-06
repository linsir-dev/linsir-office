// 新闻页面专用脚本

// 初始化标签切换功能
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签的active类
            tabBtns.forEach(b => {
                b.classList.remove('active');
                const indicator = b.querySelector('.tab-indicator');
                if (indicator) {
                    indicator.style.transform = 'scaleX(0)';
                }
            });
            
            // 添加当前标签的active类
            this.classList.add('active');
            const indicator = this.querySelector('.tab-indicator');
            if (!indicator) {
                // 如果没有指示器，创建一个
                const newIndicator = document.createElement('span');
                newIndicator.className = 'tab-indicator absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full';
                this.appendChild(newIndicator);
                // 触发动画
                setTimeout(() => {
                    newIndicator.style.transform = 'scaleX(1)';
                }, 10);
            } else {
                indicator.style.transform = 'scaleX(1)';
            }
            
            // 筛选新闻卡片
            const tab = this.dataset.tab;
            
            newsCards.forEach(card => {
                if (tab === 'all' || card.dataset.category === tab) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 初始化分页功能
function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有分页按钮的active类
            pageBtns.forEach(b => {
                b.classList.remove('bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-white');
                b.classList.add('border', 'border-gray-700', 'text-gray-400');
            });
            
            // 添加当前分页按钮的active类
            this.classList.remove('border', 'border-gray-700', 'text-gray-400');
            this.classList.add('bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-white');
            
            // 这里可以添加加载新页面内容的逻辑
            // 模拟加载效果
            const newsList = document.querySelector('.news-list');
            newsList.style.opacity = '0.7';
            
            setTimeout(() => {
                newsList.style.opacity = '1';
                // 实际项目中这里会通过AJAX加载新内容
            }, 500);
        });
    });
}

// 初始化卡片动画
function initCardAnimations() {
    const newsCards = document.querySelectorAll('.news-card');
    
    // 观察器配置
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // 创建观察器
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有新闻卡片
    newsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// 初始化函数，供components.js调用
function initializeNews() {
    // 初始化标签切换
    initTabSwitching();
    
    // 初始化分页功能
    initPagination();
    
    // 初始化卡片动画
    initCardAnimations();
    
    console.log('News page initialized');
}

// 暴露初始化函数给全局
window.initializeNews = initializeNews;
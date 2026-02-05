// 初始化函数，在组件加载完成后调用
function initializeMain() {
    // 语言切换功能
    function initializeLanguageSwitch() {
        const langZh = document.getElementById('lang-zh');
        const langEn = document.getElementById('lang-en');
        const langElements = document.querySelectorAll('[data-lang]');
        
        let currentLang = 'zh';
        
        function switchLanguage(lang) {
            currentLang = lang;
            
            // 更新语言按钮状态
            if (langZh && langEn) {
                if (lang === 'zh') {
                    langZh.classList.add('text-primary');
                    langEn.classList.remove('text-primary');
                } else {
                    langEn.classList.add('text-primary');
                    langZh.classList.remove('text-primary');
                }
            }
            
            // 更新页面内容
            langElements.forEach(element => {
                if (element.dataset.lang === lang) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            });
        }
        
        // 只有当元素存在时才添加事件监听器
        if (langZh) {
            langZh.addEventListener('click', () => switchLanguage('zh'));
        }
        if (langEn) {
            langEn.addEventListener('click', () => switchLanguage('en'));
        }
        
        // 初始设置为中文
        switchLanguage('zh');
    }
    
    // 初始化语言切换功能
    initializeLanguageSwitch();
    
    // 移动端菜单
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                // 关闭移动端菜单
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const navLinks = document.querySelectorAll('header nav a');
        const langButtons = document.querySelectorAll('header button');
        const brandNames = document.querySelectorAll('header h1');
        
        if (header) {
            if (window.scrollY > 50) {
                // 下滑时，导航栏颜色变深
                header.classList.add('bg-dark', 'shadow-lg');
                header.classList.remove('bg-transparent');
                
                // 确保导航栏元素颜色为白色，与深色背景对比
                if (navLinks.length > 0) {
                    navLinks.forEach(link => {
                        link.classList.add('text-white');
                    });
                }
                if (langButtons.length > 0) {
                    langButtons.forEach(button => {
                        button.classList.add('text-white');
                    });
                }
                if (brandNames.length > 0) {
                    brandNames.forEach(name => {
                        name.classList.add('text-white');
                    });
                }
            } else {
                // 回到顶部时，导航栏透明
                header.classList.remove('bg-dark', 'shadow-lg');
                header.classList.add('bg-transparent');
                
                // 确保导航栏元素颜色为白色，与轮播图背景对比
                if (navLinks.length > 0) {
                    navLinks.forEach(link => {
                        link.classList.add('text-white');
                    });
                }
                if (langButtons.length > 0) {
                    langButtons.forEach(button => {
                        button.classList.add('text-white');
                    });
                }
                if (brandNames.length > 0) {
                    brandNames.forEach(name => {
                        name.classList.add('text-white');
                    });
                }
            }
        }
    });
    
    // 表单提交
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('留言提交成功！我们会尽快与您联系。');
            this.reset();
        });
    }
    
    // 搜索功能
    const searchToggle = document.getElementById('search-toggle');
    const searchBox = document.getElementById('search-box');
    
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', () => {
            searchBox.classList.toggle('hidden');
        });
        
        // 点击页面其他地方关闭搜索框
        document.addEventListener('click', (e) => {
            if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
                searchBox.classList.add('hidden');
            }
        });
    }
    
    // 登录按钮点击事件（暂时不做具体实现）
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('登录按钮被点击');
            // 暂时不实现登录页面跳转
        });
    }
    
    // 轮播图功能
    function initializeCarousel() {
        const carouselContainer = document.getElementById('carousel-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBars = document.querySelectorAll('.carousel-progress');
        
        if (carouselContainer && prevBtn && nextBtn && progressBars.length > 0) {
            let currentSlide = 0;
            const totalSlides = progressBars.length;
            
            // 重置所有进度条
            function resetAllProgressBars() {
                progressBars.forEach(bar => {
                    bar.style.width = '0%';
                });
            }
            
            // 启动当前进度条动画
        function startProgressAnimation() {
            // 重置所有进度条
            resetAllProgressBars();
            
            // 启动当前进度条动画
            const currentBar = progressBars[currentSlide];
            if (currentBar) {
                // 强制重排
                currentBar.offsetHeight;
                currentBar.style.width = '100%';
            }
        }
            
            // 自动轮播
            let slideInterval = setInterval(nextSlide, 10000);
            
            function updateSlide() {
                carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                // 启动当前进度条动画
                startProgressAnimation();
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlide();
            }
            
            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlide();
            }
            
            // 控制按钮事件
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 10000);
            });
            
            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 10000);
            });
            
            // 进度条点击事件
            progressBars.forEach((bar, index) => {
                bar.parentElement.addEventListener('click', () => {
                    clearInterval(slideInterval);
                    currentSlide = index;
                    updateSlide();
                    slideInterval = setInterval(nextSlide, 10000);
                });
            });
            
            // 初始化
            resetAllProgressBars();
            startProgressAnimation();
        }
    }
    
    // 初始化轮播图
    initializeCarousel();
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    console.log('LinTranscend Tech Website Loaded');
    // 初始化函数，在组件加载完成后调用
    initializeMain();
});

// 导出初始化函数，供components.js调用
if (typeof window !== 'undefined') {
    window.initializeMain = initializeMain;
}

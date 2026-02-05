// 组件加载功能
function loadComponent(elementId, componentUrl) {
    fetch(componentUrl)
        .then(response => response.text())
        .then(html => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                // 加载完成后初始化组件中的事件
                initializeComponents();
            } else {
                console.error('Element not found:', elementId);
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// 初始化组件中的事件
function initializeComponents() {
    // 搜索功能
    const searchToggle = document.getElementById('search-toggle');
    const searchBox = document.getElementById('search-box');
    
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', function() {
            searchBox.classList.toggle('hidden');
        });
    }
    
    // 登录功能
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    

    // 移动端菜单
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 调用main.js中的初始化函数
    if (typeof window.initializeMain === 'function') {
        window.initializeMain();
    }
}



// 加载所有组件
function loadAllComponents() {
    loadComponent('header-container', 'inc_header.html');
}

// 页面加载完成后加载组件
window.addEventListener('load', loadAllComponents);

// 组件加载功能
function loadComponent(elementId, componentUrl) {
    fetch(componentUrl)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
            // 加载完成后初始化组件中的事件
            initializeComponents();
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// 初始化组件中的事件
function initializeComponents() {
    // 调用main.js中的初始化函数
    if (typeof window.initializeMain === 'function') {
        window.initializeMain();
    }
}



// 加载所有组件
function loadAllComponents() {
    loadComponent('header-container', 'inc_header.html');
    loadComponent('footer-container', 'inc_footer.html');
}

// 页面加载完成后加载组件
window.addEventListener('load', loadAllComponents);

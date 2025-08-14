document.addEventListener('DOMContentLoaded', () => {
    // ==================== 元素获取 ====================
    const appContainer = document.querySelector('.app-container');
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const openSidebarTriggers = document.querySelectorAll('.js-open-sidebar');
    const contactTabs = document.querySelectorAll('.contact-tab-btn');
    const tabContents = document.querySelectorAll('.contact-tab-content');
    const timeElement = document.getElementById('status-bar-time');
    const batteryLiquid = document.getElementById('battery-capsule-liquid');
    const batteryLevelText = document.getElementById('battery-capsule-level');
    const batteryCapsule = document.getElementById('battery-capsule');
    const sidebarProfileLink = document.getElementById('sidebar-profile-link');
    const userSettingsPage = document.getElementById('page-user-settings');
    const userSettingsBackBtn = document.getElementById('user-settings-back-btn');


    // ==================== 底部导航切换逻辑 ====================
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ==================== 侧边栏交互逻辑 ====================
    const openSidebar = () => {
        appContainer.classList.add('sidebar-open');
    };

    const closeSidebar = () => {
        appContainer.classList.remove('sidebar-open');
    };

    openSidebarTriggers.forEach(trigger => {
        trigger.addEventListener('click', openSidebar);
    });

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // ==================== 联系人页面 Tab 切换逻辑 ====================
    contactTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            contactTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ==================== 实时时钟逻辑 ====================
    function updateClock() {
        const beijingTime = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Shanghai',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        if (timeElement) {
            timeElement.textContent = beijingTime;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ==================== 实时电池胶囊逻辑 (逆向版) ====================
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            
            function updateBatteryStatus() {
                const level = Math.round(battery.level * 100);
                batteryLevelText.textContent = level;
                const drainedLevel = 100 - level;
                batteryLiquid.style.width = `${drainedLevel}%`;
            }

            updateBatteryStatus();
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    } else {
        if(batteryCapsule) {
            batteryCapsule.style.display = 'none';
        }
    }

    // ==================== 用户设置页面交互逻辑 (滑动版) ====================
    if (sidebarProfileLink && userSettingsPage) {
        sidebarProfileLink.addEventListener('click', () => {
            // [MODIFIED] 恢复使用 setTimeout 来协调动画
            closeSidebar();
            setTimeout(() => {
                userSettingsPage.classList.add('active');
            }, 0); // 短暂延迟，让侧边栏先开始关闭动画
        });
    }

    if (userSettingsBackBtn && userSettingsPage) {
        userSettingsBackBtn.addEventListener('click', () => {
            // [MODIFIED] 恢复使用 setTimeout 来协调动画
            userSettingsPage.classList.remove('active');
            setTimeout(() => {
                openSidebar();
            }, 0); // 短暂延迟，让设置页先开始关闭动画
        });
    }
});
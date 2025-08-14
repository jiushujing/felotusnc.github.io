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
    
    // 用户设置页面
    const sidebarProfileLink = document.getElementById('sidebar-profile-link');
    const userSettingsPage = document.getElementById('page-user-settings');
    const userSettingsBackBtn = document.getElementById('user-settings-back-btn');
    const userSettingsSaveBtn = document.getElementById('user-settings-save-btn');
    const inputName = document.getElementById('input-name');
    const inputGender = document.getElementById('input-gender');
    const inputBirthday = document.getElementById('input-birthday');
    const inputAge = document.getElementById('input-age');
    const textareaSettings = document.getElementById('textarea-settings');
    const inputSignature = document.getElementById('input-signature');

    // 数据管理页面
    const sidebarDataLink = document.getElementById('sidebar-data-link');
    const dataManagementPage = document.getElementById('page-data-management');
    const dataManagementBackBtn = document.getElementById('data-management-back-btn');
    const exportBtn = document.getElementById('btn-export-data');
    const importBtn = document.getElementById('btn-import-data');
    const importFileInput = document.getElementById('import-file-input');

    // ======== 新增: API 设置页面元素 ========
    const sidebarApiLink = document.getElementById('sidebar-api-link');
    const apiSettingsPage = document.getElementById('page-api-settings');
    const apiSettingsBackBtn = document.getElementById('api-settings-back-btn');
    const apiSettingsForm = document.getElementById('api-settings-form');
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const fetchModelsButton = document.getElementById('fetch-models-button');
    const btnOpenAI = document.getElementById('btn-openai');
    const btnGemini = document.getElementById('btn-gemini');
    const openaiModelsGroup = document.getElementById('openai-models');
    const geminiModelsGroup = document.getElementById('gemini-models');
    // =======================================

    // 模态框元素
    const modalContainer = document.getElementById('modal-container');
    const weatherModal = document.getElementById('weather-modal');
    const locationModal = document.getElementById('location-modal');
    const statusModal = document.getElementById('status-modal');
    const openWeatherModalBtn = document.getElementById('btn-open-weather-modal');
    const openLocationModalBtn = document.getElementById('btn-open-location-modal');
    const headerStatusTrigger = document.getElementById('header-status-trigger');
    const headerStatusText = document.getElementById('header-status-text');
    const weatherOptionsGrid = document.getElementById('weather-options-grid');
    const locationCardsContainer = document.getElementById('location-cards-container');
    const statusOptionsGrid = document.getElementById('status-options-grid');
    const addLocationBtn = document.getElementById('btn-add-location');
    const closeButtons = document.querySelectorAll('.modal-close-btn');

    // 头部弹出菜单元素
    const headerPlusBtn = document.getElementById('header-plus-btn');
    const headerPopoverMenu = document.getElementById('header-popover-menu');

    // ==================== 数据结构与本地存储 ====================
    const STORAGE_KEY = 'felotusAppData';
    let appData = {};

    const initialData = {
        userProfile: {
            gender: '女'
        },
        weather: {
            options: ['☀️', '⛅️', '☁️', '🌧', '❄️', '⚡️'],
            selected: '☀️'
        },
        locations: [],
        status: {
            options: ['在线', '离开', '请勿打扰', '听歌中', 'emo中', '恋爱中', '睡觉中'],
            selected: '在线'
        }
    };

    function saveData() {
        appData.userProfile = {
            name: inputName.value,
            gender: inputGender.value,
            birthday: inputBirthday.value,
            age: inputAge.value,
            settings: textareaSettings.value,
            signature: inputSignature.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }

    function loadData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                appData = Object.assign({}, initialData, parsedData);
                appData.userProfile = Object.assign({}, initialData.userProfile, parsedData.userProfile);
                appData.weather = Object.assign({}, initialData.weather, parsedData.weather);
                appData.status = Object.assign({}, initialData.status, parsedData.status);
            } catch (e) {
                appData = initialData;
            }
        } else {
            appData = initialData;
        }
        
        const profile = appData.userProfile;
        inputName.value = profile.name || '';
        inputGender.value = profile.gender || initialData.userProfile.gender;
        inputBirthday.value = profile.birthday || '';
        inputAge.value = profile.age || '';
        textareaSettings.value = profile.settings || '';
        inputSignature.value = profile.signature || '';
        
        updateHeaderStatus();
        renderWeatherOptions();
        renderLocationCards();
        renderStatusOptions();
    }

    [inputName, inputGender, inputBirthday, inputAge, textareaSettings, inputSignature].forEach(input => {
        input.addEventListener('input', saveData);
    });

    // ==================== 消息页头部 '+' 按钮菜单逻辑 ====================
    if (headerPlusBtn && headerPopoverMenu) {
        headerPlusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            headerPopoverMenu.classList.toggle('visible');
        });

        document.addEventListener('click', (e) => {
            if (!headerPopoverMenu.contains(e.target) && !headerPlusBtn.contains(e.target)) {
                headerPopoverMenu.classList.remove('visible');
            }
        });
    }

    // ==================== 模态框 (Modal) 核心逻辑 ====================
    function openModal(modalElement) {
        modalContainer.classList.add('visible');
        modalElement.classList.add('visible');
    }

    function closeModal() {
        modalContainer.classList.remove('visible');
        [weatherModal, locationModal, statusModal].forEach(m => m.classList.remove('visible'));
    }

    if(openWeatherModalBtn) openWeatherModalBtn.addEventListener('click', () => openModal(weatherModal));
    if(openLocationModalBtn) openLocationModalBtn.addEventListener('click', () => openModal(locationModal));
    if(headerStatusTrigger) headerStatusTrigger.addEventListener('click', () => openModal(statusModal));
    if(closeButtons) closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    if(modalContainer) modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) closeModal();
    });

    // ==================== 状态面板逻辑 (终极双Span精准换行版) ====================
    function updateHeaderStatus() {
        if(headerStatusText) headerStatusText.textContent = appData.status.selected;
    }

    function renderStatusOptions() {
        if(!statusOptionsGrid) return;
        statusOptionsGrid.innerHTML = '';
        let longPressTimer;

        appData.status.options.forEach(statusText => {
            const btn = document.createElement('button');
            btn.className = 'status-option-btn';

            btn.innerHTML = ''; 
            const line1 = document.createElement('span');
            const line2 = document.createElement('span');

            if (statusText.length > 4) {
                line1.textContent = statusText.slice(0, 4);
                line2.textContent = statusText.slice(4);
            } else {
                line1.textContent = statusText;
            }

            btn.appendChild(line1);
            if (line2.textContent) {
                btn.appendChild(line2);
            }

            if (statusText === appData.status.selected) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                appData.status.selected = statusText;
                saveData();
                updateHeaderStatus();
                renderStatusOptions();
                closeModal();
            });

            const startLongPress = () => {
                longPressTimer = setTimeout(() => {
                    if (confirm(`确定要删除状态 "${statusText}" 吗？`)) {
                        appData.status.options = appData.status.options.filter(s => s !== statusText);
                        if (appData.status.selected === statusText) {
                            appData.status.selected = appData.status.options[0] || '在线';
                        }
                        saveData();
                        updateHeaderStatus();
                        renderStatusOptions();
                    }
                }, 600);
            };
            const cancelLongPress = () => clearTimeout(longPressTimer);
            
            btn.addEventListener('mousedown', startLongPress);
            btn.addEventListener('mouseup', cancelLongPress);
            btn.addEventListener('mouseleave', cancelLongPress);
            btn.addEventListener('touchstart', startLongPress);
            btn.addEventListener('touchend', cancelLongPress);

            statusOptionsGrid.appendChild(btn);
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'status-option-btn add-new';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const newStatus = prompt('请输入新状态');
            
            if (newStatus === null) return;
            if (newStatus.trim() === '') {
                alert('状态不能为空！');
                return;
            }
            if (newStatus.length > 20) {
                alert('状态内容不能超过20个字！');
                return;
            }
            if (appData.status.options.includes(newStatus)) {
                alert('此状态已存在！');
                return;
            }

            appData.status.options.push(newStatus);
            saveData();
            renderStatusOptions();
        });
        statusOptionsGrid.appendChild(addBtn);
    }

    // ==================== 天气面板逻辑 ====================
    function renderWeatherOptions() {
        if(!weatherOptionsGrid) return;
        weatherOptionsGrid.innerHTML = '';
        let longPressTimer;

        appData.weather.options.forEach(icon => {
            const btn = document.createElement('button');
            btn.className = 'weather-option-btn';
            btn.textContent = icon;
            if (icon === appData.weather.selected) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                appData.weather.selected = icon;
                saveData();
                renderWeatherOptions();
            });

            const startLongPress = () => {
                longPressTimer = setTimeout(() => {
                    if (confirm(`确定要删除天气 "${icon}" 吗？`)) {
                        appData.weather.options = appData.weather.options.filter(i => i !== icon);
                        if (appData.weather.selected === icon) {
                            appData.weather.selected = appData.weather.options[0] || null;
                        }
                        saveData();
                        renderWeatherOptions();
                    }
                }, 600);
            };
            const cancelLongPress = () => clearTimeout(longPressTimer);
            
            btn.addEventListener('mousedown', startLongPress);
            btn.addEventListener('mouseup', cancelLongPress);
            btn.addEventListener('mouseleave', cancelLongPress);
            btn.addEventListener('touchstart', startLongPress);
            btn.addEventListener('touchend', cancelLongPress);

            weatherOptionsGrid.appendChild(btn);
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'weather-option-btn add-new';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const newWeather = prompt('请输入天气');
            if (newWeather && !appData.weather.options.includes(newWeather)) {
                appData.weather.options.push(newWeather);
                saveData();
                renderWeatherOptions();
            }
        });
        weatherOptionsGrid.appendChild(addBtn);
    }

    // ==================== 定位面板逻辑 ====================
    function renderLocationCards() {
        if(!locationCardsContainer) return;
        locationCardsContainer.innerHTML = '';
        appData.locations.forEach(location => {
            const card = document.createElement('div');
            card.className = 'location-card';
            card.innerHTML = `
                <div class="input-group">
                    <label for="loc-name-${location.id}">姓名</label>
                    <input type="text" id="loc-name-${location.id}" value="${location.name}" placeholder="例如：用户">
                </div>
                <div class="input-group">
                    <label for="loc-addr-${location.id}">地址</label>
                    <input type="text" id="loc-addr-${location.id}" value="${location.address}" placeholder="在这里输入地址">
                </div>
                <div class="location-card-actions">
                    <button class="location-delete-btn">删除</button>
                    <div class="location-select-indicator">
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
            `;

            const selectIndicator = card.querySelector('.location-select-indicator');
            if (location.selected) {
                selectIndicator.classList.add('selected');
            }

            card.querySelector(`#loc-name-${location.id}`).addEventListener('input', (e) => {
                location.name = e.target.value;
                saveData();
            });
            card.querySelector(`#loc-addr-${location.id}`).addEventListener('input', (e) => {
                location.address = e.target.value;
                saveData();
            });
            
            card.querySelector('.location-delete-btn').addEventListener('click', () => {
                if (confirm(`确定要删除定位 "${location.name || '新定位'}" 吗？`)) {
                    appData.locations = appData.locations.filter(l => l.id !== location.id);
                    saveData();
                    renderLocationCards();
                }
            });

            selectIndicator.addEventListener('click', () => {
                if (location.selected) {
                    location.selected = false;
                } else {
                    appData.locations.forEach(loc => loc.selected = false);
                    location.selected = true;
                }
                saveData();
                renderLocationCards();
            });

            locationCardsContainer.appendChild(card);
        });
    }

    if(addLocationBtn) addLocationBtn.addEventListener('click', () => {
        const newLocation = { id: Date.now(), name: '', address: '', selected: false };
        appData.locations.push(newLocation);
        saveData();
        renderLocationCards();
    });

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
    const openSidebar = () => appContainer.classList.add('sidebar-open');
    const closeSidebar = () => appContainer.classList.remove('sidebar-open');
    openSidebarTriggers.forEach(trigger => trigger.addEventListener('click', openSidebar));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
    
    // ==================== 联系人页面 Tab 切换逻辑 ====================
    if(contactTabs) contactTabs.forEach(tab => {
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
        if(!timeElement) return;
        const beijingTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
        timeElement.textContent = beijingTime;
    }
    
    // ==================== 实时电池胶囊逻辑 ====================
    function setupBatteryIndicator() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                function updateBatteryStatus() {
                    if(!batteryLevelText || !batteryLiquid) return;
                    const level = Math.round(battery.level * 100);
                    batteryLevelText.textContent = level;
                    batteryLiquid.style.width = `${100 - level}%`;
                }
                updateBatteryStatus();
                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
            });
        } else {
            if(batteryCapsule) batteryCapsule.style.display = 'none';
        }
    }
    
    // ==================== 页面切换逻辑 (用户设置 & 数据 & API) ====================
    function setupPageTransition(link, page, onBack) {
        if (link && page) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeSidebar();
                setTimeout(() => page.classList.add('active'), 10);
            });
        }
        const backBtn = page.querySelector('.fa-chevron-left');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                page.classList.remove('active');
                if (onBack) setTimeout(onBack, 10);
            });
        }
    }
    setupPageTransition(sidebarProfileLink, userSettingsPage, openSidebar);
    setupPageTransition(sidebarDataLink, dataManagementPage, openSidebar);
    setupPageTransition(sidebarApiLink, apiSettingsPage, openSidebar); // 新增API页面切换

    // ==================== 保存按钮逻辑 ====================
    if (userSettingsSaveBtn) {
        userSettingsSaveBtn.addEventListener('click', () => {
            saveData();
            alert('设置已保存成功！');
        });
    }

    // ==================== 导入/导出逻辑 ====================
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            saveData(); 
            const jsonString = JSON.stringify(appData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `felotus-data-${Date.now()}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
            alert('数据已成功导出！');
        });
    }

    if (importBtn) importBtn.addEventListener('click', () => importFileInput.click());
    
    if (importFileInput) {
        importFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    appData = Object.assign({}, initialData, importedData);
                    saveData();
                    loadData();
                    alert('数据导入成功！');
                } catch (error) {
                    alert('导入失败，请确保上传的是正确的 JSON 数据文件。');
                } finally {
                    event.target.value = null;
                }
            };
            reader.readAsText(file);
        });
    }

    // ===============================================================
    // =================== 新增: API 设置页面逻辑 ==================
    // ===============================================================
    function setupApiSettingsPage() {
        if (!apiSettingsPage) return;

        let currentApiType = 'openai';
        const defaultModels = {
            openai: { "gpt-3.5-turbo": "GPT-3.5-Turbo" },
            gemini: { "gemini-pro": "Gemini Pro" }
        };
        const SETTINGS_KEY = 'aiChatApiSettings';

        const populateModels = (models, type) => {
            const group = type === 'openai' ? openaiModelsGroup : geminiModelsGroup;
            group.innerHTML = '';
            for (const [id, name] of Object.entries(models)) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                group.appendChild(option);
            }
        };

        const restoreSelection = (modelId) => {
            if (!modelId) return;
            const optionExists = Array.from(modelSelect.options).some(opt => opt.value === modelId);
            if (optionExists) {
                modelSelect.value = modelId;
            }
        };

        const updateApiForm = (apiType) => {
            currentApiType = apiType;
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
            const isGemini = apiType === 'gemini';

            btnOpenAI.classList.toggle('active', !isGemini);
            btnGemini.classList.toggle('active', isGemini);

            openaiModelsGroup.hidden = isGemini;
            geminiModelsGroup.hidden = !isGemini;
            
            apiUrlInput.disabled = isGemini;
            apiUrlInput.value = isGemini ? 'https://generativelanguage.googleapis.com/v1beta' : (settings.openaiApiUrl || '');
            apiKeyInput.value = isGemini ? (settings.geminiApiKey || '') : (settings.openaiApiKey || '');

            apiUrlInput.placeholder = isGemini ? 'Gemini官方地址，无需修改' : '格式参考 https://example.com';
            apiKeyInput.placeholder = isGemini ? 'AIzaSy... (Gemini API Key)' : 'sk-xxxxxxxxxx';
            
            restoreSelection(settings.model);
        };

        const fetchModels = async () => {
            const apiKey = apiKeyInput.value.trim();
            const previouslySelectedModel = modelSelect.value;
            fetchModelsButton.textContent = '正在拉取...';
            fetchModelsButton.disabled = true;

            try {
                if (currentApiType === 'openai') {
                    const baseUrl = apiUrlInput.value.trim();
                    if (!baseUrl || !apiKey) throw new Error('请先填写 API 地址和密钥！');
                    
                    const response = await fetch(`${baseUrl}/v1/models`, {
                        headers: { 'Authorization': `Bearer ${apiKey}` }
                    });
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                    const data = await response.json();
                    
                    const fetchedModels = data.data.reduce((acc, model) => ({ ...acc, [model.id]: model.id }), {});
                    if (Object.keys(fetchedModels).length === 0) throw new Error("API未返回任何模型");
                    
                    populateModels(fetchedModels, 'openai');
                    if (Object.keys(fetchedModels)[0]) modelSelect.value = Object.keys(fetchedModels)[0];

                } else { // Gemini
                    if (!apiKey) throw new Error('请先填写 Gemini API Key！');
                    
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                    const data = await response.json();
                    
                    const filteredModels = data.models
                        .filter(m => (m.name.includes('gemini-1.5-pro') || m.name.includes('gemini-1.5-flash') || m.name.includes('gemini-pro')) && m.supportedGenerationMethods.includes('generateContent'))
                        .reduce((acc, model) => ({ ...acc, [model.name.split('/').pop()]: model.displayName }), {});
                    
                    if (Object.keys(filteredModels).length === 0) throw new Error("未找到符合条件的Gemini模型");
                    
                    populateModels(filteredModels, 'gemini');
                    if (Object.keys(filteredModels)[0]) modelSelect.value = Object.keys(filteredModels)[0];
                }
                restoreSelection(previouslySelectedModel);
            } catch (error) {
                if (error.message.includes("403")) {
                    alert(`拉取模型失败 (403 Forbidden):\n\n这通常是Google Cloud配置问题，请检查：\n1. API Key是否解除了"应用限制" (HTTP引荐来源)。\n2. 项目是否启用了"Vertex AI API"。\n3. 项目是否已关联结算账号。\n\n将恢复为默认列表。`);
                } else {
                    alert(`拉取模型失败: ${error.message}\n将恢复为默认列表。`);
                }
                populateModels(defaultModels[currentApiType], currentApiType);
            } finally {
                fetchModelsButton.textContent = '拉取模型';
                fetchModelsButton.disabled = false;
            }
        };
        
        const saveApiSettings = () => {
            let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
            
            settings.apiType = currentApiType;
            settings.model = modelSelect.value;

            if (currentApiType === 'gemini') {
                settings.geminiApiKey = apiKeyInput.value.trim();
            } else {
                settings.openaiApiUrl = apiUrlInput.value.trim();
                settings.openaiApiKey = apiKeyInput.value.trim();
            }
            
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            alert('API设定已保存！');
        };

        const loadApiSettings = () => {
            populateModels(defaultModels.openai, 'openai');
            populateModels(defaultModels.gemini, 'gemini');
            
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
            updateApiForm(settings.apiType || 'openai');
        };

        btnOpenAI.addEventListener('click', () => updateApiForm('openai'));
        btnGemini.addEventListener('click', () => updateApiForm('gemini'));

        apiSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveApiSettings();
        });

        fetchModelsButton.addEventListener('click', (e) => {
            e.preventDefault();
            fetchModels();
        });

        apiKeyInput.addEventListener('focus', () => { apiKeyInput.type = 'text'; });
        apiKeyInput.addEventListener('blur', () => { apiKeyInput.type = 'password'; });

        loadApiSettings();
    }


    // ==================== 初始化加载 ====================
    loadData();
    updateClock();
    setInterval(updateClock, 1000);
    setupBatteryIndicator();
    setupApiSettingsPage(); // 初始化API设置页面逻辑

});
document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================
    // ==================== 1. ELEMENT SELECTORS =========================
    // ===================================================================

    // --- App & Navigation ---
    const appContainer = document.querySelector('.app-container');
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');

    // --- Sidebar ---
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const openSidebarTriggers = document.querySelectorAll('.js-open-sidebar');

    // --- Status Bar ---
    const timeElement = document.getElementById('status-bar-time');
    const batteryLiquid = document.getElementById('battery-capsule-liquid');
    const batteryLevelText = document.getElementById('battery-capsule-level');
    const batteryCapsule = document.getElementById('battery-capsule');
    const modelStatusKey = document.getElementById('model-status-key');

    // --- Dynamic Lists & Tabs ---
    const chatListContainer = document.querySelector('.chat-list');
    const defaultGroupContactsContainer = document.getElementById('default-group-contacts');
    const defaultGroupCount = document.getElementById('default-group-count');
    const contactGroupsContainer = document.querySelector('.contact-groups');
    const contactTabs = document.querySelectorAll('.contact-tab-btn');
    const tabContents = document.querySelectorAll('.contact-tab-content');

    // --- Page Overlays ---
    const userSettingsPage = document.getElementById('page-user-settings');
    const characterSettingsPage = document.getElementById('page-character-settings');
    const dataManagementPage = document.getElementById('page-data-management');
    const apiSettingsPage = document.getElementById('page-api-settings');

    // --- User Settings Page Elements ---
    const sidebarProfileLink = document.getElementById('sidebar-profile-link');
    const inputName = document.getElementById('input-name');
    const inputGender = document.getElementById('input-gender');
    const inputBirthday = document.getElementById('input-birthday');
    const inputAge = document.getElementById('input-age');
    const textareaSettings = document.getElementById('textarea-settings');
    const inputSignature = document.getElementById('input-signature');

    // --- Character Settings Page Elements ---
    const btnCreateCharacter = document.getElementById('btn-create-character');
    const charAvatarPreview = document.getElementById('char-avatar-preview');
    const charAvatarInput = document.getElementById('char-avatar-input');
    const characterSettingsForm = {
        name: document.getElementById('input-char-name'),
        gender: document.getElementById('input-char-gender'),
        birthday: document.getElementById('input-char-birthday'),
        age: document.getElementById('input-char-age'),
        settings: document.getElementById('textarea-char-settings')
    };

    // --- Data Management Page Elements ---
    const sidebarDataLink = document.getElementById('sidebar-data-link');
    const btnClearData = document.getElementById('btn-clear-data'); // [新增]

    // --- API Settings Page Elements ---
    const sidebarApiLink = document.getElementById('sidebar-api-link');
    const apiSettingsForm = document.getElementById('api-settings-form');
    const apiConfigSelect = document.getElementById('api-config-select');
    const apiTypeSelect = document.getElementById('api-type-select');
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const btnNewConfig = document.getElementById('btn-new-config');
    const fetchModelsButtonNew = document.getElementById('fetch-models-button-new');
    const btnDeleteConfig = document.getElementById('btn-delete-config');
    const btnSaveConfig = document.getElementById('btn-save-config');
    const openaiModelsGroup = document.getElementById('openai-models');
    const geminiModelsGroup = document.getElementById('gemini-models');

    // --- Modals ---
const modalContainer = document.getElementById('modal-container');
const weatherModal = document.getElementById('weather-modal');
const locationModal = document.getElementById('location-modal');
const statusModal = document.getElementById('status-modal');
const clearDataModal = document.getElementById('clear-data-modal'); // [新增]
    const openWeatherModalBtn = document.getElementById('btn-open-weather-modal');
    const openLocationModalBtn = document.getElementById('btn-open-location-modal');
    const headerStatusTrigger = document.getElementById('header-status-trigger');
    const headerStatusText = document.getElementById('header-status-text');
    const weatherOptionsGrid = document.getElementById('weather-options-grid');
    const locationCardsContainer = document.getElementById('location-cards-container');
    const statusOptionsGrid = document.getElementById('status-options-grid');
    const addLocationBtn = document.getElementById('btn-add-location');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    const clearDataConfirmInput = document.getElementById('clear-data-confirm-input'); // [新增]
    const confirmClearDataBtn = document.getElementById('confirm-clear-data-btn'); // [新增]


    // --- Popovers ---
    const headerPlusBtn = document.getElementById('header-plus-btn');
    const headerPopoverMenu = document.getElementById('header-popover-menu');
    
    // --- [新增] Cropper Modal Elements ---
    const cropperModal = document.getElementById('cropper-modal');
    const imageToCrop = document.getElementById('image-to-crop');
    const confirmCropBtn = document.getElementById('confirm-crop-btn');
    const cancelCropBtn = document.getElementById('cancel-crop-btn');



    // ===================================================================
    // ==================== 2. STATE MANAGEMENT ==========================
    // ===================================================================

    const STORAGE_KEY = 'felotusAppData';
    let appData = {};
    let newCharacterAvatarData = null; // Temp storage for uploaded avatar (Base64)
    let cropper = null; // [新增] Cropper 实例
    

    const initialData = {
        userProfile: { gender: '女' },
        characters: [],
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
                appData.characters = parsedData.characters || [];
            } catch (e) {
                appData = initialData;
            }
        } else {
            appData = initialData;
        }
        
        // Populate user profile form
        const profile = appData.userProfile;
        inputName.value = profile.name || '';
        inputGender.value = profile.gender || initialData.userProfile.gender;
        inputBirthday.value = profile.birthday || '';
        inputAge.value = profile.age || '';
        textareaSettings.value = profile.settings || '';
        inputSignature.value = profile.signature || '';
        
        // Initial UI rendering
        updateHeaderStatus();
        renderWeatherOptions();
        renderLocationCards();
        renderStatusOptions();
        renderChatList();
        renderContactList();
    }


    // ===================================================================
    // ==================== 3. UI RENDERING FUNCTIONS ====================
    // ===================================================================

    function renderChatList() {
        if (!chatListContainer) return;
        chatListContainer.innerHTML = ''; 

        const groupChatItemHTML = `
            <div class="chat-item">
                <div class="avatar-group-logo">LOG</div>
                <div class="chat-details">
                    <div class="chat-title">相亲相爱一家人</div>
                    <div class="chat-message">AI助手: @全体成员 今天...</div>
                </div>
                <div class="chat-meta">06/05 <i class="fa-solid fa-bell-slash"></i></div>
            </div>`;
        chatListContainer.insertAdjacentHTML('beforeend', groupChatItemHTML);

        appData.characters.forEach(char => {
            const chatItemHTML = `
                <div class="chat-item">
                    <img src="${char.avatar}" alt="avatar">
                    <div class="chat-details">
                        <div class="chat-title">${char.name}</div>
                        <div class="chat-message">我们已经是好友了，现在开始聊天吧！</div>
                    </div>
                    <div class="chat-meta">${char.creationTime}</div>
                </div>`;
            chatListContainer.insertAdjacentHTML('beforeend', chatItemHTML);
        });
    }

    function renderContactList() {
        if (!defaultGroupContactsContainer || !defaultGroupCount) return;
        
        defaultGroupContactsContainer.innerHTML = '';
        defaultGroupCount.textContent = appData.characters.length;

        appData.characters.forEach(char => {
            const contactItemHTML = `
                <div class="chat-item">
                    <img src="${char.avatar}" alt="avatar">
                    <div class="chat-details">
                        <div class="chat-title">${char.name}</div>
                    </div>
                </div>`;
            defaultGroupContactsContainer.insertAdjacentHTML('beforeend', contactItemHTML);
        });
    }

    function renderStatusOptions() {
        if(!statusOptionsGrid) return;
        statusOptionsGrid.innerHTML = '';

        appData.status.options.forEach(statusText => {
            const btn = document.createElement('button');
            btn.className = 'status-option-btn';

            const line1 = document.createElement('span');
            const line2 = document.createElement('span');
            if (statusText.length > 4) {
                line1.textContent = statusText.slice(0, 4);
                line2.textContent = statusText.slice(4);
            } else {
                line1.textContent = statusText;
            }
            btn.appendChild(line1);
            if (line2.textContent) btn.appendChild(line2);

            if (statusText === appData.status.selected) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                appData.status.selected = statusText;
                saveData();
                updateHeaderStatus();
                renderStatusOptions();
                closeModal();
            });

            addLongPressListener(btn, () => {
                if (confirm(`确定要删除状态 "${statusText}" 吗？`)) {
                    appData.status.options = appData.status.options.filter(s => s !== statusText);
                    if (appData.status.selected === statusText) {
                        appData.status.selected = appData.status.options[0] || '在线';
                    }
                    saveData();
                    updateHeaderStatus();
                    renderStatusOptions();
                }
            });

            statusOptionsGrid.appendChild(btn);
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'status-option-btn add-new';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const newStatus = prompt('请输入新状态');
            if (newStatus === null) return;
            if (newStatus.trim() === '') return alert('状态不能为空！');
            if (newStatus.length > 20) return alert('状态内容不能超过20个字！');
            if (appData.status.options.includes(newStatus)) return alert('此状态已存在！');

            appData.status.options.push(newStatus);
            saveData();
            renderStatusOptions();
        });
        statusOptionsGrid.appendChild(addBtn);
    }

    function renderWeatherOptions() {
        if(!weatherOptionsGrid) return;
        weatherOptionsGrid.innerHTML = '';

        appData.weather.options.forEach(icon => {
            const btn = document.createElement('button');
            btn.className = 'weather-option-btn';
            btn.textContent = icon;
            if (icon === appData.weather.selected) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                appData.weather.selected = icon;
                saveData();
                renderWeatherOptions();
            });

            addLongPressListener(btn, () => {
                if (confirm(`确定要删除天气 "${icon}" 吗？`)) {
                    appData.weather.options = appData.weather.options.filter(i => i !== icon);
                    if (appData.weather.selected === icon) {
                        appData.weather.selected = appData.weather.options[0] || null;
                    }
                    saveData();
                    renderWeatherOptions();
                }
            });

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
            if (location.selected) selectIndicator.classList.add('selected');

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
                appData.locations.forEach(loc => loc.selected = (loc.id === location.id) ? !loc.selected : false);
                saveData();
                renderLocationCards();
            });

            locationCardsContainer.appendChild(card);
        });
    }


    // ===================================================================
    // ==================== 4. CORE LOGIC & FEATURES =====================
    // ===================================================================

    // --- Helper Functions ---
    function updateHeaderStatus() {
        if(headerStatusText) headerStatusText.textContent = appData.status.selected;
    }

    /**
     * [OPTIMIZED] Reusable helper for long-press actions.
     * @param {HTMLElement} element The element to attach the listener to.
     * @param {Function} callback The function to execute after a long press.
     */
    function addLongPressListener(element, callback) {
        let longPressTimer;
        const start = (e) => {
            e.preventDefault(); // Prevents context menu on some devices
            longPressTimer = setTimeout(callback, 600);
        };
        const cancel = () => clearTimeout(longPressTimer);

        element.addEventListener('mousedown', start);
        element.addEventListener('mouseup', cancel);
        element.addEventListener('mouseleave', cancel);
        element.addEventListener('touchstart', start, { passive: false });
        element.addEventListener('touchend', cancel);
    }

    // --- Modals ---
    function openModal(modalElement) {
        modalContainer.classList.add('visible');
        modalElement.classList.add('visible');
    }

    function closeModal() {
        modalContainer.classList.remove('visible');
        [weatherModal, locationModal, statusModal].forEach(m => m.classList.remove('visible'));
    }

    // --- Page Transitions ---
    function setupPageTransition(link, page, onBack) {
        if (link && page) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // [修复] 调用了未定义的函数 closeSidebar()，应直接操作 appContainer
                appContainer.classList.remove('sidebar-open');
                setTimeout(() => page.classList.add('active'), 10);
            });
        }
        
        // [优化] 不再使用脆弱的长ID列表，而是根据页面ID动态生成返回按钮的ID来查找
        const backButtonId = page.id.replace('page-', '') + '-back-btn';
        const backBtn = document.getElementById(backButtonId);

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                page.classList.remove('active');
                if (onBack) setTimeout(onBack, 10);
            });
        }
    }

    // --- Character Creation ---
    function setupCharacterCreation() {
        if (!btnCreateCharacter || !characterSettingsPage) return;

        const backBtn = document.getElementById('character-settings-back-btn');
        const saveBtn = document.getElementById('character-settings-save-btn');

        btnCreateCharacter.addEventListener('click', () => {
            headerPopoverMenu.classList.remove('visible');
            clearCharacterForm();
            characterSettingsPage.classList.add('active');
        });

        if(backBtn) backBtn.addEventListener('click', () => characterSettingsPage.classList.remove('active'));

        if (charAvatarPreview) charAvatarPreview.addEventListener('click', () => charAvatarInput.click());
        
        // [修改] 更新头像上传逻辑以集成裁剪器
        if (charAvatarInput) {
            charAvatarInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // 1. 显示裁剪模态框
                        cropperModal.classList.add('visible');
                        // 2. 设置待裁剪图片
                        imageToCrop.src = e.target.result;
                        // 3. 初始化 Cropper
                        if (cropper) {
                            cropper.destroy();
                        }
                        cropper = new Cropper(imageToCrop, {
                            aspectRatio: 1, // 正方形裁剪
                            viewMode: 1,    // 限制裁剪框在画布内
                            dragMode: 'move',
                            background: false,
                            autoCropArea: 0.8,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function clearCharacterForm() {
            Object.values(characterSettingsForm).forEach(input => input.value = '');
            charAvatarPreview.src = 'https://i.imgur.com/Jz9v5aB.png'; // Default avatar
            newCharacterAvatarData = null;
            if(charAvatarInput) charAvatarInput.value = null;
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const name = characterSettingsForm.name.value.trim();
                if (!name) return alert('角色姓名不能为空！');

                const timeString = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
                
                const newCharacter = {
                    id: Date.now(),
                    name: name,
                    gender: characterSettingsForm.gender.value,
                    birthday: characterSettingsForm.birthday.value,
                    age: characterSettingsForm.age.value,
                    settings: characterSettingsForm.settings.value,
                    avatar: newCharacterAvatarData || 'https://i.imgur.com/Jz9v5aB.png',
                    creationTime: timeString
                };

                appData.characters.push(newCharacter);
                saveData();
                renderChatList();
                renderContactList();

                characterSettingsPage.classList.remove('active');
                document.querySelector('.nav-button[data-target="page-messages"]').click();

                clearCharacterForm();
                alert(`角色 "${name}" 已成功创建！`);
            });
        }
    }

    // --- [新增] Cropper Modal Logic ---
    function setupCropperModal() {
        if (!cropperModal) return;

        confirmCropBtn.addEventListener('click', () => {
            const canvas = cropper.getCroppedCanvas({
                width: 256, // 输出256x256像素的图片
                height: 256,
                imageSmoothingQuality: 'high',
            });
            newCharacterAvatarData = canvas.toDataURL('image/png');
            charAvatarPreview.src = newCharacterAvatarData;

            // 清理
            cropper.destroy();
            cropper = null;
            cropperModal.classList.remove('visible');
            charAvatarInput.value = null;
        });

        cancelCropBtn.addEventListener('click', () => {
            cropper.destroy();
            cropper = null;
            cropperModal.classList.remove('visible');
            charAvatarInput.value = null;
        });
    }

    // --- Data Import/Export ---
    function setupDataManagement() {
        const exportBtn = document.getElementById('btn-export-data');
        const importBtn = document.getElementById('btn-import-data');
        const importInput = document.getElementById('import-file-input');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                saveData(); 
                const jsonString = JSON.stringify(appData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `felotus-data-${Date.now()}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
                link.remove();
                alert('数据已成功导出！');
            });
        }

        if (importBtn) importBtn.addEventListener('click', () => importInput.click());
        
        if (importInput) {
            importInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        appData = Object.assign({}, initialData, importedData);
                        saveData();
                        loadData(); // Reload all data and re-render UI
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
        
        // [新增] 清除数据逻辑
        if(btnClearData) {
            btnClearData.addEventListener('click', () => {
                openModal(clearDataModal);
            });
        }
        if(clearDataConfirmInput) {
            clearDataConfirmInput.addEventListener('input', () => {
                confirmClearDataBtn.disabled = clearDataConfirmInput.value.trim() !== 'delete';
            });
        }
        if(confirmClearDataBtn) {
            confirmClearDataBtn.addEventListener('click', () => {
                if(confirmClearDataBtn.disabled) return;

                localStorage.removeItem(STORAGE_KEY);
                alert('本地数据已成功清除！应用将重新加载。');
                location.reload();
            });
        }
    }

    // --- API Settings ---
    function updateModelStatusKey() {
        if (!modelStatusKey) return;
        const API_SETTINGS_KEY = 'aiChatApiSettings_v2'; 
        const settings = JSON.parse(localStorage.getItem(API_SETTINGS_KEY) || 'null');
        const hasActiveModel = settings?.configurations?.some(config => config.model?.trim());
        modelStatusKey.style.display = hasActiveModel ? 'inline-block' : 'none';
    }

    function setupApiSettingsPage() {
        if (!apiSettingsPage) return;
        const API_SETTINGS_KEY = 'aiChatApiSettings_v2';
        const defaultModels = { openai: {}, gemini: {} };
        let apiSettings = {};

        const getSettings = () => JSON.parse(localStorage.getItem(API_SETTINGS_KEY) || 'null');
        const saveSettings = () => {
            localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(apiSettings));
            updateModelStatusKey(); 
        };

        const populateConfigSelector = () => {
            apiConfigSelect.innerHTML = '';
            apiSettings.configurations.forEach(config => {
                const option = document.createElement('option');
                option.value = config.id;
                option.textContent = config.name;
                apiConfigSelect.appendChild(option);
            });
            apiConfigSelect.value = apiSettings.activeConfigurationId;
        };

        const updateFormForApiType = (apiType) => {
            const isGemini = apiType === 'gemini';
            apiUrlInput.disabled = isGemini;
            apiUrlInput.placeholder = isGemini ? 'Gemini官方地址，无需修改' : '格式参考 https://example.com';
            apiKeyInput.placeholder = isGemini ? 'AIzaSy... (Gemini API Key)' : 'sk-xxxxxxxxxx';
            if (isGemini) apiUrlInput.value = 'https://generativelanguage.googleapis.com/v1beta';
        };

        const populateModels = (models, type) => {
            openaiModelsGroup.hidden = (type !== 'openai');
            geminiModelsGroup.hidden = (type !== 'gemini');
            const group = type === 'openai' ? openaiModelsGroup : geminiModelsGroup;
            group.innerHTML = '';
            for (const [id, name] of Object.entries(models)) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                group.appendChild(option);
            }
        };

        const loadConfigurationDetails = (configId) => {
            const config = apiSettings.configurations.find(c => c.id == configId);
            if (!config) return;

            apiTypeSelect.value = config.type;
            apiKeyInput.value = config.apiKey || '';
            updateFormForApiType(config.type);
            if (config.type !== 'gemini') apiUrlInput.value = config.apiUrl || '';

            populateModels(defaultModels[config.type], config.type);
            if(config.model) {
                const tempOption = document.createElement('option');
                tempOption.value = config.model;
                tempOption.textContent = config.model;
                const group = config.type === 'openai' ? openaiModelsGroup : geminiModelsGroup;
                if (!group.querySelector(`option[value="${config.model}"]`)) {
                    group.appendChild(tempOption);
                }
                modelSelect.value = config.model;
            }
        };
        
        const handleNewConfig = () => {
            const name = prompt('请输入新配置的名称:', `我的配置 ${apiSettings.configurations.length + 1}`);
            if (!name) return;
            const newConfig = { id: Date.now(), name, type: 'openai', apiUrl: '', apiKey: '', model: '' };
            apiSettings.configurations.push(newConfig);
            apiSettings.activeConfigurationId = newConfig.id;
            saveSettings();
            populateConfigSelector();
            loadConfigurationDetails(newConfig.id);
        };

        const handleDeleteConfig = () => {
            if (apiSettings.configurations.length <= 1) return alert('无法删除最后一个配置！');
            
            const configIdToDelete = apiConfigSelect.value;
            const configToDelete = apiSettings.configurations.find(c => c.id == configIdToDelete);
            if (confirm(`确定要删除配置 "${configToDelete.name}" 吗？`)) {
                apiSettings.configurations = apiSettings.configurations.filter(c => c.id != configIdToDelete);
                if (apiSettings.activeConfigurationId == configIdToDelete) {
                    apiSettings.activeConfigurationId = apiSettings.configurations[0].id;
                }
                saveSettings();
                populateConfigSelector();
                loadConfigurationDetails(apiSettings.activeConfigurationId);
            }
        };

        const handleSaveConfig = (e) => {
            e.preventDefault();
            const configIdToSave = apiConfigSelect.value;
            const config = apiSettings.configurations.find(c => c.id == configIdToSave);
            if (!config) return;

            config.type = apiTypeSelect.value;
            config.apiUrl = apiUrlInput.value.trim();
            config.apiKey = apiKeyInput.value.trim();
            config.model = modelSelect.value;
            
            saveSettings();
            alert(`配置 "${config.name}" 已保存！`);
        };

        const fetchModels = async () => {
            const apiKey = apiKeyInput.value.trim();
            const apiType = apiTypeSelect.value;
            fetchModelsButtonNew.textContent = '正在拉取...';
            fetchModelsButtonNew.disabled = true;

            try {
                let fetchedModels;
                if (apiType === 'openai') {
                    const baseUrl = apiUrlInput.value.trim();
                    if (!baseUrl || !apiKey) throw new Error('请先填写 API 地址和密钥！');
                    const response = await fetch(`${baseUrl}/v1/models`, { headers: { 'Authorization': `Bearer ${apiKey}` } });
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                    const data = await response.json();
                    fetchedModels = data.data.reduce((acc, model) => ({ ...acc, [model.id]: model.id }), {});
                } else { // Gemini
                    if (!apiKey) throw new Error('请先填写 Gemini API Key！');
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                    const data = await response.json();
                    fetchedModels = data.models.reduce((acc, model) => ({ ...acc, [model.name.split('/').pop()]: model.displayName }), {});
                }

                if (Object.keys(fetchedModels).length === 0) throw new Error("API未返回任何模型");
                populateModels(fetchedModels, apiType);
            } catch (error) {
                let errorMsg = `拉取模型失败: ${error.message}`;
                if (error.message.includes("403")) {
                    errorMsg = `拉取模型失败 (403 Forbidden):\n\n这通常是Google Cloud配置问题，请检查：\n1. API Key是否解除了"应用限制"。\n2. 项目是否启用了"Vertex AI API"。\n3. 项目是否已关联结算账号。`;
                }
                alert(errorMsg);
                populateModels(defaultModels[apiType], apiType);
            } finally {
                fetchModelsButtonNew.textContent = '拉取模型';
                fetchModelsButtonNew.disabled = false;
            }
        };

        // Initialize API Settings Page
        apiSettings = getSettings();
        if (!apiSettings || !apiSettings.configurations || apiSettings.configurations.length === 0) {
            const defaultConfigId = Date.now();
            apiSettings = {
                configurations: [{ id: defaultConfigId, name: '默认配置', type: 'openai', apiUrl: '', apiKey: '', model: '' }],
                activeConfigurationId: defaultConfigId
            };
            saveSettings();
        }
        populateConfigSelector();
        loadConfigurationDetails(apiSettings.activeConfigurationId);

        apiConfigSelect.addEventListener('change', (e) => {
            apiSettings.activeConfigurationId = e.target.value;
            saveSettings();
            loadConfigurationDetails(e.target.value);
        });
        apiTypeSelect.addEventListener('change', (e) => {
            const newType = e.target.value;
            updateFormForApiType(newType);
            if (newType === 'openai') {
                const currentConfig = apiSettings.configurations.find(c => c.id == apiConfigSelect.value);
                apiUrlInput.value = currentConfig?.apiUrl || '';
            }
            apiKeyInput.value = '';
            populateModels(defaultModels[newType], newType);
        });
        btnNewConfig.addEventListener('click', handleNewConfig);
        btnDeleteConfig.addEventListener('click', handleDeleteConfig);
        apiSettingsForm.addEventListener('submit', handleSaveConfig);
        fetchModelsButtonNew.addEventListener('click', fetchModels);
        apiKeyInput.addEventListener('focus', () => { apiKeyInput.type = 'text'; });
        apiKeyInput.addEventListener('blur', () => { apiKeyInput.type = 'password'; });
    }

    // --- System Status ---
    function setupSystemStatus() {
        // Clock
        updateClock();
        setInterval(updateClock, 1000);
        function updateClock() {
            if(!timeElement) return;
            const beijingTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
            timeElement.textContent = beijingTime;
        }

        // Battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBatteryStatus = () => {
                    if(!batteryLevelText || !batteryLiquid) return;
                    const level = Math.round(battery.level * 100);
                    batteryLevelText.textContent = level;
                    batteryLiquid.style.width = `${100 - level}%`;
                };
                updateBatteryStatus();
                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
            });
        } else {
            if(batteryCapsule) batteryCapsule.style.display = 'none';
        }
    }


    // ===================================================================
    // ======================= 5. INITIALIZATION =========================
    // ===================================================================

    // --- Load initial data and render UI ---
    loadData();

    // --- Setup event listeners ---
    // User profile auto-save
    [inputName, inputGender, inputBirthday, inputAge, textareaSettings, inputSignature].forEach(input => {
        input.addEventListener('input', saveData);
    });

    // Bottom navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            navButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Sidebar
    openSidebarTriggers.forEach(trigger => trigger.addEventListener('click', () => appContainer.classList.add('sidebar-open')));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => appContainer.classList.remove('sidebar-open'));
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => appContainer.classList.remove('sidebar-open'));
    
    // Contact page tabs & groups
    if(contactTabs) contactTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            contactTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    if(contactGroupsContainer) {
        contactGroupsContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.group-header');
            if (header && header.parentElement.querySelector('.contact-list')) {
                header.closest('.group-item').classList.toggle('open');
            }
        });
    }

    // Modals
    if(openWeatherModalBtn) openWeatherModalBtn.addEventListener('click', () => openModal(weatherModal));
    if(openLocationModalBtn) openLocationModalBtn.addEventListener('click', () => openModal(locationModal));
    if(headerStatusTrigger) headerStatusTrigger.addEventListener('click', () => openModal(statusModal));
    if(closeButtons) closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    if(modalContainer) modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) closeModal(); });
    if(addLocationBtn) addLocationBtn.addEventListener('click', () => {
        appData.locations.push({ id: Date.now(), name: '', address: '', selected: false });
        saveData();
        renderLocationCards();
    });

    // Popovers
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

    // --- Setup feature modules ---
    setupPageTransition(sidebarProfileLink, userSettingsPage, () => appContainer.classList.add('sidebar-open'));
    setupPageTransition(sidebarDataLink, dataManagementPage, () => appContainer.classList.add('sidebar-open'));
    setupPageTransition(sidebarApiLink, apiSettingsPage, () => appContainer.classList.add('sidebar-open'));
    
    setupCharacterCreation();
    setupCropperModal(); // [新增]
    setupDataManagement();
    setupApiSettingsPage();
    setupSystemStatus();
    updateModelStatusKey(); 

});
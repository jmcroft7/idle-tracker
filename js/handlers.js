import { gameState, saveData, updateSetting } from './state.js';
import { showToast, updateSidebarLevel, applyTheme, buildSidebar, buildPage } from './ui.js';
import { handleSkillSelection } from './components/5_skillManagerPage.js';
import { setSelectedStatSkill } from './components/4_statsPage.js';
import { setSelectedShopTab } from './components/1_shopPage.js';
import { processActiveAction } from './main.js';
import { SKILL_DATA, ALL_SKILL_NAMES, SHOP_DATA } from './data.js';

/**
 * Sets up global event listeners for the application.
 */
export function setupEventListeners() {
    const mainContent = document.getElementById('main-content');
    const loadFileInput = document.getElementById('load-file-input');
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('click', handleSidebarClick);
    mainContent.addEventListener('click', handleMainContentClick);
    mainContent.addEventListener('change', handleSettingsChange);
    loadFileInput.addEventListener('change', handleFileLoad);
}

// --- GLOBAL EVENT HANDLER FUNCTIONS ---

function handleSidebarClick(e) {
    const collapsibleHeader = e.target.closest('[data-collapsible-target]');
    if (collapsibleHeader) {
        const targetId = collapsibleHeader.dataset.collapsibleTarget;
        const targetList = document.getElementById(targetId);
        const icon = collapsibleHeader.querySelector('.collapse-icon');
        if (targetList) {
            targetList.classList.toggle('collapsed');
            if (icon) icon.textContent = targetList.classList.contains('collapsed') ? '🙈' : '👁️';
        }
        return;
    }

    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.dataset.page) {
        e.preventDefault();
        if (!navItem.classList.contains('active')) {
            window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: navItem.dataset.page } }));
        }
    }
}

function handleMainContentClick(e) {
    const statSkillButton = e.target.closest('[data-stat-skill]');
    if (statSkillButton) {
        setSelectedStatSkill(statSkillButton.dataset.statSkill);
        buildPage('stats');
        return;
    }
    
    const shopTabButton = e.target.closest('[data-shop-tab]');
    if (shopTabButton) {
        setSelectedShopTab(shopTabButton.dataset.shopTab);
        buildPage('shop');
        return;
    }

    const buyTitleButton = e.target.closest('[data-buy-title]');
    if (buyTitleButton) {
        handleBuyTitle(buyTitleButton.dataset.buyTitle);
        return;
    }

    const equipTitleButton = e.target.closest('[data-equip-title]');
    if (equipTitleButton) {
        handleEquipTitle(equipTitleButton.dataset.equipTitle);
        return;
    }

    const skillManagerCard = e.target.closest('[data-select-skill]');
    if (skillManagerCard) {
        handleSkillSelection(skillManagerCard.dataset.selectSkill);
        return;
    }

    const actionBtn = e.target.closest('[data-action-skill]');
    if (actionBtn) {
        toggleSkillAction(actionBtn.dataset.actionSkill, actionBtn.dataset.actionName);
        return;
    }

    switch (e.target.id) {
        case 'save-btn': handleSaveToFile(); break;
        case 'load-btn': document.getElementById('load-file-input').click(); break;
    }
}

function toggleSkillAction(skillName, actionName) {
    const runningAction = gameState.activeAction;
    const actionBtn = document.getElementById(`action-btn-${actionName}`);
    
    if (runningAction) {
        processActiveAction();
        const lastActionBtn = document.getElementById(`action-btn-${runningAction.actionName}`);
        if (lastActionBtn) {
            const lastActionData = SKILL_DATA[runningAction.skillName].actions[runningAction.actionName];
            lastActionBtn.textContent = `Start ${lastActionData.title.split(' ').slice(1).join(' ')}`;
        }
        gameState.activeAction = null;
    }

    if (!runningAction || runningAction.actionName !== actionName) {
        gameState.activeAction = { skillName, actionName, startTime: Date.now() };
        actionBtn.textContent = 'Stop';
    } else {
        const progressBar = document.getElementById(`progress-bar-${actionName}`);
        if (progressBar) progressBar.style.width = '0%';
    }
    saveData();
}

function handleSettingsChange(e) {
    const { id, value, checked } = e.target;
    switch (id) {
        case 'dark-mode-toggle':
            updateSetting('useDarkMode', checked);
            applyTheme();
            break;
        case 'background-image-select':
            updateSetting('backgroundImage', value);
            applyTheme();
            const previewImg = document.getElementById('background-preview-img');
            const previewContainer = previewImg.parentElement;
            if (value === 'none') {
                previewContainer.classList.add('hidden');
            } else {
                previewContainer.classList.remove('hidden');
                previewImg.src = value;
            }
            break;
        case 'notification-position':
            updateSetting('notificationPosition', value);
            break;
        case 'notification-duration':
            updateSetting('notificationDuration', Number(value));
            break;
        case 'notification-show-name':
            updateSetting('notificationShowName', checked);
            break;
        case 'skill-sort-toggle':
            updateSetting('skillSortByLevel', checked);
            buildSidebar();
            if (document.querySelector('.skill-manager-grid')) {
                buildPage('skillManager');
            }
            break;
    }
}

function handleBuyTitle(titleKey) {
    const titleData = SHOP_DATA.titles.items[titleKey];
    if (titleData && gameState.coins >= titleData.cost) {
        gameState.coins -= titleData.cost;
        gameState.purchasedTitles.push(titleKey);
        saveData();
        buildPage('shop');
        showToast(`Purchased the title: ${titleData.name}`, '✨');
    } else {
        showToast("You don't have enough coins!", '⛔');
    }
}

function handleEquipTitle(titleKey) {
    if (gameState.purchasedTitles.includes(titleKey)) {
        gameState.equippedTitle = titleKey;
        saveData();
        buildPage('shop');
    }
}

function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedState = JSON.parse(e.target.result);
            if (loadedState && loadedState.skills && loadedState.settings) {
                Object.assign(gameState, loadedState);
                saveData();
                showToast('Game Loaded Successfully!');
                location.reload(); 
            } else {
                throw new Error("Invalid save file format.");
            }
        } catch (error) {
            console.error("Failed to load game:", error);
            showToast('Error: Invalid save file.');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

function handleSaveToFile() {
    try {
        const gameStateString = JSON.stringify(gameState, null, 2);
        const blob = new Blob([gameStateString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idle-game-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Game Saved to File!');
    } catch (error) {
        console.error("Failed to save game:", error);
        showToast('Error: Could not save game.');
    }
}

/**
 * Checks if a skill has enough XP to level up. Can handle multiple level ups from a large XP gain.
 * @param {string} skillName The name of the skill to check.
 */
export function checkLevelUp(skillName) {
    let leveledUp = false;
    while (true) {
        const skill = gameState.skills[skillName];
        const nextLevelXp = gameState.xpThresholds[skill.level];
        if (nextLevelXp && skill.xp >= nextLevelXp) {
            skill.level++;
            skill.xp -= nextLevelXp;
            const skillData = SKILL_DATA[skillName];
            const fullMessage = `${skillData.displayName} level up! Reached <span class="toast-xp">level ${skill.level}</span>.`;
            const compactMessage = `Level Up! <span class="toast-xp">${skill.level}</span>`;
            showToast({ type: 'skill', message: fullMessage, compactMessage, icon: skillData.icon });
            updateSidebarLevel(skillName);
            leveledUp = true;
        } else {
            break;
        }
    }
    return leveledUp;
}
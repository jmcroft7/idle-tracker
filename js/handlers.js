// idle-tracker/js/handlers.js

import { gameState, saveData, updateSetting, } from './state.js';
import { showToast, updateSidebarLevel, applyTheme, buildSidebar, buildPage, updatePlayerNameDisplay } from './ui.js';
import { handleSkillSelection } from './components/5_skillManagerPage.js';
import { setSelectedStatSkill } from './components/4_statsPage.js';
import { setSelectedShopTab } from './components/1_shopPage.js';
import { setSelectedSkillTab } from './components/3_skillPage.js';
import { processActiveAction, saveGameToFile, resetGame } from './main.js';
import { SKILL_DATA, ALL_SKILL_NAMES, SHOP_DATA, MAX_LEVEL, NORMAL_XP_PER_HOUR, HARD_XP_PER_HOUR } from './data.js';

/**
 * Sets up global event listeners for the application.
 */
export function setupEventListeners() {
    const mainContent = document.getElementById('main-content');
    const loadFileInput = document.getElementById('load-file-input');
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('click', handleSidebarClick);
    mainContent.addEventListener('click', handleMainContentClick);
    mainContent.addEventListener('input', handleMainContentInput);
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
            const isCollapsed = targetList.classList.toggle('collapsed');
            if (icon) icon.textContent = isCollapsed ? '🙈' : '👁️';

            // Handle state for the single skills list
            if (targetId === 'skills-nav-all') {
                updateSetting('skillsCollapsed', isCollapsed);
                return; // Early exit
            }

            // Handle state for skill group collapsing
            const groupKey = targetId.includes('skills-nav-') 
                ? targetId.replace('skills-nav-', '') 
                : targetId.includes('general-nav-list') ? 'general' : null;
            
            if (groupKey) {
                 if (isCollapsed) {
                    if (!gameState.collapsedSkillGroups.includes(groupKey)) {
                        gameState.collapsedSkillGroups.push(groupKey);
                    }
                } else {
                    gameState.collapsedSkillGroups = gameState.collapsedSkillGroups.filter(g => g !== groupKey);
                }
                saveData();
            }
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

function handleManualTimeAdd() {
    const skillSelect = document.getElementById('manual-skill-select');
    const durationInput = document.getElementById('manual-duration-input');
    const unitSelect = document.getElementById('manual-unit-select');

    const skillName = skillSelect.value;
    const duration = parseFloat(durationInput.value);
    const unit = unitSelect.value;

    if (!skillName || !duration || duration <= 0) {
        showToast("Please select a skill and enter a valid duration.", '⛔');
        return;
    }

    // Calculate total hours
    const hours = unit === 'hours' ? duration : duration / 60;

    // Calculate XP
    const xpPerHour = gameState.settings.hardMode ? HARD_XP_PER_HOUR : NORMAL_XP_PER_HOUR;
    const xpGained = hours * xpPerHour;

    // Update state
    gameState.skills[skillName].xp += xpGained;
    checkLevelUp(skillName);
    saveData();

    // Feedback
    showToast(`Added ${duration.toLocaleString()} ${unit} to ${SKILL_DATA[skillName].displayName}.`, '🎉');
    buildPage(skillName); // Navigate to the skill page to see progress
}


function handleMainContentClick(e) {
    const playerDropdownToggle = e.target.closest('#player-dropdown-toggle');
    if (playerDropdownToggle) {
        const menu = document.getElementById('player-dropdown-menu');
        if (menu) {
            menu.classList.toggle('show');
        }
        return;
    }

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

    const skillTabButton = e.target.closest('[data-skill-tab]');
    if (skillTabButton) {
        setSelectedSkillTab(skillTabButton.dataset.skillTab);
        buildPage(skillTabButton.dataset.skillName);
        return;
    }

    const completeTaskButton = e.target.closest('[data-complete-task]');
    if(completeTaskButton) {
        handleCompleteTask(completeTaskButton.dataset.completeTask);
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
        case 'save-btn': saveGameToFile(); break;
        case 'load-btn': document.getElementById('load-file-input').click(); break;
        case 'save-player-name-btn':
            showToast('Player name saved!');
            break;
        case 'reset-game-btn':
            resetGame();
            break;
        case 'manual-add-btn':
            handleManualTimeAdd();
            break;
    }
}

function handleMainContentInput(e) {
    const { id, value } = e.target;

    if (id === 'player-name-input') {
        updateSetting('playerName', value);
        updatePlayerNameDisplay();
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

function handleSkillGroupChange(skillName, newGroup) {
    const { skillGroups } = gameState;

    // Remove skill from its current group
    for (const group in skillGroups) {
        const index = skillGroups[group].indexOf(skillName);
        if (index > -1) {
            skillGroups[group].splice(index, 1);
            break;
        }
    }

    // Add skill to the new group
    if (skillGroups[newGroup]) {
        skillGroups[newGroup].push(skillName);
    }

    saveData();
    buildSidebar(); // Re-render the sidebar to show the change
}

function handleSettingsChange(e) {
    const { id, value, checked, dataset } = e.target;

    // Handle skill group changes
    if (e.target.classList.contains('skill-group-select')) {
        handleSkillGroupChange(dataset.skillName, value);
        return;
    }
    
    const activePage = document.querySelector('.nav-item.active')?.dataset.page;
    
    switch (id) {
        case 'dark-mode-toggle':
            updateSetting('useDarkMode', checked);
            applyTheme();
            break;
        case 'hard-mode-toggle':
            updateSetting('hardMode', checked);
            if (activePage && SKILL_DATA[activePage]) buildPage(activePage);
            break;
        case 'show-hours-toggle':
             updateSetting('showHoursInsteadOfXP', checked);
             if (activePage && SKILL_DATA[activePage]) buildPage(activePage);
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
        case 'group-skills-toggle':
            updateSetting('groupSkillsInSidebar', checked);
            buildSidebar();
            break;
        case 'title-select':
            gameState.equippedTitle = value;
            saveData();
            updatePlayerNameDisplay();
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
        updatePlayerNameDisplay();
    }
}

function handleCompleteTask(taskKey) {
    const [skillName, taskName] = taskKey.split('_');
    const taskData = SKILL_DATA[skillName].tasks[taskName];

    if (taskData && !gameState.completedTasks.includes(taskKey)) {
        const skillState = gameState.skills[skillName];
        if(taskData.requiredLevel && skillState.level < taskData.requiredLevel) {
            showToast("You don't have the required level for this task.", '⛔');
            return;
        }

        gameState.skills[skillName].xp += taskData.rewards.xp;
        gameState.coins += taskData.rewards.coins;
        gameState.completedTasks.push(taskKey);
        
        checkLevelUp(skillName);
        saveData();
        buildPage(skillName);
        showToast(`Task completed: ${taskData.name}!`, '🎉');
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

/**
 * Checks if a skill has enough XP to level up. Can handle multiple level ups.
 * @param {string} skillName The name of the skill to check.
 */
export function checkLevelUp(skillName) {
    let leveledUp = false;
    const { xpThresholds } = gameState;

    while (true) {
        const skill = gameState.skills[skillName];
        if (skill.level >= MAX_LEVEL) break;

        const nextLevelXp = xpThresholds[skill.level + 1];

        if (nextLevelXp !== undefined && skill.xp >= nextLevelXp) {
            skill.level++;
            const skillData = SKILL_DATA[skillName];
            const fullMessage = `${skillData.displayName} level up! Reached <span class="toast-xp">level ${skill.level}</span>.`;
            const compactMessage = `Level Up! <span class="toast-xp">${skill.level}</span>`;
            showToast({ type: 'skill', message: fullMessage, compactMessage, icon: skillData.icon });
            updateSidebarLevel(skillName);
            leveledUp = true;
        } else {
            break; // Exit loop if not enough hours for the next level
        }
    }
    return leveledUp;
}
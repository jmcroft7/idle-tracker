import { gameState, saveData, updateSetting } from './state.js';
import { showToast, updateSidebarLevel, skillIcons, setSelectedStatSkill } from './ui.js';
import { processActiveAction } from './main.js';

// Each action now specifies which stat to increment.
export const skillActionDetails = {
    woodcutting: { xp: 10, duration: 3000, statName: 'treesCut' },
    reading:     { xp: 12, duration: 4000, statName: 'booksRead' },
    writing:     { xp: 15, duration: 5000, statName: 'poemsWritten' },
    gaming:      { xp: 8,  duration: 2500, statName: 'matchesPlayed' },
    coding:      { xp: 20, duration: 6000, statName: 'bugsFixed' },
    fitness:     { xp: 18, duration: 5500, statName: 'workoutsCompleted' },
    cooking:     { xp: 14, duration: 4500, statName: 'mealsCooked' },
    mycology:    { xp: 22, duration: 7000, statName: 'mushroomsForaged' },
};

/**
 * Sets up all event listeners for the application.
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

// --- EVENT HANDLER FUNCTIONS ---

function handleSidebarClick(e) {
    const collapsibleHeader = e.target.closest('[data-collapsible-target]');
    if (collapsibleHeader) {
        const targetId = collapsibleHeader.dataset.collapsibleTarget;
        const targetList = document.getElementById(targetId);
        const icon = collapsibleHeader.querySelector('.collapse-icon');

        if (targetList) {
            targetList.classList.toggle('collapsed');
            if (icon) {
                icon.textContent = targetList.classList.contains('collapsed') ? '🙈' : '👁️';
            }
        }
        return;
    }

    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.dataset.page) {
        e.preventDefault();
        if (!navItem.classList.contains('active')) {
            const pageName = navItem.dataset.page;
            window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
        }
    }
}

function handleMainContentClick(e) {
    // Handle clicks on skill buttons in the new stats grid
    const statSkillButton = e.target.closest('[data-stat-skill]');
    if (statSkillButton) {
        setSelectedStatSkill(statSkillButton.dataset.statSkill);
        return;
    }

    // Handle clicks on the main action button
    const actionBtn = e.target.closest('[data-action-skill]');
    if (actionBtn) {
        toggleSkillAction(actionBtn.dataset.actionSkill);
        return;
    }

    // Handle other button clicks
    switch (e.target.id) {
        case 'save-btn':
            handleSaveToFile();
            break;
        case 'load-btn':
            document.getElementById('load-file-input').click();
            break;
    }
}

function toggleSkillAction(skillName) {
    const isRunning = gameState.activeAction !== null;
    const actionBtn = document.getElementById('action-btn');
    const defaultButtonText = document.querySelector(`.action-card__title`).textContent.replace('Cut', 'Start Cutting').replace('Read', 'Start Reading').replace('Write', 'Start Writing').replace('Play', 'Start Gaming').replace('Fix', 'Start Coding').replace('Do', 'Start Training').replace('Cook', 'Start Cooking').replace('Forage', 'Start Foraging');


    if (isRunning) {
        // Process any final progress before stopping
        processActiveAction();
        gameState.activeAction = null;
        saveData();
        actionBtn.textContent = defaultButtonText;
        const progressBar = document.getElementById('progress-bar');
        if(progressBar) progressBar.style.width = '0%';
    } else {
        gameState.activeAction = {
            skillName: skillName,
            startTime: Date.now()
        };
        saveData();
        actionBtn.textContent = 'Stop';
    }
}


function handleSettingsChange(e) {
    if (e.target.id === 'theme-select') {
        const newTheme = e.target.value;
        updateSetting('theme', newTheme);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }
}

function handleFileLoad(event) {
    // ... (This function remains unchanged)
}

function handleSaveToFile() {
    // ... (This function remains unchanged)
}

/**
 * Checks if a skill has enough XP to level up. Can handle multiple level ups from a large XP gain.
 * @param {string} skillName - The name of the skill to check.
 */
export function checkLevelUp(skillName) {
    let leveledUp = false;
    // Use a while loop to handle multiple level-ups from a single large XP gain
    while (true) {
        const skill = gameState.skills[skillName];
        const nextLevelXp = gameState.xpThresholds[skill.level];

        if (nextLevelXp && skill.xp >= nextLevelXp) {
            skill.level++;
            skill.xp -= nextLevelXp; // Carry over remaining XP
            const skillDisplayName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
            const message = `${skillDisplayName} level up! Reached <span class="toast-xp">level ${skill.level}</span>.`;
            showToast(message, skillIcons[skillName]);
            updateSidebarLevel(skillName);
            leveledUp = true;
        } else {
            break; // Exit loop if not enough XP for the next level
        }
    }
    return leveledUp;
}
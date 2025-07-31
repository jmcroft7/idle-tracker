import { gameState, saveData, loadData } from './state.js';
import { applyTheme, buildPage, buildSidebar, showToast } from './ui.js';
import { setupEventListeners, checkLevelUp } from './handlers.js';
import { SKILL_DATA } from './data.js';

let lastActiveSkill = null;

/**
 * Processes the active action, calculating completions and updating the state.
 */
export function processActiveAction() {
    if (!gameState.activeAction) return;

    const { skillName, actionName, startTime } = gameState.activeAction;
    const action = SKILL_DATA[skillName].actions[actionName];
    const now = Date.now();
    const elapsedTime = now - startTime;

    if (elapsedTime >= action.duration) {
        const completions = Math.floor(elapsedTime / action.duration);
        if (completions === 0) return;
        const xpGained = completions * action.xp;

        // Update state
        gameState.skills[skillName].xp += xpGained;
        if (gameState.stats[skillName][action.statName] !== undefined) {
            gameState.stats[skillName][action.statName] += completions;
        }
        gameState.activeAction.startTime += completions * action.duration;
        saveData();

        // Handle UI updates and notifications
        const leveledUp = checkLevelUp(skillName);
        if (!leveledUp) {
            const skillData = SKILL_DATA[skillName];
            const fullMessage = `<span class="toast-xp">+${xpGained}</span> ${skillData.displayName} XP`;
            const compactMessage = `<span class="toast-xp">+${xpGained}</span> XP`;
            showToast({ type: 'skill', message: fullMessage, compactMessage, icon: skillData.icon });
        }

        const activePage = document.querySelector('.nav-item.active')?.dataset.page;
        if (activePage === skillName) {
            const skill = gameState.skills[skillName];
            const nextLevelXp = gameState.xpThresholds[skill.level] || 'Max';
            const skillLevelEl = document.getElementById('skill-level');
            const skillXpEl = document.getElementById('skill-xp');
            if (skillLevelEl) skillLevelEl.textContent = skill.level;
            if (skillXpEl) skillXpEl.textContent = `${skill.xp} / ${nextLevelXp}`;
        }
    }
}


/**
 * The main game loop, runs multiple times a second.
 */
function gameTick() {
    processActiveAction();
    
    const currentActiveSkill = gameState.activeAction ? gameState.activeAction.skillName : null;

    if (lastActiveSkill && lastActiveSkill !== currentActiveSkill) {
        const lastNavItem = document.querySelector(`.nav-item[data-page="${lastActiveSkill}"]`);
        if (lastNavItem) lastNavItem.classList.remove('is-training');
    }

    if (gameState.activeAction) {
        const { skillName, actionName, startTime } = gameState.activeAction;
        const action = SKILL_DATA[skillName].actions[actionName];
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progressPercent = elapsedTime / action.duration;
        
        const activePage = document.querySelector('.nav-item.active')?.dataset.page;
        if (activePage === skillName) {
            // **FIX**: Select the correct progress bar for the currently running action
            const progressBar = document.getElementById(`progress-bar-${actionName}`);
            if (progressBar) {
                progressBar.style.width = `${Math.min(progressPercent * 100, 100)}%`;
            }
        }

        const navItem = document.querySelector(`.nav-item[data-page="${skillName}"]`);
        if (navItem) {
            navItem.classList.add('is-training');
            const ring = navItem.querySelector('.nav-item__progress-ring-fg');
            if(ring) {
                const radius = ring.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference * (1 - Math.min(progressPercent, 1));
                ring.style.strokeDasharray = `${circumference} ${circumference}`;
                ring.style.strokeDashoffset = offset;
            }
        }
    }
    
    lastActiveSkill = currentActiveSkill;
}

function initializeApp() {
    loadData();
    buildSidebar();
    applyTheme();
    buildPage('woodcutting');
    setupEventListeners();

    setInterval(gameTick, 250);
}

window.addEventListener('themeChanged', applyTheme);
window.addEventListener('pageChanged', (e) => buildPage(e.detail.page));

document.addEventListener('DOMContentLoaded', initializeApp);
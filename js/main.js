import { gameState, saveData, loadData } from './state.js';
import { applyTheme, buildPage, buildSidebar, showToast, skillIcons, updateSidebarLevel } from './ui.js';
import { setupEventListeners, skillActionDetails, checkLevelUp } from './handlers.js';

let lastActiveSkill = null; // Keep track of the last active skill to hide its progress ring

/**
 * Processes the active action, calculating completions and updating the state.
 */
export function processActiveAction() {
    if (!gameState.activeAction) return;

    const { skillName, startTime } = gameState.activeAction;
    const details = skillActionDetails[skillName];
    const now = Date.now();
    const elapsedTime = now - startTime;

    if (elapsedTime >= details.duration) {
        const completions = Math.floor(elapsedTime / details.duration);
        if (completions === 0) return;

        const xpGained = completions * details.xp;

        // Update state first
        gameState.skills[skillName].xp += xpGained;
        
        // Update the specific stat for the action
        const statName = details.statName;
        if (gameState.stats[skillName] && gameState.stats[skillName][statName] !== undefined) {
            gameState.stats[skillName][statName] += completions;
        }

        gameState.activeAction.startTime += completions * details.duration;
        saveData();

        // Handle UI updates and notifications
        const leveledUp = checkLevelUp(skillName);

        if (!leveledUp) {
            const skillDisplayName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
            const message = `<span class="toast-xp">+${xpGained}</span> ${skillDisplayName} XP`;
            showToast(message, skillIcons[skillName]);
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

    // Hide the old progress ring if the action has stopped or changed
    if (lastActiveSkill && lastActiveSkill !== currentActiveSkill) {
        const lastNavItem = document.querySelector(`.nav-item[data-page="${lastActiveSkill}"]`);
        if (lastNavItem) lastNavItem.classList.remove('is-training');
    }

    // This part only runs if an action is active, to update all progress visuals
    if (gameState.activeAction) {
        const { skillName, startTime } = gameState.activeAction;
        const details = skillActionDetails[skillName];
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progressPercent = elapsedTime / details.duration;
        
        // Update linear progress bar if on the correct page
        const activePage = document.querySelector('.nav-item.active')?.dataset.page;
        if (activePage === skillName) {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = `${Math.min(progressPercent * 100, 100)}%`;
            }
        }

        // Update circular progress bar in the sidebar
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
    applyTheme(gameState.settings.theme);
    buildPage('woodcutting');
    setupEventListeners();

    // Start the main game loop
    setInterval(gameTick, 250);
}

// Add event listeners for global state changes
window.addEventListener('themeChanged', (e) => applyTheme(e.detail.theme));
window.addEventListener('pageChanged', (e) => buildPage(e.detail.page));

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
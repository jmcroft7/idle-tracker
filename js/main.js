// idle-tracker/js/main.js

import { gameState, saveData, loadData } from './state.js';
import { applyTheme, buildPage, buildSidebar, showToast, formatProgressDisplay, updatePlayerNameDisplay } from './ui.js';
import { setupEventListeners, checkLevelUp } from './handlers.js';
import { SKILL_DATA, NORMAL_XP_PER_HOUR, HARD_XP_PER_HOUR } from './data.js';

let lastActiveSkill = null;

/**
 * Saves the current game state to a JSON file and triggers a download.
 */
export function saveGameToFile() {
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
 * Processes the active action, calculating progress in hours and updating state.
 */
export function processActiveAction() {
    if (!gameState.activeAction) return;

    const { skillName, actionName, startTime } = gameState.activeAction;
    const action = SKILL_DATA[skillName].actions[actionName];
    const now = Date.now();
    const elapsedTime = now - startTime;

    if (elapsedTime > 0) {
        const xpPerHour = gameState.settings.hardMode ? HARD_XP_PER_HOUR : NORMAL_XP_PER_HOUR;
        const xpGained = (elapsedTime / (1000 * 60 * 60)) * xpPerHour;
        const completions = Math.floor(elapsedTime / action.duration);
        
        gameState.skills[skillName].xp += xpGained;
        
        if (completions > 0) {
            const coinsGained = completions * (action.coins || 0);
            gameState.coins += coinsGained;
            if (gameState.stats[skillName][action.statName] !== undefined) {
                gameState.stats[skillName][action.statName] += completions;
            }
            gameState.activeAction.startTime += completions * action.duration;
            
            // Show a toast for the completed actions
             const leveledUp = checkLevelUp(skillName);
             if (!leveledUp) {
                const skillData = SKILL_DATA[skillName];
                const gainedXpForToast = Math.floor((action.duration / (1000 * 60 * 60)) * xpPerHour * completions);
                let fullMessage = `<span class="toast-xp">+${gainedXpForToast.toLocaleString()}</span> ${skillData.displayName} XP`;
                let compactMessage = `<span class="toast-xp">+${gainedXpForToast.toLocaleString()}</span> XP`;
                if (coinsGained > 0) {
                    fullMessage += `, <span class="toast-coins">+${coinsGained}</span> Coins`;
                    compactMessage += `, <span class="toast-coins">+${coinsGained}</span>`;
                }
                showToast({ type: 'skill', message: fullMessage, compactMessage, icon: skillData.icon });
            }
        }
        
        saveData();

        const activePage = document.querySelector('.nav-item.active')?.dataset.page;
        if (activePage === skillName) {
            const skill = gameState.skills[skillName];
            const skillLevelEl = document.getElementById('skill-level');
            const progressContainer = document.getElementById('progress-display-container');

            if (skillLevelEl) skillLevelEl.textContent = skill.level;
            
            if (progressContainer) {
                progressContainer.innerHTML = formatProgressDisplay(skill);
            }
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
        const elapsedTimeSinceLastCompletion = (now - startTime) % action.duration;
        const progressPercent = (elapsedTimeSinceLastCompletion / action.duration) * 100;
        
        const activePage = document.querySelector('.nav-item.active')?.dataset.page;
        if (activePage === skillName) {
            const progressBar = document.getElementById(`progress-bar-${actionName}`);
            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }
        }

        const navItem = document.querySelector(`.nav-item[data-page="${skillName}"]`);
        if (navItem) {
            navItem.classList.add('is-training');
            const ring = navItem.querySelector('.nav-item__progress-ring-fg');
            if(ring) {
                const radius = ring.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference * (1 - (progressPercent / 100));
                ring.style.strokeDasharray = `${circumference} ${circumference}`;
                ring.style.strokeDashoffset = offset;
            }
        }
    }
    
    // Update the coin display in the sidebar header
    const walletDisplay = document.getElementById('sidebar-wallet-coins');
    if (walletDisplay) {
        walletDisplay.textContent = gameState.coins.toLocaleString();
    }

    lastActiveSkill = currentActiveSkill;
}

/**
 * Resets the game to its default state after saving the current progress.
 */
export function resetGame() {
    if (confirm("Are you sure you want to reset your game? Your current progress will be downloaded as a save file before resetting.")) {
        saveGameToFile();
        localStorage.removeItem('idleGameSave');
        showToast('Game has been reset.');
        setTimeout(() => location.reload(), 1000);
    }
}

function initializeApp() {
    loadData();
    buildSidebar();
    applyTheme();
    buildPage('woodcutting');
    updatePlayerNameDisplay();
    setupEventListeners();

    setInterval(gameTick, 250);
}

window.addEventListener('themeChanged', applyTheme);
window.addEventListener('pageChanged', (e) => buildPage(e.detail.page));

document.addEventListener('DOMContentLoaded', initializeApp);
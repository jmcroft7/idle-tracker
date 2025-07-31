import { gameState, saveData, updateSetting } from './state.js';
import { showToast } from './ui.js';

let isCutting = false;
let cutInterval = null;

/**
 * Sets up all event listeners for the application.
 */
export function setupEventListeners() {
    const mainContent = document.getElementById('main-content');
    const loadFileInput = document.getElementById('load-file-input');

    // Use event delegation for navigation
    document.querySelector('.sidebar__nav').addEventListener('click', handleNavClick);

    // Use event delegation for dynamically created content
    mainContent.addEventListener('click', handleMainContentClick);

    // Listener for settings changes
    mainContent.addEventListener('change', handleSettingsChange);
    
    // Listener for file loading
    loadFileInput.addEventListener('change', handleFileLoad);
}

// --- EVENT HANDLER FUNCTIONS ---

function handleNavClick(e) {
    e.preventDefault();
    const navItem = e.target.closest('.nav-item');
    if (navItem && !navItem.classList.contains('active')) {
        const pageName = navItem.dataset.page;
        // Dispatch a custom event to notify other modules of the change
        window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
    }
}

function handleMainContentClick(e) {
    const targetId = e.target.id;
    switch (targetId) {
        case 'action-btn':
            toggleWoodcutting(); // This now toggles the loop
            break;
        case 'save-btn':
            handleSaveToFile();
            break;
        case 'load-btn':
            document.getElementById('load-file-input').click();
            break;
    }
}

function handleSettingsChange(e) {
    if (e.target.id === 'theme-select') {
        const newTheme = e.target.value;
        updateSetting('theme', newTheme);
        // Dispatch event to notify UI module
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }
}


function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedState = JSON.parse(e.target.result);
            // Basic validation
            if (loadedState && loadedState.skills && loadedState.settings) {
                // Directly overwrite the gameState and then save
                Object.assign(gameState, loadedState);
                saveData();
                showToast('Game Loaded Successfully!');
                // Reload the entire app to reflect the new state
                location.reload(); 
            } else {
                throw new Error("Invalid save file format.");
            }
        } catch (error) {
            console.error("Failed to load game:", error);
            showToast('Error: Invalid save file.');
        } finally {
            event.target.value = ''; // Reset input
        }
    };
    reader.readAsText(file);
}

function handleSaveToFile() {
    try {
        const gameStateString = JSON.stringify(gameState, null, 2); // Pretty print JSON
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
 * Toggles the woodcutting action loop on and off.
 */
function toggleWoodcutting() {
    isCutting = !isCutting; // Flip the state
    const actionBtn = document.getElementById('action-btn');

    if (isCutting) {
        actionBtn.textContent = 'Stop Cutting';
        runWoodcuttingCycle(); // Start the loop
    } else {
        actionBtn.textContent = 'Start Cutting';
        clearInterval(cutInterval); // Stop any current animation
        cutInterval = null;
        // Optionally reset progress bar visuals
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }
}


/**
 * Runs a single cycle of the woodcutting action and then calls itself if still active.
 */
function runWoodcuttingCycle() {
    // If the user has clicked "Stop" while the action was running, exit the loop.
    if (!isCutting) {
        return;
    }
    
    const progressBar = document.getElementById('progress-bar');
    // Ensure button is enabled to allow stopping
    document.getElementById('action-btn').disabled = false;

    let progress = 0;
    const duration = 3000; // 3 seconds in ms
    const xpGain = 10;
    const intervalTime = 30; // Update every 30ms

    cutInterval = setInterval(() => {
        progress += intervalTime;
        const width = (progress / duration) * 100;
        // Ensure progress bar exists before trying to modify it
        if (progressBar) {
            progressBar.style.width = `${width}%`;
        }

        if (progress >= duration) {
            clearInterval(cutInterval);
            
            // --- Update State & UI ---
            gameState.skills.woodcutting.xp += xpGain;
            checkLevelUp();
            saveData();
            
            const wc = gameState.skills.woodcutting;
            const nextLevelXp = gameState.xpThresholds[wc.level] || 'Max';
            const wcLevelEl = document.getElementById('wc-level');
            const wcXpEl = document.getElementById('wc-xp');
            if(wcLevelEl) wcLevelEl.textContent = wc.level;
            if(wcXpEl) wcXpEl.textContent = `${wc.xp} / ${nextLevelXp}`;
            
            // --- Loop ---
            // If we are still supposed to be cutting, start the next cycle.
            // A small delay can prevent the UI from feeling locked up.
            setTimeout(runWoodcuttingCycle, 100);
        }
    }, intervalTime);
}

function checkLevelUp() {
    const wc = gameState.skills.woodcutting;
    const nextLevelXp = gameState.xpThresholds[wc.level];
    if (nextLevelXp && wc.xp >= nextLevelXp) {
        wc.level++;
        wc.xp -= nextLevelXp; // Carry over remaining XP
        showToast(`Woodcutting level up! Reached level ${wc.level}.`);
    }
}

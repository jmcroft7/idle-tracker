import { loadData, gameState } from './state.js';
import { applyTheme, buildPage } from './ui.js';
import { setupEventListeners } from './handlers.js';

function initializeApp() {
    // Load saved data from localStorage
    loadData();

    // Set the initial theme
    applyTheme(gameState.settings.theme);

    // Build the initial page (skills)
    buildPage('skills');

    // Set up all event listeners for interactivity
    setupEventListeners();

    // Start the main game loop (e.g., for passive resource generation)
    // setInterval(gameTick, 1000); // Example for a future feature
}

// Add event listeners for global state changes
window.addEventListener('themeChanged', (e) => applyTheme(e.detail.theme));
window.addEventListener('pageChanged', (e) => buildPage(e.detail.page));

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

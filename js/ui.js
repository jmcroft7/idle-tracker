import { gameState } from './state.js';

const mainContent = document.getElementById('main-content');
const themeStylesheet = document.getElementById('theme-stylesheet');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;

/**
 * Applies the selected color theme.
 * @param {string} themeName - The name of the theme (e.g., 'dark').
 */
export function applyTheme(themeName) {
    themeStylesheet.setAttribute('href', `css/themes/${themeName}.css`);
}

/**
 * Builds and displays the content for a given page.
 * @param {string} pageName - The name of the page to build.
 */
export function buildPage(pageName) {
    mainContent.innerHTML = ''; // Clear existing content
    switch (pageName) {
        case 'skills':
            mainContent.innerHTML = buildSkillsPage();
            break;
        case 'settings':
            mainContent.innerHTML = buildSettingsPage();
            break;
        case 'about':
            mainContent.innerHTML = buildAboutPage();
            break;
    }
    updateActiveNav(pageName);
}

/**
 * Shows a short-lived notification message (a "toast").
 * @param {string} message - The message to display.
 */
export function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}


// --- PAGE BUILDER FUNCTIONS ---

function buildSkillsPage() {
    const wc = gameState.skills.woodcutting;
    const nextLevelXp = gameState.xpThresholds[wc.level] || 'Max';

    return `
        <h2 class="page-header">Skills</h2>
        <div class="info-bar">
            <div class="info-bar__item">Woodcutting Level: <span id="wc-level" class="info-bar__value">${wc.level}</span></div>
            <div class="info-bar__item">Woodcutting XP: <span id="wc-xp" class="info-bar__value">${wc.xp} / ${nextLevelXp}</span></div>
        </div>
        <div class="action-grid">
            <div class="action-card">
                <h3 class="action-card__title">Cut Normal Tree</h3>
                <p class="action-card__subtitle">10 XP / 3 seconds</p>
                <div class="action-card__progress-bar">
                    <div id="progress-bar" class="action-card__progress"></div>
                </div>
                <button id="action-btn" class="button button--primary">Start Cutting</button>
            </div>
            </div>
    `;
}

function buildSettingsPage() {
    return `
        <h2 class="page-header">Settings</h2>
        <div class="settings-section">
            <div class="form-group">
                <label for="theme-select">Theme</label>
                <select id="theme-select">
                    <option value="dark" ${gameState.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                    <option value="light" ${gameState.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                </select>
            </div>
            <div class="form-group">
                <label>Game Data</label>
                <div class="button-group">
                    <button id="save-btn" class="button button--primary">Save to File</button>
                    <button id="load-btn" class="button button--secondary">Load from File</button>
                </div>
            </div>
        </div>
    `;
}

function buildAboutPage() {
    return `
        <h2 class="page-header">About</h2>
        <div class="about-section">
            <p>This is a simple idle game inspired by Melvor Idle.</p>
            <p>It is built with HTML, CSS, and vanilla JavaScript.</p>
        </div>
    `;
}

// --- UI UPDATE FUNCTIONS ---

function updateActiveNav(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

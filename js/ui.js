// idle-tracker/js/ui.js

import { gameState } from './state.js';
import { buildSidebar as buildSidebarComponent } from './components/0_sidebar.js';
import { buildSkillPage } from './components/3_skillPage.js';
import { buildStatsPage, setSelectedStatSkill } from './components/4_statsPage.js';
import { buildSettingsPage } from './components/00_settingsPage.js';
import { buildAboutPage } from './components/00_aboutPage.js';
import { buildSkillManagerPage } from './components/5_skillManagerPage.js';
import { buildBankPage } from './components/2_bankPage.js';
import { buildShopPage } from './components/1_shopPage.js';
import { buildSkillGroupManagerPage } from './components/8_skillGroupManagerPage.js';
import { buildManualEntryPage } from './components/9_manualEntryPage.js';
import { HARD_XP_PER_HOUR, NORMAL_XP_PER_HOUR, MAX_LEVEL, SHOP_DATA } from './data.js';

const mainContent = document.getElementById('main-content');
const themeStylesheet = document.getElementById('theme-stylesheet');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;

// Re-export functions that are needed by other modules
export { setSelectedStatSkill };

/**
 * Builds the entire sidebar.
 */
export function buildSidebar() {
    buildSidebarComponent();
    // Also update the coin display any time the sidebar is rebuilt
    const walletDisplay = document.getElementById('sidebar-wallet-coins');
    if (walletDisplay) walletDisplay.textContent = gameState.coins.toLocaleString();
}

/**
 * Applies the current theme and background image settings.
 */
export function applyTheme() {
    const { useDarkMode, backgroundImage } = gameState.settings;
    const themeName = useDarkMode ? 'dark' : 'light';
    themeStylesheet.setAttribute('href', `css/themes/${themeName}.css`);

    const backgroundUrl = backgroundImage === 'none' ? '' : `url('${backgroundImage}')`;
    document.body.style.backgroundImage = backgroundUrl;

    if (backgroundImage !== 'none') {
        document.body.classList.add('body-has-background');
    } else {
        document.body.classList.remove('body-has-background');
    }
}

/**
 * Formats the progress display string for the info bar (XP or Hours).
 * @param {object} skillState The state object for the skill.
 * @returns {string} The HTML string for the progress display.
 */
export function formatProgressDisplay(skillState) {
    const { settings, xpThresholds } = gameState;
    const { showHoursInsteadOfXP, hardMode } = settings;
    const isMaxLevel = skillState.level >= MAX_LEVEL;
    
    const nextLevelXp = isMaxLevel ? xpThresholds[MAX_LEVEL] : xpThresholds[skillState.level + 1];

    if (showHoursInsteadOfXP) {
        const xpPerHour = hardMode ? HARD_XP_PER_HOUR : NORMAL_XP_PER_HOUR;
        const currentHours = (skillState.xp / xpPerHour).toFixed(2);
        const nextLevelHours = (nextLevelXp / xpPerHour).toFixed(2);
        return `Total Hours: <span id="skill-progress" class="info-bar__value">${currentHours} / ${nextLevelHours}</span>`;
    } else {
        return `Total XP: <span id="skill-progress" class="info-bar__value">${Math.floor(skillState.xp).toLocaleString()} / ${nextLevelXp.toLocaleString()}</span>`;
    }
}

/**
 * Maps page names to their corresponding builder functions (components).
 */
const pageTemplates = {
    shop: buildShopPage,
    bank: buildBankPage,
    stats: buildStatsPage,
    settings: buildSettingsPage,
    about: buildAboutPage,
    skillManager: buildSkillManagerPage,
    skillGroupManager: buildSkillGroupManagerPage,
    manualEntry: buildManualEntryPage,
    // Default case for skills
    skill: buildSkillPage,
};

/**
 * Builds and displays the content for a given page.
 * @param {string} pageName The name of the page to build.
 */
export function buildPage(pageName) {
    // Build the player name display first
    let contentHtml = buildPlayerNameDisplay();
    const pageBuilder = pageTemplates[pageName] || pageTemplates.skill;
    contentHtml += pageBuilder(pageName);
    mainContent.innerHTML = contentHtml;
    updateActiveNav(pageName);
}

/**
 * Builds the HTML for the player name display in the main header.
 * @returns {string} The HTML string for the player name display.
 */
function buildPlayerNameDisplay() {
    const { playerName } = gameState.settings;
    const { purchasedTitles, equippedTitle } = gameState;

    const titleName = (equippedTitle && equippedTitle !== 'none') ? SHOP_DATA.titles.items[equippedTitle].name : '';

    let titleOptionsHtml = purchasedTitles.map(titleKey => {
        const title = SHOP_DATA.titles.items[titleKey];
        if (!title) return '';
        return `<option value="${titleKey}" ${equippedTitle === titleKey ? 'selected' : ''}>${title.name}</option>`;
    }).join('');

    return `
        <div class="main-header">
            <div class="player-dropdown">
                <div class="player-dropdown__name" id="player-dropdown-toggle">
                    <div class="player-display">
                        <span class="player-display__name" id="player-name-main">${playerName}</span>
                        <span class="player-display__title" id="player-title-main">${titleName}</span>
                    </div>
                    <span>▼</span>
                </div>
                <div class="player-dropdown-menu" id="player-dropdown-menu">
                    <div class="player-name-display">${playerName}</div>
                    <select id="title-select" class="styled-select">${titleOptionsHtml}</select>
                    <button id="reset-game-btn" class="button">Reset Game</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Shows a short-lived notification message (a "toast").
 * @param {string|object} data The message string or a data object for complex toasts.
 */
export function showToast(data) {
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastNotification.className = `toast-position--${gameState.settings.notificationPosition}`;

    let toastContent = '';
    if (typeof data === 'object' && data !== null && data.type === 'skill') {
        if (data.icon) toastContent += `<span class="toast-icon">${data.icon}</span>`;
        toastContent += gameState.settings.notificationShowName ? data.message : data.compactMessage;
    } else {
        toastContent = data;
    }
    
    toastMessage.innerHTML = toastContent;
    toastNotification.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
    }, gameState.settings.notificationDuration);
}

/**
 * Updates a single skill's level in the sidebar.
 * @param {string} skillName The name of the skill that leveled up.
 */
export function updateSidebarLevel(skillName) {
    const skill = gameState.skills[skillName];
    const levelElement = document.querySelector(`.nav-item__level[data-level-for="${skillName}"]`);
    if (levelElement) {
        levelElement.textContent = `(${skill.level}/${MAX_LEVEL})`;
    }
}

/**
 * Updates just the player name in the header display.
 */
export function updatePlayerNameDisplay() {
    const { playerName } = gameState.settings;
    const { equippedTitle } = gameState;

    const titleName = (equippedTitle && equippedTitle !== 'none') ? SHOP_DATA.titles.items[equippedTitle].name : '';
    
    const mainNameEl = document.getElementById('player-name-main');
    if (mainNameEl) mainNameEl.textContent = playerName;

    const mainTitleEl = document.getElementById('player-title-main');
    if (mainTitleEl) mainTitleEl.textContent = titleName;
    
    const dropdownDisplay = document.querySelector('.player-dropdown-menu .player-name-display');
    if (dropdownDisplay) dropdownDisplay.textContent = playerName;
}

/**
 * Updates the active state of the sidebar navigation links.
 * @param {string} pageName The name of the currently active page.
 */
function updateActiveNav(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}
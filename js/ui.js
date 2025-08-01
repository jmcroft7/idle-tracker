import { gameState } from './state.js';
import { buildSidebar } from './components/0_sidebar.js';
import { buildSkillPage } from './components/3_skillPage.js';
import { buildStatsPage, setSelectedStatSkill } from './components/4_statsPage.js';
import { buildSettingsPage } from './components/6_settingsPage.js';
import { buildAboutPage } from './components/7_aboutPage.js';
import { buildSkillManagerPage } from './components/5_skillManagerPage.js';
import { buildBankPage } from './components/2_bankPage.js';
import { buildShopPage } from './components/1_shopPage.js';

const mainContent = document.getElementById('main-content');
const themeStylesheet = document.getElementById('theme-stylesheet');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;

// Re-export functions that are needed by other modules
export { buildSidebar, setSelectedStatSkill };

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
 * Maps page names to their corresponding builder functions (components).
 */
const pageTemplates = {
    shop: buildShopPage,
    bank: buildBankPage,
    stats: buildStatsPage,
    settings: buildSettingsPage,
    about: buildAboutPage,
    skillManager: buildSkillManagerPage,
    // Default case for skills
    skill: buildSkillPage,
};

/**
 * Builds and displays the content for a given page.
 * @param {string} pageName The name of the page to build.
 */
export function buildPage(pageName) {
    mainContent.innerHTML = '';
    const pageBuilder = pageTemplates[pageName] || pageTemplates.skill;
    mainContent.innerHTML = pageBuilder(pageName);
    updateActiveNav(pageName);
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
        levelElement.textContent = `(${skill.level}/99)`;
    }
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
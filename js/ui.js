import { gameState } from './state.js';

const mainContent = document.getElementById('main-content');
const themeStylesheet = document.getElementById('theme-stylesheet');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;
let selectedStatSkill = 'all'; // Default to "All" stats view

// Emojis for skill icons
export const skillIcons = {
    woodcutting: '🪵',
    reading: '📖',
    writing: '✍️',
    gaming: '🎮',
    coding: '💻',
    fitness: '🏋️',
    cooking: '🍳',
    mycology: '🍄'
};

/**
 * Builds the entire sidebar dynamically from game state.
 */
export function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    const skills = gameState.skills;

    let skillsHtml = '';
    for (const skillName in skills) {
        const skill = skills[skillName];
        const skillDisplayName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
        skillsHtml += `
            <li>
                <a href="#" class="nav-item" data-page="${skillName}">
                    <div class="nav-item__icon-wrapper">
                        <svg class="nav-item__progress-ring" width="32" height="32">
                            <circle class="nav-item__progress-ring-bg" r="14" cx="16" cy="16"/>
                            <circle class="nav-item__progress-ring-fg" r="14" cx="16" cy="16"/>
                        </svg>
                        <span class="nav-item__icon">${skillIcons[skillName] || '❓'}</span>
                    </div>
                    <span>${skillDisplayName}</span>
                    <span class="nav-item__level" data-level-for="${skillName}">(${skill.level}/99)</span>
                </a>
            </li>
        `;
    }

    const sidebarHtml = `
        <div class="sidebar__header">
            <h1 class="sidebar__title">IdleQuest</h1>
        </div>
        <div class="sidebar__content-wrapper">
            <div class="sidebar__category" data-collapsible-target="skills-nav-list">
                <span>SKILLS</span>
                <span class="collapse-icon">👁️</span>
            </div>
            <ul class="sidebar__nav" id="skills-nav-list">
                ${skillsHtml}
            </ul>

            <div class="sidebar__category" data-collapsible-target="general-nav-list">
                <span>GENERAL</span>
                <span class="collapse-icon">🙈</span>
            </div>
            <ul class="sidebar__nav collapsed" id="general-nav-list">
                <li><a href="#" class="nav-item" data-page="stats"><span>📊</span>Stats</a></li>
                <li><a href="#" class="nav-item" data-page="settings"><span>⚙️</span>Settings</a></li>
                <li><a href="#" class="nav-item" data-page="about"><span>ℹ️</span>About</a></li>
            </ul>

            <div class="sidebar__category" data-collapsible-target="socials-nav-list">
                <span>SOCIALS</span>
                <span class="collapse-icon">🙈</span>
            </div>
            <ul class="sidebar__nav collapsed" id="socials-nav-list">
                <li><a href="#" class="nav-item" target="_blank"><span></span>GitHub</a></li>
                <li><a href="#" class="nav-item" target="_blank"><span></span>Discord</a></li>
            </ul>
        </div>
    `;
    sidebar.innerHTML = sidebarHtml;
}

/**
 * Updates a single skill's level in the sidebar.
 * @param {string} skillName - The name of the skill that leveled up.
 */
export function updateSidebarLevel(skillName) {
    const skill = gameState.skills[skillName];
    const levelElement = document.querySelector(`.nav-item__level[data-level-for="${skillName}"]`);
    if (levelElement) {
        levelElement.textContent = `(${skill.level}/99)`;
    }
}

/**
 * Sets the currently selected skill for the stats page and re-renders it.
 * @param {string} skillName
 */
export function setSelectedStatSkill(skillName) {
    selectedStatSkill = skillName;
    buildPage('stats');
}

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
    const skillNames = Object.keys(gameState.skills);

    if (skillNames.includes(pageName)) {
        mainContent.innerHTML = buildSkillPage(pageName);
    } else {
        switch (pageName) {
            case 'stats':
                mainContent.innerHTML = buildStatsPage();
                break;
            case 'settings':
                mainContent.innerHTML = buildSettingsPage();
                break;
            case 'about':
                mainContent.innerHTML = buildAboutPage();
                break;
        }
    }
    updateActiveNav(pageName);
}

/**
 * Shows a short-lived notification message (a "toast").
 * @param {string} message - The message to display.
 * @param {string|null} icon - An optional icon to display.
 */
export function showToast(message, icon = null) {
    if (toastTimeout) clearTimeout(toastTimeout);
    
    let toastContent = '';
    if (icon) {
        toastContent = `<span style="margin-right: 10px;">${icon}</span>`;
    }
    toastContent += message;
    
    toastMessage.innerHTML = toastContent;
    toastNotification.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// --- PAGE BUILDER FUNCTIONS ---

function buildSkillPage(skillName) {
    const skill = gameState.skills[skillName];
    const nextLevelXp = gameState.xpThresholds[skill.level] || 'Max';
    const skillDisplayName = skillName.charAt(0).toUpperCase() + skillName.slice(1);

    const actionDetails = {
        woodcutting: { title: 'Cut Normal Tree', subtitle: '10 XP / 3 seconds', buttonText: 'Start Cutting' },
        reading: { title: 'Read a Book', subtitle: '12 XP / 4 seconds', buttonText: 'Start Reading' },
        writing: { title: 'Write a Poem', subtitle: '15 XP / 5 seconds', buttonText: 'Start Writing' },
        gaming: { title: 'Play a Match', subtitle: '8 XP / 2.5 seconds', buttonText: 'Start Gaming' },
        coding: { title: 'Fix a Bug', subtitle: '20 XP / 6 seconds', buttonText: 'Start Coding' },
        fitness: { title: 'Do a Workout', subtitle: '18 XP / 5.5 seconds', buttonText: 'Start Training' },
        cooking: { title: 'Cook a Meal', subtitle: '14 XP / 4.5 seconds', buttonText: 'Start Cooking' },
        mycology: { title: 'Forage Mushrooms', subtitle: '22 XP / 7 seconds', buttonText: 'Start Foraging' },
    };
    const details = actionDetails[skillName];
    
    const isActionRunning = gameState.activeAction && gameState.activeAction.skillName === skillName;
    const buttonText = isActionRunning ? 'Stop' : details.buttonText;

    return `
        <h2 class="page-header">${skillDisplayName}</h2>
        <div class="info-bar">
            <div class="info-bar__item">${skillDisplayName} Level: <span id="skill-level" class="info-bar__value">${skill.level}</span></div>
            <div class="info-bar__item">${skillDisplayName} XP: <span id="skill-xp" class="info-bar__value">${skill.xp} / ${nextLevelXp}</span></div>
        </div>
        <div class="action-grid">
            <div class="action-card">
                <h3 class="action-card__title">${details.title}</h3>
                <p class="action-card__subtitle">${details.subtitle}</p>
                <div class="action-card__progress-bar">
                    <div id="progress-bar" class="action-card__progress"></div>
                </div>
                <button id="action-btn" data-action-skill="${skillName}" class="button button--primary">${buttonText}</button>
            </div>
        </div>
    `;
}

function buildStatsPage() {
    const statDisplayNames = {
        treesCut: "Trees Cut",
        booksRead: "Books Read",
        poemsWritten: "Poems Written",
        matchesPlayed: "Matches Played",
        bugsFixed: "Bugs Fixed",
        workoutsCompleted: "Workouts Completed",
        mealsCooked: "Meals Cooked",
        mushroomsForaged: "Mushrooms Foraged"
    };

    // --- Build Skill Selection Grid ---
    let skillGridHtml = `<button class="stats-skill-button ${selectedStatSkill === 'all' ? 'active' : ''}" data-stat-skill="all">🌐 All</button>`;
    for (const skillName in gameState.skills) {
        const isActive = skillName === selectedStatSkill ? 'active' : '';
        skillGridHtml += `
            <button class="stats-skill-button ${isActive}" data-stat-skill="${skillName}">
                ${skillIcons[skillName]} ${skillName.charAt(0).toUpperCase() + skillName.slice(1)}
            </button>
        `;
    }

    // --- Build Stats Table ---
    let statsTableHtml = '';
    const headerText = selectedStatSkill === 'all' ? 'All Skills' : selectedStatSkill.charAt(0).toUpperCase() + selectedStatSkill.slice(1);
    
    const skillsToDisplay = selectedStatSkill === 'all' 
        ? Object.keys(gameState.stats) 
        : [selectedStatSkill];

    skillsToDisplay.forEach(skillName => {
        const skillStats = gameState.stats[skillName];
        if (skillStats) {
            for (const statKey in skillStats) {
                statsTableHtml += `
                    <div class="stat-row">
                        <span class="stat-label">${statDisplayNames[statKey] || statKey}</span>
                        <span class="stat-value">${skillStats[statKey].toLocaleString()}</span>
                    </div>
                `;
            }
        }
    });

    return `
        <h2 class="page-header">Statistics</h2>
        <div class="stats-skill-grid">
            ${skillGridHtml}
        </div>
        <div class="stats-container">
            <h3 class="stats-header">${headerText}</h3>
            ${statsTableHtml}
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

/**
 * Updates the active state of the sidebar navigation links.
 * @param {string} pageName - The name of the currently active page.
 */
export function updateActiveNav(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}
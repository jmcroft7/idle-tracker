import { gameState } from '../state.js';
import { SKILL_DATA } from '../data.js';

export function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    let skillsHtml = '';

    let skillsToDisplay = [...gameState.unlockedSkills];

    if (gameState.settings.skillSortByLevel) {
        skillsToDisplay.sort((a, b) => gameState.skills[b].level - gameState.skills[a].level);
    }
    
    skillsToDisplay.forEach(skillName => {
        const skillData = SKILL_DATA[skillName];
        const currentSkillState = gameState.skills[skillName];
        if (!skillData || !currentSkillState) return;
        
        skillsHtml += `
            <li>
                <a href="#" class="nav-item" data-page="${skillName}">
                    <div class="nav-item__icon-wrapper">
                        <svg class="nav-item__progress-ring" width="32" height="32">
                            <circle class="nav-item__progress-ring-bg" r="14" cx="16" cy="16"/>
                            <circle class="nav-item__progress-ring-fg" r="14" cx="16" cy="16"/>
                        </svg>
                        <span class="nav-item__icon">${skillData.icon || '❓'}</span>
                    </div>
                    <span>${skillData.displayName}</span>
                    <span class="nav-item__level" data-level-for="${skillName}">(${currentSkillState.level}/99)</span>
                </a>
            </li>
        `;
    });


    sidebar.innerHTML = `
        <div class="sidebar__header">
            <h1 class="sidebar__title">
                IdleQuest
                <span class="sidebar__title-icon">🧭</span>
            </h1>
        </div>
        <div class="sidebar__content-wrapper">
            
            <ul class="sidebar__nav">
                <li>
                    <a href="#" class="nav-item" data-page="shop">
                        <span>🪙</span>
                        <span>Shop</span>
                        <div class="nav-item__pill">
                            <span>💰</span>
                            <span id="sidebar-wallet-coins">${gameState.coins.toLocaleString()}</span>
                        </div>
                    </a>
                </li>
                <li><a href="#" class="nav-item" data-page="bank"><span>🏦</span>Bank</a></li>
            </ul>

            <div class="sidebar__category" data-collapsible-target="skills-nav-list">
                <span>SKILLS</span>
                <span class="collapse-icon">👁️</span>
            </div>
            <ul class="sidebar__nav" id="skills-nav-list">${skillsHtml}</ul>
            
            <div class="sidebar__category" data-collapsible-target="general-nav-list">
                <span>GENERAL</span>
                <span class="collapse-icon">🙈</span>
            </div>
            <ul class="sidebar__nav collapsed" id="general-nav-list">
                <li><a href="#" class="nav-item" data-page="stats"><span>📊</span>Stats</a></li>
                <li><a href="#" class="nav-item" data-page="skillManager"><span>✨</span>Manage Skills</a></li>
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
}
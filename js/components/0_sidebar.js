// idle-tracker/js/components/0_sidebar.js

import { gameState } from '../state.js';
import { SKILL_DATA, MAX_LEVEL } from '../data.js';

export function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    let skillsHtml = '';

    const renderSkillItem = (skillName) => {
        const skillData = SKILL_DATA[skillName];
        const currentSkillState = gameState.skills[skillName];
        if (!skillData || !currentSkillState) return '';
        return `
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
                    <span class="nav-item__level" data-level-for="${skillName}">(${currentSkillState.level}/${MAX_LEVEL})</span>
                </a>
            </li>
        `;
    };

    if (gameState.settings.groupSkillsInSidebar) {
        const sortedGroupNames = Object.keys(gameState.skillGroups).sort();
        sortedGroupNames.forEach(groupName => {
            const groupSkills = gameState.skillGroups[groupName];
            const isCollapsed = gameState.collapsedSkillGroups.includes(groupName);
            let displaySkills = groupSkills.filter(skillName => gameState.unlockedSkills.includes(skillName));
            if (gameState.settings.skillSortByLevel) {
                displaySkills.sort((a, b) => gameState.skills[b].level - gameState.skills[a].level);
            }
            if (displaySkills.length > 0) {
                const skillItemsHtml = displaySkills.map(renderSkillItem).join('');
                skillsHtml += `
                    <div class="sidebar__category" data-collapsible-target="skills-nav-${groupName}">
                        <span>${groupName}</span>
                        <span class="collapse-icon">${isCollapsed ? '🙈' : '👁️'}</span>
                    </div>
                    <ul class="sidebar__nav ${isCollapsed ? 'collapsed' : ''}" id="skills-nav-${groupName}">
                        ${skillItemsHtml}
                    </ul>
                `;
            }
        });
    } else {
        const isCollapsed = gameState.settings.skillsCollapsed;
        let allSkills = [...gameState.unlockedSkills];
        if (gameState.settings.skillSortByLevel) {
            allSkills.sort((a, b) => gameState.skills[b].level - gameState.skills[a].level);
        }
        skillsHtml = `
            <div class="sidebar__category" data-collapsible-target="skills-nav-all">
                <span>SKILLS</span>
                <span class="collapse-icon">${isCollapsed ? '🙈' : '👁️'}</span>
            </div>
            <ul class="sidebar__nav ${isCollapsed ? 'collapsed' : ''}" id="skills-nav-all">
                ${allSkills.map(renderSkillItem).join('')}
            </ul>
        `;
    }


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

            ${skillsHtml}
            
            <div class="sidebar__category" data-collapsible-target="general-nav-list">
                <span>GENERAL</span>
                <span class="collapse-icon">${gameState.collapsedSkillGroups.includes('general') ? '🙈' : '👁️'}</span>
            </div>
            <ul class="sidebar__nav ${gameState.collapsedSkillGroups.includes('general') ? 'collapsed' : ''}" id="general-nav-list">
                <li><a href="#" class="nav-item" data-page="stats"><span>📊</span>Stats</a></li>
                <li><a href="#" class="nav-item" data-page="skillManager"><span>✨</span>Manage Skills</a></li>
                <li><a href="#" class="nav-item" data-page="skillGroupManager"><span>📁</span>Manage Groups</a></li>
                <li><a href="#" class="nav-item" data-page="manualEntry"><span>📝</span>Manual Entry</a></li>
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
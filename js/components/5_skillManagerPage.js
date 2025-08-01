import { gameState, saveData } from '../state.js';
import { SKILL_DATA, ALL_SKILL_NAMES } from '../data.js';
import { showToast } from '../ui.js';
import { buildSidebar, buildPage } from '../ui.js';

export function buildSkillManagerPage() {
    const { unlockedSkills, settings } = gameState;
    
    let skillsToDisplay = [...ALL_SKILL_NAMES];

    if (settings.skillSortByLevel) {
        skillsToDisplay.sort((a, b) => gameState.skills[b].level - gameState.skills[a].level);
    }

    const skillGridHtml = skillsToDisplay.map(skillName => {
        const skillData = SKILL_DATA[skillName];
        const isUnlocked = unlockedSkills.includes(skillName);
        const isTraining = gameState.activeAction?.skillName === skillName;

        let statusClass = isUnlocked ? 'unlocked' : 'locked';
        if (isTraining) statusClass = 'training';

        return `
            <div class="skill-manager-card ${statusClass}" data-select-skill="${skillName}">
                <div class="skill-manager-card__icon">${skillData.icon}</div>
                <div class="skill-manager-card__name">${skillData.displayName}</div>
                <div class="skill-manager-card__level">Level ${gameState.skills[skillName].level}</div>
            </div>
        `;
    }).join('');
    
    return `
        <h2 class="page-header">Manage Skills</h2>
        <div class="info-bar">
            <div class="info-bar__item">Click a skill to add or remove it from your active list.</div>
            <div class="info-bar__item">Active Skills: <span class="info-bar__value" id="active-skill-count">${unlockedSkills.length} / 10</span></div>
        </div>
        <div class="skill-manager-grid">
            ${skillGridHtml}
        </div>
    `;
}

export function handleSkillSelection(skillName) {
    const { unlockedSkills } = gameState;
    const isUnlocked = unlockedSkills.includes(skillName);

    if (isUnlocked) {
        if (gameState.activeAction?.skillName === skillName) {
            showToast("You can't lock a skill that is currently being trained.", '⛔');
            return;
        }
        gameState.unlockedSkills = unlockedSkills.filter(s => s !== skillName);
    } else {
        if (unlockedSkills.length >= 10) {
            showToast("You can only have 10 skills active at a time.", '⛔');
            return;
        }
        gameState.unlockedSkills.push(skillName);
        gameState.unlockedSkills.sort((a, b) => ALL_SKILL_NAMES.indexOf(a) - ALL_SKILL_NAMES.indexOf(b));
    }
    
    saveData();
    buildSidebar();
    buildPage('skillManager');
}
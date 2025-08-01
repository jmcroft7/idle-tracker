// idle-tracker/js/components/8_skillGroupManagerPage.js

import { gameState } from '../state.js';
import { SKILL_DATA } from '../data.js';

export function buildSkillGroupManagerPage() {
    const { unlockedSkills, skillGroups } = gameState;

    const groupOptionsHtml = Object.keys(skillGroups).map(groupName => `<option value="${groupName}">${groupName}</option>`).join('');

    const skillRowsHtml = unlockedSkills.map(skillName => {
        const skillData = SKILL_DATA[skillName];
        let currentGroup = 'None';
        for (const group in skillGroups) {
            if (skillGroups[group].includes(skillName)) {
                currentGroup = group;
                break;
            }
        }

        return `
            <div class="skill-group-manager-row">
                <div class="skill-group-manager-row__skill-info">
                    <span class="skill-group-manager-row__icon">${skillData.icon}</span>
                    <span class="skill-group-manager-row__name">${skillData.displayName}</span>
                </div>
                <div class="skill-group-manager-row__actions">
                    <select class="styled-select skill-group-select" data-skill-name="${skillName}">
                        ${Object.keys(skillGroups).map(groupName => `<option value="${groupName}" ${currentGroup === groupName ? 'selected' : ''}>${groupName}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }).join('');

    return `
        <h2 class="page-header">Manage Skill Groups</h2>
        <div class="info-bar">
            <div class="info-bar__item">Assign your skills to the categories that make sense for your life.</div>
        </div>
        <div class="skill-group-manager-container">
            ${skillRowsHtml}
        </div>
    `;
}
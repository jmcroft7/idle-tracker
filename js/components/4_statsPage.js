import { gameState } from '../state.js';
import { SKILL_DATA, STAT_DISPLAY_NAMES } from '../data.js';

let selectedStatSkill = 'all';

export function buildStatsPage() {
    let skillGridHtml = `<button class="stats-skill-button ${selectedStatSkill === 'all' ? 'active' : ''}" data-stat-skill="all">🌐 All</button>`;
    for (const skillName in SKILL_DATA) {
        const isActive = skillName === selectedStatSkill ? 'active' : '';
        skillGridHtml += `
            <button class="stats-skill-button ${isActive}" data-stat-skill="${skillName}">
                ${SKILL_DATA[skillName].icon} ${SKILL_DATA[skillName].displayName}
            </button>
        `;
    }

    let statsTableHtml = '';
    const headerText = selectedStatSkill === 'all' ? 'All Skills' : SKILL_DATA[selectedStatSkill]?.displayName;
    const skillsToDisplay = selectedStatSkill === 'all' ? Object.keys(gameState.stats) : [selectedStatSkill];

    skillsToDisplay.forEach(skillName => {
        for (const statKey in gameState.stats[skillName]) {
            statsTableHtml += `
                <div class="stat-row">
                    <span class="stat-label">${STAT_DISPLAY_NAMES[statKey] || statKey}</span>
                    <span class="stat-value">${gameState.stats[skillName][statKey].toLocaleString()}</span>
                </div>
            `;
        }
    });

    return `
        <h2 class="page-header">Statistics</h2>
        <div class="stats-skill-grid">${skillGridHtml}</div>
        <div class="stats-container">
            <h3 class="stats-header">${headerText}</h3>
            ${statsTableHtml || '<p class="no-stats">No stats to display for this selection.</p>'}
        </div>
    `;
}

export function setSelectedStatSkill(skillName) {
    selectedStatSkill = skillName;
}
import { gameState } from '../state.js';
import { SKILL_DATA } from '../data.js';

export function buildSkillPage(skillName) {
    const skillData = SKILL_DATA[skillName];
    const skillState = gameState.skills[skillName];
    if (!skillData || !skillState) return '<h2>Skill not found or is locked.</h2>';

    const nextLevelXp = gameState.xpThresholds[skillState.level] || 'Max';

    let actionCardsHtml = '';
    for (const actionName in skillData.actions) {
        const action = skillData.actions[actionName];
        const isUnlocked = !action.requiredLevel || skillState.level >= action.requiredLevel;
        const isActionRunning = gameState.activeAction && gameState.activeAction.actionName === actionName;
        
        const buttonText = isActionRunning ? 'Stop' : `Start ${action.title.split(' ').slice(1).join(' ')}`;
        const lockedClass = isUnlocked ? '' : 'locked';
        const buttonDisabled = isUnlocked ? '' : 'disabled';
        const subtitle = isUnlocked ? `${action.xp} XP / ${action.duration / 1000} seconds` : `Requires Level ${action.requiredLevel}`;

        actionCardsHtml += `
            <div class="action-card ${lockedClass}">
                <h3 class="action-card__title">${action.title}</h3>
                <p class="action-card__subtitle">${subtitle}</p>
                <div class="action-card__progress-bar">
                    <div id="progress-bar-${actionName}" class="action-card__progress"></div>
                </div>
                <button id="action-btn-${actionName}" data-action-skill="${skillName}" data-action-name="${actionName}" class="button button--primary" ${buttonDisabled}>
                    ${buttonText}
                </button>
            </div>
        `;
    }

    return `
        <h2 class="page-header">${skillData.displayName}</h2>
        <div class="info-bar">
            <div class="info-bar__item">${skillData.displayName} Level: <span id="skill-level" class="info-bar__value">${skillState.level}</span></div>
            <div class="info-bar__item">${skillData.displayName} XP: <span id="skill-xp" class="info-bar__value">${skillState.xp} / ${nextLevelXp}</span></div>
        </div>
        <div class="action-grid">
            ${actionCardsHtml}
        </div>
    `;
}
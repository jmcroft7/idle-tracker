// idle-tracker/js/components/3_skillPage.js

import { gameState } from '../state.js';
import { SKILL_DATA, NORMAL_XP_PER_HOUR, HARD_XP_PER_HOUR } from '../data.js';
import { formatProgressDisplay } from '../ui.js';

let selectedSkillTab = 'actions';

export function setSelectedSkillTab(tabName) {
    selectedSkillTab = tabName;
}

export function buildSkillPage(skillName) {
    const skillData = SKILL_DATA[skillName];
    const skillState = gameState.skills[skillName];
    if (!skillData || !skillState) return '<h2>Skill not found or is locked.</h2>';

    // Tabs
    const TABS = { actions: 'Actions' };
    if (skillData.tasks) {
        TABS.tasks = 'Tasks';
    }

    let subNavHtml = '';
    for (const key in TABS) {
        const isActive = key === selectedSkillTab ? 'active' : '';
        subNavHtml += `
            <button class="shop-nav-button ${isActive}" data-skill-tab="${key}" data-skill-name="${skillName}">
                ${TABS[key]}
            </button>
        `;
    }

    let itemsHtml = '';
    if (selectedSkillTab === 'actions') {
        for (const actionName in skillData.actions) {
            const action = skillData.actions[actionName];
            const isUnlocked = !action.requiredLevel || skillState.level >= action.requiredLevel;
            const isActionRunning = gameState.activeAction && gameState.activeAction.actionName === actionName;
            
            const buttonText = isActionRunning ? 'Stop' : `Start ${action.title.split(' ').slice(1).join(' ')}`;
            const lockedClass = isUnlocked ? '' : 'locked';

            let actionDetailsHtml;
            if (isUnlocked) {
                const xpPerHour = gameState.settings.hardMode ? HARD_XP_PER_HOUR : NORMAL_XP_PER_HOUR;
                const xpPerAction = Math.floor((action.duration / (1000 * 60 * 60)) * xpPerHour);

                 actionDetailsHtml = `
                    <div class="action-card__details">
                        <div class="action-card__detail">
                             <span class="toast-xp">+${xpPerAction.toLocaleString()}</span> XP
                        </div>
                        <div class="action-card__detail">
                            <span>🕒</span>
                            <span>${action.duration / 1000}s</span>
                        </div>
                    </div>
                `;
            } else {
                const reqStatusClass = 'missing-requirement';
                actionDetailsHtml = `
                    <div class="action-card__details">
                        <div class="action-card__requirement ${reqStatusClass}">Requires Level ${action.requiredLevel}</div>
                    </div>
                `;
            }


            itemsHtml += `
                <div class="card action-card ${lockedClass}">
                    <h3 class="action-card__title">${action.title}</h3>
                    ${actionDetailsHtml}
                    <div class="action-card__progress-bar">
                        <div id="progress-bar-${actionName}" class="action-card__progress"></div>
                    </div>
                    <button id="action-btn-${actionName}" data-action-skill="${skillName}" data-action-name="${actionName}" class="button button--primary" ${!isUnlocked ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        }
    } else if (selectedSkillTab === 'tasks' && skillData.tasks) {
        for (const taskKey in skillData.tasks) {
            const task = skillData.tasks[taskKey];
            const taskIdentifier = `${skillName}_${taskKey}`;
            const isCompleted = gameState.completedTasks.includes(taskIdentifier);
            
            let requirementMet = true;
            let requirementHtml = '';
            if (task.requiredLevel) {
                if (skillState.level < task.requiredLevel) {
                    requirementMet = false;
                }
                const reqStatusClass = requirementMet ? 'has-requirement' : 'missing-requirement';
                requirementHtml = `<div class="task-card__requirement ${reqStatusClass}">Level ${task.requiredLevel} Required</div>`;
            }
    
            const canComplete = !isCompleted && requirementMet;
    
            itemsHtml += `
                <div class="card task-card ${isCompleted ? 'completed' : ''}">
                    <div class="task-card__header">
                        <h4 class="task-card__name">${task.name}</h4>
                    </div>
                    <p class="task-card__description">${task.description}</p>
                    <div class="task-card__rewards">
                        <div class="task-card__reward">
                            <span class="toast-xp">+${task.rewards.xp.toLocaleString()}</span> XP
                        </div>
                        <div class="task-card__reward">
                            <span class="toast-coins">+${task.rewards.coins}</span> Coins
                        </div>
                    </div>
                    <div class="task-card__footer">
                        ${requirementHtml}
                        <button class="button button--primary" data-complete-task="${taskIdentifier}" ${!canComplete ? 'disabled' : ''}>
                            ${isCompleted ? 'Completed' : 'Complete'}
                        </button>
                    </div>
                </div>
            `;
        }
    }


    return `
        <h2 class="page-header">${skillData.displayName}</h2>
        <div class="info-bar">
            <div class="info-bar__item">${skillData.displayName} Level: <span id="skill-level" class="info-bar__value">${skillState.level}</span></div>
            <div class="info-bar__item" id="progress-display-container">
                ${formatProgressDisplay(skillState)}
            </div>
        </div>
        <div class="shop-sub-nav">
            ${subNavHtml}
        </div>
        <div class="action-grid">
            ${itemsHtml}
        </div>
    `;
}
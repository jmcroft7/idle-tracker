import { gameState } from '../state.js';
import { SKILL_DATA } from '../data.js';

export function buildManualEntryPage() {
    const { unlockedSkills } = gameState;

    // Create dropdown options for all unlocked skills
    const skillOptionsHtml = unlockedSkills.map(skillName => {
        const skill = SKILL_DATA[skillName];
        return `<option value="${skillName}">${skill.icon} ${skill.displayName}</option>`;
    }).join('');

    return `
        <h2 class="page-header">Manual Time Entry</h2>
        <div class="manual-entry-container">
            <div class="settings-section">
                 <div class="info-bar">
                    <div class="info-bar__item">Forgot to track something? Add the time you spent on an activity here.</div>
                </div>
                <div class="form-group">
                    <label for="manual-skill-select">Skill</label>
                    <select id="manual-skill-select" class="styled-select">${skillOptionsHtml}</select>
                </div>
                <div class="form-group">
                    <label for="manual-duration-input">Duration</label>
                    <div class="form-group-inline">
                        <input type="number" id="manual-duration-input" class="styled-select" placeholder="e.g., 30">
                        <select id="manual-unit-select" class="styled-select">
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button id="manual-add-btn" class="button button--primary">Add Time</button>
                </div>
            </div>
        </div>
    `;
}
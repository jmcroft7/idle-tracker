import { gameState } from '../state.js';
import { BACKGROUND_OPTIONS } from '../data.js';

export function buildSettingsPage() {
    const { settings } = gameState;
    
    let optionsHtml = Object.entries(BACKGROUND_OPTIONS).map(([name, url]) => 
        `<option value="${url}" ${settings.backgroundImage === url ? 'selected' : ''}>${name}</option>`
    ).join('');

    return `
        <div class="settings-container">
            <h2 class="page-header">Settings</h2>
            <div class="settings-section">
                <h3 class="settings-header">Interface Settings</h3>
                <div class="form-group form-group--toggle">
                    <label for="dark-mode-toggle">Toggle Dark Mode</label>
                    <label class="toggle-switch"><input type="checkbox" id="dark-mode-toggle" ${settings.useDarkMode ? 'checked' : ''}><span class="toggle-slider"></span></label>
                </div>
                <div class="form-group">
                    <label for="background-image-select">Background Image</label>
                    <select id="background-image-select">${optionsHtml}</select>
                    <div class="background-preview ${settings.backgroundImage !== 'none' ? '' : 'hidden'}">
                        <img id="background-preview-img" src="${settings.backgroundImage !== 'none' ? settings.backgroundImage : ''}" alt="Background preview">
                    </div>
                </div>
                <div class="form-group form-group--toggle">
                    <label for="skill-sort-toggle">Sort Skills by Level in Sidebar</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="skill-sort-toggle" ${settings.skillSortByLevel ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div class="settings-section">
                <h3 class="settings-header">Notification Settings</h3>
                <div class="form-group">
                    <label for="notification-position">Notification Position</label>
                    <select id="notification-position">
                        <option value="bottom-left" ${settings.notificationPosition === 'bottom-left' ? 'selected' : ''}>Left</option>
                        <option value="bottom-center" ${settings.notificationPosition === 'bottom-center' ? 'selected' : ''}>Center</option>
                        <option value="bottom-right" ${settings.notificationPosition === 'bottom-right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="notification-duration">Notification Delay</label>
                    <select id="notification-duration">
                        <option value="2000" ${settings.notificationDuration === 2000 ? 'selected' : ''}>2 seconds</option>
                        <option value="3000" ${settings.notificationDuration === 3000 ? 'selected' : ''}>3 seconds</option>
                        <option value="5000" ${settings.notificationDuration === 5000 ? 'selected' : ''}>5 seconds</option>
                    </select>
                </div>
                <div class="form-group form-group--toggle">
                    <label for="notification-show-name">Show skill name in notification</label>
                    <label class="toggle-switch"><input type="checkbox" id="notification-show-name" ${settings.notificationShowName ? 'checked' : ''}><span class="toggle-slider"></span></label>
                </div>
            </div>
            <div class="settings-section">
                <h3 class="settings-header">Game Data</h3>
                <div class="button-group">
                    <button id="save-btn" class="button button--primary">Save to File</button>
                    <button id="load-btn" class="button button--secondary">Load from File</button>
                </div>
            </div>
        </div>
    `;
}
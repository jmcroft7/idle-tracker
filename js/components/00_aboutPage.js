import { gameState } from '../state.js';
import { SHOP_DATA } from '../data.js';

export function buildAboutPage() {
    const { playerName } = gameState.settings;
    const { equippedTitle } = gameState;
    const titleName = (equippedTitle && equippedTitle !== 'none') ? SHOP_DATA.titles.items[equippedTitle].name : '';
    const displayName = titleName ? `${titleName} ${playerName}` : playerName;

    return `
        <div class="about-container">
            <h2 class="page-header">About IdleQuest</h2>
            <div class="about-section">
                <p>Welcome, <span class="player-name-display">${displayName}</span>!</p>
                <p>This is a simple idle game inspired by Melvor Idle.</p>
                <p>It is built with HTML, CSS, and vanilla JavaScript.</p>
            </div>
        </div>
    `;
}
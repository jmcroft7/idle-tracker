import { gameState } from '../state.js';
import { SHOP_DATA } from '../data.js';

export function buildAboutPage() {
    const titleName = gameState.equippedTitle ? SHOP_DATA.titles.items[gameState.equippedTitle].name : null;
    const playerName = titleName ? `${titleName} Player` : 'Player';

    return `
        <div class="about-container">
            <h2 class="page-header">About IdleQuest</h2>
            <div class="about-section">
                <p>Welcome, <span class="info-bar__value">${playerName}</span>!</p>
                <p>This is a simple idle game inspired by Melvor Idle.</p>
                <p>It is built with HTML, CSS, and vanilla JavaScript.</p>
            </div>
        </div>
    `;
}
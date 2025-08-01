import { gameState } from '../state.js';

export function buildBankPage() {
    return `
        <h2 class="page-header">Bank</h2>
        <div class="bank-container">
            <div class="bank-section">
                <h3 class="bank-header">Currency</h3>
                <div class="coin-display">
                    <span class="coin-icon">💰</span>
                    <span class="coin-amount">${gameState.coins.toLocaleString()}</span>
                    <span class="coin-label">Coins</span>
                </div>
            </div>
            <div class="bank-section">
                <h3 class="bank-header">Items</h3>
                <div class="inventory-grid">
                    <!-- Item slots will be generated here in the future -->
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                    <div class="inventory-slot"></div>
                </div>
            </div>
        </div>
    `;
}
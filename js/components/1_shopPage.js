import { gameState } from '../state.js';
import { SHOP_DATA, SKILL_DATA } from '../data.js';

let selectedShopTab = 'titles'; // Default to the 'titles' tab

/**
 * Sets the currently selected tab for the shop page and re-renders it.
 * @param {string} tabName
 */
export function setSelectedShopTab(tabName) {
    selectedShopTab = tabName;
}

export function buildShopPage() {
    let subNavHtml = '';
    for (const key in SHOP_DATA) {
        const isActive = key === selectedShopTab ? 'active' : '';
        subNavHtml += `
            <button class="shop-nav-button ${isActive}" data-shop-tab="${key}">
                ${SHOP_DATA[key].displayName}
            </button>
        `;
    }
    
    const activeTabData = SHOP_DATA[selectedShopTab];
    let itemsHtml = '';
    for (const key in activeTabData.items) {
        if (key === 'none' || key === 'novice') continue;
        
        const item = activeTabData.items[key];
        const isPurchased = gameState.purchasedTitles.includes(key);
        const isEquipped = gameState.equippedTitle === key;

        let requirementsMet = true;
        let requirementHtml = '';
        if (item.requirements) {
            const reqSkill = item.requirements.skill;
            const reqLevel = item.requirements.level;
            const currentLevel = gameState.skills[reqSkill].level;
            
            if (currentLevel < reqLevel) {
                requirementsMet = false;
            }

            const reqStatusClass = requirementsMet ? 'has-requirement' : 'missing-requirement';
            const skillIcon = SKILL_DATA[reqSkill].icon;
            requirementHtml = `
                <div class="shop-item-card__requirement ${reqStatusClass}">
                    ${skillIcon} Level ${reqLevel}
                </div>
            `;
        }


        let actionButtonHtml;
        if (isEquipped) {
            actionButtonHtml = `<button class="button button--secondary" disabled>Equipped</button>`;
        } else if (isPurchased) {
            actionButtonHtml = `<button class="button button--primary" data-equip-title="${key}">Equip</button>`;
        } else {
            const canAfford = gameState.coins >= item.cost;
            actionButtonHtml = `<button class="button button--primary" data-buy-title="${key}" ${!canAfford || !requirementsMet ? 'disabled' : ''}>Buy</button>`;
        }

        itemsHtml += `
            <div class="shop-item-card">
                <div class="shop-item-card__icon">📜</div>
                <div class="shop-item-card__details">
                    <div class="shop-item-card__name">${item.name}</div>
                    <div class="shop-item-card__description">${item.description}</div>
                    <div class="shop-item-card__meta">
                        <div class="shop-item-card__cost">
                            <span>💰</span>
                            <span>${item.cost.toLocaleString()}</span>
                        </div>
                        ${requirementHtml}
                    </div>
                </div>
                <div class="shop-item-card__actions">
                    ${actionButtonHtml}
                </div>
            </div>
        `;
    }

    return `
        <h2 class="page-header">Shop</h2>
        <div class="shop-sub-nav">
            ${subNavHtml}
        </div>
        <div class="shop-grid">
            ${itemsHtml}
        </div>
    `;
}
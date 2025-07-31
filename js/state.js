// --- DEFAULT GAME STATE ---
const defaultState = {
    skills: {
        woodcutting: {
            level: 1,
            xp: 0,
        },
        // Future skills can be added here
    },
    settings: {
        theme: 'dark',
    },
    // XP thresholds for leveling up
    xpThresholds: [0, 100, 250, 500, 1000, 2000, 4000, 8000]
};

// --- GAME STATE VARIABLE ---
export let gameState = {};

// --- STATE FUNCTIONS ---

/**
 * Saves the current game state to localStorage.
 */
export function saveData() {
    localStorage.setItem('idleGameSave', JSON.stringify(gameState));
}

/**
 * Loads game state from localStorage, or uses defaults.
 */
export function loadData() {
    const savedData = localStorage.getItem('idleGameSave');
    if (savedData) {
        // Use saved data, but merge with defaults to ensure all keys exist
        gameState = deepMerge(defaultState, JSON.parse(savedData));
    } else {
        gameState = { ...defaultState };
    }
}

/**
 * Updates a setting and saves the game.
 * @param {string} key - The setting key to update.
 * @param {any} value - The new value for the setting.
 */
export function updateSetting(key, value) {
    if (gameState.settings[key] !== undefined) {
        gameState.settings[key] = value;
        saveData();
    }
}

/**
 * Helper function to deeply merge objects, useful for loading saves.
 */
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

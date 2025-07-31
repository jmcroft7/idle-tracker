// --- DEFAULT GAME STATE ---
const defaultState = {
    skills: {
        woodcutting: { level: 1, xp: 0 },
        reading:     { level: 1, xp: 0 },
        writing:     { level: 1, xp: 0 },
        gaming:      { level: 1, xp: 0 },
        coding:      { level: 1, xp: 0 },
        fitness:     { level: 1, xp: 0 },
        cooking:     { level: 1, xp: 0 },
        mycology:    { level: 1, xp: 0 },
    },
    stats: {
        woodcutting: { treesCut: 0 },
        reading:     { booksRead: 0 },
        writing:     { poemsWritten: 0 },
        gaming:      { matchesPlayed: 0 },
        coding:      { bugsFixed: 0 },
        fitness:     { workoutsCompleted: 0 },
        cooking:     { mealsCooked: 0 },
        mycology:    { mushroomsForaged: 0 },
    },
    settings: {
        theme: 'dark',
    },
    activeAction: null,
    xpThresholds: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]
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
    let parsedData = savedData ? JSON.parse(savedData) : null;

    // --- MIGRATION LOGIC for old stats format ---
    if (parsedData && parsedData.stats && typeof parsedData.stats.woodcutting === 'number') {
        console.log("Migrating old stats format to new nested format...");
        const newStats = JSON.parse(JSON.stringify(defaultState.stats)); // Get a clean, new stats structure
        
        for (const skillName in newStats) {
            if (parsedData.stats[skillName] !== undefined) {
                const statKey = Object.keys(newStats[skillName])[0]; // e.g., 'treesCut'
                newStats[skillName][statKey] = parsedData.stats[skillName]; // Assign the old value
            }
        }
        parsedData.stats = newStats; // Overwrite the old stats with the new structure
    }
    // --- END MIGRATION ---

    if (parsedData) {
        gameState = deepMerge(defaultState, parsedData);
    } else {
        gameState = JSON.parse(JSON.stringify(defaultState));
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
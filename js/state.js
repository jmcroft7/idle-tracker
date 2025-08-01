// idle-tracker/js/state.js

import { SKILL_DATA, XP_THRESHOLDS, DEFAULT_SKILL_GROUPS, DEFAULT_SKILL_ASSIGNMENTS, NORMAL_XP_PER_HOUR } from './data.js';

/**
 * Generates the default state for skills and stats based on the SKILL_DATA object.
 */
function generateDefaultState() {
    const skills = {};
    const stats = {};
    const skillGroups = {};

    // Initialize default skill groups
    DEFAULT_SKILL_GROUPS.forEach(group => {
        skillGroups[group] = [];
    });

    for (const skillName in SKILL_DATA) {
        skills[skillName] = { level: 1, xp: 0 }; // Back to xp
        stats[skillName] = {};
        for (const actionName in SKILL_DATA[skillName].actions) {
            const statName = SKILL_DATA[skillName].actions[actionName].statName;
            if (statName) {
                stats[skillName][statName] = 0;
            }
        }
        // Assign skill to its default group
        const defaultGroup = DEFAULT_SKILL_ASSIGNMENTS[skillName] || 'Hobbies';
        if (skillGroups[defaultGroup]) {
            skillGroups[defaultGroup].push(skillName);
        }
    }

    return {
        skills,
        stats,
        skillGroups,
        coins: 0,
        inventory: [],
        purchasedTitles: [],
        equippedTitle: null,
        unlockedSkills: [
            'woodcutting', 'reading', 'writing', 'gaming', 'coding', 
            'fitness', 'cooking', 'mycology', 'fishing', 'mining'
        ],
        settings: {
            useDarkMode: true,
            backgroundImage: 'none',
            notificationPosition: 'bottom-center',
            notificationDuration: 3000,
            notificationShowName: true,
            skillSortByLevel: false,
            groupSkillsInSidebar: false,
            hardMode: false,
            showHoursInsteadOfXP: false,
            skillsCollapsed: false, // New setting
        },
        activeAction: null,
        xpThresholds: XP_THRESHOLDS,
        completedTasks: [],
        collapsedSkillGroups: ['Work', 'Relationships'],
    };
}


const defaultState = generateDefaultState();
export let gameState = {};

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

    if (parsedData) {
        // Migration for older saves with hours
        if (parsedData.skills && Object.values(parsedData.skills)[0]?.hours !== undefined) {
             for(const skill in parsedData.skills) {
                const xpPerHour = parsedData.settings?.hardMode ? 1303.44 : 13034.43;
                parsedData.skills[skill].xp = (parsedData.skills[skill].hours || 0) * xpPerHour;
                delete parsedData.skills[skill].hours;
            }
        }

        if (!parsedData.skillGroups) {
            const newDefaultState = generateDefaultState();
            parsedData.skillGroups = newDefaultState.skillGroups;
            parsedData.collapsedSkillGroups = newDefaultState.collapsedSkillGroups;
        }

        if (parsedData.settings && parsedData.settings.theme) {
            parsedData.settings.useDarkMode = parsedData.settings.theme === 'dark';
            delete parsedData.settings.theme;
        }

        if (parsedData.activeAction && (!parsedData.activeAction.skillName || !SKILL_DATA[parsedData.activeAction.skillName])) {
            parsedData.activeAction = null;
        }
    }

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
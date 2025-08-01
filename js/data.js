export const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];

export const BACKGROUND_OPTIONS = {
    'None': 'none',
    'Forest': 'https://i.imgur.com/lZ6d2T0.jpeg',
    'Mountains': 'https://i.imgur.com/n1fQZ7s.jpeg'
};

export const SHOP_DATA = {
    titles: {
        displayName: 'Titles',
        items: {
            lumberjack: {
                name: 'The Lumberjack',
                description: 'A title for the aspiring arborist.',
                cost: 1000,
                requirements: {
                    skill: 'woodcutting',
                    level: 5
                }
            },
            shakespeare: {
                name: 'Shakespeare',
                description: 'A title for the poetic wordsmith.',
                cost: 2500,
                requirements: {
                    skill: 'writing',
                    level: 15
                }
            },
        }
    }
};

export const SKILL_DATA = {
    // Non-Combat Skills
    woodcutting: {
        displayName: 'Woodcutting',
        icon: '🪵',
        actions: {
            cutTree: { title: 'Cut Normal Tree', xp: 10, duration: 3000, statName: 'treesCut', coins: 5 },
            cutOakTree: { title: 'Cut Oak Tree', xp: 25, duration: 5000, statName: 'oakTreesCut', requiredLevel: 5, coins: 12 }
        }
    },
    fishing: { displayName: 'Fishing', icon: '🎣', actions: { fishShrimp: { title: 'Fish for Shrimp', xp: 10, duration: 3000, statName: 'shrimpFished', coins: 5 } } },
    firemaking: { displayName: 'Firemaking', icon: '🔥', actions: { burnLogs: { title: 'Burn Normal Logs', xp: 10, duration: 2500, statName: 'logsBurnt', coins: 1 } } },
    cooking: { displayName: 'Cooking', icon: '🍳', actions: { cookMeal: { title: 'Cook a Meal', xp: 14, duration: 4500, statName: 'mealsCooked', coins: 8 } } },
    mining: { displayName: 'Mining', icon: '⛏️', actions: { mineCopper: { title: 'Mine Copper Ore', xp: 15, duration: 4000, statName: 'copperMined', coins: 10 } } },
    smithing: { displayName: 'Smithing', icon: '🔨', actions: { smithDagger: { title: 'Smith a Bronze Dagger', xp: 20, duration: 5000, statName: 'daggersSmithed', coins: 15 } } },
    thieving: { displayName: 'Thieving', icon: '🦝', actions: { pickpocketMan: { title: 'Pickpocket a Man', xp: 8, duration: 2000, statName: 'menThieved', coins: 20 } } },
    farming: { displayName: 'Farming', icon: '🧑‍🌾', actions: { plantPotatoes: { title: 'Plant Potatoes', xp: 12, duration: 10000, statName: 'potatoesFarmed', coins: 25 } } },
    crafting: { displayName: 'Crafting', icon: '🧵', actions: { craftLeatherGloves: { title: 'Craft Leather Gloves', xp: 18, duration: 4500, statName: 'glovesCrafted', coins: 18 } } },
    
    // Other Skills
    reading: { displayName: 'Reading', icon: '📖', actions: { readBook: { title: 'Read a Book', xp: 12, duration: 4000, statName: 'booksRead', coins: 2 } } },
    writing: { displayName: 'Writing', icon: '✍️', actions: { writePoem: { title: 'Write a Poem', xp: 15, duration: 5000, statName: 'poemsWritten', coins: 10 } } },
    gaming: { displayName: 'Gaming', icon: '🎮', actions: { playMatch: { title: 'Play a Match', xp: 8, duration: 2500, statName: 'matchesPlayed', coins: 3 } } },
    coding: { displayName: 'Coding', icon: '💻', actions: { fixBug: { title: 'Fix a Bug', xp: 20, duration: 6000, statName: 'bugsFixed', coins: 50 } } },
    fitness: { displayName: 'Fitness', icon: '🏋️', actions: { doWorkout: { title: 'Do a Workout', xp: 18, duration: 5500, statName: 'workoutsCompleted', coins: 0 } } },
    mycology: { displayName: 'Mycology', icon: '🍄', actions: { forageMushrooms: { title: 'Forage Mushrooms', xp: 22, duration: 7000, statName: 'mushroomsForaged', coins: 15 } } },
};

export const ALL_SKILL_NAMES = Object.keys(SKILL_DATA);

export const STAT_DISPLAY_NAMES = {
    treesCut: "Trees Cut",
    oakTreesCut: "Oak Trees Cut",
    booksRead: "Books Read",
    poemsWritten: "Poems Written",
    matchesPlayed: "Matches Played",
    bugsFixed: "Bugs Fixed",
    workoutsCompleted: "Workouts Completed",
    mealsCooked: "Meals Cooked",
    mushroomsForaged: "Mushrooms Foraged",
    shrimpFished: "Shrimp Fished",
    copperMined: "Copper Mined",
    menThieved: "Men Thieved",
    potatoesFarmed: "Potatoes Farmed",
    logsBurnt: "Logs Burnt",
    daggersSmithed: "Daggers Smithed",
    glovesCrafted: "Gloves Crafted",
};
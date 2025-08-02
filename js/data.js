// idle-tracker/js/data.js

/**
 * Generates an array of XP thresholds for levels 1-99.
 * This formula is a common one used in RPGs for a smooth leveling curve.
 */
function generateXpThresholds() {
  const thresholds = [0, 0]; // XP for level 1 is 0
  let totalXp = 0;
  for (let level = 2; level <= 100; level++) {
    const xpForLevel = Math.floor(
      300 * Math.pow(1.13, level)
    );
    totalXp += xpForLevel;
    thresholds.push(totalXp);
  }
   // The final value at level 99 will be ~13.7M, which is close to the target
  return thresholds.slice(0, 100);
}

export const XP_THRESHOLDS = generateXpThresholds();
export const MAX_LEVEL = 99; // Centralized constant for max level
export const MAX_XP = XP_THRESHOLDS[MAX_LEVEL]; // Total XP to reach max level

// Define the total hours for each mode to reach max level
const NORMAL_MODE_TOTAL_HOURS = 1000;
const HARD_MODE_TOTAL_HOURS = 10000;

// Calculate the XP per hour for each mode
export const NORMAL_XP_PER_HOUR = MAX_XP / NORMAL_MODE_TOTAL_HOURS;
export const HARD_XP_PER_HOUR = MAX_XP / HARD_MODE_TOTAL_HOURS;

export const BACKGROUND_OPTIONS = {
  None: "none",
  Forest: "https://i.imgur.com/lZ6d2T0.jpeg",
  Mountains: "https://i.imgur.com/n1fQZ7s.jpeg",
};

export const SHOP_DATA = {
  titles: {
    displayName: "Titles",
    items: {
      none: {
        name: "None",
        description: "No title equipped.",
      },
      novice: {
        name: "The Novice",
        description: "A title for those just starting their journey.",
        cost: 0,
      },
      lumberjack: {
        name: "The Lumberjack",
        description: "A title for the aspiring arborist.",
        cost: 1000,
        requirements: {
          skill: "woodcutting",
          level: 5,
        },
      },
      shakespeare: {
        name: "Shakespeare",
        description: "A title for the poetic wordsmith.",
        cost: 2500,
        requirements: {
          skill: "writing",
          level: 15,
        },
      },
    },
  },
};

export const SKILL_DATA = {
  // Non-Combat Skills
  woodcutting: {
    displayName: "Woodcutting",
    icon: "🪵",
    actions: {
      cutTree: {
        title: "Cut Normal Tree",
        duration: 3000,
        statName: "treesCut",
        coins: 5,
      },
      cutOakTree: {
        title: "Cut Oak Tree",
        duration: 5000,
        statName: "oakTreesCut",
        requiredLevel: 5,
        coins: 12,
      },
    },
    tasks: {
      pickupStick: {
        name: "Pick up one stick",
        description: "A simple task to get you started.",
        rewards: { xp: 1300, coins: 2 }, // ~0.1 hours worth of XP
      },
      sharpenAxe: {
        name: "Sharpen your axe",
        description: "A sharp axe is a happy axe.",
        rewards: { xp: 2600, coins: 5 }, // ~0.2 hours worth of XP
        requiredLevel: 2,
      },
    },
  },
  fishing: {
    displayName: "Fishing",
    icon: "🎣",
    actions: {
      fishShrimp: {
        title: "Fish for Shrimp",
        duration: 3000,
        statName: "shrimpFished",
        coins: 5,
      },
    },
  },
  firemaking: {
    displayName: "Firemaking",
    icon: "🔥",
    actions: {
      burnLogs: {
        title: "Burn Normal Logs",
        duration: 2500,
        statName: "logsBurnt",
        coins: 1,
      },
    },
  },
  cooking: {
    displayName: "Cooking",
    icon: "🍳",
    actions: {
      cookMeal: {
        title: "Cook a Meal",
        duration: 4500,
        statName: "mealsCooked",
        coins: 8,
      },
    },
  },
  mining: {
    displayName: "Mining",
    icon: "⛏️",
    actions: {
      mineCopper: {
        title: "Mine Copper Ore",
        duration: 4000,
        statName: "copperMined",
        coins: 10,
      },
    },
  },
  smithing: {
    displayName: "Smithing",
    icon: "🔨",
    actions: {
      smithDagger: {
        title: "Smith a Bronze Dagger",
        duration: 5000,
        statName: "daggersSmithed",
        coins: 15,
      },
    },
  },
  thieving: {
    displayName: "Thieving",
    icon: "🦝",
    actions: {
      pickpocketMan: {
        title: "Pickpocket a Man",
        duration: 2000,
        statName: "menThieved",
        coins: 20,
      },
    },
  },
  farming: {
    displayName: "Farming",
    icon: "🧑‍🌾",
    actions: {
      plantPotatoes: {
        title: "Plant Potatoes",
        duration: 10000,
        statName: "potatoesFarmed",
        coins: 25,
      },
    },
  },
  crafting: {
    displayName: "Crafting",
    icon: "🧵",
    actions: {
      craftLeatherGloves: {
        title: "Craft Leather Gloves",
        duration: 4500,
        statName: "glovesCrafted",
        coins: 18,
      },
    },
  },

  // Other Skills
  reading: {
    displayName: "Reading",
    icon: "📖",
    actions: {
      readBook: {
        title: "Read a Book",
        duration: 4000,
        statName: "booksRead",
        coins: 2,
      },
      readChapter: {
        title: "Read a Chapter",
        duration: 1200000, // 20 minutes
        statName: "chaptersRead",
        requiredLevel: 10,
        coins: 25,
      }
    },
    tasks: {
      readPoem: {
        name: "Read a Poem",
        description: "Find a quiet moment to enjoy some verse.",
        rewards: { xp: 2000, coins: 5 },
      },
      readShortStory: {
        name: "Read a Short-Story",
        description: "A complete narrative in a single sitting.",
        rewards: { xp: 6500, coins: 15 },
        requiredLevel: 5,
      },
    },
  },
  writing: {
    displayName: "Writing",
    icon: "✍️",
    actions: {
      writePoem: {
        title: "Write a Poem",
        duration: 5000,
        statName: "poemsWritten",
        coins: 10,
      },
    },
  },
  gaming: {
    displayName: "Gaming",
    icon: "🎮",
    actions: {
      playMatch: {
        title: "Play a Match",
        duration: 2500,
        statName: "matchesPlayed",
        coins: 3,
      },
    },
  },
  coding: {
    displayName: "Coding",
    icon: "💻",
    actions: {
      fixBug: {
        title: "Fix a Bug",
        duration: 6000,
        statName: "bugsFixed",
        coins: 50,
      },
    },
  },
  fitness: {
    displayName: "Fitness",
    icon: "🏋️",
    actions: {
      doWorkout: {
        title: "Do a Workout",
        duration: 5500,
        statName: "workoutsCompleted",
        coins: 0,
      },
    },
  },
  mycology: {
    displayName: "Mycology",
    icon: "🍄",
    actions: {
      forageMushrooms: {
        title: "Forage Mushrooms",
        duration: 7000,
        statName: "mushroomsForaged",
        coins: 15,
      },
    },
  },
};

export const ALL_SKILL_NAMES = Object.keys(SKILL_DATA);

export const DEFAULT_SKILL_GROUPS = [
  "Work",
  "Home",
  "Financial",
  "Health",
  "Hobbies",
  "Relationships",
  "Personal Growth",
  "Education",
];

export const DEFAULT_SKILL_ASSIGNMENTS = {
  woodcutting: "Hobbies",
  fishing: "Hobbies",
  mining: "Hobbies",
  mycology: "Hobbies",
  firemaking: "Home",
  cooking: "Home",
  farming: "Home",
  smithing: "Hobbies",
  crafting: "Hobbies",
  thieving: "Financial",
  reading: "Personal Growth",
  writing: "Personal Growth",
  gaming: "Hobbies",
  coding: "Work",
  fitness: "Health",
};

export const STAT_DISPLAY_NAMES = {
  treesCut: "Trees Cut",
  oakTreesCut: "Oak Trees Cut",
  booksRead: "Books Read",
  chaptersRead: "Chapters Read",
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
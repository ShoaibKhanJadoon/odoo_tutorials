/** @odoo-module **/

import { choose } from "../utils/utils";

export const rewards = [
    {
        description: "🎁 You found 500 bonus clicks!",
        apply(clicker) {
            clicker.clicks += 500;
        },
        maxLevel: 2,
    },
    {
        description: "🤖 You earned 1 free ClickBot!",
        apply(clicker) {
            clicker.clickBots += 1;
        },
        minLevel: 1,
        maxLevel: 3,
    },
    {
        description: "🚀 You earned a BigBot upgrade!",
        apply(clicker) {
            clicker.bigBots += 1;
        },
        minLevel: 2,
        maxLevel: 3,
    },
    {
        description: "⚡ Power increased by 1!",
        apply(clicker) {
            clicker.power += 1;
        },
        minLevel: 3,
    },
    {
        description: "💰 Jackpot! Gain 10,000 clicks!",
        apply(clicker) {
            clicker.clicks += 10000;
        },
        minLevel: 3,
    },
];

/**
 * 🎲 Select a random reward available at the current level.
 * @param {ClickerModel} clicker - The current game state/model.
 * @returns {Object|null} A random reward object or null if none are available.
 */
export function getReward(level) {
    // Filter rewards that are valid for this level
    const availableRewards = rewards.filter(
        (r) =>
            (r.minLevel === undefined || r.minLevel <= level) &&
            (r.maxLevel === undefined || r.maxLevel >= level)
    );
    // Choose one randomly
    return choose(availableRewards);
}

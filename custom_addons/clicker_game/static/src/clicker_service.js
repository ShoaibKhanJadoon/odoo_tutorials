/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { humanNumber } from "@web/core/utils/numbers";
import { ClickerModel } from "./clicker_model";

// Define service as a plain object (not a class)
export const clickerService = {
    dependencies: ["effect"],
    start(env, { effect }) {
        const model = new ClickerModel(env);
        model.bus.addEventListener("MILESTONE_1K", () => {
            // Step 2: show rainbow man
            effect.add({
                type: "rainbow_man",
                message: "🎉 Milestone reached! You can now buy ClickBots 🤖",
                fadeout: "slow",
            });
        });
        model.bus.addEventListener("MILESTONE_5K", () => {
            effect.add({
                type: "rainbow_man",
                message: "🔥 Amazing! BigBots unlocked 💪 (cost 5000 clicks)",
                fadeout: "slow",
            });
        });
        model.bus.addEventListener("MILESTONE_100K", () => {
            effect.add({
                type: "rainbow_man",
                message: "⚡ Incredible! Power upgrades are now available!",
                fadeout: "slow",
            });
        });
        model.bus.addEventListener("MILESTONE_1M", () => {
            effect.add({
                type: "rainbow_man",
                message: "🌳 Wow! You can now buy Fruit Trees! 🍒🍐",
                fadeout: "slow",
            });})    
        

        return {
            model:model,
            get state() {
                return model; // reactive state
            },
            buyBigBot: model.buyBigBot.bind(model),
            increment: model.increment.bind(model),
            buyTree: model.buyTree.bind(model),
            buyClickBot: model.buyClickBot.bind(model),
            buyPower: model.buyPower.bind(model),
        };
    },
};

// Register the service
registry.category("services").add("clicker_service", clickerService);


export function useClicker() {
    // Get the clicker service
    const service = useService("clicker_service");
    const localState = useState(service.state);

    const getHumanizedClicks = () => humanNumber(localState.clicks, { decimals: 1 });

    return {
        state: localState,
        increment: service.increment,
        buyClickBot: service.buyClickBot,
        buyBigBot: service.buyBigBot,
        buyTree: service.buyTree,
        totalTrees: service.state.totalTrees,
        totalFruits: service.state.totalFruits,
        buyPower: service.buyPower,
        get humanizedClicks() {
            return getHumanizedClicks();
        },
    };
    
}
/** @odoo-module **/

import { registry } from "@web/core/registry";

const commandProviderRegistry = registry.category("command_provider");

commandProviderRegistry.add("clicker_commands", {
    provide(env, options) {
        const result = [];

        // 🕹️ Open Game Command
        result.push({
            name: "Open Clicker Game",
            category: "Clicker Game",
            action() {
                env.services.action.doAction("clicker_game.client_action");
            },
        });

        // 🤖 Buy Bot Command
        result.push({
            name: "Buy 1 Click Bot",
            category: "Clicker Game",
            action() {
                const clicker = env.services["clicker_service"];
                const before = clicker.state.clickBots;
                const clicksBefore = clicker.state.clicks;

                clicker.buyClickBot(); // tries to buy it

                const after = clicker.state.clickBots;

                if (after > before) {
                    // ✅ Bot was actually bought
                    env.services.notification.add("Bought 1 Click Bot!", {
                        title: "✅ Success",
                        type: "success",
                    });
                } else if (clicksBefore < 1000) {
                    // ❌ Not enough clicks
                    env.services.notification.add("Not enough clicks to buy a Click Bot!", {
                        title: "⚠️ Insufficient Clicks",
                        type: "warning",
                    });
                } else {
                    // 🧱 Some other reason
                    env.services.notification.add("Cannot buy Click Bot right now.", {
                        title: "❌ Failed",
                        type: "danger",
                    });
                }
            },
        });

        return result;
    },
});

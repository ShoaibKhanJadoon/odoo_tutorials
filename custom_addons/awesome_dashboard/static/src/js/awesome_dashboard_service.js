import { registry } from "@web/core/registry";

const awesomeDashboardService = {
    dependencies: ["notification"],

    start(env, { notification }) {
        let counter = 1;

        
            notification.add(`Awesome Dashboard Tick ${counter++}`);
        
    },
};

registry
    .category("services")
    .add("awesome_dashboard_service", awesomeDashboardService);

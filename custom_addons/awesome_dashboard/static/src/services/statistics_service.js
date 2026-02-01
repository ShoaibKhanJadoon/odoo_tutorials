import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc";

/**
 * This is a shared reactive object.
 * Any component using it will auto-update when data changes.
 */
const statistics = reactive({
  new_orders: 0,
  total_amount: 0,
  cancelled_orders: 0,
  cancelled_amount: 0,
});

/**
 * This service loads dashboard statistics
 * and refreshes them every 10 seconds.
 */
export const statisticsService = {
  start(env) {

    // Function to load data from server
    async function loadStatistics() {
      const data = await rpc("/awesome_dashboard/statistics");
      // Update reactive object
      statistics.new_orders = data.new_orders;
      statistics.total_amount = data.total_amount;
      statistics.cancelled_orders = data.cancelled_orders;
      statistics.cancelled_amount = data.cancelled_amount;
    }

    // Load once when service starts
    loadStatistics();

    // Refresh data every 10 seconds
    setInterval(loadStatistics, 10000);

    return {
      statistics,
      loadStatistics,
    };
  },
};

// Register service in Odoo
registry
  .category("services")
  .add("awesome_dashboard.statistics", statisticsService);

import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item";
import { DashboardSettingsDialog } from "./dashboard_settings_dialog";

export class AwesomeDashboard extends Component {
  static template = "awesome_dashboard.AwesomeDashboard";
  static components = { Layout, DashboardItem };
  static STORAGE_KEY = "awesome_dashboard.removed_items";
  setup() {
    this.dialog = useService("dialog");
    this.action = useService("action");
    // All registered dashboard items
    this.registryItems = registry.category("awesome_dashboard").getAll();
    this.state = useState({
      items: [],
    });
    this._loadItems()

    this.statisticsService = useService("awesome_dashboard.statistics");
    this.statistics = useState(this.statisticsService.statistics);

    // ✅ Load data once (service handles refresh)
    onWillStart(() => {
      

      this.statisticsService.loadStatistics();
    });
  }

  _loadItems() {
    const removed = JSON.parse(
      localStorage.getItem(AwesomeDashboard.STORAGE_KEY) || "[]",
    );

    this.state.items = this.registryItems.filter(
      (item) => !removed.includes(item.id),
    );

  }
  

  openSettings() {
    this.dialog.add(DashboardSettingsDialog, {
      items: this.registryItems,
      onApply: () => this._loadItems(),
    });
  }
  openCustomers() {
    this.action.doAction("base.action_partner_form");
  }

  openSalesOrders() {
    this.action.doAction({
      type: "ir.actions.act_window",
      name: "Sales Orders",
      res_model: "sale.order",
      views: [
        [false, "list"],
        [false, "form"],
      ],
      target: "current",
    });
  }

  openLeads() {
    this.action.doAction({
      type: "ir.actions.act_window",
      name: "Leads",
      res_model: "crm.lead",
      views: [
        [false, "list"],
        [false, "form"],
      ],
      target: "current",
    });
  }
}

registry
  .category("lazy_components")
  .add("awesome_dashboard.action", AwesomeDashboard);

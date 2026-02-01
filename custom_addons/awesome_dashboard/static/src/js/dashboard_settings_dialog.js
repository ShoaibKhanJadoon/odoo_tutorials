/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

const STORAGE_KEY = "awesome_dashboard.removed_items";

export class DashboardSettingsDialog extends Component {
  static template = "awesome_dashboard.DashboardSettingsDialog";
  static components = { Dialog };
  static props = {
    items: Array,
    close: Function,
    onApply: Function,
  };
  setup() {
    const removed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    this.state = useState({
      checked: Object.fromEntries(
        this.props.items.map((item) => [item.id, !removed.includes(item.id)]),
      ),
    });
  }

  apply() {
    const removedIds = Object.entries(this.state.checked)
      .filter(([, checked]) => !checked)
      .map(([id]) => id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(removedIds));
    this.props.onApply();
    this.props.close();
  }
}

/** @odoo-module **/

import { Component, useState, useExternalListener } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useClicker } from "./clicker_service";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";

export class ClickerSystrayItem extends Component {
  static template = "clicker_game.ClickerSystrayItem";
  static components = { Dropdown, DropdownItem };
  setup() {
    this.clicker = useClicker();
    this.action = useService("action");
    useExternalListener(document.body, "click", this.onExternalClick, {
      capture: true,
    });
  }
  onExternalClick(ev) {
    if (!ev.target.closest(".o_systray_clicker")) {
      this.clicker.increment(1);
    }
  }

  increment(ev) {
    ev.stopPropagation();
    this.clicker.increment(10);
  }
  openClicker(ev) {
    ev.stopPropagation();
    this.action.doAction({
      type: "ir.actions.client",
      tag: "clicker_game.client_action", // same as we registered
      target: "new", // Opens in a popover
      name: "Clicker Game",
    });
  }
  buyClickbot(ev) {
    ev.stopPropagation();
    this.clicker.buyClickBot();
  }

  buyPearTree(ev) {
    ev.stopPropagation();
    this.clicker.buyTree("pear");
  }

  buyCherryTree(ev) {
    ev.stopPropagation();
    this.clicker.buyTree?.("cherry");
  }

  buyPeachTree(ev) {
    ev.stopPropagation();
    this.clicker.buyTree?.("peach");
  }
}

registry.category("systray").add("clicker_game.ClickerSystrayItem", {
  Component: ClickerSystrayItem,
});

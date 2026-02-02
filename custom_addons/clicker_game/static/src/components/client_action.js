/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useClicker } from "../clicker_service";
import { ClickValue } from "./click_value";
import { Notebook} from "@web/core/notebook/notebook";

export class ClickerClientAction extends Component {
  static template = "clicker_game.ClickerClientAction";
  static components = { ClickValue, Notebook };

  setup() {
    this.clicker = useClicker();
  }
  increment(ev) {
    ev.stopPropagation();
    this.clicker.increment(10);
  }
  buyBot() {
    this.clicker.buyClickBot();
  }

  buyBigBot() {
    this.clicker.buyBigBot();
  }

  buyPower() {
    this.clicker.buyPower();
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

  get canBuyBot() {
    return this.clicker.state.clicks >= 1000 && this.clicker.state.level >= 1;
  }
  get canBuyBigBot() {
    return this.clicker.state.clicks >= 5000 && this.clicker.state.level >= 2;
  }
  get canBuyPower() {
    return this.clicker.state.clicks >= 50000 && this.clicker.state.level >= 3;
  }

  get canBuyTree() {
    return (
      this.clicker.state.level >= 4 && this.clicker.state.clicks >= 1000000
    );
  }
}

registry
  .category("actions")
  .add("clicker_game.client_action", ClickerClientAction);

/** @odoo-module **/

import { Component } from "@odoo/owl";
import { useClicker } from "../clicker_service";

export class ClickValue extends Component {
    static template = "clicker_game.ClickValue";

    setup() {
        this.clicker = useClicker();
    }
}

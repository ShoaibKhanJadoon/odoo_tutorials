
import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { markup } from "@odoo/owl";

import { Counter } from "@awesome_owl/js/counter";
import { Card } from "@awesome_owl/js/card";
import { TodoList } from "@awesome_owl/js/todo_list";

export class Playground extends Component {

    static template = "awesome_owl.Playground";
    static components = { Counter, Card, TodoList };
    setup() {
        this.html = "<strong>This will be escaped</strong>";
        this.safeHtml = markup("<strong>This is rendered as HTML</strong>");
        this.state = useState({ sum: 0 });
    }
    incrementSum(value) {
        this.state.sum += value;
    }

}

registry.category("actions").add("awesome_owl.playground", Playground);

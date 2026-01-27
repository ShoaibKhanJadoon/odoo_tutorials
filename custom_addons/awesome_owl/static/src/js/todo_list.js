/** @odoo-module **/

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { TodoItem } from "./todo_item";

export class TodoList extends Component {
    static template = "awesome_owl.TodoList";
    static components = { TodoItem };

    setup() {
        this.todos = useState([
            { id: 1, description: "buy milk", isCompleted: false },
            { id: 2, description: "learn OWL", isCompleted: false },
            { id: 3, description: "build Odoo module", isCompleted: true },
        ]);

        // create the ref
        this.inputRef = useRef("input");

        // DOM exists here
        onMounted(() => {
            this.inputRef.el.focus();
        });
    }
    addTodo(ev) {
        // Enter key
        if (ev.keyCode !== 13) {
            return;
        }

        const description = ev.target.value.trim();

        // Bonus: ignore empty input
        if (!description) {
            return;
        }
        

        const nextId = this.todos.length
        ? this.todos[this.todos.length - 1].id + 1
        : 1;

        this.todos.push({
            id: nextId,
            description,
            isCompleted: false,
        });

        // clear input
        ev.target.value = "";
    }

    toggleTodo(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (todo) {
            todo.isCompleted = !todo.isCompleted;
        }
    }
    removeTodo(todoId) {
        const index = this.todos.findIndex(t => t.id === todoId);
        if (index >= 0) {
            this.todos.splice(index, 1);   // reactive delete
        }
    }
}

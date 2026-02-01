/** @odoo-module **/

import { dashboardItemRegistry } from "../dashboard_registry";
import { NumberCard } from "./number_card";

dashboardItemRegistry.add("new_orders", {
  id: "new_orders",
  description: "New orders",
  Component: NumberCard,
  props: (data) => ({
    title: "New Orders",
    value: data.new_orders,
  }),
});

dashboardItemRegistry.add("total_amount", {
  id: "total_amount",
  description: "Total sales amount",
  Component: NumberCard,
  size: 2,
  props: (data) => ({
    title: "Total Amount",
    value: `Rs ${data.total_amount}`,
  }),
});

dashboardItemRegistry.add("cancelled_orders", {
  id: "cancelled_orders",
  description: "Cancelled orders",
  Component: NumberCard,
  props: (data) => ({
    title: "Cancelled Orders",
    value: data.cancelled_orders,
  }),
});

dashboardItemRegistry.add("cancelled_amount", {
  id: "cancelled_amount",
  description: "Cancelled amount",
  Component: NumberCard,
  props: (data) => ({
    title: "Cancelled Amount",
    value: `Rs ${data.cancelled_amount}`,
  }),
});

# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from datetime import datetime

class AwesomeDashboardController(http.Controller):

    @http.route('/awesome_dashboard/statistics', type='jsonrpc', auth='user')
    def get_statistics(self):
        """
        Returns statistics for the dashboard:
        - Number of new orders this month
        - Total amount of new orders
        - Average amount of t-shirt per order
        - Number of cancelled orders
        - Average time for orders to go from 'new' to 'sent' or 'cancelled'
        - Number of t-shirts sold per size (for pie chart)
        """
        Order = request.env['sale.order'].sudo()
        today = datetime.today()
        first_day = datetime(today.year, today.month, 1)

        # New orders this month
        new_orders = Order.search([('date_order', '>=', first_day), ('state', '=', 'sale')])
        new_orders_count = len(new_orders)
        total_amount = sum(order.amount_total for order in new_orders)

        # Cancelled orders this month
        cancelled_orders = Order.search([('date_order', '>=', first_day), ('state', '=', 'cancel')])
        cancelled_count = len(cancelled_orders)
        cancelled_amount = sum(order.amount_total for order in cancelled_orders)

        return {
            "new_orders": new_orders_count,
            "total_amount": total_amount,
            "cancelled_orders": cancelled_count,
            "cancelled_amount": cancelled_amount,
        }
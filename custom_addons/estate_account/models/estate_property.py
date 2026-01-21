from odoo import models, fields, Command
from odoo.exceptions import UserError

class EstateProperty(models.Model):
    _inherit = "estate.property"

    def action_set_sold(self):
        # Call original method (usually sets state = 'sold')
        res = super().action_set_sold()

        for record in self:
            if not record.buyer_id:
                continue

            # Prevent duplicate invoices
            existing_invoice = self.env['account.move'].search([
                ('ref', '=', f'PROP-{record.id}'),
                ('move_type', '=', 'out_invoice'),
                ('state', '!=', 'cancel'),
            ], limit=1)
            if existing_invoice:
                continue

            # Prepare invoice lines
            lines = []

            # 1. Full property selling price
            lines.append(Command.create({
                'name': f"Property sale - {record.name}",
                'quantity': 1,
                'price_unit': record.selling_price,
                'product_id': False,
            }))

            # 2. Commission (6% of selling price)
            commission_amount = record.selling_price * 0.06
            lines.append(Command.create({
                'name': f"Agency commission (6%) - {record.name}",
                'quantity': 1,
                'price_unit': commission_amount,
            }))

            # 3. Administrative fee
            lines.append(Command.create({
                'name': "Administrative fee",
                'quantity': 1,
                'price_unit': 100.00,
            }))

            # Create the customer invoice
            invoice = self.env['account.move'].create({
                'partner_id': record.buyer_id.id,
                'move_type': 'out_invoice',
                'ref': f'PROP-{record.id}',  # reference to property
                'name': f"INV-{record.id}",   # invoice number (custom)
                'invoice_date': fields.Date.today(),
                'currency_id': record.currency_id.id,
                'invoice_line_ids': lines,
            })

            # Optional: post the invoice immediately
            # invoice.action_post()

        return res

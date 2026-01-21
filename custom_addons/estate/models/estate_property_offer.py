from odoo import models, fields,api
from datetime import timedelta
from odoo.exceptions import ValidationError,UserError


from odoo.exceptions import UserError

class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Property Offer"
    _order = "price desc"

    _check_offer_price_positive = models.Constraint(
        'CHECK(price > 0)',
        'The offer price must be strictly positive.'
    )

        

    price = fields.Float(string="Offer Price", required=True)
    status = fields.Selection(
        [('accepted', 'Accepted'), ('refused', 'Refused')],
        string="Status",
        copy=False
    )
    partner_id = fields.Many2one('res.partner', string="Buyer", required=True)
    property_id = fields.Many2one('estate.property', string="Property", required=True)

     # Related + stored field (IMPORTANT)
    property_type_id = fields.Many2one(
        "estate.property.type",
        related="property_id.property_type_id",
        store=True,
        readonly=True
    )
    
    def _compute_offer_count(self):
        for record in self:
            record.offer_count = len(record.offer_ids)

    validity = fields.Integer(default=7)
    date_deadline = fields.Date(
        compute="_compute_date_deadline",
        inverse="_inverse_date_deadline",
        store=True
    )
    
    @api.depends('create_date', 'validity')
    def _compute_date_deadline(self):
        for record in self:
            if record.create_date and record.validity:
                record.date_deadline = (
                    record.create_date.date() + timedelta(days=record.validity)
                )
            else:
                # fallback during creation
                record.date_deadline = fields.Date.today() + timedelta(days=record.validity)
    
    @api.depends('create_date', 'date_deadline')
    def _inverse_date_deadline(self):
        for record in self:
            if record.create_date and record.date_deadline:
                record.validity = (
                    record.date_deadline - record.create_date.date()
                ).days

    
    def action_accept_offer(self):
        for offer in self:
            property_record = offer.property_id

            # Only one accepted offer per property
            if property_record.offer_ids.filtered(lambda o: o.status == 'accepted'):
                raise UserError("An offer has already been accepted for this property!")

            # Accept this offer
            offer.status = 'accepted'

            # Update property info
            property_record.buyer_id = offer.partner_id
            property_record.selling_price = offer.price

            # IMPORTANT: set property state
            property_record.state = 'offer_accepted'

        return True
    
    def action_refuse_offer(self):
        for offer in self:
            # Prevent refusing an offer if it is already accepted
            if offer.status == 'accepted':
                raise UserError("You cannot refuse an offer that has already been accepted!")

            offer.status = 'refused'
        return True
    
    @api.constrains('property_id')
    def _check_property_state(self):
        for offer in self:
            if offer.property_id.state in ('sold', 'canceled'):
                raise ValidationError(
                    "You cannot create or modify an offer for a sold or canceled property."
                )
    @api.model_create_multi
    def create(self, vals_list):
        # Enforce single creation only (block bulk / multi-create)
        if len(vals_list) != 1:
            raise UserError("Only one offer can be created at a time in this module.")

        vals = vals_list[0]  # Now safe: extract the single dict

        property_id = vals.get("property_id")
        price = vals.get("price")

        if not property_id:
            raise UserError("Property ID is required to create an offer.")

        if price is None or price <= 0:  # Optional: also enforce positive price
            raise UserError("A positive offer price is required.")

        property_record = self.env["estate.property"].browse(property_id)

        if not property_record.exists():
            raise UserError("The selected property does not exist.")

        # Prevent lower offer
        existing_prices = property_record.offer_ids.mapped("price")
        if existing_prices and price < max(existing_prices):
            current_best = max(existing_prices)
            raise UserError(
                f"You cannot create an offer lower than the current best offer ({current_best})."
            )

        # Create the single offer
        offer = super().create(vals)

        # Update property state
        offer.property_id.update_state_from_offers()

        return offer
    
    def unlink(self):
        properties = self.mapped('property_id')
        res = super().unlink()
        if properties:
            properties.update_state_from_offers()
        return res

    
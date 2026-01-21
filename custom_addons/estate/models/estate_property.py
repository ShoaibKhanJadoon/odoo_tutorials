from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError
from odoo.tools.float_utils import float_compare, float_is_zero


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real Estate Property"
    _order = "id desc"

    _check_expected_price_positive = models.Constraint(
        'CHECK(expected_price > 0)',
        'The expected price must be strictly positive.'
    )

    _check_selling_price_positive = models.Constraint(
        'CHECK(selling_price >= 0)',
        'The selling price must be positive.'
    )
    name = fields.Char(required=True)
    tag_ids = fields.Many2many(
        'estate.property.tag',
        string="Tags"
    )

    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(
        copy=False,
        string="Available From",
        default=lambda self: fields.Date.today()
    )
    property_type_id = fields.Many2one(
    'estate.property.type',
    string='Property Type',
    required=True,
    ondelete='restrict'
    )
    buyer_id = fields.Many2one(
        "res.partner",
        string="Buyer",
        copy=False
    )

    salesperson_id = fields.Many2one(
        "res.users",
        string="Salesperson",
        default=lambda self: self.env.user
    )
    offer_ids = fields.One2many(
        'estate.property.offer',  # comodel
        'property_id',            # inverse field
        string="Offers"
    )

    expected_price = fields.Float(required=True)
    selling_price = fields.Float(readonly=True, copy=False)
    bedrooms = fields.Integer(default=2)
    living_area = fields.Integer()
    facades = fields.Integer()
    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer()
    total_area = fields.Float(
        string="Total Area",
        compute="_compute_total_area"
    )
    garden_orientation = fields.Selection(
        [
            ('north', 'North'),
            ('south', 'South'),
            ('east', 'East'),
            ('west', 'West'),
        ]
    )

    active = fields.Boolean(default=True)

    state = fields.Selection(
        [
            ('new', 'New'),
            ('offer_received', 'Offer Received'),
            ('offer_accepted', 'Offer Accepted'),
            ('sold', 'Sold'),
            ('cancelled', 'Cancelled'),
        ],
        required=True,
        copy=False,
        default='new',
        readonly=True,
        string="Status",
    )
    currency_id = fields.Many2one(
    'res.currency',
    string='Currency',
    default=lambda self: self.env.company.currency_id,
    required=True
)


    total_area = fields.Float(
        string="Total Area",
        compute="_compute_total_area"
    )

    bestoffer_price = fields.Float(
        string="Best Offer",
        compute="_compute_bestoffer"
    )
    @api.depends('offer_ids.price')
    def _compute_bestoffer(self):
        for property in self:
            if property.offer_ids:
                property.bestoffer_price = max(property.offer_ids.mapped('price'))
            else:
                property.bestoffer_price = 0.0
    @api.depends('living_area', 'garden_area')
    def _compute_total_area(self):
        for property in self:
            property.total_area = property.living_area + (property.garden_area or 0)

    @api.onchange('garden')
    def _onchange_garden(self):
        if self.garden:
            self.garden_area = 10
            self.garden_orientation = 'north'
        else:
            self.garden_area = 0
            self.garden_orientation = False

    def action_cancel_property(self):
        for record in self:
            if record.state == 'sold':
                raise UserError("A sold property cannot be cancelled!")
            record.state = 'cancelled'
        return True

    def action_set_sold(self):
        for record in self:
            if record.state == 'cancelled':
                raise UserError("A cancelled property cannot be sold!")
            if record.state != 'offer_accepted':
                raise UserError("Property can only be set to sold after an offer is accepted!")
            record.state = 'sold'
        return True

    
    
    @api.constrains('selling_price', 'expected_price')
    def _check_selling_price(self):
        for record in self:
            # selling_price is allowed to be zero (no offer accepted yet)
            if float_is_zero(record.selling_price, precision_rounding=record.currency_id.rounding):
                continue

            # selling price must be at least 90% of expected price
            minimum_price = record.expected_price * 0.9

            if float_compare(
                record.selling_price,
                minimum_price,
                precision_rounding=record.currency_id.rounding
            ) < 0:
                raise ValidationError(
                    "The selling price cannot be lower than 90% of the expected price."
                )
    @api.ondelete(at_uninstall=False)
    def _check_property_deletion(self):
        for record in self:
            if record.state not in ('new', 'cancelled'):
                raise UserError(
                    "You can only delete properties that are New or Cancelled."
                )
            
                
    def update_state_from_offers(self): 
        """Sync state based on presence of offers"""
        for property in self:
            has_offers = bool(property.offer_ids)
            if has_offers and property.state == 'new':
                property.state = 'offer_received'
            elif not has_offers and property.state == 'offer_received':
                property.state = 'new'
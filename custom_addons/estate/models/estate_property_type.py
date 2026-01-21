from odoo import models, fields, api

class EstatePropertyType(models.Model):
    _name = 'estate.property.type'
    _description = 'Estate Property Type'
    _order = "sequence, name"

    sequence = fields.Integer(default=10)
    _unique_property_type_name = models.Constraint(
        'UNIQUE(name)',
        'The property type name must be unique.'
    )

    property_ids = fields.One2many(
        "estate.property",
        "property_type_id",
        string="Properties"
    )
    
    
    name = fields.Char(string='Property Type', required=True)
    description = fields.Text(string='Description')
    properties_count = fields.Integer(string='Number of Properties', compute='_compute_properties_count')
    
    # ✅ One2many inverse of property_type_id
    offer_ids = fields.One2many(
        "estate.property.offer",
        "property_type_id",
        string="Offers"
    )

    offer_count = fields.Integer(
        compute="_compute_offer_count"
    )

    def _compute_offer_count(self):
        for record in self:
            record.offer_count = len(record.offer_ids)

    def _compute_properties_count(self):
        for property_type in self:
            property_type.properties_count = self.env['estate.property'].search_count([('property_type_id', '=', property_type.id)])


    

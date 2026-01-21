{
    'name': 'Estate Management',
    'version': '1.0',
    'summary': 'Manage real estate properties',
    'description': """
Estate Management Module
========================
This module allows you to manage real estate properties, offers, buyers,
and property status.
    """,
    'category': 'Real Estate',
    'author': 'Shoaib Khan',
    'license': 'LGPL-3',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/estate_property_views.xml',
        'views/estate_property_offer_views.xml',
        'views/estate_property_type_views.xml',
        'views/estate_property_tag_views.xml',
        'views/res_users_view.xml',
        'views/estate_menus.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
}
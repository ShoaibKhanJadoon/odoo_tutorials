{
    "name": "Awesome Dashboard",
    "version": "1.0",
    "category": "Tools",
    "summary": "Owl Dashboard using Odoo JS Framework",
    "depends": ["web","crm","sale_management"],
    "author": "Muhammad Shoaib Khan",
    "data": [
        "views/awesome_dashboard_action.xml",
    ],
    "license": "LGPL-3",
    "assets": {
         "web.assets_backend": [
        "awesome_dashboard/static/src/dashboard_action.js",
        "awesome_dashboard/static/src/dashboard_registry.js",
        ],
        "awesome_dashboard.dashboard": [
            "awesome_dashboard/static/src/js/awesome_dashboard.js",
            "awesome_dashboard/static/src/js/awesome_dashboard_service.js",
            "awesome_dashboard/static/src/xml/awesome_dashboard.xml",
            "awesome_dashboard/static/src/js/dashboard_settings_dialog.js",
            "awesome_dashboard/static/src/xml/dashboard_settings_dialog.xml",
            "awesome_dashboard/static/src/js/dashboard_items.js",
            "awesome_dashboard/static/src/js/number_card.js",
            "awesome_dashboard/static/src/xml/number_card.xml",
            "awesome_dashboard/static/src/xml/dashboard_item.xml",
            "awesome_dashboard/static/src/js/dashboard_item.js",
            "awesome_dashboard/static/src/services/statistics_service.js",
            "awesome_dashboard/static/src/css/dashboard.scss",
        ],
    },
    "installable": True,
    "application": True,
}

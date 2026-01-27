{
    'name': 'Awesome Owl',
    'version': '1.0',
    'summary': 'An awesome module for Odoo',
    'description': 'This module adds awesome features to Odoo.',
    'author': 'Muhammad Shoaib Khan',
    'category': 'Tools',
    'depends': ['base'],
    'data': [
        'views/awesome_owl_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'awesome_owl/static/src/js/playground.js',
            'awesome_owl/static/src/xml/playground.xml',
            'awesome_owl/static/src/xml/counter.xml',
            'awesome_owl/static/src/js/counter.js',
            'awesome_owl/static/src/xml/card.xml',
            'awesome_owl/static/src/js/card.js',
            'awesome_owl/static/src/xml/TodoList.xml',
            'awesome_owl/static/src/js/todo_list.js',
            'awesome_owl/static/src/xml/TodoItem.xml',
            'awesome_owl/static/src/js/todo_item.js',
            
        ]},
    'LICENSE': 'LGPL-3',
    'installable': True,
    'application': True,
}
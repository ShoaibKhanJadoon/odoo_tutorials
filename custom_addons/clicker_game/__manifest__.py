{
    'name': "Clicker Game",
    'version': '1.0',
    'summary': 'A systray-based clicker game using OWL',
    'category': 'Tools',
    'depends': ['web'],

    'assets': {
        'web.assets_backend': [
            "clicker_game/static/src/components/client_action.scss",
            "clicker_game/static/src/utils/utils.js",
            "clicker_game/static/src/commands/clicker_commands.js",
            "clicker_game/static/src/components/click_rewards.js",
            "clicker_game/static/src/clicker_systray_item.js",
            "clicker_game/static/src/clicker_systray_item.xml",
            "clicker_game/static/src/components/click_value.xml",
            "clicker_game/static/src/components/click_value.js",
            "clicker_game/static/src/clicker_service.js",
            "clicker_game/static/src/clicker_model.js",
            "clicker_game/static/src/components/client_action.js",
            "clicker_game/static/src/components/client_action.xml",
        ],
    },

    'installable': True,
    'application': True,
}

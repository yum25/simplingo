# Default Gemini-supported languages
gem_app_langs = {'ar': 'Arabic',
                 'bn': 'Bengali',
                 'bg': 'Bulgarian',
                 'zh': 'Simplified Chinese',
                 'zh-tw': 'Traditional Chinese',
                 'hr': 'Croatian',
                 'cs': 'Czech',
                 'da': 'Danish',
                 'nl': 'Dutch',
                 'en': 'English',
                 'et': 'Estonian',
                 'fi': 'Finnish',
                 'de': 'German',
                 'el': 'Greek',
                 'iw': 'Hebrew',
                 'hi': 'Hindi',
                 'hu': 'Hungarian',
                 'id': 'Indonesian',
                 'it': 'Italian',
                 'ja': 'Japanese',
                 'ko': 'Korean',
                 'lv': 'Latvian',
                 'lt': 'Lithuanian',
                 'no': 'Norwegian',
                 'pl': 'Polish',
                 'pt': 'Portuguese',
                 'ro': 'Romanian',
                 'ru': 'Russian',
                 'sr': 'Serbian',
                 'sk': 'Slovak',
                 'sl': 'Slovenian',
                 'es': 'Spanish',
                 'sw': 'Swahili',
                 'sv': 'Swedish',
                 'th': 'Thai',
                 'tr': 'Turkish',
                 'uk': 'Ukrainian',
                 'vi': 'Vietnamese'}
# TODO: Default GPT-supported languages 
gpt_app_langs = {}

class Config(object):
    """Configure relevant runtime settings."""
    DEBUG = True
    DEVELOPMENT = True

    # Configure app specifics:
    #   Model can be gpt2, t5, gemini (support for others is in progress)
    #   Set app langs to those supported by a specific model
    B_MODEL = "gemini"
    GEMINI_BACKUP = False
    APP_LANGS = gem_app_langs

class ProdConfig(Config):
    DEVELOPMENT = False
    DEBUG = False
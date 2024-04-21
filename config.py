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
                 'fr': 'French',
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

# Note: not good with Hebrew
# Many languages trained on, questionable functional support
# Languages included are languages that were listed somewhere;
# there is no official list available online
gpt_app_langs = {# 'af': 'Afrikaans', # Afrikaans
                 # 'as': 'Assamese', # অসমীয়া
                 'ar': 'Arabic', # العربية
                 'awa': 'Awadhi', # अवधी
                 'az': 'Azerbaijani', # Azərbaycanca
                 'ba': 'Bashkir', # Башҡорт
                 'be': 'Belarusian', # Беларуская
                 'bg': 'Bulgarian', # български
                 'bgc': 'Haryanvi', # हरियाणवी
                 'bho': 'Bhojpuri', # भोजपुरी
                 'bn': 'Bengali', # বাংলা
                 'bs': 'Bosnian', # Bosanski
                 'ca': 'Catalan', # Català
                 'cnr': 'Montenegrin', # Crnogorski
                 'cs': 'Czech', # Čeština
                 'cy': 'Welsh', # Cymraeg
                 'da': 'Danish', # Dansk
                 'de': 'German', # Deutsch
                 'doi': 'Dogri', # डोगरी
                 'el': 'Greek', # Ελληνικά
                 'en': 'English', # English
                 'es': 'Spanish', # Español
                 'et': 'Estonian', # Eesti
                 'eu': 'Basque', # Euskara
                 'fa': 'Persian', # فارسی
                 'fi': 'Finnish', # Suomi
                 'fo': 'Faroese', # Føroyskt
                 'fr': 'French', # Français
                 'ga': 'Irish', # Gaeilge
                 'gl': 'Galician', # Galego
                 'gu': 'Gujarati', # ગુજરાતી
                 'hi': 'Hindi', # हिंदी
                 'hne': 'Chhattisgarhi', # छत्तीसगढ़ी	
                 'hr': 'Croatian', # Hrvatski
                 'hu': 'Hungarian', # Magyar
                 'hy': 'Armenian', # Հայերեն
                 'id': 'Indonesian', # Bahasa Indonesia
                 'it': 'Italian', # Italiano
                 # 'iw': 'Hebrew', # עִבְרִית
                 'ja': 'Japanese', # 日本語
                 'jv': 'Javanese', # Basa Jawa
                 'ka': 'Georgian', # ქართული
                 'kk': 'Kazakh', # Қазақша
                 'kn': 'Kannada', # ಕನ್ನಡ
                 'ko': 'Korean', # 한국어
                 'kok': 'Konkani', # कोंकणी
                 'ks': 'Kashmiri', # कश्मीरी
                 'ky': 'Kyrgyz', # Кыргызча
                 'lt': 'Lithuanian', # Lietuvių
                 'lv': 'Latvian', # Latviešu
                 'mai': 'Maithili', # मैथिली
                 'mk': 'Macedonian', # Македонски
                 'mn': 'Mongolian', # Монгол
                 'mr': 'Marathi', # मराठी
                 'ms': 'Malay', # Bahasa Melayu
                 'mt': 'Maltese', # Malti
                 'mwr': 'Marwari', # मारवाड़ी
                 # 'my': 'Burmese', # မြန်မာအက္ခရာ
                 'nan': 'Min Nan', # 閩南語
                 'ne': 'Nepali', # नेपाली
                 'nl': 'Dutch', # Nederlands
                 'no': 'Norwegian', # Norsk
                 'or': 'Oriya', # ଓଡ଼ିଆ
                 'pa': 'Punjabi', # ਪੰਜਾਬੀ
                 'pl': 'Polish', # Polski
                 'ps': 'Pashto', # پښتو
                 'pt': 'Portuguese', # Português
                 'pt-br': 'Brazilian Portuguese', # português brasileiro
                 'raj': 'Rajasthani', # राजस्थानी
                 'ro': 'Romanian', # Română
                 'ro-m': 'Moldovan', # Moldovenească
                 'ru': 'Russian', # Русский
                 'sa': 'Sanskrit', # संस्कृतम्
                 'sat': 'Santali', # संताली
                 'sd': 'Sindhi', # سنڌي
                 'si': 'Sinhala', # සිංහල
                 'sk': 'Slovak', # Slovenčina
                 'sl': 'Slovenian', # Slovenščina
                 'sr': 'Serbian', # Српски
                 'sq': 'Albanian', # Shqip
                 'sw': 'Swahili', # Kiswahili
                 'sv': 'Swedish', # Svenska
                 'ta': 'Tamil', # தமிழ்
                 'te': 'Telugu', # తెలుగు
                 'tg': 'Tajik', # Тоҷикӣ
                 'th': 'Thai', # ภาษาไทย
                 'tk': 'Turkmen Turkic', # Türkmençe
                 'tl': 'Tagalog', # Tagalog
                 'tr': 'Turkish', # Türkçe
                 'tt': 'Tatar', # татар теле
                 'uk': 'Ukrainian', # Українська
                 'ur': 'Urdu', # اردو
                 'uz': 'Uzbek', # Ўзбек
                 'vi': 'Vietnamese', # Việt Nam
                 'wuu': 'Wu', # 吴语
                 'yue': 'Cantonese', # 粵語
                 'zh': 'Simplified Chinese', # 中文 （简体）
                 'zh-tw': 'Traditional Chinese',} # 中文 （繁體）

class Config(object):
    """Configure relevant runtime settings."""
    DEBUG = True
    DEVELOPMENT = True

    # Configure app specifics:
    #   Model can be gpt2, t5, gemini (support for others is in progress)
    #   Set app langs to those supported by a specific model
    B_MODEL = "gemini"
    # When using free Gemini API, set up backup model for better response times
    #   and to avoid hitting rate limits as quickly
    GEMINI_BACKUP = True
    GEMINI_BACKUP_NUMBER = 3
    GPT_BACKUP = False
    GEM_LANGS = gem_app_langs
    GPT_LANGS = gpt_app_langs

class ProdConfig(Config):
    DEVELOPMENT = False
    DEBUG = False
    B_MODEL = "gpt35"
    GEMINI_BACKUP = True
    APP_LANGS = gpt_app_langs
    BACKUP_APP_LANGS = gem_app_langs
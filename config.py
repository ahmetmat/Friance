import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration settings for the application"""
    
    # Application settings
    DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    
    # API Keys
    ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY', '')
    IOINTELLIGENCE_API_KEY = os.getenv('IOINTELLIGENCE_API_KEY', '')
    NEWS_API_KEY = os.getenv('NEWS_API_KEY', '')
    
    # File paths
    PROFILE_PATH = os.path.join(os.path.dirname(__file__), "marketsweep", "user_profile.json")
    
    # External APIs
    ETHERSCAN_API_URL = "https://api.etherscan.io/api"
    COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
    BINANCE_API_URL = "https://api.binance.com"
    BITGET_API_URL = "https://api.bitget.com"
    NEWS_API_URL = "https://newsapi.org/v2/everything"
    
    # LLM settings
    LLM_MODEL = os.getenv('LLM_MODEL', 'meta-llama/Llama-3.3-70B-Instruct')
    LLM_BASE_URL = os.getenv('LLM_BASE_URL', 'https://api.intelligence.io.solutions/api/v1/')
    
    # Default cache duration (in seconds)
    CACHE_DURATION = 300  # 5 minutes
    
    @staticmethod
    def get_api_key(service):
        """Get API key for a specific service"""
        if service.lower() == 'etherscan':
            return Config.ETHERSCAN_API_KEY
        elif service.lower() == 'iointelligence':
            return Config.IOINTELLIGENCE_API_KEY
        elif service.lower() == 'news':
            return Config.NEWS_API_KEY
        return None


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # In production, rely on environment variables for secrets


# Select configuration based on environment
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Current configuration
current_config = config[os.getenv('FLASK_ENV', 'default')]
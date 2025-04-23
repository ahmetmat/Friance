/**
 * Multilanguage support for Crypto Investor Copilot
 */

// Available languages
const languages = {
    en: {
      name: 'English',
      translations: {
        // Header
        'app_title': 'Crypto Investor Copilot',
        'app_subtitle': 'Your personalized assistant for data-driven cryptocurrency investment decisions',
        
        // Form steps
        'step1_title': 'Personal Information',
        'step2_title': 'Investment Preferences',
        'step3_title': 'Wallet Information',
        
        // Form fields
        'name_label': 'Your Name',
        'name_placeholder': 'John Doe',
        'budget_label': 'Investment Budget (USD)',
        'budget_placeholder': '5000',
        'risk_label': 'Risk Tolerance',
        'risk_low': 'Low - Safety First',
        'risk_medium': 'Medium - Balanced Approach',
        'risk_high': 'High - Maximum Growth',
        'interests_label': 'Investment Interests',
        'interests_placeholder': 'Type and press Enter (e.g. AI, DeFi, Web3)',
        'connection_type_label': 'Connection Type',
        'connection_wallet': 'Ethereum Wallet Address',
        'connection_binance': 'Binance Account',
        'connection_bitget': 'Bitget Account',
        'wallet_address_label': 'Wallet Address',
        'etherscan_key_label': 'Etherscan API Key',
        'binance_api_key_label': 'Binance API Key',
        'binance_secret_label': 'Binance Secret Key',
        'bitget_api_key_label': 'Bitget API Key',
        'bitget_secret_label': 'Bitget Secret Key',
        'bitget_passphrase_label': 'Bitget Passphrase',
        'api_key_help': '* We recommend using API keys with read-only permissions',
        
        // Buttons
        'back_button': 'Back',
        'continue_button': 'Continue',
        'analyze_button': 'Analyze Portfolio',
        'restart_button': 'Start New Analysis',
        
        // Results
        'market_summary_title': 'Market Summary',
        'portfolio_recommendation_title': 'Portfolio Recommendation',
        'wallet_analysis_title': 'Wallet Analysis',
        'btc_up': 'Bitcoin is up',
        'today': 'today',
        'top_gainers': 'Top Gainers',
        'top_losers': 'Top Losers',
        'strategy': 'Strategy',
        'account_address': 'Account Address/ID:',
        'total_holdings': 'Total Holdings (USD):',
        'token_breakdown': 'Token Breakdown:',
        
        // Loading
        'analyzing': 'Analyzing your portfolio and market data...',
        
        // Errors
        'required_fields': 'Please fill in all required fields.',
        'wallet_required': 'Please enter your wallet address.',
        'etherscan_required': 'Please enter your Etherscan API key.',
        'binance_required': 'Please enter your Binance API key and secret key.',
        'bitget_required': 'Please enter your Bitget API key, secret key, and passphrase.'
      }
    },
    tr: {
      name: 'Türkçe',
      translations: {
        // Header
        'app_title': 'Kripto Yatırımcı Yardımcısı',
        'app_subtitle': 'Veri odaklı kripto para yatırım kararları için kişiselleştirilmiş asistanınız',
        
        // Form steps
        'step1_title': 'Kişisel Bilgiler',
        'step2_title': 'Yatırım Tercihleri',
        'step3_title': 'Cüzdan Bilgileri',
        
        // Form fields
        'name_label': 'Adınız',
        'name_placeholder': 'Ahmet Yılmaz',
        'budget_label': 'Yatırım Bütçesi (USD)',
        'budget_placeholder': '5000',
        'risk_label': 'Risk Toleransı',
        'risk_low': 'Düşük - Önce Güvenlik',
        'risk_medium': 'Orta - Dengeli Yaklaşım',
        'risk_high': 'Yüksek - Maksimum Büyüme',
        'interests_label': 'Yatırım İlgi Alanları',
        'interests_placeholder': 'Yazın ve Enter\'a basın (örn. AI, DeFi, Web3)',
        'connection_type_label': 'Bağlantı Türü',
        'connection_wallet': 'Ethereum Cüzdan Adresi',
        'connection_binance': 'Binance Hesabı',
        'connection_bitget': 'Bitget Hesabı',
        'wallet_address_label': 'Cüzdan Adresi',
        'etherscan_key_label': 'Etherscan API Anahtarı',
        'binance_api_key_label': 'Binance API Anahtarı',
        'binance_secret_label': 'Binance Gizli Anahtarı',
        'bitget_api_key_label': 'Bitget API Anahtarı',
        'bitget_secret_label': 'Bitget Gizli Anahtarı',
        'bitget_passphrase_label': 'Bitget Parolası',
        'api_key_help': '* Sadece okuma izni olan API anahtarları kullanmanızı öneririz',
        
        // Buttons
        'back_button': 'Geri',
        'continue_button': 'Devam Et',
        'analyze_button': 'Portföyü Analiz Et',
        'restart_button': 'Yeni Analiz Başlat',
        
        // Results
        'market_summary_title': 'Piyasa Özeti',
        'portfolio_recommendation_title': 'Portföy Önerisi',
        'wallet_analysis_title': 'Cüzdan Analizi',
        'btc_up': 'Bitcoin yükseldi',
        'today': 'bugün',
        'top_gainers': 'En Çok Yükselenler',
        'top_losers': 'En Çok Düşenler',
        'strategy': 'Strateji',
        'account_address': 'Hesap Adresi/ID:',
        'total_holdings': 'Toplam Varlıklar (USD):',
        'token_breakdown': 'Token Dağılımı:',
        
        // Loading
        'analyzing': 'Portföyünüz ve piyasa verileri analiz ediliyor...',
        
        // Errors
        'required_fields': 'Lütfen tüm gerekli alanları doldurun.',
        'wallet_required': 'Lütfen cüzdan adresinizi girin.',
        'etherscan_required': 'Lütfen Etherscan API anahtarınızı girin.',
        'binance_required': 'Lütfen Binance API anahtarınızı ve gizli anahtarınızı girin.',
        'bitget_required': 'Lütfen Bitget API anahtarınızı, gizli anahtarınızı ve parolanızı girin.'
      }
    }
  };
  
  // Current language (default to English)
  let currentLanguage = 'en';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Create language selector
    createLanguageSelector();
    
    // Load saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang && languages[savedLang]) {
      currentLanguage = savedLang;
    }
    
    // Update language selector and translate page
    document.getElementById('language-select').value = currentLanguage;
    translatePage();
  });
  
  /**
   * Create language selector element
   */
  function createLanguageSelector() {
    const languageSelector = document.createElement('div');
    languageSelector.classList.add('language-selector');
    
    // Create select element
    const select = document.createElement('select');
    select.id = 'language-select';
    
    // Add options for each language
    for (const lang in languages) {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = languages[lang].name;
      select.appendChild(option);
    }
    
    // Add event listener
    select.addEventListener('change', function() {
      currentLanguage = this.value;
      localStorage.setItem('language', currentLanguage);
      translatePage();
    });
    
    languageSelector.appendChild(select);
    document.body.appendChild(languageSelector);
  }
  
  /**
   * Translate all elements with data-i18n attribute
   */
  function translatePage() {
    const translations = languages[currentLanguage].translations;
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      
      if (translations[key]) {
        // If it's an input with placeholder
        if (element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translations[key]);
        }
        // If it's a button or has innerHTML
        else {
          element.innerHTML = translations[key];
        }
      }
    });
  }
  
  /**
   * Get translated text for a key
   * 
   * @param {string} key - Translation key
   * @returns {string} - Translated text or key if not found
   */
  function getTranslation(key) {
    const translations = languages[currentLanguage].translations;
    return translations[key] || key;
  }
  
  /**
   * Update all element text with translation on page load and language change
   */
  function initTranslations() {
    // Get all elements that need translation
    const elementsToTranslate = [
      { selector: 'h1', key: 'app_title' },
      { selector: '.subtitle', key: 'app_subtitle' },
      // Add more elements here
    ];
    
    // Update each element with translation
    elementsToTranslate.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        el.setAttribute('data-i18n', item.key);
        el.textContent = getTranslation(item.key);
      });
    });
  }
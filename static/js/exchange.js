/**
 * Exchange integration and form handling for the Crypto Investor Copilot
 */

// Toggle form fields based on selected connection type
function toggleConnectionFields() {
    const connectionType = document.getElementById('connection_type').value;
    
    // Hide all connection fields first
    document.getElementById('wallet_fields').style.display = 'none';
    document.getElementById('binance_fields').style.display = 'none';
    document.getElementById('bitget_fields').style.display = 'none';
    
    // Show selected fields
    if (connectionType === 'wallet') {
      document.getElementById('wallet_fields').style.display = 'block';
    } else if (connectionType === 'binance') {
      document.getElementById('binance_fields').style.display = 'block';
    } else if (connectionType === 'bitget') {
      document.getElementById('bitget_fields').style.display = 'block';
    }
  }
  
  // Initialize form with default connection type
  document.addEventListener('DOMContentLoaded', function() {
    // Set up the connection type toggle
    const connectionTypeSelect = document.getElementById('connection_type');
    if (connectionTypeSelect) {
      connectionTypeSelect.addEventListener('change', toggleConnectionFields);
      toggleConnectionFields(); // Set initial state
    }
    
    // Set up form submission 
    const form = document.getElementById('investor-form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
  });
  
  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form data before submission
    if (!validateForm()) {
      return;
    }
    
    // Show loading animation
    showLoadingIndicator();
    
    // Collect form data
    const formData = collectFormData();
    
    // In a real application, send data to server
    // For this example we'll use the simulateAnalysis function
    simulateAnalysis(formData);
  }
  
  // Validate form fields based on selected connection type
 // Validate form fields based on selected connection type
function validateForm() {
  // Basic required fields
  const name = document.getElementById('name').value;
  const budget = document.getElementById('budget').value;
  
  if (!name || !budget) {
    alert('Please fill in your name and budget.');
    return false;
  }
  
  // Connection type specific validation
  const connectionType = document.getElementById('connection_type').value;
  
  if (connectionType === 'wallet') {
    const walletAddress = document.getElementById('wallet_address').value;
    
    if (!walletAddress) {
      alert('Please enter your wallet address.');
      return false;
    }
    
    // Removed Etherscan API key validation
  } 
  else if (connectionType === 'binance') {
    const binanceApiKey = document.getElementById('binance_api_key').value;
    const binanceSecret = document.getElementById('binance_secret').value;
    
    if (!binanceApiKey || !binanceSecret) {
      alert('Please enter your Binance API key and secret key.');
      return false;
    }
  }
  else if (connectionType === 'bitget') {
    const bitgetApiKey = document.getElementById('bitget_api_key').value;
    const bitgetSecret = document.getElementById('bitget_secret').value;
    const bitgetPassphrase = document.getElementById('bitget_passphrase').value;
    
    if (!bitgetApiKey || !bitgetSecret || !bitgetPassphrase) {
      alert('Please enter your Bitget API key, secret key, and passphrase.');
      return false;
    }
  }
  
  return true;
}

// Also update the collectFormData function
function collectFormData() {
  const connectionType = document.getElementById('connection_type').value;
  
  // Basic user profile
  const formData = {
    connection_type: connectionType,
    profile: {
      name: document.getElementById('name').value,
      budget: parseFloat(document.getElementById('budget').value),
      risk: document.getElementById('risk').value,
      interests: window.tags || [] // Global tags array from main.js
    }
  };
  
  // Connection specific data
  if (connectionType === 'wallet') {
    formData.wallet_address = document.getElementById('wallet_address').value;
    // Removed Etherscan API key field
  } 
  else if (connectionType === 'binance') {
    formData.binance_api_key = document.getElementById('binance_api_key').value;
    formData.binance_secret = document.getElementById('binance_secret').value;
  }
  else if (connectionType === 'bitget') {
    formData.bitget_api_key = document.getElementById('bitget_api_key').value;
    formData.bitget_secret = document.getElementById('bitget_secret').value;
    formData.bitget_passphrase = document.getElementById('bitget_passphrase').value;
  }
  
  return formData;
}
  
  // Show loading indicator
  function showLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.classList.add('loading-container');
    loadingEl.id = 'loading-indicator';
    loadingEl.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Analyzing your portfolio and market data...</p>
    `;
    document.body.appendChild(loadingEl);
  }
  
  // Remove loading indicator
  function hideLoadingIndicator() {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
      loadingEl.remove();
    }
  }
  
  // Simulate API call
 // exchange.js dosyasında değişiklik
// exchange.js içindeki simulateAnalysis fonksiyonunu düzenleyin
// exchange.js içindeki simulateAnalysis fonksiyonunu düzenleyin
// In exchange.js - update the simulateAnalysis function to properly handle the response

function simulateAnalysis(formData) {
    // Demo mode and real API mode toggle
    const USE_REAL_API = true;
    
    if (USE_REAL_API) {
        console.log("Sending analysis request to server...");
        showLoadingIndicator();
        
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Received data:", data);
            
            // Check if we have an error message
            if (data.status === "error") {
                throw new Error(data.message || "Unknown error occurred");
            }
            
            // Hide loading indicator
            hideLoadingIndicator();
            
            // Show results
            document.querySelector('form').style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            const resultsElement = document.getElementById('results');
            resultsElement.classList.add('active');
            
            // Populate results with data
            populateResults(data);
        })
        .catch(error => {
            console.error("API Error:", error);
            hideLoadingIndicator();
            
            // Show error message to user
            const errorMsg = `An error occurred: ${error.message}. Please check your connection details and try again.`;
            alert(errorMsg);
        });
    } else {
        // Test mode - simulate delay and use sample data
        console.log("Using test mode with sample data");
        showLoadingIndicator();
        
        // Simulate network delay
        setTimeout(() => {
            hideLoadingIndicator();
            
            // Get sample data based on connection type
            const sampleData = getSampleDataForConnectionType(formData.connection_type);
            
            // Show results
            document.querySelector('form').style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.getElementById('results').classList.add('active');
            
            // Populate results with sample data
            populateResults(sampleData);
        }, 2000);
    }
}
  // Get customized sample data based on connection type
  function getSampleDataForConnectionType(connectionType) {
    // Base sample data
    const data = {
      "market_summary": {
        "btc_pct": 3.53,
        "gainers": [
          { "change": 14.26, "symbol": "STX" },
          { "change": 9.5, "symbol": "SOL" },
          { "change": 8.32, "symbol": "KAS" },
          { "change": 7.12, "symbol": "SUI" },
          { "change": 6.8, "symbol": "XLM" }
        ],
        "losers": [
          { "change": -2.7, "symbol": "DEXE" },
          { "change": -2.36, "symbol": "TKX" },
          { "change": -0.23, "symbol": "TRX" },
          { "change": -0.14, "symbol": "SUSDS" },
          { "change": -0.09, "symbol": "USDC" }
        ],
        "markdown": "**📈 Top Gainers**\n- STX +14.26%\n- SOL +9.5%\n- KAS +8.32%\n- SUI +7.12%\n- XLM +6.8%\n\n**📉 Top Losers**\n- DEXE -2.7%\n- TKX -2.36%\n- TRX -0.23%\n- SUSDS -0.14%\n- USDC -0.09%\n\n**💰 Bitcoin Update**\n- Bitcoin is up 📈 3.53%",
        "summary": "The market is seeing a positive trend with Bitcoin up 3.53%, led by top gainers STX, SOL, and KAS, while DEXE, TKX, and TRX are among the losers."
      },
      "portfolio_recommendation": {
        "markdown": "**💼 Portfolio Recommendation**\n- STX (30%): Recent high gains indicate strong momentum...\n- SUI (20%): AI-focused with potential for growth...\n- XLM (50%): Stable infrastructure for balanced risk...",
        "recommended": [
          {
            "alloc_pct": 30,
            "reason": "Strong short-term momentum with 14.26% gain",
            "symbol": "stx"
          },
          {
            "alloc_pct": 20,
            "reason": "Growing AI ecosystem potential",
            "symbol": "sui"
          },
          {
            "alloc_pct": 50,
            "reason": "Established infrastructure with medium-risk stability",
            "symbol": "xlm"
          }
        ],
        "strategy": "Balanced risk with AI and infrastructure focus, considering medium risk level."
      }
    };
    
    // Customize wallet analysis based on connection type
    if (connectionType === 'wallet') {
      data.wallet_analysis = {
        "address": "0x94845333028B1204Fbe14E1278Fd4Adde46B22ce",
        "holdings_usd": 8528.13,
        "token_breakdown": [
          {
            "amount": 2.842711376299289,
            "symbol": "ETH",
            "usd_value": 8528.13
          }
        ]
      };
    } 
    else if (connectionType === 'binance') {
      data.wallet_analysis = {
        "address": "Binance: API5X...Z7F3Q",
        "holdings_usd": 12463.75,
        "token_breakdown": [
          {
            "amount": 0.35,
            "symbol": "BTC", 
            "usd_value": 6825.50
          },
          {
            "amount": 1.25,
            "symbol": "ETH",
            "usd_value": 3750.00
          },
          {
            "amount": 1850.0,
            "symbol": "USDT",
            "usd_value": 1850.00
          },
          {
            "amount": 10.5,
            "symbol": "SOL",
            "usd_value": 682.50
          },
          {
            "amount": 85.0,
            "symbol": "XLM",
            "usd_value": 355.75
          }
        ]
      };
    }
    return data;
    }
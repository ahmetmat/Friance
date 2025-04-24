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
      <p>Analyzing your portfolio and market data... max 45 seconds</p>
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
       
    }
}
  
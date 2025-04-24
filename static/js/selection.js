// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to card buttons
    const cardButtons = document.querySelectorAll('.card-cta');
    cardButtons.forEach(button => {
      button.addEventListener('click', function() {
        const option = this.getAttribute('data-option');
        selectOption(option);
      });
    });
  });
  
  // Function to handle option selection
  function selectOption(option) {
    // Apply pulse animation to selected card
    document.getElementById(`${option}-card`).classList.add('pulse');
    
    // Hide all cards with fade effect
    const cardsContainer = document.getElementById('selection-cards');
    cardsContainer.style.opacity = '0';
    cardsContainer.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      cardsContainer.style.display = 'none';
      
      // Show form container
      const formContainer = document.getElementById('form-container');
      formContainer.style.display = 'block';
      
      // Load appropriate form based on selection
      loadForm(option);
    }, 500);
  }
  
  // Function to load appropriate form based on selection
  function loadForm(option) {
    const formContainer = document.getElementById('form-container');
    
    switch(option) {
      case 'market-analysis':
        // For market analysis, we'll show a simple form with just a button
        formContainer.innerHTML = `
          <div class="card">
            <h3 class="card-title">Market Analysis</h3>
            <p class="card-description">Our AI will analyze current market conditions and provide you with insights.</p>
            <button class="card-cta" id="start-market-analysis">
              Start Analysis <i class="fas fa-chart-bar"></i>
            </button>
          </div>
        `;
        // Add event listener after creating the button
        setTimeout(() => {
          document.getElementById('start-market-analysis').addEventListener('click', submitMarketAnalysis);
        }, 0);
        break;
        
      case 'portfolio-analysis':
        // For portfolio analysis, we need wallet connection info
        formContainer.innerHTML = `
          <div class="card">
            <h3 class="card-title">Connect Your Wallet</h3>
            <p class="card-description">Provide your wallet address to analyze your current holdings.</p>
            
            <div style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Connection Type</label>
              <select id="connection_type" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
                <option value="wallet">Ethereum Wallet Address</option>
                <option value="binance">Binance Account</option>
                <option value="bitget">Bitget Account</option>
              </select>
            </div>
            
            <div id="wallet_fields" style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Wallet Address</label>
              <input type="text" id="wallet_address" placeholder="0x94845333028B1204Fbe14E1278Fd4Adde46B22ce" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
            </div>
            
            <button class="card-cta" id="analyze-portfolio" style="background: #f59e0b;">
              Analyze My Portfolio <i class="fas fa-search-dollar"></i>
            </button>
          </div>
        `;
        // Add event listeners after creating the elements
        setTimeout(() => {
          document.getElementById('connection_type').addEventListener('change', toggleConnectionFields);
          document.getElementById('analyze-portfolio').addEventListener('click', submitPortfolioAnalysis);
        }, 0);
        break;
        
      case 'investment-recommendations':
        // For investment recommendations, we need budget and profile info
        formContainer.innerHTML = `
          <div class="card">
            <h3 class="card-title">Investment Profile</h3>
            <p class="card-description">Tell us about your investment goals so we can provide personalized recommendations.</p>
            
            <div style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Your Name</label>
              <input type="text" id="name" placeholder="John Doe" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
            </div>
            
            <div style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Investment Budget (USD)</label>
              <input type="number" id="budget" placeholder="5000" min="100" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
            </div>
            
            <div style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Risk Tolerance</label>
              <select id="risk" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
                <option value="low">Low - Safety First</option>
                <option value="medium" selected>Medium - Balanced Approach</option>
                <option value="high">High - Maximum Growth</option>
              </select>
            </div>
            
            <div style="width: 100%; margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Investment Interests</label>
              <div class="tags-input-container" id="tags-container" style="border: 1px solid #d1d5db; padding: 0.5rem; border-radius: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <input type="text" class="tags-input" id="tags-input" placeholder="Type and press Enter (e.g. AI, DeFi, Web3)" style="flex: 1; border: none; outline: none; padding: 0.25rem; min-width: 150px;">
              </div>
            </div>
            
            <button class="card-cta" id="get-recommendations" style="background: #22c55e;">
              Get Recommendations <i class="fas fa-chart-pie"></i>
            </button>
          </div>
        `;
        // Add event listeners after creating the elements
        setTimeout(() => {
          initializeTagsInput();
          document.getElementById('get-recommendations').addEventListener('click', submitInvestmentRecommendations);
        }, 0);
        break;
    }
  }
  
  // Function to toggle connection fields based on selected type
  function toggleConnectionFields() {
    const connectionType = document.getElementById('connection_type').value;
    const walletFields = document.getElementById('wallet_fields');
    
    // Remove any existing exchange-specific fields
    const existingExchangeFields = document.getElementById('exchange_fields');
    if (existingExchangeFields) {
      existingExchangeFields.remove();
    }
    
    // Show/hide wallet fields
    if (connectionType === 'wallet') {
      walletFields.style.display = 'block';
    } else {
      walletFields.style.display = 'none';
      
      // Create and add exchange fields
      const exchangeFields = document.createElement('div');
      exchangeFields.id = 'exchange_fields';
      exchangeFields.style.width = '100%';
      exchangeFields.style.marginBottom = '1.5rem';
      
      if (connectionType === 'binance') {
        exchangeFields.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Binance API Key</label>
            <input type="text" id="binance_api_key" placeholder="Your Binance API Key" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Binance Secret Key</label>
            <input type="password" id="binance_secret" placeholder="Your Binance Secret Key" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
            <small style="display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #64748b;">* We recommend using API keys with read-only permissions</small>
          </div>
        `;
      } else if (connectionType === 'bitget') {
        exchangeFields.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Bitget API Key</label>
            <input type="text" id="bitget_api_key" placeholder="Your Bitget API Key" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Bitget Secret Key</label>
            <input type="password" id="bitget_secret" placeholder="Your Bitget Secret Key" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; text-align: left; font-weight: 500;">Bitget Passphrase</label>
            <input type="password" id="bitget_passphrase" placeholder="Your Bitget Passphrase" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #d1d5db;">
            <small style="display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #64748b;">* We recommend using API keys with read-only permissions</small>
          </div>
        `;
      }
      
      // Insert exchange fields after wallet fields
      walletFields.parentNode.insertBefore(exchangeFields, walletFields.nextSibling);
    }
  }
  
  // Function to initialize tags input
  function initializeTagsInput() {
    const tagsContainer = document.getElementById('tags-container');
    const tagsInput = document.getElementById('tags-input');
    
    if (!tagsContainer || !tagsInput) return;
    
    // Add default tags
    ['AI', 'DeFi', 'Web3'].forEach(tag => {
      addTag(tag);
    });
    
    // Event listener for adding new tags
    tagsInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && tagsInput.value.trim() !== '') {
        e.preventDefault();
        const tag = tagsInput.value.trim();
        addTag(tag);
        tagsInput.value = '';
      }
    });
  }
  
  // Function to add a tag
  function addTag(tag) {
    const tagsContainer = document.getElementById('tags-container');
    const tagsInput = document.getElementById('tags-input');
    
    if (!tagsContainer || !tagsInput) return;
    
    const tagElement = document.createElement('div');
    tagElement.classList.add('tag-item');
    tagElement.style.backgroundColor = '#e0f2fe';
    tagElement.style.color = '#0284c7';
    tagElement.style.padding = '0.25rem 0.5rem';
    tagElement.style.borderRadius = '0.25rem';
    tagElement.style.display = 'flex';
    tagElement.style.alignItems = 'center';
    
    const tagText = document.createTextNode(tag);
    tagElement.appendChild(tagText);
    
    const closeButton = document.createElement('span');
    closeButton.style.marginLeft = '0.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      tagElement.remove();
    });
    
    tagElement.appendChild(closeButton);
    tagsContainer.insertBefore(tagElement, tagsInput);
  }
  
  // Submit handlers for each form type
  function submitMarketAnalysis() {
    // For market analysis, we can proceed directly to analysis
    showLoadingIndicator();
    
    // Prepare data for the request
    const data = {
      connection_type: "none",
      profile: {
        type: "market_analysis_only"
      }
    };
    
    // Send real request to the backend
    sendAnalysisRequest(data);
  }
  
  function submitPortfolioAnalysis() {
    // Validate wallet information
    const connectionType = document.getElementById('connection_type').value;
    
    if (connectionType === 'wallet') {
      const walletAddress = document.getElementById('wallet_address').value;
      if (!walletAddress) {
        alert('Please enter your wallet address.');
        return;
      }
    } else if (connectionType === 'binance') {
      const binanceApiKey = document.getElementById('binance_api_key').value;
      const binanceSecret = document.getElementById('binance_secret').value;
      if (!binanceApiKey || !binanceSecret) {
        alert('Please enter your Binance API key and secret key.');
        return;
      }
    } else if (connectionType === 'bitget') {
      const bitgetApiKey = document.getElementById('bitget_api_key').value;
      const bitgetSecret = document.getElementById('bitget_secret').value;
      const bitgetPassphrase = document.getElementById('bitget_passphrase').value;
      if (!bitgetApiKey || !bitgetSecret || !bitgetPassphrase) {
        alert('Please enter your Bitget API key, secret key, and passphrase.');
        return;
      }
    }
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Collect form data
    const data = collectPortfolioData();
    
    // Send real request to backend
    sendAnalysisRequest(data);
  }
  
  function submitInvestmentRecommendations() {
    // Validate investment profile
    const name = document.getElementById('name').value;
    const budget = document.getElementById('budget').value;
    
    if (!name || !budget) {
      alert('Please fill in your name and budget.');
      return;
    }
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Collect form data
    const data = collectInvestmentData();
    
    // Send real request to backend
    sendAnalysisRequest(data);
  }
  
  // Helper function to collect portfolio analysis data
  function collectPortfolioData() {
    const connectionType = document.getElementById('connection_type').value;
    
    // Basic data structure
    const data = {
      connection_type: connectionType,
      profile: {
        type: "portfolio_analysis",
        name: "Portfolio User",
        budget: 0,
        risk: "medium"
      }
    };
    
    // Add connection-specific fields
    if (connectionType === 'wallet') {
      data.wallet_address = document.getElementById('wallet_address').value;
    } else if (connectionType === 'binance') {
      data.binance_api_key = document.getElementById('binance_api_key').value;
      data.binance_secret = document.getElementById('binance_secret').value;
    } else if (connectionType === 'bitget') {
      data.bitget_api_key = document.getElementById('bitget_api_key').value;
      data.bitget_secret = document.getElementById('bitget_secret').value;
      data.bitget_passphrase = document.getElementById('bitget_passphrase').value;
    }
    
    return data;
  }
  
  // Helper function to collect investment recommendation data
  function collectInvestmentData() {
    // Extract tags from UI
    const tagElements = document.querySelectorAll('.tag-item');
    const tags = Array.from(tagElements).map(el => el.textContent.trim().replace('×', ''));
    
    return {
      connection_type: "none",
      profile: {
        type: "investment_recommendations",
        name: document.getElementById('name').value,
        budget: parseFloat(document.getElementById('budget').value),
        risk: document.getElementById('risk').value,
        interests: tags
      }
    };
  }
  
  // Show loading indicator with progress bar
  function showLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.classList.add('loading-container');
    loadingEl.id = 'loading-indicator';
    loadingEl.style.position = 'fixed';
    loadingEl.style.top = '0';
    loadingEl.style.left = '0';
    loadingEl.style.width = '100%';
    loadingEl.style.height = '100%';
    loadingEl.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    loadingEl.style.display = 'flex';
    loadingEl.style.flexDirection = 'column';
    loadingEl.style.alignItems = 'center';
    loadingEl.style.justifyContent = 'center';
    loadingEl.style.zIndex = '1000';
    
    const spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid var(--primary)';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.marginBottom = '1rem';
    
    const text = document.createElement('p');
    text.textContent = 'Analyzing portfolio and market data- max45 seconds...';
    
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '80%';
    progressContainer.style.maxWidth = '400px';
    progressContainer.style.height = '20px';
    progressContainer.style.backgroundColor = '#f3f3f3';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.marginTop = '1rem';
    progressContainer.style.overflow = 'hidden';
    
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = 'var(--primary)';
    progressBar.style.transition = 'width 0.3s ease';
    
    progressContainer.appendChild(progressBar);
    loadingEl.appendChild(spinner);
    loadingEl.appendChild(text);
    loadingEl.appendChild(progressContainer);
    
    document.body.appendChild(loadingEl);
    
    // Simulate progress bar (to indicate activity while waiting for API)
    simulateProgressBar();
  }
  
  // Simulate progress bar
  function simulateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    let width = 0;
    
    const interval = setInterval(() => {
      if (width >= 90) {
        clearInterval(interval);
      } else {
        width += Math.random() * 5;
        progressBar.style.width = Math.min(width, 90) + '%';
      }
    }, 300);
    
    // Store the interval ID in a global variable so we can clear it if needed
    window.progressInterval = interval;
  }
  
  // Function to send analysis request to backend
  function sendAnalysisRequest(data) {
    console.log("Sending analysis request:", data);
    
    fetch('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Received analysis data:", data);
      
      // Clear any existing progress bar interval
      if (window.progressInterval) {
        clearInterval(window.progressInterval);
      }
      
      // Complete the progress bar
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = '100%';
      }
      
      // Hide loading indicator
      setTimeout(() => {
        hideLoadingIndicator();
        
        // Display the results
        displayResults(data);
      }, 500); // Short delay to see the completed progress bar
    })
    .catch(error => {
      console.error("API Error:", error);
      
      // Hide loading indicator
      hideLoadingIndicator();
      
      // Show error message
      alert(`An error occurred: ${error.message}. Please try again.`);
    });
  }
  
  // Function to hide loading indicator
  function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
    
    // Clear any existing progress bar interval
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
      window.progressInterval = null;
    }
  }
  
  // Function to display results
  function displayResults(data) {
    console.log("Displaying results:", data);
    
    // Create results container if it doesn't exist
    let resultsContainer = document.getElementById('results-container');
    
    if (!resultsContainer) {
      // Create new results container
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'results-container';
      resultsContainer.className = 'results-container active';
      
      // Create a basic structure
      resultsContainer.innerHTML = `
        <div class="card" id="market-summary-card">
          <div class="card-header">
            <div class="card-icon market-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="card-title">Market Summary</h3>
          </div>
          
          <div class="btc-update">
            <div class="btc-icon">
              <i class="fab fa-bitcoin"></i>
            </div>
            <div class="btc-text">
              Bitcoin is up <span id="btc-pct" class="gain">0%</span> today
            </div>
          </div>
          
          <div class="market-columns">
            <div class="market-column">
              <h4><i class="fas fa-arrow-up"></i> Top Gainers</h4>
              <ul class="coin-list" id="gainers-list"></ul>
            </div>
            
            <div class="market-column">
              <h4><i class="fas fa-arrow-down"></i> Top Losers</h4>
              <ul class="coin-list" id="losers-list"></ul>
            </div>
          </div>
          
          <p class="summary-text" id="market-summary"></p>
        </div>
        
        <div class="card" id="portfolio-recommendation-card">
          <div class="card-header">
            <div class="card-icon portfolio-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <h3 class="card-title">Portfolio Recommendation</h3>
          </div>
          
          <div class="strategy-card">
            <div class="strategy-title">
              <i class="fas fa-lightbulb"></i> Strategy
            </div>
            <p id="strategy-text"></p>
          </div>
          
          <ul class="recommendation-list" id="recommendation-list"></ul>
        </div>
        
        <div class="card" id="wallet-analysis-card">
          <div class="card-header">
            <div class="card-icon wallet-icon">
              <i class="fas fa-wallet"></i>
            </div>
            <h3 class="card-title">Wallet Analysis</h3>
          </div>
          
          <div class="wallet-info">
            <div class="info-row">
              <span class="info-label">Account Address/ID:</span>
              <span class="info-value address-value" id="wallet-address"></span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Total Holdings (USD):</span>
              <span class="info-value" id="holdings-value">$0.00</span>
            </div>
            
            <div>
              <span class="info-label">Token Breakdown:</span>
              <div id="token-list"></div>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary restart-btn" onclick="restartAnalysis()">
          <i class="fas fa-redo"></i> Start New Analysis
        </button>
      `;
      
      // Add the results container to the page
      document.querySelector('.container').appendChild(resultsContainer);
    }
    
    // Hide the form container
    const formContainer = document.getElementById('form-container');
    formContainer.style.display = 'none';
    
    // Show the results container
    resultsContainer.style.display = 'block';
    
    // Update results with data from API
    populateResults(data);
  }
  
  // Function to populate results with data
  function populateResults(data) {
    // Market Summary
    if (data.market_summary) {
      // Update BTC percentage
      const btcPctElement = document.getElementById('btc-pct');
      if (btcPctElement) {
        const btcPct = data.market_summary.btc_pct || 0;
        btcPctElement.textContent = `${btcPct}%`;
        
        // Update class based on positive/negative value
        if (btcPct >= 0) {
          btcPctElement.classList.add('gain');
          btcPctElement.classList.remove('loss');
        } else {
          btcPctElement.classList.add('loss');
          btcPctElement.classList.remove('gain');
        }
      }
      
      // Populate gainers
      const gainersList = document.getElementById('gainers-list');
      if (gainersList && Array.isArray(data.market_summary.gainers)) {
        gainersList.innerHTML = '';
        data.market_summary.gainers.forEach(coin => {
          const li = document.createElement('li');
          li.classList.add('coin-item');
          const changePrefix = coin.change >= 0 ? '+' : '';
          li.innerHTML = `
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
            <span class="gain">${changePrefix}${coin.change}%</span>
          `;
          gainersList.appendChild(li);
        });
      }
      
      // Populate losers
      const losersList = document.getElementById('losers-list');
      if (losersList && Array.isArray(data.market_summary.losers)) {
        losersList.innerHTML = '';
        data.market_summary.losers.forEach(coin => {
          const li = document.createElement('li');
          li.classList.add('coin-item');
          li.innerHTML = `
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
            <span class="loss">${coin.change}%</span>
          `;
          losersList.appendChild(li);
        });
      }
      
      // Update summary text
      const marketSummaryElement = document.getElementById('market-summary');
      if (marketSummaryElement) {
        marketSummaryElement.textContent = data.market_summary.summary || '';
      }
    }
    
    // Portfolio Recommendation
    if (data.portfolio_recommendation) {
      // Update strategy text
      const strategyElement = document.getElementById('strategy-text');
      if (strategyElement) {
        strategyElement.textContent = data.portfolio_recommendation.strategy || '';
      }
      
      // Clear and update recommendation list
      const recommendationList = document.getElementById('recommendation-list');
      if (recommendationList) {
        recommendationList.innerHTML = '';
        
        // Recommended allocation
        if (Array.isArray(data.portfolio_recommendation.recommended) && 
            data.portfolio_recommendation.recommended.length > 0) {
          
          data.portfolio_recommendation.recommended.forEach(rec => {
            const li = document.createElement('li');
            li.classList.add('recommendation-item');
            li.innerHTML = `
              <div class="recommendation-header">
                <span class="coin-tag">${(rec.symbol || '').toUpperCase()}</span>
                <span class="allocation">${rec.alloc_pct || 0}%</span>
              </div>
              <p class="recommendation-reason">${rec.reason || ''}</p>
            `;
            recommendationList.appendChild(li);
          });
        }
        
        // Add section for existing holdings advice if available
        // Add section for existing holdings advice if available
      if (Array.isArray(data.portfolio_recommendation.existing_holdings) && 
      data.portfolio_recommendation.existing_holdings.length > 0) {
    
    const holdingsTitle = document.createElement('h4');
    holdingsTitle.innerHTML = '<i class="fas fa-exchange-alt"></i> Actions for Your Current Holdings';
    holdingsTitle.className = 'mt-4 mb-2';
    recommendationList.appendChild(holdingsTitle);
    
    data.portfolio_recommendation.existing_holdings.forEach(holding => {
      const li = document.createElement('li');
      li.classList.add('recommendation-item');
      
      // Define color based on action
      let actionClass = 'text-primary';
      const action = (holding.action || '').toUpperCase();
      if (action === 'SELL') actionClass = 'text-danger';
      if (action === 'REDUCE') actionClass = 'text-warning';
      if (action === 'KEEP') actionClass = 'text-success';
      
      li.innerHTML = `
        <div class="recommendation-header">
          <span class="coin-tag">${(holding.symbol || '').toUpperCase()}</span>
          <span class="action ${actionClass}">${action}</span>
        </div>
        <p class="recommendation-reason">${holding.reason || ''}</p>
      `;
      recommendationList.appendChild(li);
    });
  }
  
  // Add section for new investment opportunities
  if (Array.isArray(data.portfolio_recommendation.new_investments) && 
      data.portfolio_recommendation.new_investments.length > 0) {
    
    const newInvestTitle = document.createElement('h4');
    newInvestTitle.innerHTML = '<i class="fas fa-lightbulb"></i> New Investment Opportunities';
    newInvestTitle.className = 'mt-4 mb-2';
    recommendationList.appendChild(newInvestTitle);
    
    data.portfolio_recommendation.new_investments.forEach(newInvest => {
      const li = document.createElement('li');
      li.classList.add('recommendation-item');
      li.innerHTML = `
        <div class="recommendation-header">
          <span class="coin-tag">${(newInvest.symbol || '').toUpperCase()}</span>
          <span class="action text-success">BUY</span>
        </div>
        <p class="recommendation-reason">${newInvest.reason || ''}</p>
      `;
      recommendationList.appendChild(li);
    });
  }
}
}

// Wallet Analysis
if (data.wallet_analysis) {
// Show the wallet analysis card
const walletCard = document.getElementById('wallet-analysis-card');
if (walletCard) {
  walletCard.style.display = 'block';
  
  // Update wallet address
  const walletAddressEl = document.getElementById('wallet-address');
  if (walletAddressEl) {
    const addressDisplay = data.wallet_analysis.address || 
                         data.wallet_analysis.connection_id || 
                         "Account information";
    walletAddressEl.textContent = addressDisplay;
  }
  
  // Update holdings value
  const holdingsValueEl = document.getElementById('holdings-value');
  if (holdingsValueEl) {
    const holdings = data.wallet_analysis.holdings_usd || 0;
    holdingsValueEl.textContent = `$${holdings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
  
  // Portfolio performance summary
  if (data.wallet_analysis.portfolio_change_pct !== undefined) {
    const walletInfo = document.querySelector('.wallet-info');
    
    // Check if performance container already exists
    let performanceContainer = document.querySelector('.portfolio-performance');
    
    if (!performanceContainer && walletInfo) {
      // Create new performance container
      performanceContainer = document.createElement('div');
      performanceContainer.classList.add('portfolio-performance');
      
      const changeClass = data.wallet_analysis.portfolio_change_pct >= 0 ? 'gain' : 'loss';
      const changeSign = data.wallet_analysis.portfolio_change_pct >= 0 ? '+' : '';
      
      performanceContainer.innerHTML = `
        <div class="info-row">
          <span class="info-label">7-Day Performance:</span>
          <span class="info-value ${changeClass}">${changeSign}${data.wallet_analysis.portfolio_change_pct}%</span>
        </div>
        <div class="info-row">
          <span class="info-label">Previous Value (7 days ago):</span>
          <span class="info-value">$${(data.wallet_analysis.portfolio_past_value || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
      `;
      
      // Insert after the second info-row
      const infoRows = walletInfo.querySelectorAll('.info-row');
      if (infoRows.length >= 2) {
        infoRows[1].insertAdjacentElement('afterend', performanceContainer);
      } else {
        walletInfo.appendChild(performanceContainer);
      }
    }
  }
  
  // Update token list
  const tokenList = document.getElementById('token-list');
  if (tokenList && Array.isArray(data.wallet_analysis.token_breakdown)) {
    tokenList.innerHTML = '';
    data.wallet_analysis.token_breakdown.forEach(token => {
      const div = document.createElement('div');
      div.classList.add('token-item');
      
      // Choose icon based on token
      let iconClass = 'fab fa-ethereum';
      if ((token.symbol || '').toUpperCase() === 'BTC') iconClass = 'fab fa-bitcoin';
      else if (['USDT', 'USDC', 'DAI', 'BUSD'].includes((token.symbol || '').toUpperCase())) iconClass = 'fas fa-dollar-sign';
      
      // Add profit/loss indicator if available
      let profitLossHtml = '';
      if (token.profit_loss_pct !== undefined) {
        const plClass = token.profit_loss_pct >= 0 ? 'gain' : 'loss';
        const plSign = token.profit_loss_pct >= 0 ? '+' : '';
        profitLossHtml = `<span class="${plClass}">${plSign}${token.profit_loss_pct.toFixed(2)}%</span>`;
      }
      
      // Add market trend if available
      let trendHtml = '';
      if (token.market_trend) {
        const trendClass = token.market_trend.includes('+') ? 'gain' : 'loss';
        trendHtml = `<span class="market-trend ${trendClass}">${token.market_trend} (24h)</span>`;
      }
      
      div.innerHTML = `
        <div class="token-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="token-details">
          <div class="token-symbol">${token.symbol || 'Unknown'}</div>
          <div class="token-amount">${(token.amount || 0).toFixed(6)} ${token.symbol || ''}</div>
          <div class="token-trends">
            ${profitLossHtml} ${trendHtml}
          </div>
        </div>
        <div class="token-value">$${(token.usd_value || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      `;
      tokenList.appendChild(div);
    });
  }
}
} else {
// If no wallet analysis data, hide the wallet card
const walletCard = document.getElementById('wallet-analysis-card');
if (walletCard) {
  walletCard.style.display = 'none';
}
}
}

// Function to restart analysis
function restartAnalysis() {
// Reset the UI to the initial state
const resultsContainer = document.getElementById('results-container');
if (resultsContainer) {
resultsContainer.style.display = 'none';
}

// Show the selection cards
const selectionCards = document.getElementById('selection-cards');
if (selectionCards) {
selectionCards.style.display = 'grid';
selectionCards.style.opacity = '1';
}

// Remove pulse class from cards
document.querySelectorAll('.card').forEach(card => {
card.classList.remove('pulse');
});

// Hide form container
const formContainer = document.getElementById('form-container');
if (formContainer) {
formContainer.style.display = 'none';
}
}
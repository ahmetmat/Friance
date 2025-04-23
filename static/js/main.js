/**
 * Main JavaScript for the Crypto Investor Copilot
 */

// Global variables
const steps = ["step1", "step2", "step3"];
let currentStep = 0;
let tags = ['AI', 'DeFi', 'Web3']; // Default tags

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Setup step navigation
  document.getElementById('next1')?.addEventListener('click', validateAndNextStep);
  document.getElementById('next2')?.addEventListener('click', nextStep);
  document.getElementById('prev2')?.addEventListener('click', prevStep);
  document.getElementById('prev3')?.addEventListener('click', prevStep);
  
  // Setup tags input
  initializeTagsInput();
  
  // Setup restart button
  document.getElementById('restart')?.addEventListener('click', restartForm);
});

// Form navigation functions
function validateAndNextStep() {
  const nameInput = document.getElementById('name');
  const budgetInput = document.getElementById('budget');
  
  if (nameInput.value && budgetInput.value) {
    nextStep();
  } else {
    alert('Please fill in all required fields.');
  }
}

function nextStep() {
  document.getElementById(steps[currentStep]).classList.remove('active');
  currentStep++;
  document.getElementById(steps[currentStep]).classList.add('active');
  updateProgress();
}

function prevStep() {
  document.getElementById(steps[currentStep]).classList.remove('active');
  currentStep--;
  document.getElementById(steps[currentStep]).classList.add('active');
  updateProgress();
}

function updateProgress() {
  // Update progress bar
  const progressBar = document.getElementById('progress-bar');
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  
  // Update step circles
  const stepCircles = document.querySelectorAll('.step-circle');
  stepCircles.forEach((circle, index) => {
    if (index < currentStep) {
      circle.classList.add('completed');
      circle.innerHTML = '<i class="fas fa-check"></i>';
    } else if (index === currentStep) {
      circle.classList.add('active');
      circle.innerHTML = index + 1;
    } else {
      circle.classList.remove('active', 'completed');
      circle.innerHTML = index + 1;
    }
  });
}

// Tags input functionality
function initializeTagsInput() {
  const tagsContainer = document.getElementById('tags-container');
  const tagsInput = document.getElementById('tags-input');
  
  if (!tagsContainer || !tagsInput) return;
  
  // Clear existing tags
  const existingTags = tagsContainer.querySelectorAll('.tag-item');
  existingTags.forEach(tag => tag.remove());
  
  // Clear tags array
  tags = [];
  
  // Add default tags
  ['AI', 'DeFi', 'Web3'].forEach(tag => {
    tags.push(tag);
    addTag(tag);
  });
  
  // Event listener for adding new tags
  tagsInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && tagsInput.value.trim() !== '') {
      e.preventDefault();
      const tag = tagsInput.value.trim();
      if (!tags.includes(tag)) {
        tags.push(tag);
        addTag(tag);
      }
      tagsInput.value = '';
    }
  });
}

function addTag(tag) {
  const tagsContainer = document.getElementById('tags-container');
  const tagsInput = document.getElementById('tags-input');
  
  if (!tagsContainer || !tagsInput) return;
  
  const tagElement = document.createElement('div');
  tagElement.classList.add('tag-item');
  tagElement.innerHTML = `
    ${tag}
    <span class="tag-close">&times;</span>
  `;
  
  tagElement.querySelector('.tag-close').addEventListener('click', () => {
    tagElement.remove();
    tags.splice(tags.indexOf(tag), 1);
  });
  
  tagsContainer.insertBefore(tagElement, tagsInput);
}

// Form reset function
function restartForm() {
  // Reset form
  document.getElementById('investor-form').reset();
  
  // Reset tags
  initializeTagsInput();
  
  // Reset to first step
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  currentStep = 0;
  updateProgress();
  
  // Show form and hide results
  document.querySelector('form').style.display = 'block';
  document.querySelector('.progress-container').style.display = 'flex';
  document.getElementById('results').classList.remove('active');
}

// Populate results with data
// Populate results with data
// main.js içinde populateResults fonksiyonunu güncelleyin
// In main.js - update populateResults function

function populateResults(data) {
    try {
        console.log("Populating results with data:", data);
        
        // Check if we have valid data
        if (!data) {
            throw new Error("No data received from server");
        }
        
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
                const performanceContainer = document.querySelector('.portfolio-performance');
                
                // Create new element if it doesn't exist
                if (!performanceContainer) {
                    const performanceEl = document.createElement('div');
                    performanceEl.classList.add('portfolio-performance');
                    
                    const changeClass = data.wallet_analysis.portfolio_change_pct >= 0 ? 'gain' : 'loss';
                    const changeSign = data.wallet_analysis.portfolio_change_pct >= 0 ? '+' : '';
                    
                    performanceEl.innerHTML = `
                        <div class="info-row">
                            <span class="info-label">7-Day Performance:</span>
                            <span class="info-value ${changeClass}">${changeSign}${data.wallet_analysis.portfolio_change_pct}%</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Previous Value (7 days ago):</span>
                            <span class="info-value">$${(data.wallet_analysis.portfolio_past_value || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                    `;
                    
                    // Insert after holdings value
                    const walletInfo = document.querySelector('.wallet-info');
                    if (walletInfo) {
                        const tokenListContainer = document.getElementById('token-list').parentNode;
                        if (tokenListContainer) {
                            walletInfo.insertBefore(performanceEl, tokenListContainer);
                        } else {
                            walletInfo.appendChild(performanceEl);
                        }
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
        
        // Final check to make sure loading indicator is gone
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
            console.log("Loading indicator removed after results displayed");
        }
    } catch (error) {
        console.error("Error populating results:", error);
        
        // Create simple error notification for the user
        alert("An error occurred while displaying results. Please try again.");
        
        // Also remove loading indicator on error
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Show form again
        document.querySelector('form').style.display = 'block';
        document.querySelector('.progress-container').style.display = 'flex';
        document.getElementById('results').classList.remove('active');
    }
}
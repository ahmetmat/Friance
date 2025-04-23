# marketsweep/portfolio_analyzer.py
import json
from datetime import datetime, timedelta
import requests

def get_historical_prices(symbols, days_ago=7):
    """Get historical price data for tokens"""
    today = datetime.now()
    past_date = today - timedelta(days=days_ago)
    
    historical_prices = {}
    
    for symbol in symbols:
        try:
            url = f"https://api.coingecko.com/api/v3/coins/{symbol.lower()}/market_chart"
            params = {
                "vs_currency": "usd",
                "days": str(days_ago),
                "interval": "daily"
            }
            
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if "prices" in data and len(data["prices"]) >= 2:
                    # Get first and latest price
                    first_price = data["prices"][0][1]
                    latest_price = data["prices"][-1][1]
                    
                    historical_prices[symbol] = {
                        "past_price": first_price,
                        "current_price": latest_price,
                        "change_pct": ((latest_price - first_price) / first_price) * 100
                    }
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {e}")
    
    return historical_prices

def analyze_wallet_performance(wallet, market_data):
    """
    Analyze wallet performance including profit/loss for each token
    Returns wallet metrics and potential actions
    """
    token_breakdown = wallet.get("token_breakdown", [])
    
    # Get list of token symbols
    symbols = [token["symbol"] for token in token_breakdown]
    
    # Get historical price data
    historical_prices = get_historical_prices(symbols)
    
    # Add performance data to each token
    for token in token_breakdown:
        symbol = token["symbol"]
        if symbol in historical_prices:
            price_data = historical_prices[symbol]
            
            # Calculate profit/loss
            token["past_value"] = token["amount"] * price_data["past_price"]
            token["profit_loss"] = token["usd_value"] - token["past_value"]
            token["profit_loss_pct"] = price_data["change_pct"]
            
            # Add current market trend (from market_data)
            for gainer in market_data.get("gainers", []):
                if gainer["symbol"].lower() == symbol.lower():
                    token["market_trend"] = f"+{gainer['change']}%"
                    break
            
            for loser in market_data.get("losers", []):
                if loser["symbol"].lower() == symbol.lower():
                    token["market_trend"] = f"{loser['change']}%"
                    break
    
    # Calculate overall portfolio performance
    total_current_value = sum(token.get("usd_value", 0) for token in token_breakdown)
    total_past_value = sum(token.get("past_value", 0) for token in token_breakdown if "past_value" in token)
    
    if total_past_value > 0:
        portfolio_change_pct = ((total_current_value - total_past_value) / total_past_value) * 100
    else:
        portfolio_change_pct = 0
    
    performance_summary = {
        "portfolio_change_pct": round(portfolio_change_pct, 2),
        "portfolio_past_value": round(total_past_value, 2),
        "best_performers": [],
        "worst_performers": []
    }
    
    # Identify best and worst performers
    token_performance = []
    for token in token_breakdown:
        if "profit_loss_pct" in token:
            token_performance.append({
                "symbol": token["symbol"],
                "profit_loss_pct": token["profit_loss_pct"]
            })
    
    # Sort by performance
    token_performance.sort(key=lambda x: x["profit_loss_pct"], reverse=True)
    
    # Get top 3 best and worst
    if token_performance:
        performance_summary["best_performers"] = token_performance[:3]
        performance_summary["worst_performers"] = token_performance[-3:]
    
    return performance_summary
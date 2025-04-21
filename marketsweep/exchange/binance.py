import hmac
import hashlib
import time
import requests
from typing import Dict, List, Optional
from .base import ExchangeConnector

class BinanceConnector(ExchangeConnector):
    """Connector for Binance exchange"""
    
    def __init__(self, api_key: str, api_secret: str):
        super().__init__(api_key, api_secret)
        self.base_url = "https://api.binance.com"
    
    def _generate_signature(self, query_string: str) -> str:
        """Generate HMAC SHA256 signature for Binance API authentication"""
        return hmac.new(
            self.api_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    def get_account(self) -> Dict:
        """Get account information from Binance"""
        endpoint = "/api/v3/account"
        timestamp = int(time.time() * 1000)
        query_string = f"timestamp={timestamp}"
        signature = self._generate_signature(query_string)
        
        url = f"{self.base_url}{endpoint}?{query_string}&signature={signature}"
        headers = {"X-MBX-APIKEY": self.api_key}
        
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Binance API error: {response.text}")
        
        return response.json()
    
    def get_balances(self) -> List[Dict]:
        """Get all non-zero balances from Binance account"""
        account_info = self.get_account()
        
        # Filter only assets with balance > 0
        balances = [
            asset for asset in account_info.get("balances", [])
            if float(asset["free"]) > 0 or float(asset["locked"]) > 0
        ]
        
        return balances
    
    def get_prices(self) -> Dict:
        """Get current prices for all trading pairs"""
        url = f"{self.base_url}/api/v3/ticker/price"
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Binance API error: {response.text}")
        
        price_data = response.json()
        
        # Convert to dictionary format {symbol: price}
        prices = {item["symbol"]: float(item["price"]) for item in price_data}
        return prices
    
    def get_portfolio_value(self) -> Dict:
        """Calculate portfolio value in USD"""
        balances = self.get_balances()
        prices = self.get_prices()
        
        portfolio = []
        total_value = 0.0
        
        for asset in balances:
            symbol = asset["asset"]
            amount = float(asset["free"]) + float(asset["locked"])
            
            # Find price for this asset (usually paired with USDT)
            price = 0.0
            if symbol == "USDT":
                price = 1.0
            elif f"{symbol}USDT" in prices:
                price = prices[f"{symbol}USDT"]
            elif f"{symbol}BUSD" in prices:
                price = prices[f"{symbol}BUSD"]
            
            value = amount * price
            if value > 0:
                portfolio.append({
                    "symbol": symbol,
                    "amount": amount,
                    "usd_value": round(value, 2)
                })
                total_value += value
        
        connection_info = self.get_connection_info()
        
        return {
            "address": f"Binance: {connection_info['api_key']}",
            "holdings_usd": round(total_value, 2),
            "token_breakdown": sorted(portfolio, key=lambda x: x["usd_value"], reverse=True)
        }
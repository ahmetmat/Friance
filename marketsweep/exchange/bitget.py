import hmac
import hashlib
import time
import requests
from typing import Dict, List, Optional
from .base import ExchangeConnector

class BitgetConnector(ExchangeConnector):
    """Connector for Bitget exchange"""
    
    def __init__(self, api_key: str, api_secret: str, passphrase: str):
        super().__init__(api_key, api_secret)
        self.passphrase = passphrase
        self.base_url = "https://api.bitget.com"
    
    def _generate_signature(self, timestamp: str, method: str, request_path: str, body: str = "") -> str:
        """Generate HMAC SHA256 signature for Bitget API authentication"""
        message = timestamp + method + request_path + body
        signature = hmac.new(
            self.api_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def get_account_assets(self) -> Dict:
        """Get account assets from Bitget"""
        endpoint = "/api/spot/v1/account/assets"
        method = "GET"
        timestamp = str(int(time.time() * 1000))
        
        signature = self._generate_signature(timestamp, method, endpoint)
        
        headers = {
            "ACCESS-KEY": self.api_key,
            "ACCESS-SIGN": signature,
            "ACCESS-TIMESTAMP": timestamp,
            "ACCESS-PASSPHRASE": self.passphrase,
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Bitget API error: {response.text}")
        
        return response.json()
    
    def get_all_account_balances(self) -> Dict:
        """
        Get overview of all account balances (spot, futures, funding, earn, bots, margin)
        
        Returns:
            Dict containing balances in USDT for all account types
        """
        endpoint = "/api/v2/account/all-account-balance"
        method = "GET"
        timestamp = str(int(time.time() * 1000))
        
        signature = self._generate_signature(timestamp, method, endpoint)
        
        headers = {
            "ACCESS-KEY": self.api_key,
            "ACCESS-SIGN": signature,
            "ACCESS-TIMESTAMP": timestamp,
            "ACCESS-PASSPHRASE": self.passphrase,
            "Content-Type": "application/json",
            "locale": "en-US"
        }
        
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"Bitget API error: {response.text}")
        
        return response.json()

    def get_futures_records(self, start_time: int, end_time: int, limit: int = 100) -> Dict:
        """
        Get futures transaction records
        
        Args:
            start_time (int): Start time in milliseconds
            end_time (int): End time in milliseconds (max 30 days from start_time)
            limit (int): Maximum number of records to return (default: 100, max: 500)
        
        Returns:
            Dict containing futures transaction records
        """
        endpoint = "/api/v2/tax/future-record"
        method = "GET"
        timestamp = str(int(time.time() * 1000))
        
        # Build query string
        query_params = f"?startTime={start_time}&endTime={end_time}&limit={limit}"
        
        signature = self._generate_signature(timestamp, method, endpoint + query_params)
        
        headers = {
            "ACCESS-KEY": self.api_key,
            "ACCESS-SIGN": signature,
            "ACCESS-TIMESTAMP": timestamp,
            "ACCESS-PASSPHRASE": self.passphrase,
            "Content-Type": "application/json",
            "locale": "en-US"
        }
        
        url = f"{self.base_url}{endpoint}{query_params}"
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"Bitget API error: {response.text}")
        
        return response.json()

    
    def get_balances(self) -> List[Dict]:
        """Get all non-zero balances from Bitget account"""
        account_info = self.get_account_assets()
        
        balances = []
        if account_info.get("code") == "00000" and "data" in account_info:
            for asset in account_info["data"]:
                total = float(asset.get("available", 0)) + float(asset.get("frozen", 0))
                if total > 0:
                    balances.append({
                        "asset": asset.get("coinName", ""),
                        "free": asset.get("available", 0),
                        "locked": asset.get("frozen", 0)
                    })
        
        return balances
    
    def get_portfolio_value(self) -> Dict:
        """Calculate portfolio value in USD using Bitget's own valuation"""
        account_info = self.get_account_assets()
        
        portfolio = []
        total_value = 0.0
    
        if account_info.get("code") == "00000" and "data" in account_info:
            for asset in account_info["data"]:
                symbol = asset.get("coinName", "")
                amount = float(asset.get("available", 0)) + float(asset.get("frozen", 0))
                value = float(asset.get("usdtAmount", 0))
                
                if value > 0:
                    portfolio.append({
                        "symbol": symbol,
                        "amount": amount,
                        "usd_value": round(value, 2)
                    })
                    total_value += value
        
        connection_info = self.get_connection_info()
        
        return {
            "connection_id": f"Bitget: {connection_info['api_key']}",  # address yerine connection_id
            "holdings_usd": round(total_value, 2),
            "token_breakdown": sorted(portfolio, key=lambda x: x["usd_value"], reverse=True)
        }
    
    
    def get_connection_info(self) -> Dict:
        """Override to include passphrase info (masked)"""
        info = super().get_connection_info()
        # Add masked passphrase
        if len(self.passphrase) > 4:
            info["passphrase"] = f"{'*' * (len(self.passphrase) - 4)}{self.passphrase[-4:]}"
        else:
            info["passphrase"] = "****"
        return info
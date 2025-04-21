import os
import requests
from typing import Dict, List, Optional

class EthereumWalletConnector:
    """Connector for Ethereum wallet addresses using Etherscan"""
    
    def __init__(self, wallet_address: str, api_key: str):
        self.wallet_address = wallet_address
        self.api_key = api_key
        self.base_url = "https://api.etherscan.io/api"
    
    def get_eth_balance(self) -> float:
        """Get ETH balance for the wallet"""
        params = {
            'module': 'account',
            'action': 'balance',
            'address': self.wallet_address,
            'tag': 'latest',
            'apikey': self.api_key
        }
        
        response = requests.get(self.base_url, params=params)
        if response.status_code != 200:
            raise Exception(f"Etherscan API error: {response.status_code} - {response.text}")
        
        data = response.json()
        if data.get('status') != '1':
            raise Exception(f"Etherscan API error: {data.get('message')}")
        
        # Convert from wei to ETH
        eth_balance = int(data.get('result', '0')) / 1e18
        return eth_balance
    
    def get_token_balances(self) -> List[Dict]:
        """Get ERC20 token balances for the wallet"""
        params = {
            'module': 'account',
            'action': 'tokentx',
            'address': self.wallet_address,
            'page': 1,
            'offset': 100,  # Get last 100 transactions
            'sort': 'desc',
            'apikey': self.api_key
        }
        
        response = requests.get(self.base_url, params=params)
        if response.status_code != 200:
            raise Exception(f"Etherscan API error: {response.status_code} - {response.text}")
        
        data = response.json()
        if data.get('status') != '1' and data.get('message') != 'No transactions found':
            raise Exception(f"Etherscan API error: {data.get('message')}")
        
        # Process transactions to get token balances
        token_balances = {}
        if 'result' in data and isinstance(data['result'], list):
            for tx in data['result']:
                token_symbol = tx.get('tokenSymbol', '')
                token_decimals = int(tx.get('tokenDecimal', '0'))
                
                # Skip if token info is missing
                if not token_symbol or token_decimals == 0:
                    continue
                
                # Calculate value based on if wallet is sender or receiver
                value = int(tx.get('value', '0')) / (10 ** token_decimals)
                if tx.get('from', '').lower() == self.wallet_address.lower():
                    value = -value
                
                # Add to token balances
                if token_symbol not in token_balances:
                    token_balances[token_symbol] = {
                        'symbol': token_symbol,
                        'amount': 0,
                        'contract': tx.get('contractAddress', '')
                    }
                
                token_balances[token_symbol]['amount'] += value
        
        # Filter out tokens with zero or negative balance
        tokens = [token for token in token_balances.values() if token['amount'] > 0]
        return tokens
    
    def get_token_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get current prices for tokens from CoinGecko"""
        if not symbols:
            return {}
        
        # Convert symbols to comma-separated string
        symbols_str = ','.join(symbols)
        
        url = f"https://api.coingecko.com/api/v3/simple/price"
        params = {
            'ids': symbols_str.lower(),
            'vs_currencies': 'usd'
        }
        
        try:
            response = requests.get(url, params=params)
            if response.status_code != 200:
                return {}
            
            price_data = response.json()
            prices = {}
            for symbol in symbols:
                if symbol.lower() in price_data:
                    prices[symbol] = price_data[symbol.lower()].get('usd', 0)
            
            return prices
        except Exception:
            # Fallback to empty prices if API fails
            return {}
    
    def get_portfolio_value(self) -> Dict:
        """Calculate portfolio value in USD"""
        # Get ETH balance
        eth_balance = self.get_eth_balance()
        
        # Approximate ETH price (in production, get this from an API)
        eth_price = 3000.0  # Fallback price
        
        # Try to get current ETH price from CoinGecko
        try:
            response = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
            if response.status_code == 200:
                data = response.json()
                if 'ethereum' in data and 'usd' in data['ethereum']:
                    eth_price = data['ethereum']['usd']
        except:
            pass  # Use fallback price if API fails
        
        eth_value = eth_balance * eth_price
        
        # Get token balances
        tokens = self.get_token_balances()
        
        # Get token prices
        token_symbols = [token['symbol'] for token in tokens]
        token_prices = self.get_token_prices(token_symbols)
        
        # Calculate token values
        portfolio = []
        total_value = eth_value
        
        # Add ETH to portfolio
        if eth_balance > 0:
            portfolio.append({
                "symbol": "ETH",
                "amount": eth_balance,
                "usd_value": round(eth_value, 2)
            })
        
        # Add tokens to portfolio
        for token in tokens:
            symbol = token['symbol']
            amount = token['amount']
            price = token_prices.get(symbol, 0)
            value = amount * price
            
            if value > 0:
                portfolio.append({
                    "symbol": symbol,
                    "amount": amount,
                    "usd_value": round(value, 2)
                })
                total_value += value
        
        return {
            "address": self.wallet_address,
            "holdings_usd": round(total_value, 2),
            "token_breakdown": sorted(portfolio, key=lambda x: x["usd_value"], reverse=True)
        }
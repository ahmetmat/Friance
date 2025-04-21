from abc import ABC, abstractmethod
from typing import Dict, List, Optional

class ExchangeConnector(ABC):
    """Base abstract class for all exchange connectors"""
    
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
    
    @abstractmethod
    def get_balances(self) -> List[Dict]:
        """
        Get all asset balances from the exchange
        
        Returns:
            List of assets with their balances
        """
        pass
    
    @abstractmethod
    def get_portfolio_value(self) -> Dict:
        """
        Calculate total portfolio value and breakdown by token
        
        Returns:
            Dict containing total USD value and token breakdown
        """
        pass
    
    def get_connection_info(self) -> Dict:
        """
        Get connection information (masked API key, etc)
        
        Returns:
            Dict with connection details
        """
        # Mask API key for display
        masked_key = f"{self.api_key[:5]}...{self.api_key[-5:]}" if len(self.api_key) > 10 else "****"
        return {
            "connector_type": self.__class__.__name__,
            "api_key": masked_key
        }
# Crypto Investor Copilot
![Screenshot 2025-04-24 at 16 19 46](https://github.com/user-attachments/assets/1aeb5730-cc38-4aab-84b9-c71ac780dfea)
<!-- Screenshot recommendation: Add a main dashboard screenshot of the application showing the interface -->

A personalized assistant for data-driven cryptocurrency investment decisions. Powered by advanced analytics and AI, this tool helps both novice and experienced crypto investors make informed decisions using real-time market data, portfolio analysis, and tailored investment recommendations.

## 📋 Features

### 🔍 Market Analysis
- Comprehensive market overview with trending cryptocurrencies
- Top gainers and losers with percentage changes
- Bitcoin price movement and market sentiment indicators
- News sentiment integration and impact assessment
<!-- Screenshot recommendation: Add a screenshot of the market analysis section showing gainers/losers -->
![Screenshot 2025-04-24 at 16 21 50](https://github.com/user-attachments/assets/4d233c22-7325-42b0-af0c-38c7dd5ad1ef)
![Screenshot 2025-04-24 at 16 22 25](https://github.com/user-attachments/assets/49e89a13-7c7c-4af8-8482-243185ecb52b)


### 📊 Portfolio Analysis
- Connect your Ethereum wallet or exchange accounts (Binance, Bitget)
- View detailed breakdown of your crypto holdings
- Performance tracking with 7-day change visualization
- Token-specific metrics and profit/loss indicators
- Smart security features for secure API connections

![Screenshot 2025-04-24 at 16 22 40](https://github.com/user-attachments/assets/00c427b2-c9f7-4cac-9c99-4aea7e3ef6d6)
![Screenshot 2025-04-24 at 16 23 51](https://github.com/user-attachments/assets/ee0d764b-6a3c-43fb-bba4-99a9a62f8ab1)
![Screenshot 2025-04-24 at 16 24 14](https://github.com/user-attachments/assets/a9494944-3210-4322-baf8-347bc9219f86)


### 💰 Investment Recommendations
- Personalized investment strategies based on risk tolerance
- Budget-based allocation recommendations
- Interest-based token suggestions (AI, DeFi, Web3, etc.)
- Technical and fundamental analysis for each recommendation
- Smart rebalancing suggestions for existing holdings
<!-- Screenshot recommendation: Add a screenshot of the recommendation section -->
![Screenshot 2025-04-24 at 16 24 32](https://github.com/user-attachments/assets/43cbcb96-9efc-4ffb-856a-653d742b4576)
![Screenshot 2025-04-24 at 16 26 46](https://github.com/user-attachments/assets/baa59830-0ab4-4c1a-8245-23e10fc84105)



## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Flask
- Required API keys:
  - Etherscan API key (for wallet analysis)
  - IO Intelligence API key (for AI analysis)
  - NewsAPI key (for news sentiment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-investor-copilot.git
cd crypto-investor-copilot
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your API keys:
```
ETHERSCAN_API_KEY=your_etherscan_key
IOINTELLIGENCE_API_KEY=your_io_intelligence_key
NEWS_API_KEY=your_newsapi_key
FLASK_ENV=development
```

5. Start the application:
```bash
python server.py
```

6. Open your browser and navigate to `http://localhost:5000`

## ⚙️ Architecture

### Frontend
- HTML5, CSS3, and JavaScript
- Responsive design with mobile support
- Light/dark mode toggle
- Multi-language support (English, Turkish)

### Backend
- Flask web server
- RESTful API architecture
- Secure API key management
- Modular application structure

### Data Sources
- CoinGecko API for market data
- Etherscan API for Ethereum wallet analysis
- Binance and Bitget APIs for exchange integrations
- NewsAPI for market news and sentiment

### AI Integration (IO Intelligence)
The application leverages IO Intelligence (an AI platform) in two main components:

1. **Market Summarization (agent.py)**: 
   - Processes real-time market data and news headlines
   - Generates concise market summaries with trend analysis
   - Identifies key market patterns and actionable insights
   - Uses the Meta Llama 3.3 70B model for comprehensive analysis

2. **Portfolio Recommendations (recommender_agent.py)**:
   - Creates personalized investment strategies based on risk profile
   - Analyzes technical indicators (RSI, MACD, moving averages)
   - Provides fundamental analysis of projects and ecosystems
   - Recommends specific allocation percentages and actions for existing holdings
   - Adapts recommendations based on current market conditions

IO Intelligence serves as the analytical brain of the application, transforming raw data into actionable insights through advanced LLM capabilities.

## 🔒 Security

- No private keys are stored on the server
- API keys are stored securely with encryption
- Read-only API access recommended for exchange connections
- Option to use without connecting personal wallets

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## 🛣️ Roadmap

- [ ] Add more exchanges (Kraken, Coinbase, etc.)
- [ ] Implement portfolio history tracking
- [ ] Add tax reporting features
- [ ] Create mobile applications (iOS, Android)
- [ ] Add more advanced technical analysis indicators
- [ ] Implement social sentiment analysis

## 💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- ahmet tahir mat

## 🙏 Acknowledgments

- IO Intelligence for providing the AI capabilities
- CoinGecko for market data API
- Etherscan for blockchain data
- NewsAPI for current crypto news

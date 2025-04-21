from flask import Flask, request, jsonify, render_template
import json, os
from marketsweep.exchange import BinanceConnector, BitgetConnector, EthereumWalletConnector

app = Flask(__name__)
PROFILE_PATH = os.path.join(os.path.dirname(__file__), "marketsweep", "user_profile.json")

@app.route('/', methods=['GET'])
def root():
    return render_template("index.html")

@app.route("/save-profile", methods=["POST"])
def save_profile():
    data = request.get_json()
    
    # Save API keys to environment variables if provided
    if 'etherscan_api_key' in data:
        os.environ['ETHERSCAN_API_KEY'] = data['etherscan_api_key']
    
    # Save profile
    with open(PROFILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data['profile'], f, indent=2)
    return jsonify({"status": "success"}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    from marketsweep.tools import fetch_market_data, fetch_news
    from marketsweep.agent import summarize_market
    from marketsweep.recommender_agent import recommend_portfolio

    market = fetch_market_data()
    news = fetch_news()
    
    # Get wallet/exchange data based on connection type
    connection_type = data.get('connection_type', 'wallet')
    wallet = None
    
    try:
        if connection_type == 'wallet':
            wallet_connector = EthereumWalletConnector(
                data['wallet_address'],
                data.get('etherscan_api_key', os.environ.get('ETHERSCAN_API_KEY', ''))
            )
            wallet = wallet_connector.get_portfolio_value()
            
        elif connection_type == 'binance':
            binance_connector = BinanceConnector(
                data['binance_api_key'],
                data['binance_secret']
            )
            wallet = binance_connector.get_portfolio_value()
            
        elif connection_type == 'bitget':
            bitget_connector = BitgetConnector(
                data['bitget_api_key'],
                data['bitget_secret'],
                data['bitget_passphrase']
            )
            wallet = bitget_connector.get_portfolio_value()
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to fetch wallet/exchange data: {str(e)}"
        }), 400

    profile = data.get('profile')  # use profile sent in request

    # Generate outputs
    summary = summarize_market(market, news)
    recommendation = recommend_portfolio(profile, market)

    result = {
        'market_summary': summary,
        'portfolio_recommendation': recommendation,
        'wallet_analysis': wallet
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
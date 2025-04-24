from flask import Flask, request, jsonify, render_template, Response
import json, os, uuid
from dotenv import load_dotenv
from marketsweep.exchange import BinanceConnector, BitgetConnector, EthereumWalletConnector

app = Flask(__name__)
PROFILE_PATH = os.path.join(os.path.dirname(__file__), "marketsweep", "user_profile.json")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

@app.route('/', methods=['GET'])
def root():
    return render_template("index.html")
@app.after_request
def add_security_headers(response):
    # CSP header with unsafe-inline to allow inline scripts
    if response.mimetype == 'text/html':
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; "
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; "
            "img-src 'self' data:; "
            "font-src 'self' https://cdnjs.cloudflare.com; "
            "connect-src 'self'; "
            "worker-src 'self'; "
            "frame-src 'self'; "
            "object-src 'none';"
        )
        response.headers['Content-Security-Policy'] = csp
    return response

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

# Add to server.py - enhanced error handling in the /analyze route

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        print(f"Received analysis request: {data.get('connection_type')}")

        from marketsweep.tools import fetch_market_data, fetch_news
        from marketsweep.agent import summarize_market
        from marketsweep.recommender_agent import recommend_portfolio
        from marketsweep.portfolio_analyzer import analyze_wallet_performance
        from marketsweep.exchange import BinanceConnector, BitgetConnector, EthereumWalletConnector

        market = fetch_market_data()
        news = fetch_news()
        
        # Get wallet/exchange data
        connection_type = data.get('connection_type', 'wallet')
        wallet = None
        
        try:
            if connection_type == 'wallet':
                print(f"Connecting to Ethereum wallet: {data.get('wallet_address', '')[:10]}...")
                # Always use environment variable for Etherscan API key
                wallet_connector = EthereumWalletConnector(
                    data['wallet_address'],
                    os.environ.get('ETHERSCAN_API_KEY', '')
                )
                wallet = wallet_connector.get_portfolio_value()
                
            elif connection_type == 'binance':
                print("Connecting to Binance account...")
                binance_connector = BinanceConnector(
                    data['binance_api_key'],
                    data['binance_secret']
                )
                wallet = binance_connector.get_portfolio_value()
                
            elif connection_type == 'bitget':
                print("Connecting to Bitget account...")
                bitget_connector = BitgetConnector(
                    data['bitget_api_key'],
                    data['bitget_secret'],
                    data['bitget_passphrase']
                )
                wallet = bitget_connector.get_portfolio_value()
                
        except Exception as e:
            print(f"Error connecting to {connection_type}: {str(e)}")
            return jsonify({
                "status": "error",
                "message": f"Failed to fetch wallet/exchange data: {str(e)}"
            }), 400

        print(f"Successfully retrieved wallet data: {wallet.get('holdings_usd') if wallet else 'None'} USD")
        profile = data.get('profile')  # user profile from request

        # Analyze wallet performance (detect profit/loss)
        if wallet:
            print("Analyzing wallet performance...")
            try:
                wallet_performance = analyze_wallet_performance(wallet, market)
                wallet.update(wallet_performance)
                print(f"Wallet performance: {wallet_performance.get('portfolio_change_pct', 0)}%")
            except Exception as e:
                print(f"Error analyzing wallet performance: {str(e)}")
                # Continue without performance analysis

        # Generate outputs
        print("Generating market summary...")
        try:
            summary = summarize_market(market, news)
        except Exception as e:
            print(f"Error generating market summary: {str(e)}")
            # Create a basic summary as fallback
            summary = {
                "summary": "Market analysis currently unavailable.",
                "gainers": market.get("gainers", []),
                "losers": market.get("losers", []),
                "btc_pct": market.get("btc_pct", 0),
                "markdown": "**Market Summary**\nMarket analysis currently unavailable."
            }
        
        print("Generating portfolio recommendation...")
        try:
            recommendation = recommend_portfolio(profile, market, wallet)
            print("Portfolio recommendation generated successfully")
        except Exception as e:
            print(f"Error generating portfolio recommendation: {str(e)}")
            # Create a basic recommendation as fallback
            from marketsweep.recommender_agent import create_fallback_recommendation
            recommendation = create_fallback_recommendation(market, wallet)
            print("Generated fallback recommendation")

        # Make sure wallet has address field
        if wallet and 'address' not in wallet:
            if connection_type == 'bitget':
                wallet['address'] = f"Bitget Account: {data['bitget_api_key'][:5]}...{data['bitget_api_key'][-5:]}"
            elif connection_type == 'binance':
                wallet['address'] = f"Binance Account: {data['binance_api_key'][:5]}...{data['binance_api_key'][-5:]}"

        result = {
            'market_summary': summary,
            'portfolio_recommendation': recommendation,
            'wallet_analysis': wallet
        }
        
        # Generate a unique ID for this analysis result
        analysis_id = str(uuid.uuid4())
        
        # Save the result to a file for later retrieval
        result_path = os.path.join(RESULTS_DIR, f"{analysis_id}.json")
        with open(result_path, 'w', encoding='utf-8') as f:
            json.dump(result, f)
        
        print(f"Analysis complete, saved as {analysis_id}")
        
        # Return the result along with the generated ID
        result['id'] = analysis_id
        return jsonify(result)
    except Exception as e:
        import traceback
        print(f"Unexpected error in analyze endpoint: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": f"An unexpected error occurred: {str(e)}"
        }), 500

@app.route("/results/<analysis_id>", methods=["GET"])
def get_results(analysis_id):
    """Retrieve previously saved analysis results"""
    try:
        # Check if the results file exists
        result_path = os.path.join(RESULTS_DIR, f"{analysis_id}.json")
        if not os.path.exists(result_path):
            return jsonify({"status": "error", "message": "Analysis results not found"}), 404
        
        # Read and return the results
        with open(result_path, 'r', encoding='utf-8') as f:
            result = json.load(f)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error retrieving results: {str(e)}"
        }), 500
    
if __name__ == '__main__':
    app.run(debug=True)
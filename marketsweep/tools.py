import os, requests, datetime
from dotenv import load_dotenv
load_dotenv()

# CoinGecko cryptomarket data

def fetch_market_data() -> dict:
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,
        "page": 1,
        "sparkline": "false",
        "price_change_percentage": "24h"
    }
    coins = requests.get(url, params=params).json()
    sorted_by_change = sorted(coins, key=lambda c: c.get("price_change_percentage_24h", 0) or 0)
    gainers = sorted_by_change[-5:][::-1]
    losers = sorted_by_change[:5]
    btc = next((c for c in coins if c['id'] == 'bitcoin'), None)
    btc_pct = btc['price_change_percentage_24h'] if btc else 0.0
    return {
        "gainers": [{"symbol": c["symbol"], "change": round(c["price_change_percentage_24h"],2)} for c in gainers],
        "losers": [{"symbol": c["symbol"], "change": round(c["price_change_percentage_24h"],2)} for c in losers],
        "btc_pct": round(btc_pct,2)
    }

# NewsAPI headlines

def fetch_news() -> str:
    from os import getenv
    NEWS_KEY = getenv("NEWS_API_KEY")
    since = (datetime.datetime.utcnow() - datetime.timedelta(hours=12)).isoformat(timespec="seconds")
    r = requests.get(
        "https://newsapi.org/v2/everything",
        params={"q": "finance OR crypto", "from": since, "language": "en", "sortBy": "publishedAt", "apiKey": NEWS_KEY}
    ).json()
    return "\n".join([a["title"] for a in r.get("articles", [])[:20]])

# On-chain wallet via Etherscan

def fetch_wallet_data(address: str) -> dict:
    ETH_KEY = "W8BQFYECTGGDQPVZ6BEF5PRZJ7CXUSFDDY"
    # Example: get ETH balance
    resp = requests.get(
        'https://api.etherscan.io/api',
        params={'module':'account','action':'balance','address':address,'tag':'latest','apikey':ETH_KEY}
    ).json()
    eth_wei = int(resp.get('result','0'))
    eth_balance = eth_wei / 1e18
    # Mock breakdown
    return {
        'address': address,
        'holdings_usd': round(eth_balance * 3000,2),
        'token_breakdown': [{'symbol':'ETH','amount':eth_balance,'usd_value':round(eth_balance*3000,2)}]
    }
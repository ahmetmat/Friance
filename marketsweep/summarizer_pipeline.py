import json
from marketsweep.tools import fetch_market_data, fetch_news
from marketsweep.agent import summarize_market
from marketsweep.recommender_agent import recommend_portfolio, load_user_profile

def run_full_pipeline():
    print("🚀 Fetching market data and news...")
    market = fetch_market_data(); news = fetch_news()
    print("🧠 Generating market summary...")
    summary = summarize_market(market, news)
    print("📋 Generating portfolio recommendation...")
    profile = load_user_profile(); recommendation = recommend_portfolio(profile, market)
    result = {"market_summary": summary, "portfolio_recommendation": recommendation}
    with open("marketsweep/output.json","w",encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print("✅ Done! Markdown outputs below:")
    print(summary["markdown"]); print(recommendation["markdown"])

if __name__ == "__main__":
    run_full_pipeline()
import os, json
from dotenv import load_dotenv
import openai
load_dotenv()
client = openai.OpenAI(
    api_key=os.getenv("IOINTELLIGENCE_API_KEY"),
    base_url="https://api.intelligence.io.solutions/api/v1/"
)

SYSTEM_PROMPT = (
    "You are a market analyst agent. Given JSON market data (gainers, losers, btc_pct) and recent headlines, "
    "generate a concise English summary and a clean Markdown-formatted section. "
    "The final response must follow this JSON format exactly:\n\n"
    "{\n"
    "  \"summary\": \"...\",\n"
    "  \"gainers\": [{\"symbol\": \"XYZ\", \"change\": 4.32}],\n"
    "  \"losers\": [{\"symbol\": \"ABC\", \"change\": -2.15}],\n"
    "  \"btc_pct\": 2.51,\n"
    "  \"markdown\": \"**📈 Top Gainers**\\n- XYZ +4.32%\\n...\"\n"
    "}\n\n"
    "Use emojis, bullets, and only English."
)

def summarize_market(market_json: dict, news_text: str) -> dict:
    user_msg = f"### Market Data ###\n{json.dumps(market_json,ensure_ascii=False)}\n\n### Headlines ###\n{news_text}"
    chat = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct",
        messages=[{"role":"system","content":SYSTEM_PROMPT},{"role":"user","content":user_msg}],
        temperature=0.3,max_tokens=400
    )
    return json.loads(chat.choices[0].message.content)

if __name__ == "__main__":
    from marketsweep.tools import fetch_market_data, fetch_news
    import pprint
    print("⏳ Fetching status...")
    m = fetch_market_data(); n = fetch_news()
    r = summarize_market(m,n)
    pprint.pprint(r, width=120)
    __all__ = ["summarize_market"]
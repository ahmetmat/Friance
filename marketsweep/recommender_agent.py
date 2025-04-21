import json, os
from dotenv import load_dotenv
import openai

# Load environment variables (including IOINTELLIGENCE_API_KEY)
load_dotenv()

# Initialize the IO Intelligence/OpenAI client
client = openai.OpenAI(
    api_key=os.getenv("IOINTELLIGENCE_API_KEY"),
    base_url="https://api.intelligence.io.solutions/api/v1/"
)

RECOMMEND_PROMPT = (
    "You're a crypto investment advisor. Based on the user's profile and market data, "
    "propose a portfolio strategy with rationale. Follow this JSON format exactly:\n\n"
    "{\n"
    "  \"recommended\": [{\"symbol\": \"INJ\", \"alloc_pct\": 40, \"reason\": \"Short-term momentum & strong fundamentals\"}],\n"
    "  \"strategy\": \"Balanced risk with AI + infrastructure focus.\",\n"
    "  \"markdown\": \"**💼 Portfolio Recommendation**\\n- INJ (40%): Strong recent gains...\\n...\"\n"
    "}\n\n"
    "Only answer in English. Be concise but insightful."
)

def load_user_profile(path="marketsweep/user_profile.json"):
    """Read the user's profile JSON and return as dict."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def recommend_portfolio(user_profile: dict, market_data: dict) -> dict:
    """
    Call the LLM to generate a portfolio recommendation based
    on the user profile and current market data.
    Returns a dict matching the schema in RECOMMEND_PROMPT.
    """
    user_msg = (
        f"### User Profile ###\n{json.dumps(user_profile, ensure_ascii=False)}\n\n"
        f"### Market Data ###\n{json.dumps(market_data, ensure_ascii=False)}"
    )

    chat = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct",
        messages=[
            {"role": "system", "content": RECOMMEND_PROMPT},
            {"role": "user",   "content": user_msg}
        ],
        temperature=0.4,
        max_tokens=600,
    )

    content = chat.choices[0].message.content.strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # Provide the raw response for debugging
        raise RuntimeError(f"Invalid JSON from LLM. Raw response:\n{content}")

if __name__ == "__main__":
    # Quick self-test
    from marketsweep.tools import fetch_market_data

    profile = load_user_profile()
    market  = fetch_market_data()
    try:
        result = recommend_portfolio(profile, market)
        print(json.dumps(result, indent=2))
    except RuntimeError as e:
        print("❌ Recommendation error:", e)
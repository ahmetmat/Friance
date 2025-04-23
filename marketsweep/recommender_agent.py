import json, os, re
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
    "You're a professional crypto technical analyst and portfolio advisor. Based on the user's profile, current market data, "
    "and their existing wallet, provide tailored investment advice. Include:\n\n"
    "1. A detailed portfolio strategy based on risk preference with time horizon considerations\n"
    "2. Technical analysis using indicators (RSI, MACD, moving averages) for recommended coins\n"
    "3. Fundamental analysis of project development, ecosystem growth, and market adoption\n"
    "4. Clear allocation percentages totaling 100%\n"
    "5. For existing holdings, provide in-depth analysis for KEEP, SELL, or REDUCE recommendations\n"
    "6. For new investment opportunities, include both technical and fundamental justifications\n\n"
    "Return ONLY a valid JSON object without any additional text, markdown formatting, or code blocks. "
    "The response must be a pure JSON object with the following structure:\n\n"
    "{\n"
    "  \"strategy\": \"Medium-risk portfolio with technical momentum & fundamental growth focus.\",\n"
    "  \"recommended\": [\n"
    "    {\"symbol\": \"BTC\", \"alloc_pct\": 45, \"reason\": \"RSI at 62 indicates bullish momentum without being overbought. MACD shows positive divergence and strong support at $38,000.\"}\n"
    "  ],\n"
    "  \"existing_holdings\": [\n"
    "    {\"symbol\": \"ETH\", \"action\": \"KEEP\", \"reason\": \"RSI at 58 shows room for growth. Strong fundamentals with upcoming protocol upgrades and increasing developer activity.\"}\n"
    "  ],\n"
    "  \"new_investments\": [\n"
    "    {\"symbol\": \"SOL\", \"reason\": \"Recent consolidation with RSI reset from overbought conditions. Strong ecosystem growth with 22% increase in active developers.\"}\n"
    "  ],\n"
    "  \"markdown\": \"**💼 Portfolio Recommendation**\\n- BTC (45%): Technical indicators show...\\n...\"\n"
    "}\n\n"
    "CRITICAL: Return ONLY the JSON object with no explanatory text, markdown formatting, or code blocks."
)

def load_user_profile(path="marketsweep/user_profile.json"):
    """Read the user's profile JSON and return as dict."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_json_from_response(text):
    """Extract JSON from a response that might contain markdown and other text."""
    # Try to find JSON within markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        json_text = json_match.group(1)
    else:
        # If no code blocks, try to find JSON between curly braces
        json_match = re.search(r'(\{.*\})', text, re.DOTALL)
        if json_match:
            json_text = json_match.group(1)
        else:
            # If no JSON found, return the original text
            json_text = text
    
    # Clean up any trailing incomplete text (common in LLM outputs)
    # Find the last closing brace that has balanced braces
    open_count = 0
    close_count = 0
    for i, char in enumerate(json_text):
        if char == '{':
            open_count += 1
        elif char == '}':
            close_count += 1
            if open_count == close_count:
                json_text = json_text[:i+1]
                break
    
    return json_text

def recommend_portfolio(user_profile: dict, market_data: dict, wallet_data: dict = None) -> dict:
    """
    Call the LLM to generate a portfolio recommendation based
    on the user profile, current market data, and wallet data.
    Returns a dict matching the schema in RECOMMEND_PROMPT.
    """
    wallet_json = json.dumps(wallet_data, ensure_ascii=False) if wallet_data else "{}"
    
    user_msg = (
        f"### User Profile ###\n{json.dumps(user_profile, ensure_ascii=False)}\n\n"
        f"### Market Data ###\n{json.dumps(market_data, ensure_ascii=False)}\n\n"
        f"### User's Current Wallet ###\n{wallet_json}"
    )

    try:
        chat = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct",
            messages=[
                {"role": "system", "content": RECOMMEND_PROMPT},
                {"role": "user",   "content": user_msg}
            ],
            temperature=0.4,
            max_tokens=800,
        )

        content = chat.choices[0].message.content.strip()
        
        # Extract JSON from the response
        json_content = extract_json_from_response(content)
        
        try:
            return json.loads(json_content)
        except json.JSONDecodeError as e:
            # If still invalid, try one more approach - find the first '{' and last '}'
            first_brace = content.find('{')
            last_brace = content.rfind('}')
            
            if first_brace != -1 and last_brace != -1 and first_brace < last_brace:
                json_content = content[first_brace:last_brace+1]
                try:
                    return json.loads(json_content)
                except json.JSONDecodeError:
                    pass
            
            # If all approaches fail, re-raise with the original content
            raise RuntimeError(f"Invalid JSON from LLM. Raw response:\n{content}")
    except Exception as e:
        # Create a fallback recommendation
        print(f"Error calling AI: {str(e)}")
        return create_fallback_recommendation(market_data, wallet_data)

def create_fallback_recommendation(market_data, wallet_data):
    """Create a basic fallback recommendation when AI fails."""
    # Extract gainers from market data
    gainers = market_data.get("gainers", [])
    
    # Sort by highest gain
    sorted_gainers = sorted(gainers, key=lambda x: x.get("change", 0), reverse=True)
    
    # Create recommendations from top gainers
    recommended = []
    total_allocated = 0
    
    # First, allocate to top gainers
    for i, coin in enumerate(sorted_gainers[:3]):
        symbol = coin.get("symbol", "")
        change = coin.get("change", 0)
        alloc = min(40, 100 - total_allocated) if i == 0 else min(30, 100 - total_allocated)
        
        if total_allocated >= 100 or alloc <= 0:
            break
            
        recommended.append({
            "symbol": symbol,
            "alloc_pct": alloc,
            "reason": f"Strong momentum with {change}% recent gain"
        })
        total_allocated += alloc
    
    # Allocate remaining to BTC if needed
    if total_allocated < 100:
        recommended.append({
            "symbol": "BTC",
            "alloc_pct": 100 - total_allocated,
            "reason": "Balanced risk with the market leader"
        })
    
    # Create basic existing holdings recommendations if wallet data available
    existing_holdings = []
    if wallet_data and "token_breakdown" in wallet_data:
        for token in wallet_data["token_breakdown"]:
            symbol = token.get("symbol", "")
            existing_holdings.append({
                "symbol": symbol,
                "action": "KEEP",
                "reason": f"Current holding with value ${token.get('usd_value', 0)}"
            })
    
    # Create a basic markdown summary
    markdown = "**💼 Portfolio Recommendation**\n"
    for rec in recommended:
        markdown += f"- {rec['symbol']} ({rec['alloc_pct']}%): {rec['reason']}\n"
    
    if existing_holdings:
        markdown += "\n**Existing Holdings:**\n"
        for holding in existing_holdings:
            markdown += f"- {holding['symbol']}: {holding['action']} - {holding['reason']}\n"
    
    return {
        "strategy": "Balanced portfolio with focus on recent momentum",
        "recommended": recommended,
        "existing_holdings": existing_holdings,
        "new_investments": [],
        "markdown": markdown
    }
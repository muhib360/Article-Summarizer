from openai import OpenAI
import os
from dotenv import load_dotenv
from trafilatura import fetch_url, extract

# Load environment variables from .env file
load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPEN_ROUTER_KEY"),
    base_url=os.environ.get("MODEL_BASE_URL")
)

downloaded = fetch_url("https://en.wikipedia.org/wiki/Artificial_intelligence")
result = extract(downloaded)

response = client.chat.completions.create(
    model=os.environ.get("MODEL_NAME"),
    messages=[
        {"role": "system", "content": """Summarize the article.
Return:

- A concise title.
- Between 6 and 10 key points.
- Each key point should be one complete sentence.
- Do not create separate heading bullets.
- Do not output incomplete phrases.
- Each bullet should summarize one major idea.
- End with a one-sentence TL;DR."""},
        {"role": "user", "content": f"Summarize the following text:\n\n{result}"}
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "summary",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "title": { "type": "string" },
                    "key_points": { 
                        "type": "array",
                        "items": {
                            "type": "string"
                        } 
                    },
                    "one_line TL;DR": { "type": "string" }
                }
            }
        }
    }
)

print(response.choices[0].message.content)
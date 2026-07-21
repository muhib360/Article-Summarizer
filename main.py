from openai import OpenAI
import os
from dotenv import load_dotenv
from trafilatura import fetch_url, extract
from pydantic import BaseModel
from typing import Optional

class Summary(BaseModel):
    title: str
    bullet_points: list[str]
    tldr: str
    additional_info: Optional[dict[str, str]]

# Load environment variables from .env file
load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPEN_ROUTER_KEY"),
    base_url=os.environ.get("MODEL_BASE_URL")
)

downloaded = fetch_url("https://techcrunch.com/2026/07/20/anthropics-landmark-1-5b-copyright-settlement-is-approved/")
result = extract(downloaded)

response = client.chat.completions.parse(
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
- End with a one-sentence TL;DR.
- Include additional key-value pairs in 'additional_info' for extra article-specific details."""},
        {"role": "user", "content": f"Summarize the following text:\n\n{result}"}
    ],
    response_format=Summary
)

print(response.choices[0].message.content)
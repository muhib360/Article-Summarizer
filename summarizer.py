from openai import OpenAI
from trafilatura import fetch_url, extract
from models import Summary
from config import OPEN_ROUTER_KEY, MODEL_BASE_URL, MODEL_NAME

class ArticleSummarizer:
    def __init__(self):
        self.client = OpenAI(
            api_key=OPEN_ROUTER_KEY,
            base_url=MODEL_BASE_URL
        )

    def summarize(self, article_text: str) -> Summary:
        response = self.client.chat.completions.parse(
            model=MODEL_NAME,
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
                {"role": "user", "content": f"Summarize the following text:\n\n{article_text}"}
            ],
            response_format=Summary
        )
        return response.choices[0].message.content
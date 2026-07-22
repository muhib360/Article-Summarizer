from fastapi import APIRouter
from scraper import extract_article_text
from summarizer import ArticleSummarizer
from models import Summary

router = APIRouter(prefix="/summarize", tags=["summarize"])

@router.post('/')
async def create_summary(target_url: str) -> Summary:
    extracted_text = extract_article_text(target_url)
    summarizer = ArticleSummarizer()

    summary = summarizer.summarize(extracted_text)

    return summary
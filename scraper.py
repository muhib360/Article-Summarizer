from trafilatura import fetch_url, extract

def extract_article_text(url: str) -> str:
    """Fetch URL content and extract clean article text."""
    downloaded = fetch_url(url)
    if not downloaded:
        raise ValueError(f"Failed to fetch content from URL: {url}")
    
    result = extract(downloaded)
    if not result:
        raise ValueError(f"Failed to extract article content from URL: {url}")
        
    return result

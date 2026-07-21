from scraper import extract_article_text
from summarizer import ArticleSummarizer

def main():
    target_url = "https://medium.com/@alrojo_github/how-to-get-into-the-stanford-computer-science-phd-program-71c8e1169b34"
    extracted_text = extract_article_text(target_url)

    summarizer = ArticleSummarizer()

    summary = summarizer.summarize(extracted_text)
    print(summary)

if __name__ == "__main__":
    main()
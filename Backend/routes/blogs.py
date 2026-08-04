from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.db import get_db
from db.models.Article import Article
from db.models.User import User
from dependencies.auth import get_current_user
from models import SaveBlogRequest, SavedBlogResponse, SavedBlogListItem
import uuid

router = APIRouter(prefix="/blogs", tags=["blogs"])


@router.post("/", response_model=SavedBlogResponse, status_code=status.HTTP_201_CREATED)
async def save_blog(
    request: SaveBlogRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save an already-summarized blog to the database."""

    article = Article(
        source_url=str(request.source_url),
        title=request.title,
        bullet_points=request.bullet_points,
        tldr=request.tldr,
        additional_info=request.additional_info,
        user_id=current_user.id,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)

    return article


@router.get("/", response_model=list[SavedBlogListItem])
async def list_saved_blogs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all saved blogs for the authenticated user (lightweight view)."""

    result = await db.execute(
        select(Article)
        .where(Article.user_id == current_user.id)
        .order_by(Article.saved_at.desc())
    )
    articles = result.scalars().all()
    return articles


@router.get("/{blog_id}", response_model=SavedBlogResponse)
async def get_saved_blog(
    blog_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the full details of a single saved blog."""

    article = await db.get(Article, blog_id)
    if not article or article.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found.",
        )

    return article


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_blog(
    blog_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a saved blog (only the owner can delete)."""

    article = await db.get(Article, blog_id)
    if not article or article.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found.",
        )

    await db.delete(article)
    await db.commit()

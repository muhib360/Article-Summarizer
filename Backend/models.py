from typing import Optional
from pydantic import BaseModel

class Summary(BaseModel):
    title: str
    bullet_points: list[str]
    tldr: str
    additional_info: dict[str, str] | None
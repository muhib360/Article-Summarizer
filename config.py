import os
from dotenv import load_dotenv

load_dotenv()

OPEN_ROUTER_KEY = os.environ.get("OPEN_ROUTER_KEY")
MODEL_BASE_URL = os.environ.get("MODEL_BASE_URL")
MODEL_NAME = os.environ.get("MODEL_NAME")
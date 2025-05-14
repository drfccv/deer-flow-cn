import os
import json
import logging

from langchain_community.tools import BraveSearch, DuckDuckGoSearchResults
from langchain_community.tools.arxiv import ArxivQueryRun
from langchain_community.tools.searx_search.tool import SearxSearchResults
from langchain_community.utilities.searx_search import SearxSearchWrapper
from langchain_community.utilities import ArxivAPIWrapper, BraveSearchWrapper

from src.config import SEARCH_MAX_RESULTS
from src.tools.tavily_search.tavily_search_results_with_images import (
    TavilySearchResultsWithImages,
)

from .decorators import create_logged_tool

logger = logging.getLogger(__name__)

# Tavily 搜索工具
LoggedTavilySearch = create_logged_tool(TavilySearchResultsWithImages)
tavily_search_tool = LoggedTavilySearch(
    name="web_search",
    max_results=SEARCH_MAX_RESULTS,
    include_raw_content=True,
    include_images=True,
    include_image_descriptions=True,
)

# DuckDuckGo 搜索工具
LoggedDuckDuckGoSearch = create_logged_tool(DuckDuckGoSearchResults)
duckduckgo_search_tool = LoggedDuckDuckGoSearch(
    name="web_search", max_results=SEARCH_MAX_RESULTS
)

# Brave 搜索工具
LoggedBraveSearch = create_logged_tool(BraveSearch)
brave_search_tool = LoggedBraveSearch(
    name="web_search",
    search_wrapper=BraveSearchWrapper(
        api_key=os.getenv("BRAVE_SEARCH_API_KEY", ""),
        search_kwargs={"count": SEARCH_MAX_RESULTS},
    ),
)

# Arxiv 搜索工具
LoggedArxivSearch = create_logged_tool(ArxivQueryRun)
arxiv_search_tool = LoggedArxivSearch(
    name="web_search",
    api_wrapper=ArxivAPIWrapper(
        top_k_results=SEARCH_MAX_RESULTS,
        load_max_docs=SEARCH_MAX_RESULTS,
        load_all_available_meta=True,
    ),
)

# Searx 搜索工具（新版标准写法）
searx_wrapper = SearxSearchWrapper(
    searx_host=os.environ["SEARX_HOST"],
    unsecure=True,  # 如果用 http，这里要 True；https 推荐 False
    params={
        "language": "zh",
        "format": "json",
        "safesearch": 1,
        "categories": "general"
    },
    headers={},
)
searx_search_tool = SearxSearchResults(
    wrapper=searx_wrapper,
    num_results=SEARCH_MAX_RESULTS
)

if __name__ == "__main__":
    results = searx_search_tool.invoke("cute panda")
    print(json.dumps(results, indent=2, ensure_ascii=False))
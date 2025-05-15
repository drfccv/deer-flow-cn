# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

import json
import logging
import os

from langchain_community.tools import BraveSearch, DuckDuckGoSearchResults
from langchain_community.tools.arxiv import ArxivQueryRun
from langchain_community.utilities.arxiv import ArxivAPIWrapper
from langchain_community.utilities.brave_search import BraveSearchWrapper
from langchain_community.utilities.searx_search import SearxSearchWrapper

from src.config import SEARCH_MAX_RESULTS
from src.tools.tavily_search.tavily_search_results_with_images import (
    TavilySearchResultsWithImages,
)

# 兼容不同 langchain_community 版本的 SearxSearchResults 导入
try:
    from langchain_community.tools.searx_search.tool import SearxSearchResults
except ImportError:
    try:
        from langchain_community.tools.searx_search import SearxSearchResults
    except ImportError:
        SearxSearchResults = None  # 或者抛出异常，根据需要

from .decorators import create_logged_tool

logger = logging.getLogger(__name__)


LoggedTavilySearch = create_logged_tool(TavilySearchResultsWithImages)
tavily_search_tool = LoggedTavilySearch(
    name="web_search",
    max_results=SEARCH_MAX_RESULTS,
    include_raw_content=True,
    include_images=True,
    include_image_descriptions=True,
)

LoggedDuckDuckGoSearch = create_logged_tool(DuckDuckGoSearchResults)
duckduckgo_search_tool = LoggedDuckDuckGoSearch(
    name="web_search", max_results=SEARCH_MAX_RESULTS
)

LoggedBraveSearch = create_logged_tool(BraveSearch)
brave_search_tool = LoggedBraveSearch(
    name="web_search",
    search_wrapper=BraveSearchWrapper(
        api_key=os.getenv("BRAVE_SEARCH_API_KEY", ""),
        search_kwargs={"count": SEARCH_MAX_RESULTS},
    ),
)

LoggedArxivSearch = create_logged_tool(ArxivQueryRun)
arxiv_search_tool = LoggedArxivSearch(
    name="web_search",
    api_wrapper=ArxivAPIWrapper(
        top_k_results=SEARCH_MAX_RESULTS,
        load_max_docs=SEARCH_MAX_RESULTS,
        load_all_available_meta=True,
    ),
)

# SearxSearchResults 需要 wrapper 参数
searx_wrapper = SearxSearchWrapper(
    searx_host=os.getenv("SEARX_HOST", "http://localhost:2304"),  # 优先读取 .env 中 SEARX_HOST
    unsecure=True,  # 如有 https 可改为 False
    params={"language": "zh"},  # 可根据需要调整
)
LoggedSearxSearch = create_logged_tool(SearxSearchResults)
searx_search_tool = LoggedSearxSearch(
    name="web_search",
    wrapper=searx_wrapper,
    max_results=SEARCH_MAX_RESULTS
)

# 只暴露 web_search_tool，防止暴露底层实现名
__all__ = [
    "web_search_tool",
]

if __name__ == "__main__":
    results = tavily_search_tool.invoke("cute panda")
    print(json.dumps(results, indent=2, ensure_ascii=False))

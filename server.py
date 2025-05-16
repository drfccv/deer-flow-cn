# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

"""
Server script for running the DeerFlow API.
"""

import argparse
import logging
from dotenv import load_dotenv

import uvicorn

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Run the DeerFlow API server")
    parser.add_argument(
        "--reload",
        action="store_true",
        help="Enable auto-reload (default: True except on Windows)",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="Host to bind the server to (default: localhost)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to bind the server to (default: 8000)",
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="info",
        choices=["debug", "info", "warning", "error", "critical"],
        help="Log level (default: info)",
    )
    # Adding SSL support
    parser.add_argument(
        "--ssl-keyfile",
        type=str,
        help="Path to SSL private key (if using SSL)",
    )
    parser.add_argument(
        "--ssl-certfile",
        type=str,
        help="Path to SSL certificate (if using SSL)",
    )

    args = parser.parse_args()

    # Determine reload setting
    reload = False

    # Command line arguments override defaults
    if args.reload:
        reload = True

    logger.info("Starting DeerFlow API server")

    # Run the server with or without SSL based on arguments
    if args.ssl_keyfile and args.ssl_certfile:
        uvicorn.run(
            "src.server:app",
            host=args.host,
            port=args.port,
            reload=reload,
            log_level=args.log_level,
            ssl_keyfile=args.ssl_keyfile,  # Pass SSL keyfile
            ssl_certfile=args.ssl_certfile,  # Pass SSL certfile
        )
    else:
        uvicorn.run(
            "src.server:app",
            host=args.host,
            port=args.port,
            reload=reload,
            log_level=args.log_level,
        )

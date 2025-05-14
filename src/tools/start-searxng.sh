cd "$(dirname "$0")/searxng"
source "./.venv/bin/activate"
export SEARXNG_SETTINGS_PATH="$PWD/searx/settings.yml"
python3 -m searx.webapp
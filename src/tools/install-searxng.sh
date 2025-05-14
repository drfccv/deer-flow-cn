#!/bin/bash

set -e

# ====== 自定义监听地址和端口 ======
LISTEN_ADDRESS=${1:-127.0.0.1}
LISTEN_PORT=${2:-2304}

# 当前目录为安装目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$SCRIPT_DIR/searxng"

echo "🔧 安装目录: $INSTALL_DIR"
echo "🌐 监听地址: $LISTEN_ADDRESS"
echo "🌐 监听端口: $LISTEN_PORT"

# ====== 自动检测平台并安装依赖 ======
install_dependencies() {
    echo "[1/5] 检测系统平台..."

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO_ID=$ID
    else
        echo "❌ 无法识别操作系统类型"
        exit 1
    fi

    echo "🖥️ 当前系统: $DISTRO_ID"

    case "$DISTRO_ID" in
        ubuntu|debian)
            sudo apt update
            sudo apt install -y git python3 python3-venv python3-dev curl redis-server
            ;;
        centos|rhel|rocky|almalinux|opencloudos)
            sudo yum install -y git python3 python3-devel curl redis
            ;;
        fedora)
            sudo dnf install -y git python3 python3-devel curl redis
            ;;
        arch)
            sudo pacman -Sy --noconfirm git python python-pip curl redis
            ;;
        opensuse*|suse)
            sudo zypper install -y git python3 python3-devel curl redis
            ;;
        *)
            echo "❌ 暂不支持的系统: $DISTRO_ID"
            exit 1
            ;;
    esac

    echo "🔍 检查 venv 模块..."
    if ! python3 -m venv --help &>/dev/null; then
        echo "❌ Python 缺少 venv 模块"
        echo "💡 建议安装 python3-devel 或 python3-venv"
        exit 1
    else
        echo "✅ venv 模块可用"
    fi

    # 启动 Redis 服务，但不设置开机启动
    echo "[2/5] 启动 Redis 服务..."
    sudo systemctl start redis
}

# ====== 开始安装流程 ======
install_dependencies

echo "[3/5] 克隆项目..."
if [ ! -d "$INSTALL_DIR/.git" ]; then
    git clone https://github.com/searxng/searxng.git "$INSTALL_DIR"
else
    echo "✅ 项目已存在，跳过克隆"
fi

cd "$INSTALL_DIR"

echo "[4/5] 创建 Python 虚拟环境..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate

echo "[5/5] 安装 Python 依赖..."

pip install --upgrade pip setuptools wheel

REQ_FILE=""
if [ -f "requirements.txt" ]; then
    REQ_FILE="requirements.txt"
elif [ -f "searxng/requirements.txt" ]; then
    REQ_FILE="searxng/requirements.txt"
else
    echo "❌ 找不到 requirements.txt"
    exit 1
fi

pip install -r "$REQ_FILE"

echo "[6/6] 配置监听地址和端口..."

# 确保配置文件目录存在
mkdir -p "$INSTALL_DIR/searx"
CONFIG_FILE="$INSTALL_DIR/searx/settings.yml"

# 如果配置文件不存在，复制默认配置文件
if [ ! -f "$CONFIG_FILE" ]; then
    cp searx/settings.yml "$CONFIG_FILE"
fi

# 替换配置中的监听地址和端口
echo "正在修改监听地址和端口..."
sed -i "s|^  bind_address: .*|  bind_address: '$LISTEN_ADDRESS'|" "$CONFIG_FILE"
sed -i "s|^  port: .*|  port: $LISTEN_PORT|" "$CONFIG_FILE"

# 配置 Redis
echo "正在配置 Redis..."
sed -i "s|^  redis:|  redis:|g" "$CONFIG_FILE"
sed -i "s|#    enable: false|    enable: true|g" "$CONFIG_FILE"
sed -i "s|#    host: .*|    host: 127.0.0.1|g" "$CONFIG_FILE"
sed -i "s|#    port: .*|    port: 6379|g" "$CONFIG_FILE"
sed -i "s|#    db: .*|    db: 0|g" "$CONFIG_FILE"

# 显示配置修改结果
echo "✅ 配置完成：监听地址 $LISTEN_ADDRESS，端口 $LISTEN_PORT，Redis 已启用"

# 完成安装
echo
echo "✅ 安装完成！"
echo "👉 启动方式："
echo "   cd \"$INSTALL_DIR\""
echo "   source .venv/bin/activate"
echo "   python3 -m searx.webapp"
echo
echo "🌐 访问地址： http://$LISTEN_ADDRESS:$LISTEN_PORT"
echo

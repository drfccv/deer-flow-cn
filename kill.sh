#!/bin/bash

# 定义要检查的端口列表
PORTS=(2304 3000 8000)

for port in "${PORTS[@]}"; do
    # 查找端口是否被占用
    pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | grep -E '^[0-9]+$' | sort -u)
    if [ -n "$pid" ]; then
        echo "端口 $port 被进程 $pid 占用，正在kill..."
        for p in $pid; do
            kill -9 $p && echo "已kill进程 $p"
        done
    else
        echo "端口 $port 未被占用。"
    fi
done
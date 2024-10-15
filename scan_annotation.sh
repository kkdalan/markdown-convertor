#!/bin/bash

# 檢查是否提供了參數
if [ "$#" -lt 1 ]; then
    echo "請提供要搜索的註解名稱，例如: ./scan_annotation.sh @Component @Service"
    exit 1
fi

# 接受多個參數作為要搜索的註解
annotations=("$@")

# 定義模組名稱和目錄清單
modules=(
    "framework-core"                           # 核心框架模組
    "framework-core-extensions-util"           # 核心框架擴展 - 工具模組
    "framework-core-extensions-custom-rqrs"    # 核心框架擴展 - 自定義請求/回應模組
    "framework-adapters-rest"                   # 框架適配器 - REST API 支持
    "framework-adapters-rabbitmq"               # 框架適配器 - RabbitMQ 支持
    "framework-adapters-jms"                    # 框架適配器 - JMS 支持
    "framework-adapters-soap"                   # 框架適配器 - SOAP 支持
)

# 表頭
header="| **模組名稱** |"
for annotation in "${annotations[@]}"; do
    header+=" $annotation |"
done
echo "$header"

headline="|--------------|"
for annotation in "${annotations[@]}"; do
    headline+="------------|"
done
echo "$headline"

# 在每個模組中掃描指定註解的檔案並統計數量
for module in "${modules[@]}"; do
    counts=("$module")
    for annotation in "${annotations[@]}"; do
        count=$(grep -rl "$annotation" "$module" | grep -E "\.java$" | wc -l)
        counts+=("$count")
    done
    
    # echo "| ${counts[*]} |"
    module_count="|"
    for cnt in "${counts[@]}"; do
        module_count+=" $cnt | "
    done
    echo "$module_count"
done


#!/bin/bash

# 檢查是否提供了參數
if [ "$#" -lt 2 ]; then
    echo "請提供要搜索的註解名稱及要掃描的 package，例如: ./scan_project.sh luzmi-core @Component @Service"
    exit 1
fi

module="$1"

# 接受多個參數作為要搜索的註解
annotations=("${@:2}")

# 定義要掃描的 package 路徑
packages_to_scan=(
    "src/main/java/com/misystex/luzmi"
    "src/test/java/com/misystex/luzmi"
    "target"
    "src/main/java/com/misystex/luzmi/core/adapter"
    "src/main/java/com/misystex/luzmi/core/adapter/in"
    "src/main/java/com/misystex/luzmi/core/adapter/out"
    "src/main/java/com/misystex/luzmi/core/application"
    "src/main/java/com/misystex/luzmi/core/application/in"
    "src/main/java/com/misystex/luzmi/core/application/out"
    "src/main/java/com/misystex/luzmi/core/annotation"
    "src/main/java/com/misystex/luzmi/core/domain"
    "src/main/java/com/misystex/luzmi/core/spring/config"
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
for package in "${packages_to_scan[@]}"; do
    counts=("$package")
    for annotation in "${annotations[@]}"; do
        # 遞迴搜尋指定註解，並計算 Java 檔案的數量
        count=$(grep -rl "$annotation" "$module/$package" | grep -e "\.java$" | wc -l)
        counts+=("$count")
    done
    
    # 使用 | 分隔輸出
    package_count="|"
    for cnt in "${counts[@]}"; do
        package_count+=" $cnt |"
    done
    echo "$package_count"
done


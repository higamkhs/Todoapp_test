#!/bin/bash

echo "🎯 Todo App を起動中..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 server.py
elif command -v python &> /dev/null; then
    python server.py
else
    echo "❌ Python が見つかりません。"
    echo "代わりに静的ファイルを直接ブラウザで開きます..."
    
    # Try to open the HTML file directly
    if command -v xdg-open &> /dev/null; then
        xdg-open index.html
    elif command -v open &> /dev/null; then
        open index.html
    else
        echo "📄 index.html をブラウザで開いてください。"
    fi
fi
#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from threading import Timer

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

def open_browser():
    """Open the browser after a short delay"""
    webbrowser.open(f'http://localhost:{PORT}')

def start_server():
    """Start the web server"""
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Todo App が http://localhost:{PORT} で起動しました！")
        print("✨ ブラウザが自動で開きます...")
        print("🛑 停止するには Ctrl+C を押してください")
        
        # Open browser after 1 second
        Timer(1.0, open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 サーバーを停止しました。お疲れ様でした！")

if __name__ == "__main__":
    start_server()
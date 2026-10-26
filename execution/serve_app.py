#!/usr/bin/env python3
"""
execution/serve_app.py — Lightweight deterministic HTTP server for Jolty web application.

Usage:
    python3 execution/serve_app.py [--port 8000] [--host 127.0.0.1] [--dir .]
"""

import argparse
import http.server
import os
import socket
import socketserver
import sys


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler that adds no-cache headers and security/CORS headers."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # Quiet standard asset polling logs to keep stdout clean
        if "GET /favicon.ico" in args[0] or "200" in args[1]:
            return
        super().log_message(format, *args)


def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0


def find_available_port(start_port: int, host: str = "127.0.0.1", max_attempts: int = 10) -> int:
    port = start_port
    for _ in range(max_attempts):
        if not is_port_in_use(port, host):
            return port
        port += 1
    return port


def main():
    parser = argparse.ArgumentParser(description="Deterministic web server for Jolty")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)), help="Port to serve on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host interface")
    parser.add_argument("--dir", type=str, default=".", help="Root directory to serve")
    parser.add_argument("--check", action="store_true", help="Check configuration and exit")

    args = parser.parse_args()

    serve_dir = os.path.abspath(args.dir)
    if not os.path.isdir(serve_dir):
        print(f"Error: Directory '{serve_dir}' does not exist.", file=sys.stderr)
        sys.exit(1)

    os.chdir(serve_dir)

    target_port = find_available_port(args.port, args.host)
    if target_port != args.port:
        print(f"Note: Port {args.port} was busy. Switched to port {target_port}.")

    if args.check:
        print(f"Ready: host={args.host}, port={target_port}, dir={serve_dir}")
        sys.exit(0)

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((args.host, target_port), NoCacheHTTPRequestHandler) as httpd:
        print(f"Jolty local server running at http://{args.host}:{target_port}/")
        print(f"Serving files from: {serve_dir}")
        print("Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Jolty server gracefully.")
            httpd.server_close()
            sys.exit(0)


if __name__ == "__main__":
    main()

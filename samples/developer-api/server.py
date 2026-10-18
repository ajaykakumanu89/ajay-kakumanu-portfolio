"""Synthetic portfolio demo: an in-memory task API for local use only."""

import argparse
import json
from http.server import BaseHTTPRequestHandler, HTTPServer


class TaskHandler(BaseHTTPRequestHandler):
    tasks = []
    next_id = 1
    max_body_bytes = 8192

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {"status": "ok"})
        elif self.path == "/tasks":
            self.send_json(200, {"tasks": self.tasks})
        else:
            self.send_json(404, {"error": "Route not found."})

    def do_POST(self):
        if self.path != "/tasks":
            self.send_json(404, {"error": "Route not found."})
            return

        content_type = self.headers.get("Content-Type", "").split(";")[0]
        if content_type.strip().lower() != "application/json":
            self.send_json(415, {"error": "Use Content-Type: application/json."})
            return

        length_header = self.headers.get("Content-Length")
        if length_header is None:
            self.send_json(411, {"error": "Content-Length is required."})
            return
        try:
            length = int(length_header)
        except ValueError:
            self.send_json(400, {"error": "Content-Length must be an integer."})
            return
        if length < 0:
            self.send_json(400, {"error": "Content-Length cannot be negative."})
            return
        if length > self.max_body_bytes:
            self.send_json(413, {"error": "Request body exceeds 8192 bytes."})
            return

        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(400, {"error": "Body must be valid UTF-8 JSON."})
            return
        if not isinstance(data, dict) or set(data) != {"title"}:
            self.send_json(400, {"error": "Body must be an object containing only title."})
            return
        title = data["title"]
        if not isinstance(title, str) or not 1 <= len(title.strip()) <= 200:
            self.send_json(400, {"error": "title must be a string of 1 to 200 characters after trimming."})
            return

        task = {"id": type(self).next_id, "title": title.strip()}
        type(self).next_id += 1
        self.tasks.append(task)
        self.send_json(201, task)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765, help="Local port (default: 8765)")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")
    server = HTTPServer(("127.0.0.1", args.port), TaskHandler)
    print("Task API listening at http://127.0.0.1:{} (Ctrl+C to stop)".format(args.port), flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Task API.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

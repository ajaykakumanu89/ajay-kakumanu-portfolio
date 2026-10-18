#!/usr/bin/env python3
"""Check local HTML href targets and fragments without making network requests."""

from __future__ import annotations

import argparse
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.anchors: set[str] = set()
        self.links: list[tuple[int, str]] = []

    def handle_starttag(self, tag: str, attributes: list[tuple[str, str | None]]) -> None:
        attrs = dict(attributes)
        if attrs.get("id"):
            self.anchors.add(attrs["id"])
        if tag == "a" and attrs.get("name"):
            self.anchors.add(attrs["name"])
        if attrs.get("href") is not None:
            self.links.append((self.getpos()[0], attrs["href"]))

    handle_startendtag = handle_starttag


def read_document(path: Path, cache: dict[Path, Document]) -> Document:
    if path not in cache:
        document = Document()
        document.feed(path.read_text(encoding="utf-8-sig"))
        document.close()
        cache[path] = document
    return cache[path]


def check_link(source: Path, href: str, cache: dict[Path, Document]) -> tuple[str, str]:
    try:
        parts = urlsplit(href)
    except ValueError as error:
        return "BROKEN", f"invalid URL: {error}"
    if parts.scheme or parts.netloc or href.startswith("/"):
        return "SKIP", "external URL, URI scheme, or site-root path"
    local_path = unquote(parts.path)
    # Backslashes and drive letters are not portable HTML relative paths.
    if "\\" in local_path or Path(local_path).is_absolute():
        return "SKIP", "nonportable or absolute filesystem path"
    target = (source.parent / local_path).resolve() if local_path else source
    if not target.is_file():
        return "BROKEN", "target file does not exist or is a directory"
    if parts.fragment and target.suffix.lower() in {".html", ".htm"}:
        fragment = unquote(parts.fragment)
        if fragment not in read_document(target, cache).anchors:
            return "BROKEN", f"HTML anchor #{fragment} does not exist"
    return "OK", "target exists"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path, help="HTML files or directories to check")
    arguments = parser.parse_args()
    files: set[Path] = set()
    for path in arguments.paths:
        if path.is_dir():
            files.update(p.resolve() for p in path.rglob("*") if p.is_file() and p.suffix.lower() in {".html", ".htm"})
        elif path.is_file() and path.suffix.lower() in {".html", ".htm"}:
            files.add(path.resolve())
        else:
            parser.error(f"expected an existing HTML file or directory: {path}")
    if not files:
        parser.error("no HTML files found")
    counts = {"OK": 0, "BROKEN": 0, "SKIP": 0}
    cache: dict[Path, Document] = {}
    try:
        for source in sorted(files):
            for line, href in read_document(source, cache).links:
                status, reason = check_link(source, href, cache)
                counts[status] += 1
                print(f"{status}: {source.name}:{line}: {href!r} - {reason}")
    except (OSError, UnicodeError, ValueError) as error:
        print(f"ERROR: unable to read or parse input: {error}", file=sys.stderr)
        return 2
    checked = counts["OK"] + counts["BROKEN"]
    print(f"Summary: {counts['OK']} valid, {counts['BROKEN']} broken, {counts['SKIP']} skipped ({checked} links checked).")
    return 1 if counts["BROKEN"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

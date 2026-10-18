"""Check required portfolio files and local Markdown file links.

Run from any directory with Python 3.11 or later. External URLs and heading-only
fragments are deliberately not checked. This script does not inspect the HTML
fixtures used by the separate documentation-validator sample.
"""

from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "README.md",
    "ABOUT.md",
    "resume.md",
    "CONTRIBUTING.md",
    "docs/portfolio-plan.md",
    "docs/sample-template.md",
    "docs/content-review.md",
    "docs/publishing.md",
    "samples/developer-api/README.md",
    "samples/developer-api/api-reference.md",
    "samples/developer-api/server.py",
    "samples/documentation-validator/README.md",
    "samples/documentation-validator/check_links.py",
    "samples/ai-assisted-documentation/README.md",
)
LINK = re.compile(r"!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+\"[^\"]*\")?\)")


def main():
    errors = []
    for relative in REQUIRED:
        if not (ROOT / relative).is_file():
            errors.append(f"Missing required file: {relative}")

    files = sorted(ROOT.rglob("*.md"))
    checked = 0
    for source in files:
        if any(part in {".git", ".venv", "venv"} for part in source.parts):
            continue
        content = source.read_text(encoding="utf-8")
        # Fenced command examples may contain illustrative Markdown paths.
        content = re.sub(r"^```[^\n]*\n.*?^```\s*$", "", content,
                         flags=re.MULTILINE | re.DOTALL)
        for match in LINK.finditer(content):
            destination = match.group(1).strip("<>")
            parsed = urlsplit(destination)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            checked += 1
            target = (source.parent / unquote(parsed.path)).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                errors.append(f"{source.relative_to(ROOT)}: link leaves repository: {destination}")
                continue
            if not target.exists():
                errors.append(f"{source.relative_to(ROOT)}: missing link target: {destination}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"FAIL: {len(errors)} issue(s); {checked} local Markdown links checked.")
        return 1
    print(f"PASS: {len(REQUIRED)} required files; {checked} local Markdown links checked.")
    print("External URLs, heading fragments, and career claims were not checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""List Cursor personal skills (~/.cursor/skills) with optional keyword filter.

Usage:
  python3 list_cursor_skills.py
  python3 list_cursor_skills.py --filter html react
  python3 list_cursor_skills.py --markdown --root /Users/you/.cursor/skills
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def parse_frontmatter(text: str) -> tuple[str | None, str | None]:
    name = None
    desc = None
    if not text.lstrip().startswith("---"):
        return name, desc
    end = text.find("\n---", 3)
    if end == -1:
        return name, desc
    block = text[3:end]
    m_name = re.search(r"^name:\s*(.+)$", block, re.MULTILINE)
    m_desc = re.search(r"^description:\s*>?-?\s*(.+)$", block, re.MULTILINE)
    if m_name:
        name = m_name.group(1).strip().strip('"').strip("'")
    if m_desc:
        desc = m_desc.group(1).strip().strip('"').strip("'")
    return name, desc


def first_heading(text: str) -> str | None:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return None


def load_skill(root: Path, folder: Path) -> dict:
    skill_md = folder / "SKILL.md"
    if not skill_md.is_file():
        return {}
    raw = skill_md.read_text(encoding="utf-8", errors="replace")
    name, desc = parse_frontmatter(raw)
    if not name:
        h = first_heading(raw)
        name = (h or folder.name).lower().replace(" ", "-")[:64]
    return {
        "folder": folder.name,
        "path": str(skill_md.resolve()),
        "name": name or folder.name,
        "description": (desc or "")[:500],
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--root",
        type=Path,
        default=Path.home() / ".cursor" / "skills",
        help="Skills root (default: ~/.cursor/skills)",
    )
    ap.add_argument(
        "--filter",
        nargs="*",
        default=[],
        help="Case-insensitive substring match on name, folder, description",
    )
    ap.add_argument("--markdown", action="store_true", help="Print markdown bullets")
    args = ap.parse_args()
    root: Path = args.root.expanduser()
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 2

    items: list[dict] = []
    for child in sorted(root.iterdir(), key=lambda p: p.name.lower()):
        if not child.is_dir() or child.name.startswith("."):
            continue
        row = load_skill(root, child)
        if not row:
            continue
        hay = f"{row['name']} {row['folder']} {row['description']}".lower()
        if args.filter and not any(f.lower() in hay for f in args.filter):
            continue
        items.append(row)

    if args.markdown:
        for r in items:
            p = r["path"]
            print(f"- `@{p}` — **{r['name']}** ({r['folder']})")
    else:
        for r in items:
            print(f"{r['name']}\t{r['folder']}\t{r['path']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

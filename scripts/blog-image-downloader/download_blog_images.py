#!/usr/bin/env python3
"""
Download missing blog images defined in scripts/blog-image-manifest.json (repo root).

Run from anywhere:
  python scripts/blog-image-downloader/download_blog_images.py

Section images (default): Google Images via Selenium + Chrome, up to 4 parallel workers.

Entity icons (--include-icons): Simple Icons CDN.

Optional --licensed-apis: Pexels → Unsplash, then Google as fallback (no undraw).

Writes blog-image-attributions.json and blog-image-attributions.md (source URLs for disclaimers).

Overwrites existing image files by default. Use --skip-existing to keep files on disk.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass, field
from typing import NamedTuple
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal
from urllib.parse import parse_qs, quote, unquote, urlparse

import requests
from dotenv import load_dotenv
from PIL import Image

try:
    import cairosvg
except ImportError:
    cairosvg = None  # type: ignore

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options as ChromeOptions
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait

    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

# ---------------------------------------------------------------------------
# Paths & config
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_ROOT = SCRIPT_DIR.parent
PROJECT_ROOT = SCRIPTS_ROOT.parent
MANIFEST_PATH = SCRIPTS_ROOT / "blog-image-manifest.json"
DEFAULT_ENV_PATH = PROJECT_ROOT / ".env.local"
PUBLIC_DIR = PROJECT_ROOT / "public"
DEFAULT_ATTRIBUTIONS_JSON = SCRIPT_DIR / "blog-image-attributions.json"
DEFAULT_ATTRIBUTIONS_MD = SCRIPT_DIR / "blog-image-attributions.md"

IMAGE_DISCLAIMER_BLOCK = """> **Image Disclaimer**: The images used in this blog post were sourced from public Google searches. I do not own the rights to these images. They are used for illustrative and educational purposes only under fair use principles. If you are the copyright owner and would like an image removed, please contact me."""

# Brand primary (gold) for undraw.co — matches qwabi.co.za CSS --primary
UNDRAW_COLOR = "FFD700"
SIMPLE_ICONS_COLOR = "FFD700"

DOWNLOAD_DELAY_SEC = 1.25
GOOGLE_SCROLL_PASSES = 3
REQUEST_TIMEOUT = 45
MIN_WIDTH_PX = 1200
MAX_WORKERS = 4

_thread_local = threading.local()
_active_google_drivers: list[GoogleImageSearch] = []
_drivers_lock = threading.Lock()
# Google blocks or serves empty grids when many Chromes search in parallel
_google_search_lock = threading.Lock()

# Embedded in Google Images HTML/JSON (imgres anchors are often missing in modern UI)
_IMGRES_URL_IN_HTML_RE = re.compile(
    r"https?://(?:www\.)?google\.com/imgres\?[^\"'\\\s<>]+",
    re.I,
)
_IMGURL_PARAM_RE = re.compile(r"imgurl=([^&\"'\\\s]+)", re.I)
_OU_JSON_RE = re.compile(r'"ou":"(https?:\\/\\/[^"\\]+)"')

# URL substrings to skip when post is cultural/historical (avoids random stock junk)
IRRELEVANT_URL_FOR_CULTURE = frozenset(
    {
        "iphone",
        "smartphone",
        "cellphone",
        "cell-phone",
        "mobile-phone",
        "android-phone",
        "phone-case",
        "telefon",
        "gadget",
        "tablet",
        "laptop",
        "macbook",
    }
)

CULTURAL_POST_MARKERS = frozenset(
    {
        "culture",
        "history",
        "xhosa",
        "thembu",
        "abathemubu",
        "heritage",
        "lineage",
        "massacre",
        "ntsikana",
        "bulhoek",
        "africa",
        "ancestry",
        "madiba",
        "mandela",
    }
)

# Entity name → Simple Icons slug (https://simpleicons.org)
ENTITY_SIMPLE_ICON_SLUG: dict[str, str] = {
    "Cursor": "cursor",
    "Claude": "anthropic",
    "Claude Code": "anthropic",
    "OpenAI Codex": "openai",
    "GitHub Copilot": "githubcopilot",
    "Vercel v0": "vercel",
    "Bolt": "stackblitz",
    "React": "react",
    "Next.js": "nextdotjs",
    "TypeScript": "typescript",
    "Node.js": "nodedotjs",
    "Python": "python",
    "Supabase": "supabase",
    "Firebase": "firebase",
    "Kubernetes": "kubernetes",
    "Docker": "docker",
    "Netlify": "netlify",
    "Gatsby": "gatsby",
    "Paystack": "paystack",
    "Google Antigravity": "google",
    "LangChain": "langchain",
    "TensorFlow": "tensorflow",
    "DVT": "dvt",
    "Netgen": "netgen",
    "Synthesis": "synthesis",
    "SovTech": "sovtech",
    "Warp Development": "warp",
    "Specno": "specno",
    "Bluegrass Digital": "bluegrassdigital",
    "BBD": "bbdsoftware",
    "Entelect": "entelect",
    "Accenture": "accenture",
    "MIDA": "mida",
    "Simply": "simply",
    "Queens Connect": "openai",
    "Kingly": "kingly",
    "Laundry Marketplace": "laundry",
    "UTap": "utap",
    "ClinicPlus": "clinicplus",
    "Ayabonga Qwabi": "qwabi",
}

# Search-term hints → undraw illustration slug (subset; API search fills gaps)
# search-term substring → undraw newSlug (full id from undraw.co/illustration/…)
UNDRAW_SLUG_HINTS: dict[str, str] = {
    "lineage": "family_6gj8",
    "ancestry": "family_6gj8",
    "heritage": "family_6gj8",
    "timeline": "business-plan_zrf7",
    "whiteboard": "setup-wizard_45kx",
    "diagram": "business-plan_zrf7",
    "architecture": "business-plan_zrf7",
    "cloud": "business-plan_zrf7",
    "microservices": "team-assignment_lzot",
    "microservice": "team-assignment_lzot",
    "web design": "code-deployed_iwvu",
    "web-design": "code-deployed_iwvu",
    "web development": "code-deployed_iwvu",
    "software": "code-deployed_iwvu",
    "developer": "code-deployed_iwvu",
    "programming": "code-deployed_iwvu",
    "coding": "code-deployed_iwvu",
    "application development": "code-deployed_iwvu",
    "security": "setup-wizard_45kx",
    "devops": "setup-wizard_45kx",
    "api": "code-deployed_iwvu",
    "database": "setup-wizard_45kx",
    "mobile": "mobile-assistant_iifm",
    "ui": "mobile-assistant_iifm",
    "ux": "mobile-assistant_iifm",
    "design": "mobile-assistant_iifm",
    "landing": "business-plan_zrf7",
    "budget": "business-plan_zrf7",
    "checklist": "setup-wizard_45kx",
    "map": "walking-the-dog_cjob",
    "team": "team-assignment_lzot",
    "workshop": "team-assignment_lzot",
    "discovery": "setup-wizard_45kx",
    "testing": "setup-wizard_45kx",
    "workflow": "team-assignment_lzot",
    "ai": "setup-wizard_45kx",
    "machine learning": "setup-wizard_45kx",
    "startup": "business-plan_zrf7",
    "mvp": "business-plan_zrf7",
}


@dataclass
class DownloadResult:
    item_id: str
    public_path: str
    status: Literal["downloaded", "skipped", "failed"]
    source: str = ""
    message: str = ""
    manual_url: str = ""
    image_url: str = ""
    page_url: str = ""
    google_search_url: str = ""
    post_slug: str = ""
    post_title: str = ""
    section_heading: str = ""


class PostContext(NamedTuple):
    slug: str
    title: str
    categories: list[str]


@dataclass
class RunLog:
    started_at: str
    finished_at: str = ""
    manifest_path: str = ""
    dry_run: bool = False
    skip_existing: bool = False
    include_icons: bool = False
    licensed_apis: bool = False
    downloaded: list[DownloadResult] = field(default_factory=list)
    skipped: list[DownloadResult] = field(default_factory=list)
    failed: list[DownloadResult] = field(default_factory=list)
    manual_queue: list[dict[str, str]] = field(default_factory=list)


class RunLogger:
    """Structured stdout logging for each image download attempt."""

    def __init__(self, *, quiet: bool = False) -> None:
        self.quiet = quiet
        self._lock = threading.Lock()

    def _out(self, msg: str = "", *, err: bool = False) -> None:
        if self.quiet:
            return
        with self._lock:
            print(msg, file=sys.stderr if err else sys.stdout)

    @staticmethod
    def _short_url(url: str, max_len: int = 88) -> str:
        if len(url) <= max_len:
            return url
        return url[: max_len - 3] + "..."

    @staticmethod
    def _clean_heading(raw: str) -> str:
        return re.sub(r"^#+\s*", "", raw or "").strip()

    def separator(self) -> None:
        self._out("─" * 72)

    def item_header(
        self,
        idx: int,
        total: int,
        *,
        item_id: str,
        dest: Path,
        kind: Literal["section", "icon"],
        post_ctx: PostContext | None,
        entry: dict[str, Any],
    ) -> None:
        if self.quiet:
            self._out(f"[{idx}/{total}] {dest.name}")
            return
        self.separator()
        self._out(f"[{idx}/{total}] {item_id}")
        self._out(f"  File:     {dest.name}")
        if kind == "section" and post_ctx:
            self._out(f"  Post:     {post_ctx.title} ({post_ctx.slug})")
            heading = self._clean_heading(entry.get("sectionHeading", ""))
            if heading:
                self._out(f"  Section:  {heading}")
            keywords = entry.get("searchKeywords") or []
            if keywords:
                self._out(f"  Keywords: {', '.join(keywords[:4])}")
        elif kind == "icon":
            self._out(f"  Entity:   {entry.get('entityName', 'unknown')}")

    def strategy(self, label: str) -> None:
        self._out(f"  Strategy: {label}")

    def queries(self, google_queries: list[str]) -> None:
        if self.quiet or not google_queries:
            return
        self._out("  Queries:")
        for i, q in enumerate(google_queries, start=1):
            self._out(f"    {i}. {q}")

    def step(self, msg: str) -> None:
        self._out(f"  → {msg}")

    def detail(self, msg: str) -> None:
        self._out(f"      {msg}")

    def ok(self, msg: str) -> None:
        self._out(f"  ✓ {msg}")

    def skip(self, msg: str) -> None:
        self._out(f"  − {msg}")

    def fail(self, msg: str) -> None:
        self._out(f"  ✗ {msg}", err=True)

    def result_downloaded(self, result: DownloadResult) -> None:
        if self.quiet:
            line = result.page_url or result.image_url or result.message
            self._out(f"  ✓ {result.source}: {line}")
            return
        self.ok(result.source)
        if result.message:
            self._out(f"    Query:  {result.message}")
        if result.page_url:
            self._out(f"    Page:   {self._short_url(result.page_url)}")
        if result.image_url:
            self._out(f"    Image:  {self._short_url(result.image_url)}")

    def summary_footer(
        self,
        *,
        downloaded: int,
        skipped: int,
        failed: int,
        log_path: Path,
        attributions_json: Path | None = None,
        attributions_md: Path | None = None,
        manual_count: int = 0,
    ) -> None:
        if not self.quiet:
            self.separator()
        self._out(
            f"\nDone. downloaded={downloaded} skipped={skipped} failed={failed}"
        )
        self._out(f"Log: {log_path}")
        if attributions_json:
            self._out(f"Attributions: {attributions_json}")
        if attributions_md:
            self._out(f"Attributions MD: {attributions_md}")
        if manual_count:
            self._out(f"Manual queue: {manual_count} item(s) in log file")


def load_env(env_path: Path) -> None:
    if env_path.is_file():
        load_dotenv(env_path, override=False)
    else:
        load_dotenv(DEFAULT_ENV_PATH, override=False)


def public_path_to_disk(public_path: str) -> Path:
    """Map /images/blog/foo.webp → public/images/blog/foo.webp"""
    rel = public_path.lstrip("/")
    return PUBLIC_DIR / rel


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def load_manifest(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def build_query(keywords: list[str]) -> str:
    """Prefer first 2–3 keywords; strip slug noise."""
    parts: list[str] = []
    for kw in keywords:
        cleaned = re.sub(r"^summary:\s*", "", kw, flags=re.I).strip()
        if cleaned and cleaned not in parts:
            parts.append(cleaned)
    return " ".join(parts[:3]) if parts else "technology workspace"


def is_cultural_post(ctx: PostContext) -> bool:
    blob = f"{ctx.slug} {ctx.title} {' '.join(ctx.categories)}".lower()
    return any(marker in blob for marker in CULTURAL_POST_MARKERS)


def _dedupe_queries(queries: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for q in queries:
        key = q.strip().lower()
        if key and key not in seen:
            seen.add(key)
            out.append(q.strip())
    return out


def build_google_queries(entry: dict[str, Any], ctx: PostContext) -> list[str]:
    """
    Build one or more Google Images queries with post context so cultural sections
    do not resolve to generic stock (e.g. phones for "Thembu lineage").
    """
    heading = re.sub(r"^#+\s*", "", entry.get("sectionHeading", "") or "").strip()
    heading = re.sub(r"^summary:\s*", "", heading, flags=re.I).strip()
    keywords = entry.get("searchKeywords", [])
    slug_l = ctx.slug.lower()
    queries: list[str] = []

    if is_cultural_post(ctx):
        if "abathemubu" in slug_l or "thembu" in slug_l:
            queries.extend(
                [
                    "AbaThembu Thembu people South Africa Eastern Cape",
                    "Thembu kingdom Xhosa South Africa landscape",
                    "African tribal heritage Eastern Cape South Africa",
                ]
            )
        if "xhosa" in slug_l:
            queries.append(f"Xhosa culture South Africa {heading or ctx.title}")
        if "bulhoek" in slug_l:
            queries.append("Bulhoek massacre South Africa 1921 history")
        if "ntsikana" in slug_l:
            queries.append("Ntsikana Xhosa prophet South Africa history")
        if heading:
            queries.append(f"{heading} South Africa African heritage")
        queries.append(f"{ctx.title.replace('-', ' ')} South Africa Africa")
    else:
        base = build_query(keywords)
        queries.append(base)
        if heading and heading.lower() not in base.lower():
            queries.append(f"{heading} {ctx.title}")

    if not queries:
        queries.append(build_query(keywords) or ctx.slug.replace("-", " "))

    return _dedupe_queries(queries)


def page_url_from_image_url(image_url: str) -> str:
    """Fallback when Google imgres has no imgrefurl: use the image host root."""
    parsed = urlparse(image_url)
    if parsed.scheme and parsed.netloc:
        return f"{parsed.scheme}://{parsed.netloc}/"
    return image_url


def google_search_url_for_query(query: str) -> str:
    return f"https://www.google.com/search?tbm=isch&q={quote(query)}"


def url_passes_relevance(url: str, ctx: PostContext, *, alt_text: str = "") -> bool:
    lower = f"{url} {alt_text}".lower()
    if is_cultural_post(ctx) and any(bad in lower for bad in IRRELEVANT_URL_FOR_CULTURE):
        return False
    return True


def decode_data_uri(src: str) -> tuple[bytes | None, str]:
    """Decode data:image/...;base64,... to bytes and mime subtype (jpeg, webp, ...)."""
    match = re.match(r"data:image/([\w+.-]+);base64,(.+)", src.strip(), re.I | re.DOTALL)
    if not match:
        return None, ""
    try:
        return base64.b64decode(match.group(2), validate=False), match.group(1).lower()
    except Exception:  # noqa: BLE001
        return None, ""


def candidate_passes_relevance(candidate: dict[str, Any], ctx: PostContext) -> bool:
    return url_passes_relevance(
        candidate.get("imageUrl", ""),
        ctx,
        alt_text=candidate.get("altText", ""),
    )


def save_as_webp(source_bytes: bytes, dest: Path, is_svg: bool = False) -> None:
    """Convert downloaded bytes to WebP at dest."""
    ensure_parent(dest)
    if is_svg:
        if cairosvg is None:
            raise RuntimeError("cairosvg required for SVG→WebP (pip install cairosvg)")
        png_bytes = cairosvg.svg2png(bytestring=source_bytes, output_width=1200)
        img = Image.open(__import__("io").BytesIO(png_bytes)).convert("RGB")
    else:
        from io import BytesIO

        img = Image.open(BytesIO(source_bytes))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

    # Icons: smaller max dimension
    max_side = 512 if "/icons/" in str(dest) else 1600
    img.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

    if dest.suffix.lower() == ".webp":
        save_kwargs: dict[str, Any] = {"format": "WEBP", "quality": 85, "method": 6}
        if img.mode == "RGBA":
            save_kwargs["lossless"] = False
        img.save(dest, **save_kwargs)
    else:
        img.save(dest, format="WEBP", quality=85, method=6)


class PexelsClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers["Authorization"] = api_key

    def get_photo(self, photo_id: str) -> dict[str, Any] | None:
        url = f"https://api.pexels.com/v1/photos/{photo_id}"
        r = self.session.get(url, timeout=REQUEST_TIMEOUT)
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()

    def get_photo_url(self, photo_id: str) -> str | None:
        data = self.get_photo(photo_id)
        if not data:
            return None
        src = data.get("src") or {}
        return src.get("large2x") or src.get("large") or src.get("original")

    def search(self, query: str) -> tuple[str, str] | None:
        params = {
            "query": query,
            "per_page": 5,
            "orientation": "landscape",
            "size": "large",
        }
        r = self.session.get(
            "https://api.pexels.com/v1/search", params=params, timeout=REQUEST_TIMEOUT
        )
        if r.status_code == 429:
            time.sleep(5)
            r = self.session.get(
                "https://api.pexels.com/v1/search", params=params, timeout=REQUEST_TIMEOUT
            )
        r.raise_for_status()
        photos = r.json().get("photos") or []
        if not photos:
            return None
        chosen = photos[0]
        for photo in photos:
            if photo.get("width", 0) >= MIN_WIDTH_PX:
                chosen = photo
                break
        src = chosen.get("src") or {}
        download_url = src.get("large2x") or src.get("large") or src.get("original")
        page_url = chosen.get("url") or f"https://www.pexels.com/search/{quote(query)}/"
        if not download_url:
            return None
        return download_url, page_url


class UnsplashClient:
    def __init__(self, access_key: str) -> None:
        self.access_key = access_key
        self.session = requests.Session()
        self.session.headers["Accept-Version"] = "v1"
        self.session.headers["Authorization"] = f"Client-ID {access_key}"

    def search(self, query: str) -> tuple[str, str] | None:
        params = {"query": query, "per_page": 5, "orientation": "landscape"}
        r = self.session.get(
            "https://api.unsplash.com/search/photos",
            params=params,
            timeout=REQUEST_TIMEOUT,
        )
        if r.status_code in (401, 403):
            return None
        r.raise_for_status()
        results = r.json().get("results") or []
        if not results:
            return None
        photo = results[0]
        urls = photo.get("urls") or {}
        raw = urls.get("raw")
        download_url = (
            f"{raw}&w=1200&fit=max&q=85"
            if raw
            else urls.get("regular") or urls.get("small")
        )
        page_url = photo.get("links", {}).get("html") or "https://unsplash.com"
        if not download_url:
            return None
        return download_url, page_url


# Curated undraw newSlug values (from undraw.co/illustration/… pages)
UNDRAW_KNOWN_SLUGS: dict[str, str] = {
    "family": "family_6gj8",
    "lineage": "family_6gj8",
    "ancestry": "family_6gj8",
    "genealogy": "family_6gj8",
    "heritage": "family_6gj8",
    "culture": "family_6gj8",
    "team": "team-assignment_lzot",
    "timeline": "business-plan_zrf7",
    "whiteboard": "setup-wizard_45kx",
    "developer": "code-deployed_iwvu",
    "programming": "code-deployed_iwvu",
    "laptop": "mobile-assistant_iifm",
    "mobile": "mobile-assistant_iifm",
    "security": "setup-wizard_45kx",
    "architecture": "business-plan_zrf7",
    "diagram": "business-plan_zrf7",
    "budget": "business-plan_zrf7",
    "checklist": "setup-wizard_45kx",
    "workshop": "team-assignment_lzot",
    "discovery": "setup-wizard_45kx",
    "testing": "setup-wizard_45kx",
    "landing": "business-plan_zrf7",
    "map": "walking-the-dog_cjob",
}


class UndrawClient:
    """Fetch SVG from undraw.co via Next.js page data + cdn.undraw.co."""

    def __init__(self, color: str = UNDRAW_COLOR) -> None:
        self.color = color.lstrip("#")
        self._catalog: list[dict[str, Any]] | None = None

    def _load_catalog(self) -> list[dict[str, Any]]:
        if self._catalog is not None:
            return self._catalog
        r = requests.get("https://undraw.co/illustrations", timeout=REQUEST_TIMEOUT)
        r.raise_for_status()
        match = re.search(
            r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text, re.S
        )
        if not match:
            self._catalog = []
            return self._catalog
        data = json.loads(match.group(1))
        self._catalog = data.get("props", {}).get("pageProps", {}).get("illustrations") or []
        return self._catalog

    def _resolve_new_slug(self, query: str) -> str | None:
        q = query.lower()
        for hint, new_slug in sorted(
            UNDRAW_SLUG_HINTS.items(), key=lambda x: len(x[0]), reverse=True
        ):
            if hint in q:
                return new_slug
        for hint, slug in UNDRAW_KNOWN_SLUGS.items():
            if hint in q:
                return slug
        words = [w for w in re.findall(r"[a-z]{4,}", q) if w not in ("blog", "image", "section", "abathemubu")]
        best_slug: str | None = None
        best_score = 0
        for item in self._load_catalog():
            title = (item.get("title") or "").lower()
            new_slug = item.get("newSlug") or ""
            score = sum(1 for w in words if w in title or w in new_slug.replace("-", " "))
            if score > best_score:
                best_score = score
                best_slug = new_slug
        return best_slug

    def _fetch_media_url(self, new_slug: str) -> str | None:
        page_url = f"https://undraw.co/illustration/{new_slug}"
        r = requests.get(page_url, timeout=REQUEST_TIMEOUT)
        if not r.ok:
            return None
        match = re.search(
            r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text, re.S
        )
        if not match:
            return None
        data = json.loads(match.group(1))
        ill = data.get("props", {}).get("pageProps", {}).get("illustration") or {}
        return ill.get("media")

    def _tint_svg(self, svg_text: str) -> str:
        """Replace default undraw purple with brand gold."""
        replacements = ("#6c63ff", "#6C63FF", "#7b6df6", "#7B6DF6")
        tinted = svg_text
        for old in replacements:
            tinted = tinted.replace(old, f"#{self.color}")
        return tinted

    def download_svg(self, query: str) -> bytes | None:
        new_slug = self._resolve_new_slug(query)
        if not new_slug:
            return None
        media_url = self._fetch_media_url(new_slug)
        if not media_url:
            return None
        r = requests.get(media_url, timeout=REQUEST_TIMEOUT)
        if not r.ok:
            return None
        return self._tint_svg(r.text).encode("utf-8")


def download_bytes(url: str) -> bytes:
    r = requests.get(url, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "qwabi-blog-image-bot/1.0"})
    r.raise_for_status()
    return r.content


class GoogleImageSearch:
    """Selenium helper for Google Images (default source for section images)."""

    def __init__(self, *, headless: bool = True) -> None:
        if not SELENIUM_AVAILABLE:
            raise RuntimeError(
                "selenium is not installed. Run: pip install selenium"
            )
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument(
            "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(2)
        self._wait = WebDriverWait(self.driver, 12)
        self._last_google_fetch_hint = ""

    def quit(self) -> None:
        if self.driver:
            self.driver.quit()
            self.driver = None  # type: ignore[assignment]

    def __enter__(self) -> GoogleImageSearch:
        return self

    def __exit__(self, *args: object) -> None:
        self.quit()

    def _dismiss_consent_if_present(self) -> None:
        """Best-effort cookie/consent dismiss (Google UI varies by region)."""
        for xpath in (
            "//button[contains(., 'Accept all')]",
            "//button[contains(., 'Accept All')]",
            "//button[contains(., 'Reject all')]",
            "//button[contains(., 'Reject All')]",
            "//button[contains(., 'I agree')]",
            "//div[@role='button' and contains(., 'Accept')]",
            "//div[@role='button' and contains(., 'Reject')]",
        ):
            try:
                btn = self.driver.find_element(By.XPATH, xpath)
                btn.click()
                time.sleep(0.8)
                return
            except Exception:  # noqa: BLE001
                continue

    def fetch_links_by_search(self, search_query: str) -> list[str]:
        """
        Return raw href values for image result links (/imgres).
        Kept for compatibility with the original snippet; prefer fetch_image_urls().
        """
        return [
            c.get("googleResultHref", "")
            for c in self.fetch_image_candidates(search_query)
            if c.get("googleResultHref")
        ]

    def fetch_image_candidates(
        self, search_query: str, *, max_results: int = 8
    ) -> list[dict[str, str]]:
        """
        Search Google Images; return imageUrl + pageUrl (imgrefurl) from /imgres links.
        """
        with _google_search_lock:
            return self._fetch_image_candidates_after_nav(
                search_query, max_results=max_results
            )

    def fetch_image_urls(self, search_query: str, *, max_results: int = 8) -> list[str]:
        """Direct image URLs only (compat). Prefer fetch_image_candidates()."""
        return [
            c["imageUrl"]
            for c in self.fetch_image_candidates(search_query, max_results=max_results)
        ]

    def _fetch_image_candidates_after_nav(
        self, search_query: str, *, max_results: int
    ) -> list[dict[str, str]]:
        search_url = (
            f"https://www.google.com/search?q={quote(search_query)}&tbm=isch&hl=en"
        )
        self.driver.get(search_url)
        self._dismiss_consent_if_present()
        self._wait_for_image_grid()

        for _ in range(GOOGLE_SCROLL_PASSES):
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);"
            )
            time.sleep(0.7)

        hrefs: list[str] = []
        for link in self.driver.find_elements(
            By.XPATH, "//a[contains(@href, '/imgres')]"
        ):
            href = link.get_attribute("href")
            if href and href not in hrefs:
                hrefs.append(href)

        page_html = self.driver.page_source
        candidates = self._candidates_from_imgres_hrefs(hrefs, max_results=max_results)
        if len(candidates) < max_results:
            embedded = self._candidates_from_page_source(
                page_html, max_results=max_results
            )
            seen = {c["imageUrl"] for c in candidates}
            for item in embedded:
                if item["imageUrl"] in seen:
                    continue
                seen.add(item["imageUrl"])
                candidates.append(item)
                if len(candidates) >= max_results:
                    break
        if len(candidates) < max_results:
            data_uri_candidates = self._candidates_from_data_uri_images(
                search_query, max_results=max_results
            )
            seen_urls = {c["imageUrl"] for c in candidates}
            seen_hashes = {
                c.get("contentHash", "") for c in candidates if c.get("contentHash")
            }
            for item in data_uri_candidates:
                ch = item.get("contentHash", "")
                if ch and ch in seen_hashes:
                    continue
                if item["imageUrl"] in seen_urls:
                    continue
                if ch:
                    seen_hashes.add(ch)
                seen_urls.add(item["imageUrl"])
                candidates.append(item)
                if len(candidates) >= max_results:
                    break
        if not candidates:
            self._last_google_fetch_hint = self._diagnose_empty_google_results(
                page_html
            )
        else:
            self._last_google_fetch_hint = ""
        return candidates[:max_results]

    def _diagnose_empty_google_results(self, page_html: str) -> str:
        """Explain why Google returned no parseable image URLs."""
        if self._page_is_google_bot_block():
            return (
                "Google bot check page. Try --google-headed, --workers 1, "
                "or wait and retry."
            )
        head = page_html[:8000].lower()
        if "before you continue" in head or "consent.google" in self.driver.current_url:
            return "Google consent wall still visible; could not dismiss cookies."
        data_uri_n = len(re.findall(r"data:image/[^;]+;base64,", page_html))
        imgres_n = len(re.findall(r"/imgres", page_html))
        imgurl_n = len(_IMGURL_PARAM_RE.findall(page_html))
        ou_n = len(_OU_JSON_RE.findall(page_html))
        return (
            f"No usable candidates (data-uri={data_uri_n}, imgres={imgres_n}, "
            f"imgurl params={imgurl_n}, ou JSON={ou_n}). "
            "Thumbnails may be too small after decode."
        )

    def _page_is_google_bot_block(self) -> bool:
        url = (self.driver.current_url or "").lower()
        if "google.com/sorry" in url or "/sorry/index" in url:
            return True
        title = (self.driver.title or "").lower()
        if title in ("sorry...", "sorry") or title.startswith("sorry"):
            return True
        head = (self.driver.page_source or "")[:6000].lower()
        return (
            "unusual traffic from your computer network" in head
            or "our systems have detected unusual traffic" in head
        )

    def _wait_for_image_grid(self) -> None:
        """Wait for any sign the image grid loaded (imgres anchors are often absent)."""
        locators = (
            (By.XPATH, "//a[contains(@href, '/imgres')]"),
            (By.CSS_SELECTOR, "div#islrg, div.islrc, div[data-id]"),
            (By.XPATH, "//img[contains(@src, 'gstatic.com')]"),
            (By.CSS_SELECTOR, "img[src^='data:image']"),
        )
        for by, selector in locators:
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((by, selector))
                )
                return
            except Exception:  # noqa: BLE001
                continue
        time.sleep(2)

    def _candidates_from_imgres_hrefs(
        self, hrefs: list[str], *, max_results: int
    ) -> list[dict[str, str]]:
        candidates: list[dict[str, str]] = []
        seen: set[str] = set()
        for href in hrefs:
            parsed = self._parse_imgres_href(href)
            image_url = parsed.get("imageUrl", "")
            if not image_url or not self._is_usable_image_url(image_url):
                continue
            if image_url in seen:
                continue
            seen.add(image_url)
            page_url = parsed.get("pageUrl") or page_url_from_image_url(image_url)
            candidates.append(
                {
                    "imageUrl": image_url,
                    "pageUrl": page_url,
                    "googleResultHref": href,
                }
            )
            if len(candidates) >= max_results:
                break
        return candidates

    @staticmethod
    def _is_usable_image_url(url: str) -> bool:
        lower = url.lower()
        if not lower.startswith("http"):
            return False
        if "google.com/images/branding" in lower:
            return False
        if "gstatic.com" in lower and "encrypted-tbn" in lower:
            return False
        if lower.endswith(".svg") or "/favicon" in lower:
            return False
        return True

    @classmethod
    def _candidates_from_page_source(
        cls, html: str, *, max_results: int
    ) -> list[dict[str, str]]:
        """Parse imgurl/imgrefurl from embedded imgres URLs and JSON blobs."""
        candidates: list[dict[str, str]] = []
        seen: set[str] = set()

        for match in _IMGRES_URL_IN_HTML_RE.finditer(html):
            href = unquote(match.group(0).replace("\\u003d", "=").replace("\\u0026", "&"))
            parsed = cls._parse_imgres_href(href)
            image_url = parsed.get("imageUrl", "")
            if not image_url or not cls._is_usable_image_url(image_url):
                continue
            if image_url in seen:
                continue
            seen.add(image_url)
            candidates.append(
                {
                    "imageUrl": image_url,
                    "pageUrl": parsed.get("pageUrl")
                    or page_url_from_image_url(image_url),
                    "googleResultHref": href,
                }
            )
            if len(candidates) >= max_results:
                return candidates

        for match in _IMGURL_PARAM_RE.finditer(html):
            image_url = unquote(match.group(1).replace("\\/", "/"))
            if not cls._is_usable_image_url(image_url) or image_url in seen:
                continue
            seen.add(image_url)
            candidates.append(
                {
                    "imageUrl": image_url,
                    "pageUrl": page_url_from_image_url(image_url),
                    "googleResultHref": "",
                }
            )
            if len(candidates) >= max_results:
                return candidates

        for match in _OU_JSON_RE.finditer(html):
            image_url = match.group(1).replace("\\/", "/")
            if not cls._is_usable_image_url(image_url) or image_url in seen:
                continue
            seen.add(image_url)
            candidates.append(
                {
                    "imageUrl": image_url,
                    "pageUrl": page_url_from_image_url(image_url),
                    "googleResultHref": "",
                }
            )
            if len(candidates) >= max_results:
                break

        return candidates

    def _candidates_from_data_uri_images(
        self, search_query: str, *, max_results: int
    ) -> list[dict[str, str]]:
        """
        Google often serves grid thumbnails as data:image/...;base64 in <img src>.
        Click a thumbnail to try to surface a larger preview, then decode bytes.
        """
        candidates: list[dict[str, str]] = []
        seen_hashes: set[str] = set()
        page_url = google_search_url_for_query(search_query)
        thumbs = self.driver.find_elements(By.CSS_SELECTOR, "img[src^='data:image']")

        for thumb in thumbs:
            if len(candidates) >= max_results:
                break
            src = (thumb.get_attribute("src") or "").strip()
            if len(src) < 80:
                continue
            thumb_bytes, _mime = decode_data_uri(src)
            if not thumb_bytes or len(thumb_bytes) < 2500:
                continue

            image_bytes, alt_text, source_note = self._try_larger_image_after_click(
                thumb, thumb_bytes
            )
            if not image_bytes:
                continue

            content_hash = hashlib.sha256(image_bytes).hexdigest()[:20]
            if content_hash in seen_hashes:
                continue
            seen_hashes.add(content_hash)

            candidates.append(
                {
                    "imageUrl": f"inline:data-uri:{content_hash}",
                    "pageUrl": page_url,
                    "googleResultHref": "",
                    "inlineImageBytes": image_bytes,
                    "altText": alt_text,
                    "contentHash": content_hash,
                    "sourceNote": source_note,
                }
            )

        return candidates

    def _try_larger_image_after_click(
        self, thumb_el: Any, thumb_bytes: bytes
    ) -> tuple[bytes | None, str, str]:
        """Click grid thumb; return best image bytes, alt text, and source label."""
        alt_text = (thumb_el.get_attribute("alt") or "").strip()
        best_bytes = thumb_bytes
        source_note = "google-data-uri-thumbnail"

        try:
            self.driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
                thumb_el,
            )
            time.sleep(0.25)
            thumb_el.click()
            time.sleep(1.1)
            preview = self.driver.execute_script(
                """
                const imgs = [...document.querySelectorAll('img')];
                let best = null;
                for (const el of imgs) {
                  const w = el.naturalWidth || 0;
                  const h = el.naturalHeight || 0;
                  if (w < 180 || h < 180) continue;
                  const src = el.currentSrc || el.src || '';
                  if (!src) continue;
                  if (!best || w * h > best.area) {
                    best = { src, w, h, area: w * h, alt: el.alt || '' };
                  }
                }
                return best;
                """
            )
            if preview and preview.get("src"):
                src = preview["src"]
                if src.startswith("http") and self._is_usable_image_url(src):
                    try:
                        data = download_bytes(src)
                        if len(data) > len(best_bytes):
                            return data, preview.get("alt") or alt_text, "google-preview-http"
                    except Exception:  # noqa: BLE001
                        pass
                if src.startswith("data:image"):
                    data, _mime = decode_data_uri(src)
                    if data and len(data) > len(best_bytes):
                        return (
                            data,
                            preview.get("alt") or alt_text,
                            "google-preview-data-uri",
                        )
        except Exception:  # noqa: BLE001
            pass

        return best_bytes, alt_text, source_note

    @staticmethod
    def _parse_imgres_href(href: str) -> dict[str, str]:
        parsed = urlparse(href)
        if "/imgres" not in parsed.path:
            return {}
        qs = parse_qs(parsed.query)
        image_raw = qs.get("imgurl", [None])[0]
        page_raw = qs.get("imgrefurl", [None])[0]
        out: dict[str, str] = {}
        if image_raw:
            out["imageUrl"] = unquote(image_raw)
        if page_raw:
            out["pageUrl"] = unquote(page_raw)
        return out

    @staticmethod
    def _imgres_href_to_image_url(href: str) -> str | None:
        return GoogleImageSearch._parse_imgres_href(href).get("imageUrl")

    def download_first_usable(
        self,
        search_queries: list[str],
        dest: Path,
        ctx: PostContext,
        *,
        max_urls_per_query: int = 12,
        run_log: RunLogger | None = None,
    ) -> tuple[str | None, str | None, str]:
        """
        Try each query, then each candidate until one saves as WebP.
        Returns (image_url, page_url, last_error_or_used_query).
        """
        last_error = "no results"
        total_q = len(search_queries)
        for q_idx, search_query in enumerate(search_queries, start=1):
            if run_log:
                run_log.step(f'Google query {q_idx}/{total_q}: "{search_query}"')
            candidates = self.fetch_image_candidates(
                search_query, max_results=max_urls_per_query
            )
            if not candidates:
                last_error = f"no URLs for {search_query!r}"
                if run_log:
                    run_log.detail("No image URLs parsed from results")
                    hint = getattr(self, "_last_google_fetch_hint", "")
                    if hint:
                        run_log.detail(hint)
                continue
            if run_log:
                inline_n = sum(
                    1 for c in candidates if c.get("inlineImageBytes")
                )
                if inline_n:
                    run_log.detail(
                        f"Found {len(candidates)} candidate(s) "
                        f"({inline_n} from Google data-uri thumbnails)"
                    )
                else:
                    run_log.detail(f"Found {len(candidates)} candidate URL(s)")
            for c_idx, candidate in enumerate(candidates, start=1):
                url = candidate["imageUrl"]
                page_url = candidate.get("pageUrl") or page_url_from_image_url(url)
                if not candidate_passes_relevance(candidate, ctx):
                    last_error = f"filtered irrelevant URL for {search_query!r}"
                    if run_log:
                        run_log.detail(
                            f"Try {c_idx}/{len(candidates)}: skipped (relevance filter)"
                        )
                    continue
                inline_bytes = candidate.get("inlineImageBytes")
                if run_log:
                    if inline_bytes:
                        note = candidate.get("sourceNote", "data-uri")
                        run_log.detail(
                            f"Try {c_idx}/{len(candidates)}: decoding Google {note} "
                            f"({len(inline_bytes) // 1024} KB)"
                        )
                    else:
                        run_log.detail(
                            f"Try {c_idx}/{len(candidates)}: downloading "
                            f"{RunLogger._short_url(url, 64)}"
                        )
                try:
                    data = inline_bytes if inline_bytes else download_bytes(url)
                    save_as_webp(data, dest)
                    with Image.open(dest) as img:
                        if img.width < MIN_WIDTH_PX and "/icons/" not in str(dest):
                            dest.unlink(missing_ok=True)
                            last_error = f"too small ({img.width}px) for {search_query!r}"
                            if run_log:
                                run_log.detail(
                                    f"Try {c_idx}/{len(candidates)}: too small "
                                    f"({img.width}px wide, need {MIN_WIDTH_PX}px)"
                                )
                            continue
                    if run_log:
                        run_log.detail(
                            f"Try {c_idx}/{len(candidates)}: saved WebP "
                            f"{img.width}×{img.height}px"
                        )
                    stored_url = page_url if url.startswith("inline:data-uri:") else url
                    return stored_url, page_url, search_query
                except Exception as exc:  # noqa: BLE001
                    last_error = f"{search_query!r}: {exc}"
                    if run_log:
                        run_log.detail(f"Try {c_idx}/{len(candidates)}: failed ({exc})")
                    if dest.is_file():
                        dest.unlink(missing_ok=True)
                    continue
        if run_log:
            run_log.detail(f"All queries exhausted ({last_error})")
        return None, None, last_error


def _thread_google(headless: bool) -> GoogleImageSearch:
    """One Chrome driver per worker thread (Selenium is not thread-safe)."""
    google = getattr(_thread_local, "google", None)
    if google is None:
        google = GoogleImageSearch(headless=headless)
        _thread_local.google = google
        with _drivers_lock:
            _active_google_drivers.append(google)
    return google


def shutdown_all_google_drivers() -> None:
    with _drivers_lock:
        drivers = list(_active_google_drivers)
        _active_google_drivers.clear()
    for driver in drivers:
        try:
            driver.quit()
        except Exception:  # noqa: BLE001
            pass
    _thread_local.google = None


@dataclass(frozen=True)
class WorkerConfig:
    dry_run: bool
    skip_existing: bool
    licensed_apis: bool
    google_headed: bool
    pexels_key: str
    unsplash_key: str
    delay_sec: float


@dataclass
class JobResult:
    idx: int
    total: int
    item_id: str
    entry: dict[str, Any]
    post_ctx: PostContext | None
    kind: Literal["section", "icon"]
    result: DownloadResult
    manual_queue: dict[str, str] | None = None


def process_job(
    idx: int,
    total: int,
    item_id: str,
    entry: dict[str, Any],
    post_ctx: PostContext | None,
    kind: Literal["section", "icon"],
    *,
    cfg: WorkerConfig,
    run_log: RunLogger,
) -> JobResult:
    public_path = entry.get("publicPath", "")
    dest = public_path_to_disk(public_path)
    run_log.item_header(
        idx,
        total,
        item_id=item_id,
        dest=dest,
        kind=kind,
        post_ctx=post_ctx,
        entry=entry,
    )

    pexels = PexelsClient(cfg.pexels_key) if cfg.pexels_key and cfg.licensed_apis else None
    unsplash = (
        UnsplashClient(cfg.unsplash_key)
        if cfg.unsplash_key and cfg.licensed_apis
        else None
    )
    google: GoogleImageSearch | None = None
    if kind == "section" and not cfg.dry_run:
        google = _thread_google(headless=not cfg.google_headed)

    try:
        if kind == "section":
            assert post_ctx is not None
            result = process_section(
                item_id,
                entry,
                dest,
                post_ctx,
                dry_run=cfg.dry_run,
                skip_existing=cfg.skip_existing,
                pexels=pexels,
                unsplash=unsplash,
                google=google,
                licensed_apis=cfg.licensed_apis,
                run_log=run_log,
            )
            if result.status == "downloaded":
                enrich_section_result(result, post_ctx, entry)
        else:
            result = process_icon(
                item_id,
                entry,
                dest,
                dry_run=cfg.dry_run,
                skip_existing=cfg.skip_existing,
                run_log=run_log,
            )
    except Exception as exc:  # noqa: BLE001
        result = DownloadResult(
            item_id=item_id,
            public_path=public_path,
            status="failed",
            source="none",
            message=str(exc),
        )
        run_log.fail(str(exc))

    manual_queue: dict[str, str] | None = None
    if result.status == "failed" and result.manual_url:
        manual_queue = {
            "item_id": item_id,
            "public_path": public_path,
            "manual_url": result.manual_url,
            "query": (
                build_google_queries(entry, post_ctx)[0]
                if kind == "section" and post_ctx
                else entry.get("entityName", "")
            ),
        }

    if result.status == "downloaded":
        run_log.result_downloaded(result)
    elif result.status == "skipped" and run_log.quiet:
        run_log.skip(result.message)
    elif result.status == "failed" and run_log.quiet:
        run_log.fail(result.message)

    if cfg.delay_sec > 0 and not cfg.dry_run:
        time.sleep(cfg.delay_sec)

    return JobResult(
        idx=idx,
        total=total,
        item_id=item_id,
        entry=entry,
        post_ctx=post_ctx,
        kind=kind,
        result=result,
        manual_queue=manual_queue,
    )


def simple_icons_url(entity_name: str) -> str | None:
    slug = ENTITY_SIMPLE_ICON_SLUG.get(entity_name)
    if not slug:
        # Guess: lowercase, no spaces
        slug = re.sub(r"[^a-z0-9]", "", entity_name.lower())
    return f"https://cdn.simpleicons.org/{quote(slug)}/{SIMPLE_ICONS_COLOR}"


def iter_section_tasks(
    manifest: dict[str, Any],
    *,
    slug_filter: str | None,
    statuses: set[str],
) -> list[tuple[str, dict[str, Any], PostContext]]:
    tasks: list[tuple[str, dict[str, Any], PostContext]] = []
    for post in manifest.get("posts", []):
        if slug_filter and post.get("slug") != slug_filter:
            continue
        post_slug = post.get("slug", "unknown")
        ctx = PostContext(
            slug=post_slug,
            title=post.get("title", post_slug),
            categories=list(post.get("categories") or []),
        )
        for section in post.get("sectionImages", []):
            if section.get("status") in statuses:
                item_id = f"{post_slug}:{section.get('suggestedFilename', 'section')}"
                tasks.append((item_id, section, ctx))
    return tasks


def iter_icon_tasks(
    manifest: dict[str, Any],
    *,
    slug_filter: str | None,
    statuses: set[str],
) -> list[tuple[str, dict[str, Any]]]:
    tasks: list[tuple[str, dict[str, Any]]] = []
    seen_filenames: set[str] = set()
    for post in manifest.get("posts", []):
        if slug_filter and post.get("slug") != slug_filter:
            continue
        post_slug = post.get("slug", "unknown")
        for icon in post.get("entityIcons", []):
            if icon.get("status") not in statuses:
                continue
            fn = icon.get("suggestedFilename", "")
            if fn in seen_filenames:
                continue
            seen_filenames.add(fn)
            item_id = f"icon:{fn}"
            tasks.append((item_id, icon))
    return tasks


def _download_via_licensed_apis(
    item_id: str,
    entry: dict[str, Any],
    dest: Path,
    query: str,
    *,
    pexels: PexelsClient | None,
    unsplash: UnsplashClient | None,
    run_log: RunLogger | None = None,
) -> DownloadResult | None:
    """Pexels → Unsplash. Returns None if all fail."""
    pexels_id = entry.get("pexelsId")
    if pexels_id and pexels:
        if run_log:
            run_log.step(f"Pexels photo id {pexels_id}")
        try:
            photo = pexels.get_photo(str(pexels_id))
            if photo:
                src = photo.get("src") or {}
                url = src.get("large2x") or src.get("large") or src.get("original")
                page_url = photo.get("url") or f"https://www.pexels.com/photo/{pexels_id}/"
                if url:
                    data = download_bytes(url)
                    save_as_webp(data, dest)
                    if run_log:
                        run_log.detail("Pexels id lookup succeeded")
                    return DownloadResult(
                        item_id=item_id,
                        public_path=entry.get("publicPath", ""),
                        status="downloaded",
                        source="pexels-id",
                        message=f"photo {pexels_id}",
                        image_url=url,
                        page_url=page_url,
                    )
            if run_log:
                run_log.detail("Pexels id lookup returned no usable URL")
        except Exception as exc:  # noqa: BLE001
            if run_log:
                run_log.detail(f"Pexels id failed ({exc})")

    if pexels:
        if run_log:
            run_log.step(f'Pexels search: "{query}"')
        try:
            found = pexels.search(query)
            if found:
                url, page_url = found
                data = download_bytes(url)
                save_as_webp(data, dest)
                if run_log:
                    run_log.detail("Pexels search succeeded")
                return DownloadResult(
                    item_id=item_id,
                    public_path=entry.get("publicPath", ""),
                    status="downloaded",
                    source="pexels-search",
                    message=query,
                    image_url=url,
                    page_url=page_url,
                )
            if run_log:
                run_log.detail("Pexels search returned no results")
        except Exception as exc:  # noqa: BLE001
            if run_log:
                run_log.detail(f"Pexels search failed ({exc})")
    elif run_log:
        run_log.detail("Pexels skipped (no API key)")

    if unsplash:
        if run_log:
            run_log.step(f'Unsplash search: "{query}"')
        try:
            found = unsplash.search(query)
            if found:
                url, page_url = found
                data = download_bytes(url)
                save_as_webp(data, dest)
                if run_log:
                    run_log.detail("Unsplash search succeeded")
                return DownloadResult(
                    item_id=item_id,
                    public_path=entry.get("publicPath", ""),
                    status="downloaded",
                    source="unsplash",
                    message=query,
                    image_url=url,
                    page_url=page_url,
                )
            if run_log:
                run_log.detail("Unsplash search returned no results")
        except Exception as exc:  # noqa: BLE001
            if run_log:
                run_log.detail(f"Unsplash search failed ({exc})")
    elif run_log:
        run_log.detail("Unsplash skipped (no API key)")

    return None


def process_section(
    item_id: str,
    entry: dict[str, Any],
    dest: Path,
    ctx: PostContext,
    *,
    dry_run: bool,
    pexels: PexelsClient | None,
    unsplash: UnsplashClient | None,
    google: GoogleImageSearch | None,
    licensed_apis: bool = False,
    skip_existing: bool = False,
    run_log: RunLogger | None = None,
) -> DownloadResult:
    if dest.is_file() and skip_existing:
        if run_log:
            run_log.skip("existing file kept (--skip-existing)")
        return DownloadResult(
            item_id=item_id,
            public_path=entry.get("publicPath", ""),
            status="skipped",
            message="file already exists (--skip-existing)",
        )

    google_queries = build_google_queries(entry, ctx)
    if is_cultural_post(ctx) and run_log:
        run_log.detail("Cultural post: using South Africa / heritage photo queries")

    if dry_run:
        mode = "Pexels/Unsplash → Google Images" if licensed_apis else "Google Images"
        if run_log:
            run_log.strategy(mode + " (dry-run, no download)")
            run_log.queries(google_queries)
        return DownloadResult(
            item_id=item_id,
            public_path=entry.get("publicPath", ""),
            status="skipped",
            message=f"dry-run ({mode})",
        )

    last_google = "not attempted"

    if licensed_apis:
        if run_log:
            run_log.strategy("Pexels/Unsplash, then Google Images fallback")
            run_log.queries(google_queries)
        stock_query = build_query(entry.get("searchKeywords", []))
        result = _download_via_licensed_apis(
            item_id,
            entry,
            dest,
            stock_query,
            pexels=pexels,
            unsplash=unsplash,
            run_log=run_log,
        )
        if result:
            return enrich_section_result(result, ctx, entry)
        if google:
            if run_log:
                run_log.step("Licensed APIs failed, falling back to Google Images")
            try:
                winning_url, page_url, used_query = google.download_first_usable(
                    google_queries, dest, ctx, run_log=run_log
                )
                if winning_url:
                    return enrich_section_result(
                        DownloadResult(
                            item_id=item_id,
                            public_path=entry.get("publicPath", ""),
                            status="downloaded",
                            source="google-images",
                            message=used_query or "",
                            image_url=winning_url,
                            page_url=page_url or page_url_from_image_url(winning_url),
                        ),
                        ctx,
                        entry,
                        image_url=winning_url,
                        page_url=page_url or "",
                        search_query=used_query or "",
                    )
            except Exception as exc:  # noqa: BLE001
                last_google = str(exc)
            else:
                last_google = "no usable image URLs after licensed APIs failed"
        else:
            last_google = "Google disabled"

    else:
        if run_log:
            run_log.strategy("Google Images (Selenium)")
            run_log.queries(google_queries)
        if not google:
            if run_log:
                run_log.fail("Google Images unavailable (install selenium)")
            return DownloadResult(
                item_id=item_id,
                public_path=entry.get("publicPath", ""),
                status="failed",
                source="none",
                message="Google Images required (install selenium)",
            )
        try:
            winning_url, page_url, used_query = google.download_first_usable(
                google_queries, dest, ctx, run_log=run_log
            )
            if winning_url:
                return enrich_section_result(
                    DownloadResult(
                        item_id=item_id,
                        public_path=entry.get("publicPath", ""),
                        status="downloaded",
                        source="google-images",
                        message=used_query or "",
                        image_url=winning_url,
                        page_url=page_url or page_url_from_image_url(winning_url),
                    ),
                    ctx,
                    entry,
                    image_url=winning_url,
                    page_url=page_url or "",
                    search_query=used_query or "",
                )
        except Exception as exc:  # noqa: BLE001
            last_google = str(exc)
        else:
            last_google = "no usable image URLs after all queries"

    if run_log:
        run_log.fail(f"Google Images: {last_google}")
    manual_q = quote(google_queries[0] if google_queries else ctx.slug)
    return DownloadResult(
        item_id=item_id,
        public_path=entry.get("publicPath", ""),
        status="failed",
        source="none",
        message=f"Google: {last_google}",
        manual_url=f"https://www.google.com/search?tbm=isch&q={manual_q}",
    )


def process_icon(
    item_id: str,
    entry: dict[str, Any],
    dest: Path,
    *,
    dry_run: bool,
    skip_existing: bool,
    run_log: RunLogger | None = None,
) -> DownloadResult:
    if dest.is_file() and skip_existing:
        if run_log:
            run_log.skip("existing file kept (--skip-existing)")
        return DownloadResult(
            item_id=item_id,
            public_path=entry.get("publicPath", ""),
            status="skipped",
            message="file already exists (--skip-existing)",
        )

    entity = entry.get("entityName", "unknown")
    hint = entry.get("officialSourceHint", "")

    if dry_run:
        if run_log:
            run_log.strategy("Simple Icons CDN (dry-run)")
        return DownloadResult(
            item_id=item_id,
            public_path=entry.get("publicPath", ""),
            status="skipped",
            message=f"dry-run icon: {entity}",
        )

    url = simple_icons_url(entity)
    if url:
        if run_log:
            run_log.strategy("Simple Icons CDN")
            run_log.step(f"Downloading icon for {entity!r}")
            run_log.detail(RunLogger._short_url(url))
        try:
            data = download_bytes(url)
            # Simple Icons returns SVG
            save_as_webp(data, dest, is_svg=True)
            if run_log:
                run_log.detail("Saved WebP icon")
            return DownloadResult(
                item_id=item_id,
                public_path=entry.get("publicPath", ""),
                status="downloaded",
                source="simple-icons",
                message=entity,
                image_url=url,
                page_url=f"https://simpleicons.org/?q={quote(entity)}",
            )
        except Exception as exc:  # noqa: BLE001
            si_error = str(exc)
            if run_log:
                run_log.detail(f"Simple Icons failed ({exc})")
    else:
        si_error = "no slug mapping"
        if run_log:
            run_log.detail("No Simple Icons slug mapping for entity")

    manual = f"https://simpleicons.org/?q={quote(entity)}"
    if hint:
        manual += f" | official: {hint}"
    return DownloadResult(
        item_id=item_id,
        public_path=entry.get("publicPath", ""),
        status="failed",
        source="none",
        message=f"Simple Icons: {si_error}",
        manual_url=manual,
    )


def enrich_section_result(
    result: DownloadResult,
    ctx: PostContext,
    entry: dict[str, Any],
    *,
    image_url: str = "",
    page_url: str = "",
    search_query: str = "",
) -> DownloadResult:
    result.post_slug = ctx.slug
    result.post_title = ctx.title
    result.section_heading = (entry.get("sectionHeading") or "").strip()
    if image_url:
        result.image_url = image_url
    if page_url:
        result.page_url = page_url
    if search_query:
        result.google_search_url = google_search_url_for_query(search_query)
    return result


def load_attributions(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {"version": 1, "updated_at": "", "images": {}}
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    if "images" not in data:
        data["images"] = {}
    return data


def save_attributions(path: Path, store: dict[str, Any]) -> None:
    ensure_parent(path)
    store["updated_at"] = datetime.now(timezone.utc).isoformat()
    with path.open("w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)
        f.write("\n")


def record_attribution(store: dict[str, Any], result: DownloadResult) -> None:
    if result.status != "downloaded" or not result.public_path:
        return
    key = result.public_path.lstrip("/")
    store["images"][key] = {
        "publicPath": result.public_path,
        "postSlug": result.post_slug,
        "postTitle": result.post_title,
        "sectionHeading": result.section_heading,
        "source": result.source,
        "imageUrl": result.image_url,
        "pageUrl": result.page_url,
        "googleSearchUrl": result.google_search_url,
        "searchQuery": result.message,
        "downloadedAt": datetime.now(timezone.utc).isoformat(),
    }


def write_attributions_markdown(path: Path, store: dict[str, Any]) -> None:
    """Grouped by post slug — paste disclaimer + sources into each blog post."""
    images: dict[str, Any] = store.get("images") or {}
    if not images:
        return

    by_post: dict[str, list[dict[str, Any]]] = {}
    for row in images.values():
        slug = row.get("postSlug") or "_unknown"
        by_post.setdefault(slug, []).append(row)

    lines = [
        "# Blog image sources",
        "",
        "Generated by `download_blog_images.py`. Use the block below in posts that use these images.",
        "",
        "## Disclaimer (copy into post)",
        "",
        IMAGE_DISCLAIMER_BLOCK,
        "",
        "---",
        "",
    ]

    for slug in sorted(by_post.keys()):
        rows = sorted(
            by_post[slug],
            key=lambda r: (r.get("sectionHeading") or r.get("publicPath") or ""),
        )
        title = rows[0].get("postTitle") or slug
        lines.append(f"## {title}")
        lines.append("")
        lines.append(f"Slug: `{slug}`")
        lines.append("")
        for row in rows:
            heading = (row.get("sectionHeading") or "").lstrip("# ").strip()
            if heading:
                lines.append(f"### {heading}")
            else:
                lines.append(f"### `{row.get('publicPath', '')}`")
            lines.append("")
            lines.append(f"- **File:** `{row.get('publicPath', '')}`")
            lines.append(f"- **Source:** {row.get('source', '')}")
            if row.get("pageUrl"):
                lines.append(f"- **Original site:** {row['pageUrl']}")
            if row.get("imageUrl"):
                lines.append(f"- **Image URL:** {row['imageUrl']}")
            if row.get("googleSearchUrl"):
                lines.append(f"- **Google search:** {row['googleSearchUrl']}")
            if row.get("searchQuery"):
                lines.append(f"- **Query used:** {row['searchQuery']}")
            lines.append("")

    ensure_parent(path)
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_log(log: RunLog, log_path: Path) -> None:
    ensure_parent(log_path)
    payload = {
        "started_at": log.started_at,
        "finished_at": log.finished_at,
        "manifest_path": log.manifest_path,
        "dry_run": log.dry_run,
        "skip_existing": log.skip_existing,
        "include_icons": log.include_icons,
        "licensed_apis": log.licensed_apis,
        "summary": {
            "downloaded": len(log.downloaded),
            "skipped": len(log.skipped),
            "failed": len(log.failed),
            "manual_queue": len(log.manual_queue),
        },
        "downloaded": [asdict(r) for r in log.downloaded],
        "skipped": [asdict(r) for r in log.skipped],
        "failed": [asdict(r) for r in log.failed],
        "manual_queue": log.manual_queue,
    }
    with log_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")


def _merge_job_result(
    log: RunLog, attributions: dict[str, Any], job: JobResult
) -> None:
    result = job.result
    if result.status == "downloaded":
        log.downloaded.append(result)
        record_attribution(attributions, result)
    elif result.status == "skipped":
        log.skipped.append(result)
    else:
        log.failed.append(result)
        if job.manual_queue:
            log.manual_queue.append(job.manual_queue)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download missing blog images from blog-image-manifest.json"
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=MANIFEST_PATH,
        help="Path to blog-image-manifest.json",
    )
    parser.add_argument(
        "--env",
        type=Path,
        default=DEFAULT_ENV_PATH,
        help="Path to .env.local for API keys",
    )
    parser.add_argument(
        "--log",
        type=Path,
        default=SCRIPT_DIR / "blog-image-download-log.json",
        help="JSON log output path",
    )
    parser.add_argument("--dry-run", action="store_true", help="List actions without downloading")
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip download when the target file already exists (default: overwrite)",
    )
    parser.add_argument(
        "--include-icons",
        action="store_true",
        help='Also download entity icons with status "needed" (and "optional" if --include-optional-icons)',
    )
    parser.add_argument(
        "--include-optional-icons",
        action="store_true",
        help='Include entity icons with status "optional" (requires --include-icons)',
    )
    parser.add_argument("--limit", type=int, default=0, help="Max items to process (0 = all)")
    parser.add_argument("--slug", type=str, default="", help="Only process one post slug")
    parser.add_argument(
        "--delay",
        type=float,
        default=DOWNLOAD_DELAY_SEC,
        help="Seconds between downloads",
    )
    parser.add_argument(
        "--licensed-apis",
        action="store_true",
        help="Use Pexels/Unsplash first; Google Images only as fallback",
    )
    parser.add_argument(
        "--google-headed",
        action="store_true",
        help="Show Chrome window for Google Images (debugging; default is headless)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Minimal logging (one line per image)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        metavar="N",
        help=f"Parallel workers (1–{MAX_WORKERS}, default 4). Each worker opens its own Chrome.",
    )
    parser.add_argument(
        "--attributions-json",
        type=Path,
        default=DEFAULT_ATTRIBUTIONS_JSON,
        help="JSON file mapping each publicPath to source URLs",
    )
    parser.add_argument(
        "--attributions-md",
        type=Path,
        default=DEFAULT_ATTRIBUTIONS_MD,
        help="Markdown summary with disclaimer block and per-post source links",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    load_env(args.env)

    pexels_key = os.getenv("PEXELS_API_KEY", "").strip()
    unsplash_key = os.getenv("UNSPLASH_ACCESS_KEY", "").strip()

    if not args.manifest.is_file():
        print(f"Manifest not found: {args.manifest}", file=sys.stderr)
        return 1

    manifest = load_manifest(args.manifest)
    pexels = PexelsClient(pexels_key) if pexels_key else None
    unsplash = UnsplashClient(unsplash_key) if unsplash_key else None
    if args.licensed_apis and not pexels_key:
        print("Warning: PEXELS_API_KEY not set — Pexels disabled.", file=sys.stderr)

    if not args.dry_run and not SELENIUM_AVAILABLE:
        print(
            "Error: Google Images requires selenium. Run: pip install selenium",
            file=sys.stderr,
        )
        return 1

    section_statuses = {"missing"}
    icon_statuses: set[str] = set()
    if args.include_icons:
        icon_statuses.add("needed")
        if args.include_optional_icons:
            icon_statuses.add("optional")

    slug_filter = args.slug or None
    section_tasks = iter_section_tasks(
        manifest, slug_filter=slug_filter, statuses=section_statuses
    )
    icon_tasks = iter_icon_tasks(manifest, slug_filter=slug_filter, statuses=icon_statuses)
    all_tasks: list[
        tuple[str, dict[str, Any], PostContext | None, Literal["section", "icon"]]
    ] = [(i, e, c, "section") for i, e, c in section_tasks] + [
        (i, e, None, "icon") for i, e in icon_tasks
    ]

    if args.limit > 0:
        all_tasks = all_tasks[: args.limit]

    log = RunLog(
        started_at=datetime.now(timezone.utc).isoformat(),
        manifest_path=str(args.manifest),
        dry_run=args.dry_run,
        skip_existing=args.skip_existing,
        include_icons=args.include_icons,
        licensed_apis=args.licensed_apis,
    )

    total = len(all_tasks)
    workers = max(1, min(MAX_WORKERS, args.workers))
    run_log = RunLogger(quiet=args.quiet)
    mode = "dry-run" if args.dry_run else "download"
    source_label = (
        "Pexels/Unsplash → Google" if args.licensed_apis else "Google Images"
    )
    run_log._out(f"Blog image {mode}: {total} item(s), source={source_label}")
    run_log._out(f"  Workers: {workers} (max {MAX_WORKERS})")
    if args.skip_existing:
        run_log._out("  (--skip-existing: will not overwrite files on disk)")
    if workers > 1 and not args.dry_run:
        run_log._out(
            f"  Each worker uses its own Chrome session ({workers} browsers in parallel)"
        )

    worker_cfg = WorkerConfig(
        dry_run=args.dry_run,
        skip_existing=args.skip_existing,
        licensed_apis=args.licensed_apis,
        google_headed=args.google_headed,
        pexels_key=pexels_key,
        unsplash_key=unsplash_key,
        delay_sec=args.delay if workers == 1 else 0.0,
    )

    attributions = load_attributions(args.attributions_json)

    try:
        if workers == 1:
            for idx, (item_id, entry, post_ctx, kind) in enumerate(all_tasks, start=1):
                job = process_job(
                    idx,
                    total,
                    item_id,
                    entry,
                    post_ctx,
                    kind,
                    cfg=worker_cfg,
                    run_log=run_log,
                )
                _merge_job_result(log, attributions, job)
        else:
            with ThreadPoolExecutor(max_workers=workers) as pool:
                futures = {
                    pool.submit(
                        process_job,
                        idx,
                        total,
                        item_id,
                        entry,
                        post_ctx,
                        kind,
                        cfg=worker_cfg,
                        run_log=run_log,
                    ): idx
                    for idx, (item_id, entry, post_ctx, kind) in enumerate(
                        all_tasks, start=1
                    )
                }
                for future in as_completed(futures):
                    job = future.result()
                    _merge_job_result(log, attributions, job)
    finally:
        shutdown_all_google_drivers()

    log.finished_at = datetime.now(timezone.utc).isoformat()
    write_log(log, args.log)

    attr_json = args.attributions_json if log.downloaded and not args.dry_run else None
    attr_md = args.attributions_md if log.downloaded and not args.dry_run else None
    if attr_json:
        save_attributions(attr_json, attributions)
        write_attributions_markdown(attr_md, attributions)

    run_log.summary_footer(
        downloaded=len(log.downloaded),
        skipped=len(log.skipped),
        failed=len(log.failed),
        log_path=args.log,
        attributions_json=attr_json,
        attributions_md=attr_md,
        manual_count=len(log.manual_queue),
    )

    return 1 if log.failed else 0


if __name__ == "__main__":
    sys.exit(main())

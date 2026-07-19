#!/usr/bin/env python3
"""
Generate progressive (blur-up) image pairs for the Gyungkook site.

For each source photo:
  - `{stem}.preview.webp`  — ~64px wide, low quality (paints instantly)
  - `{stem}.webp`          — display-sized, high quality q=90 (final sharp)

Usage (from repo root):
  python3 scripts/generate-progressive-images.py

Requires: Pillow (`pip install Pillow`)
See: docs/progressive-images.md
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"

# (relative path under public/assets, max full width)
TARGETS: list[tuple[str, int]] = [
    # Home hero slides
    ("hero-01.png", 2117),
    ("hero-02.png", 1374),
    ("hero-03.jpg", 2432),
    ("hero-04.png", 2560),
    ("hero-05.jpg", 1024),
    # Sub visuals
    ("sub/sub-01-01.jpg", 2560),
    ("sub/sub-02-01.jpg", 2560),
    ("sub/sub-04-01.jpg", 2560),
    ("sub/sub-04-02.jpg", 2560),
    ("sub/sub-04-03.jpg", 2560),
    ("sub/sub-04-04.jpg", 2560),
    # About intro large photos
    ("about/quote-city.png", 2560),
    ("about/strength-01.png", 1600),
    ("about/strength-02.png", 1600),
    ("about/strength-03.png", 1600),
    ("about/dark-seal.png", 512),
]

PREVIEW_W = 64
PREVIEW_Q = 45
FULL_Q = 90


def stem_pair(src: Path) -> tuple[Path, Path]:
    base = src.with_suffix("")
    return base.with_suffix(".webp"), Path(str(base) + ".preview.webp")


def load_image(path: Path) -> Image.Image:
    im = Image.open(path)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        return im.convert("RGBA")
    return im.convert("RGB")


def main() -> None:
    for rel, max_w in TARGETS:
        src = ROOT / rel
        if not src.exists():
            print(f"MISSING {src}")
            continue

        full_path, preview_path = stem_pair(src)
        im = load_image(src)
        w, h = im.size

        # Preview
        pw = PREVIEW_W
        ph = max(1, round(h * (pw / w)))
        prev = im.resize((pw, ph), Image.Resampling.LANCZOS)
        prev.save(preview_path, format="WEBP", quality=PREVIEW_Q, method=6)

        # Full
        if w > max_w:
            nh = round(h * (max_w / w))
            full = im.resize((max_w, nh), Image.Resampling.LANCZOS)
        else:
            full = im
        full.save(full_path, format="WEBP", quality=FULL_Q, method=6)

        print(
            f"{rel}: {src.stat().st_size / 1024 / 1024:.2f}MB → "
            f"full {full_path.stat().st_size / 1024:.0f}KB + "
            f"preview {preview_path.stat().st_size / 1024:.1f}KB"
        )


if __name__ == "__main__":
    main()

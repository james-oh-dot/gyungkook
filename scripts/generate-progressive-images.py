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
    ("hero-01.png", 1600),
    ("hero-02.png", 1374),
    ("hero-03.jpg", 2432),
    ("hero-04.png", 1920),
    ("hero-05.jpg", 1024),
    # Home hero swipe thumbs
    ("hero-01-next.jpg", 300),
    ("hero-02-next.jpg", 300),
    ("hero-03-next.jpg", 300),
    ("hero-04-next.jpg", 300),
    ("hero-05-next.jpg", 300),
    # Home section photos
    ("notice-1.jpg", 900),
    ("notice-2.jpg", 900),
    ("notice-3.jpg", 900),
    ("about.jpg", 1920),
    ("practice-1.jpg", 1920),
    ("practice-2.jpg", 1920),
    ("practice-3.jpg", 1920),
    ("achieve-1.jpg", 1920),
    ("achieve-2.jpg", 1920),
    ("achieve-3.jpg", 1920),
    ("professionals-bg.jpg", 1920),
    ("profile-1.jpg", 1104),
    ("profile-2.jpg", 1104),
    ("profile-3.jpg", 1104),
    ("profile-4.jpg", 1104),
    ("press-1.jpg", 1280),
    ("press-2.jpg", 600),
    ("press-3.jpg", 1920),
    ("award-hover.jpg", 1000),
    ("social-bg.jpg", 1920),
    ("office-map.jpg", 1091),
    # Sub visuals
    ("sub/sub-01-01.jpg", 1920),
    ("sub/sub-01-02.jpg", 1920),
    ("sub/sub-01-03.jpg", 1920),
    # 변호사 · 자문단 — card (3× ~897) + profile hero PNG (3× ~1467) + advisors
    ("lawyers/parkhyoyoung-card.jpg", 1200),
    ("lawyers/gongdaeho-card.jpg", 1200),
    ("lawyers/gongseongjun-card.jpg", 1200),
    ("lawyers/sinjiho-card.jpg", 1200),
    ("lawyers/parkhyoyoung.png", 1600),
    ("lawyers/gongseongjun.png", 1600),
    ("lawyers/sinjiho.png", 1600),
    ("advisors/leeseokwoo.jpg", 1200),
    ("advisors/yoonkyuhee.jpg", 1200),
    ("advisors/junghyun.jpg", 1200),
    ("advisors/joara.jpg", 1200),
    ("advisors/baekjinki.jpg", 1200),
    ("sub/sub-01-04.jpg", 1920),
    ("sub/sub-01-05.jpg", 1920),
    ("sub/sub-01-06.jpg", 1920),
    ("sub/sub-02-01.jpg", 1920),
    ("sub/sub-02-02.jpg", 1920),
    ("sub/sub-03-01.jpg", 1920),
    ("sub/sub-04-01.jpg", 1920),
    ("sub/sub-04-02.jpg", 1920),
    ("sub/sub-04-03.jpg", 1920),
    ("sub/sub-04-04.jpg", 1920),
    ("sub/sub-05-01.jpg", 1920),
    # Lawyer portraits
    ("lawyers/gongdaeho.png", 900),
    # 공대호 인증서 / 위촉장 / 수상 (Figma node screenshots, native 184x260)
    ("lawyers/gongdaeho-cert-redevelopment.png", 400),
    ("lawyers/gongdaeho-cert-admin.png", 400),
    ("lawyers/gongdaeho-apt-lh.png", 400),
    ("lawyers/gongdaeho-apt-seoul-human-rights.png", 400),
    ("lawyers/gongdaeho-apt-medical-volunteer.png", 400),
    ("lawyers/gongdaeho-apt-youth-legal.png", 400),
    ("lawyers/gongdaeho-apt-nk-human-rights.png", 400),
    ("lawyers/gongdaeho-apt-village-lawyer.png", 400),
    ("lawyers/gongdaeho-award-human-rights.png", 400),
    ("lawyers/gongdaeho-award-police.png", 400),
    ("lawyers/gongdaeho-award-brand-index.png", 400),
    # 대표인사말 (greeting)
    ("greeting/ceo.jpg", 1280),
    ("greeting/signature.png", 368),
    # 경국인갤러리 (gallery) — brand pyramid diagram
    ("gallery/pyramid.png", 564),
    # About intro large photos
    ("about/quote-city.png", 1920),
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

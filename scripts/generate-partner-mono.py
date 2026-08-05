#!/usr/bin/env python3
"""
Generate the monochrome partner logos used by the home footer marquee.

Source logos (`public/assets/about/partners/`) are all dark artwork on an
opaque white plate — fine on the light 법인소개 협력사 grid, invisible on the
marquee's dark band. For each source this writes
`public/assets/partners-mono/{stem}.png`:

  1. background → transparent (existing alpha is kept when the file already
     has one; otherwise the plate colour is keyed out from the border inward)
  2. artwork → greyscale
  3. greyscale inverted when the art reads dark, so it lands light on the band
  4. levels stretched to a common light range — raw inversion left the set
     spread over mean luminance 125…242, which reads as a row of randomly
     dim/bright logos rather than one monochrome family
  5. trimmed to content + padded, so every logo is framed consistently

The originals are left untouched — the 협력사 grid still uses the colour set.

Usage (from repo root):
  python3 scripts/generate-partner-mono.py

Requires: Pillow (`pip install Pillow`)
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"
SRC_DIR = ROOT / "about" / "partners"
OUT_DIR = ROOT / "partners-mono"

# Height every logo is normalised to; width follows the trimmed aspect.
TARGET_H = 120
# Transparent breathing room so tall glyphs don't touch the marquee edge.
PAD = 6
# How far a pixel may drift from the plate colour and still count as background.
KEY_TOLERANCE = 32
# Below this mean luminance the artwork is "dark" and gets inverted.
DARK_MEAN = 128
# Levels target: the bulk of each logo's tone is stretched into this range so
# the whole strip reads as one family. Floor stays well clear of the band.
LEVELS_LO = 120
LEVELS_HI = 255
# A logo whose tonal spread is narrower than this is effectively flat art —
# stretching it would just amplify compression noise, so it goes solid light.
FLAT_SPREAD = 12


def plate_colour(im: Image.Image) -> tuple[int, int, int]:
    """Most common colour along the border — the plate the logo sits on."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    edge: dict[tuple[int, int, int], int] = {}
    for x in range(w):
        for y in (0, h - 1):
            edge[rgb.getpixel((x, y))] = edge.get(rgb.getpixel((x, y)), 0) + 1
    for y in range(h):
        for x in (0, w - 1):
            edge[rgb.getpixel((x, y))] = edge.get(rgb.getpixel((x, y)), 0) + 1
    return max(edge.items(), key=lambda kv: kv[1])[0]


def has_real_alpha(im: Image.Image) -> bool:
    """True when the file already carries a usable cut-out."""
    if im.mode not in ("RGBA", "LA") and not (
        im.mode == "P" and "transparency" in im.info
    ):
        return False
    alpha = im.convert("RGBA").getchannel("A")
    transparent = sum(count for value, count in enumerate(alpha.histogram()) if value < 16)
    # A stray transparent pixel is not a cut-out; require a real share.
    return transparent > (im.width * im.height) * 0.02


def build_alpha(im: Image.Image) -> Image.Image:
    """Alpha mask isolating the artwork from its plate."""
    if has_real_alpha(im):
        return im.convert("RGBA").getchannel("A")

    pr, pg, pb = plate_colour(im)
    rgb = im.convert("RGB")
    # Chebyshev distance from the plate colour, ramped over the tolerance so
    # antialiased glyph edges fade out instead of stair-stepping.
    alpha = Image.new("L", rgb.size)
    alpha.putdata(
        [
            0
            if max(abs(r - pr), abs(g - pg), abs(b - pb)) <= KEY_TOLERANCE
            else 255
            for r, g, b in rgb.getdata()
        ]
    )
    return alpha


def normalise(grey: Image.Image, alpha: Image.Image) -> Image.Image:
    """Stretch the visible tonal range into [LEVELS_LO, LEVELS_HI]."""
    visible = sorted(g for g, a in zip(grey.getdata(), alpha.getdata()) if a > 128)
    if not visible:
        return grey

    # Percentiles, not min/max — a few stray pixels shouldn't set the range.
    lo = visible[int(len(visible) * 0.05)]
    hi = visible[int(len(visible) * 0.95)]

    if hi - lo < FLAT_SPREAD:
        return Image.eval(grey, lambda _v: LEVELS_HI)

    span = hi - lo
    scale = (LEVELS_HI - LEVELS_LO) / span
    return Image.eval(
        grey,
        lambda v: min(255, max(0, round((v - lo) * scale + LEVELS_LO))),
    )


def main() -> int:
    if not SRC_DIR.is_dir():
        print(f"missing source dir: {SRC_DIR}")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(
        p for p in SRC_DIR.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg")
    )

    for src in sources:
        im = Image.open(src)
        alpha = build_alpha(im)
        grey = im.convert("L")

        # Mean luminance over visible pixels only — the plate must not skew it.
        visible = [g for g, a in zip(grey.getdata(), alpha.getdata()) if a > 128]
        mean = sum(visible) / len(visible) if visible else 255
        if mean < DARK_MEAN:
            grey = Image.eval(grey, lambda v: 255 - v)

        grey = normalise(grey, alpha)
        out = Image.merge("RGBA", (grey, grey, grey, alpha))

        bbox = alpha.getbbox()
        if bbox:
            out = out.crop(bbox)

        scale = TARGET_H / out.height
        out = out.resize(
            (max(1, round(out.width * scale)), TARGET_H), Image.LANCZOS
        )

        padded = Image.new("RGBA", (out.width + PAD * 2, out.height + PAD * 2), (0, 0, 0, 0))
        padded.paste(out, (PAD, PAD), out)

        dest = OUT_DIR / f"{src.stem}.png"
        padded.save(dest, optimize=True)
        print(
            f"{src.name:18} -> {dest.name:18} {padded.size}  "
            f"mean={mean:5.1f} {'inverted' if mean < DARK_MEAN else 'as-is'}"
        )

    print(f"\n{len(sources)} logo(s) written to {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

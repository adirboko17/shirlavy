#!/usr/bin/env python3
"""Optimize brows result photos (Drive folder "קמפיינים") into public/slots.

Usage: python3 scripts/build-results.py <dir-with-pngs>
Expects micro-1..8.png (מיקרובליידינג) and combo-1..8.png (משולבת), 1080x1080
before/after squares. Writes results-{micro,combo}-N.webp plus "after" crops used
by the home treatments teaser. Then run scripts/build-slots.py to refresh slot-map.json.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public" / "slots"


def webp(im: Image.Image, name: str, max_side: int = 1600, quality: int = 82) -> None:
    im = im.convert("RGB")
    if max(im.size) > max_side:
        s = max_side / max(im.size)
        im = im.resize((int(im.width * s), int(im.height * s)), Image.Resampling.LANCZOS)
    im.save(OUT / f"{name}.webp", "WEBP", quality=quality, method=6)


def main(src: Path) -> None:
    for kind in ("micro", "combo"):
        for i in range(1, 9):
            fp = src / f"{kind}-{i}.png"
            if fp.exists():
                webp(Image.open(fp), f"results-{kind}-{i}")
        teaser = src / f"{kind}-2.png"
        if teaser.exists():
            im = Image.open(teaser)
            w, h = im.size
            # right ("after") half, without the divider, monogram and BEFORE/AFTER bar
            webp(im.crop((int(w * 0.52), int(h * 0.02), w, int(h * 0.72))), f"home-tr-{kind}-after", quality=84)


if __name__ == "__main__":
    main(Path(sys.argv[1]))

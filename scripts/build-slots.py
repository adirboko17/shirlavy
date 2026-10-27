#!/usr/bin/env python3
"""Generate optimized WebP assets and slot-map.json from Shir Drive export."""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content" / "shir"
OUT = ROOT / "public" / "slots"
OUT.mkdir(parents=True, exist_ok=True)

# WhatsApp composite with clinic photo (bottom half)
CLINIC_WA = Path(
    "/cursor/stores/bot/grok-bot/agents/e6865400-2fda-482f-a665-7b09c6a8f625/attachments/01M5YJCN7FYDTTWNNFW57VH56F.png"
)


def save_webp(im: Image.Image, name: str, max_side: int = 1600, quality: int = 82) -> str:
    im = im.convert("RGB")
    w, h = im.size
    if max(w, h) > max_side:
        scale = max_side / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    path = OUT / f"{name}.webp"
    im.save(path, "WEBP", quality=quality, method=6)
    return f"/slots/{name}.webp"


def crop_ig_post(im: Image.Image) -> Image.Image:
    """Remove Instagram screenshot chrome (status bar, caption, nav)."""
    w, h = im.size
    top = int(h * 0.12)
    bottom = int(h * 0.58)
    left = int(w * 0.04)
    right = int(w * 0.96)
    return im.crop((left, top, right, bottom))


def split_panels(im: Image.Image, panels: int) -> list[Image.Image]:
    w, h = im.size
    step = w // panels
    return [im.crop((i * step, 0, (i + 1) * step if i < panels - 1 else w, h)) for i in range(panels)]


def ba_from_ig(path: Path, panels: int, before_idx: int, after_idx: int) -> tuple[Image.Image, Image.Image]:
    im = Image.open(path)
    content = crop_ig_post(im)
    parts = split_panels(content, panels)
    return parts[before_idx], parts[after_idx]


def collage_from_ig(path: Path) -> Image.Image:
    """Full before/after collage row from an Instagram screenshot (no split)."""
    return crop_ig_post(Image.open(path))


def main() -> None:
    slots: dict[str, str] = {}

    portrait = CONTENT / "images/root/WhatsApp Image 2026-10-15 at 09.48.42.jpg"
    slots["home-shir-portrait"] = save_webp(Image.open(portrait), "home-shir-portrait")
    slots["about-ch-1"] = slots["home-shir-portrait"]

    teaching = CONTENT / "images/root/IMG_7845.jpg"
    slots["about-ch-2"] = save_webp(Image.open(teaching), "about-ch-2")

    if CLINIC_WA.exists():
        wa = Image.open(CLINIC_WA)
        ww, wh = wa.size
        clinic = wa.crop((0, int(wh * 0.52), ww, wh))
        # Focus on treatment bed + ring light
        cw, ch = clinic.size
        clinic = clinic.crop((int(cw * 0.05), int(ch * 0.08), int(cw * 0.95), int(ch * 0.92)))
        slots["home-tr-4"] = save_webp(clinic, "home-tr-4-clinic")  # TODO: replace with high-res clinic photo
        slots["about-ch-3"] = slots["home-tr-4"]
        slots["contact-clinic"] = slots["home-tr-4"]
        slots["aes-clinic"] = slots["home-tr-4"]

    course_dir = CONTENT / "images/course-photos"
    course_files = sorted(course_dir.glob("*.jpg"))
    if course_files:
        slots["home-academy-1"] = save_webp(Image.open(course_files[0]), "home-academy-1")
        slots["ac-skills"] = save_webp(Image.open(course_files[-1]), "ac-skills")
        slots["ac-shir"] = save_webp(Image.open(course_files[2 % len(course_files)]), "ac-shir")
        for i, fp in enumerate(course_files[:9]):
            slots[f"ac-gal-{i}"] = save_webp(Image.open(fp), f"ac-gal-{i}")

    # Brows technique hero images
    micro_dir = CONTENT / "images/microblading-before-after"
    micro_files = sorted(micro_dir.glob("*.jpg"))
    if micro_files:
        b, a = ba_from_ig(micro_files[0], 3, 0, 2)
        slots["brows-tech-0"] = save_webp(b, "brows-tech-micro")
        slots["home-tr-1"] = slots["brows-tech-0"]
        slots["home-ba-1"] = save_webp(collage_from_ig(micro_files[0]), "home-ba-1")

    combo_dir = CONTENT / "images/combined-method-before-after"
    combo_files = sorted(combo_dir.glob("*.jpg"))
    if combo_files:
        b, a = ba_from_ig(combo_files[0], 3, 0, 2)
        slots["brows-tech-2"] = save_webp(b, "brows-tech-combo")
        slots["home-tr-2"] = slots["brows-tech-2"]
        slots["home-ba-2"] = save_webp(collage_from_ig(combo_files[0]), "home-ba-2")

    if len(micro_files) > 1:
        b, a = ba_from_ig(micro_files[1], 3, 0, 1)
        slots["brows-tech-1"] = save_webp(b, "brows-tech-powder")

    removal_dir = CONTENT / "images/laser-pmu-removal-before-after"
    removal_files = sorted(removal_dir.glob("*.jpg"))
    for i, fp in enumerate(removal_files[:3]):
        collage = save_webp(collage_from_ig(fp), f"rm-ba-{i + 1}")
        slots[f"rm-ba-{i + 1}"] = collage
        if i == 0:
            slots["home-tr-3"] = collage
            slots["home-ba-3"] = collage

    # Brows gallery (micro + combo) — full collage per post
    gal_idx = 0
    for fp in micro_files:
        slots[f"brows-g{gal_idx}"] = save_webp(collage_from_ig(fp), f"brows-g{gal_idx}")
        gal_idx += 1
    for fp in combo_files:
        slots[f"brows-g{gal_idx}"] = save_webp(collage_from_ig(fp), f"brows-g{gal_idx}")
        gal_idx += 1

    # Store product photos from Drive (real SKUs where names match)
    product_map = {
        "p-brow-balm-1": None,
        "p-calm-serum-1": None,
        "p-rich-cream-1": None,
        "p-home-ritual-1": None,
        "p-brow-brush-1": "E6BE40E1-D3B5-4FDB-B0F5-47DFB6D30779.jpg",
        "p-student-kit-1": "49895B10-D9C2-401B-83AB-4C65F64C5A9E.jpg",
    }
    root = CONTENT / "images/root"
    hebrew_products = {
        "p-student-kit-1": "שבלונות 1.jpg",
        "p-brow-brush-1": "אפליקטור 1.jpg",
    }
    for slot_id, fname in {**product_map, **hebrew_products}.items():
        if not fname:
            continue
        fp = root / fname
        if fp.exists():
            slots[slot_id] = save_webp(Image.open(fp), slot_id)

    for fp in root.glob("*.jpg"):
        name = fp.name
        if re.search(r"^(WhatsApp|IMG_)", name):
            continue
        if "לטקס" in name or "שבלונות 2" in name:
            continue  # older logo on product
        slug = re.sub(r"[^\w]+", "-", fp.stem)[:40]
        sid = f"store-{slug}"
        if sid not in slots:
            slots[sid] = save_webp(Image.open(fp), sid)

    # Keep existing hero slots if we didn't regenerate
    for legacy in ["home-hero-main", "home-academy-2", "p-brow-balm-1", "p-calm-serum-1", "p-rich-cream-1", "p-home-ritual-1"]:
        leg_path = OUT / f"{legacy}.webp"
        if legacy not in slots and leg_path.exists():
            slots[legacy] = f"/slots/{legacy}.webp"

    map_path = ROOT / "lib" / "slot-map.json"
    map_path.write_text(json.dumps(dict(sorted(slots.items())), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(slots)} slots to {map_path}")


if __name__ == "__main__":
    main()

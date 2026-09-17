# Srishti Innovative Meditation Journey - Branding Package

This folder contains the editorial redesign of the Nine-Day Meditation Journey marketing package. Open `index.html` for the marketing-team gallery. Edition 2 replaces the earlier layouts; the original edition remains in Git at `c9acf0c`.

## Final exports

- `output/srishti-nine-day-meditation-trifold.pdf` - two-sided A4 roll-fold brochure, with 3 mm bleed, crop/fold marks and embedded fonts. Media size is 315 × 228 mm; trim to 297 × 210 mm. See production notes before printing.
- `output/srishti-nine-day-meditation-digital.pdf` - seven-page 4:5 portrait brochure with clickable WhatsApp, email, website and QR links; about 3.2 MiB.
- `output/srishti-meditation-social-1080x1350.png` - ready-to-share cover image with contact details.

## Reusable assets

- `assets/srishti-innovative-logo.png` - supplied Srishti Innovative logo.
- `assets/meditation-room-hero.png` - generated luxury two-seat meditation-room hero artwork.
- `source/brochure-content.md` - approved brochure copy.
- `source/brand-guide.md` - visual direction, palette, and production notes.
- `source/hero-image-prompt.txt` - reusable generation prompt.
- `assets/website-qr.svg` - scalable QR code for https://www.srishtis.com/.
- `source/build_editorial.py` - current editable layout and compact marketing copy; run with Python, ReportLab and pypdf. The original `build_brochures.py` command forwards to this edition.
- `source/production-notes.md` - dimensions, folding, print preparation and reproduction guidance.
- `source/build-report.json` - actual export page counts, sizes and link totals.
- `preview/` - current render of every brochure page.

## Rebuilding

Run `python3 branding/source/build_editorial.py` from the project root. Fonts default to Georgia and Arial in macOS Supplemental Fonts. Set `BRAND_FONT_DIR` to a directory containing the same licensed TTF filenames on another computer. Fonts are embedded in final PDFs; font files are not redistributed. The PNG master artwork and supplied logo are preserved unchanged.

Re-render both PDFs after changes and replace the social PNG from digital page 1 at 144 dpi. The documents contain vector typography and QR modules, with raster photography at its original proportions. Marketing copy is condensed for each layout; `source/brochure-content.md` retains the longer approved copy.

The logo must retain its original proportions. Chakra, mantra, visualization, and sound language is contemplative and must not be reframed as medical treatment or guaranteed outcomes.

"""Compare hero screenshots to verify load animation actually animates."""
from PIL import Image
import os

base = "tests/screenshots"
files = ["anim-0ms.png", "anim-400ms.png", "anim-900ms.png", "anim-1600ms.png"]

for f in files:
    path = os.path.join(base, f)
    if not os.path.exists(path):
        print(f"MISSING: {path}")
        continue
    im = Image.open(path).convert("RGB")
    px = im.load()
    w, h = im.size
    # sample center region where hero portrait sits
    non_white = 0
    total = 0
    for y in range(0, h, 8):
        for x in range(0, w, 8):
            r, g, b = px[x, y]
            total += 1
            if not (r > 240 and g > 240 and b > 240):
                non_white += 1
    print(f"{f}: {w}x{h} non-white pixels = {non_white}/{total} ({100*non_white/total:.1f}%)")
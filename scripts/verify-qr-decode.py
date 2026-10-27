import jsqr
import png
import sys

INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/"

def main():
    for path, label in [("/tmp/qr.png", "1897x898"), ("/tmp/qr-mobile.png", "390x844")]:
        try:
            data = open(path, "rb").read()
            reader = png.Reader(bytes=data)
            width, height, rows, info = reader.read()
            pixels = []
            for row in rows:
                for i in range(0, len(row), 3):
                    pixels.append((row[i], row[i+1], row[i+2]))
            pixels = bytes(pixels)
            code = jsqr.JSQR(pixels, width, height)
            decoded = code.decode()
            print(f"[{label}] {path}")
            print(f"  DECODED : {decoded!r}")
            print(f"  MATCH   : {decoded == INSTAGRAM_URL}")
            print()
        except Exception as e:
            print(f"[{label}] FAILED: {e}")

if __name__ == "__main__":
    main()
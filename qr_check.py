import struct

with open("E:/NhPortfolio/public/qr-placeholder.png", "rb") as f:
    data = f.read()

assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
i = 8
while i < len(data):
    length = struct.unpack(">I", data[i:i+4])[0]
    ctype = data[i+4:i+8].decode("ascii")
    print(f"{ctype} length={length} at offset={i}")
    i += 12 + length
    if ctype == "IEND":
        break
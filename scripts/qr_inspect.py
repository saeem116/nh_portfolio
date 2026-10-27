import struct

def inspect(path):
    data = open(path, "rb").read()
    print(f"--- {path} ---")
    print(f"size: {len(data)} bytes")
    print(f"sig: {data[:8]}")
    i = 8
    while i < len(data):
        length = struct.unpack(">I", data[i:i+4])[0]
        ctype = data[i+4:i+8].decode("ascii")
        print(f"  chunk: {ctype} len={length}")
        if ctype == "IHDR":
            w, h = struct.unpack(">II", data[i+16:i+24])
            bit_depth = data[i+24]
            color_type = data[i+25]
            print(f"    width={w} height={h} bit_depth={bit_depth} color_type={color_type}")
        if ctype == "IDAT":
            # check first few bytes of decompressed data
            pass
        i += 12 + length
        if ctype == "IEND":
            break

for p in ["/tmp/qr.png", "/tmp/qr-mobile.png"]:
    inspect(p)
    print()
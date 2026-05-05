from PIL import Image
import sys

def remove_checkerboard(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        newData = []
        for item in data:
            # item is (R, G, B, A)
            # The red logo is mostly red, so R is high, but G and B are low.
            # The checkerboard is white (255, 255, 255) and gray (e.g. 204, 204, 204 or 230, 230, 230)
            # If the pixel is mostly gray/white (R, G, and B are close to each other and > 180)
            
            r, g, b, a = item
            
            # Simple heuristic for grey/white:
            if r > 180 and g > 180 and b > 180 and abs(r-g) < 20 and abs(g-b) < 20:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_checkerboard("public/moonstruck-logo.png", "public/moonstruck-logo.png")

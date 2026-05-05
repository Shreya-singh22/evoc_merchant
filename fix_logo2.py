from PIL import Image
import sys

def remove_checkerboard(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        newData = []
        for item in data:
            r, g, b, a = item
            
            # The Moonstruck logo is RED. 
            # Red pixels have high R, and lower G and B.
            # Checkerboard pixels are grayscale, so R, G, and B are very close to each other.
            
            if r > g + 30 and r > b + 30:
                # It's a red pixel, keep it!
                newData.append(item)
            else:
                # It's not red (it's grayscale checkerboard or white), make it transparent
                newData.append((255, 255, 255, 0))
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_checkerboard("public/moonstruck-logo.png", "public/moonstruck-logo.png")

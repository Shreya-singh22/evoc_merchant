from PIL import Image

def crop_and_clean_logo(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        newData = []
        min_x, min_y = img.width, img.height
        max_x, max_y = 0, 0
        
        for y in range(img.height):
            for x in range(img.width):
                item = data[y * img.width + x]
                r, g, b, a = item
                
                # If it is red (Moonstruck logo color)
                if r > g + 30 and r > b + 30 and r > 100:
                    newData.append(item)
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)
                else:
                    newData.append((255, 255, 255, 0)) # transparent
                    
        img.putdata(newData)
        
        # Now crop it!
        if max_x >= min_x and max_y >= min_y:
            # Add a small 10px padding
            pad = 10
            crop_box = (
                max(0, min_x - pad), 
                max(0, min_y - pad), 
                min(img.width, max_x + pad), 
                min(img.height, max_y + pad)
            )
            cropped_img = img.crop(crop_box)
            cropped_img.save(output_path, "PNG")
            print(f"Successfully processed and cropped {input_path}")
        else:
            print("No red pixels found, leaving as is.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_and_clean_logo("public/moonstruck-logo.png", "public/moonstruck-logo.png")

import os
from PIL import Image

def generate_icons():
    src_icon = "public/app_icon.png"
    if not os.path.exists(src_icon):
        print(f"Source icon {src_icon} not found!")
        return

    img = Image.open(src_icon)
    
    # Save web icons
    img.resize((192, 192), Image.Resampling.LANCZOS).save("public/icon-192.png")
    img.resize((512, 512), Image.Resampling.LANCZOS).save("public/icon-512.png")
    img.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon.ico")
    print("Web icons generated in public/")

    # Android mipmaps
    densities = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }

    base_res = "android/app/src/main/res"
    if os.path.exists(base_res):
        for folder, size in densities.items():
            target_dir = os.path.join(base_res, folder)
            os.makedirs(target_dir, exist_ok=True)
            
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(os.path.join(target_dir, "ic_launcher.png"))
            resized.save(os.path.join(target_dir, "ic_launcher_round.png"))
            resized.save(os.path.join(target_dir, "ic_launcher_foreground.png"))
        print("Android mipmap icons updated successfully!")
    else:
        print(f"Android res folder {base_res} does not exist yet.")

if __name__ == "__main__":
    generate_icons()

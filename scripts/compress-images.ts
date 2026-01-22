import { globSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const images = globSync("dist/assets/*.png");
for (const image of images) {
    const imageData = sharp(image);
    const metadata = await imageData.metadata();
    const finalImage = await imageData
        .resize({
            width: metadata.width * 0.25,
            height: metadata.height * 0.25,
        })
        .toFormat("png")
        .toBuffer();
    writeFileSync(image, finalImage);
}

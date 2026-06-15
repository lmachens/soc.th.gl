# SoC.th.gl extractor

The extractor is used to extract the data from Songs of Conquest to the JSON files in `lib/collections`.

## How to use the extractor

It's required to have Songs of Conquest installed on your computer. This guide is for the Steam version, but should work for other versions too.

Next, you need to install [AssetRipper](https://github.com/AssetRipper/AssetRipper/), which is a tool to extract the game data.

> ⚠️ **Use AssetRipper v1.0.13.1 (the May 2024 build). Do not use a newer build.**
> The scripts in this folder parse AssetRipper's YAML output, and newer versions changed that output in breaking ways: `internalIDToNameTable` becomes `first: {213: <fileId>}` instead of `first: {first, second}` (breaks all icon/sprite resolution), the `Icons` atlas stops splitting into a second `Icons_0` page, and `_statuses` is serialized as a packed hex string instead of a plain list. If sprites/icons come out wrong or `seed.mjs` crashes on a null commander, you are almost certainly on the wrong AssetRipper version. Download: https://github.com/AssetRipper/AssetRipper/releases/tag/1.0.13.1

### AssetRipper

After you extracted the ZIP file, please run `AssetRipper.GUI.Free.exe` and configurate it in the settings:

- Sprite Export Format: `Unity`
- Script Export Format: `Decompiled`

Now, open the game folder like `C:\Program Files (x86)\Steam\steamapps\common\SongsOfConquest\SongsOfConquest_Data`.

Even if we are interested in some of the files, we will export everything. Create a folder called `SongsOfConquest` next to this README.md file (`extractor/SongsOfConquest`). Click on `Export all Files` and enter the path to the `SongsOfConquest` folder.

Exporting these files will take a while.

### Start the extractor

After the export is done, we can start parsing the data.
First, install dependencies with `npm install`. Node v16 is required.

There are three scripts:

- `cache.mjs`: This script prepares a list of all the files based on their GUID. This is used to increase the execution time of the following scripts. We only need to run this if a new version of Songs of Conquest is released and we run AssetRipper again. The result of this script is a file called `out/cache.json`. Use `npm run cache` to run this script.
- `seed.mjs`: This script is generating the `termMap.json` and parses all manifest files of the game, which includes factions, skills, sprites and more. The results are stored in `out` folder as JSON files. Use `npm run seed` to run this script. It will take a while, so grab a cup of coffee ☕.
- `convert.mjs`: The JSON files from the `seed.mjs` script have much more information than we need. This script converts the data to a more usable format and copies these files to `lib/collections`. In addition, it required image/spritesheet files are copied to `public`. Use `npm run convert` to run this script.

You can call `npm start` if you want to run all scripts at once.

### Running AssetRipper without the GUI (optional)

AssetRipper's GUI is actually a local web server, so the export can be automated instead of clicking through the UI:

1. Launch it headless: `AssetRipper.GUI.Free.exe --launch-browser false --port 5558`
2. Confirm settings on `/Settings/Edit` are Sprite Export = `Native`, Script Export = `Decompiled` (these are the v1.0.13.1 defaults).
3. `POST /LoadFolder` with form field `path` = the game's `…/SongsOfConquest/SongsOfConquest_Data` folder.
4. `POST /Export` with form field `Path` = `extractor/SongsOfConquest` (must be empty first).

Then run `npm run cache && npm run seed && npm run convert` as usual.

### Adding a static faction banner

Faction/town pages show an animated `public/factions/<Type>AnimatedFactionBanner.gif`, which is **not** produced by the extractor. Factions without one (currently Roots, Vanir, Yulan) fall back to a static `public/factions/<Type>Banner.png` — see `STATIC_BANNER_FACTIONS` / `getFactionBannerSrc` in `lib/factions.ts`.

To make one for a new faction, the game's colorable banner sprite (`faction.bannerSprite`, e.g. `BannerColorable` in `YulanUI.png`) can be cropped, tinted to the faction colour, and centred on a 256×256 canvas. Example with ImageMagick (a Unity atlas is bottom-left origin, so `top = atlasHeight - y - height`):

```bash
# crop the banner sprite from the atlas (x,y,w,h come from factions.json bannerSprite)
magick YulanUI.png -crop 96x147+1811+84 +repage banner_raw.png
# duotone-tint via a colour ramp (keeps the white emblem), then centre on 256x256
magick banner_raw.png -alpha extract alpha.png
magick -size 1x256 gradient:'#0d4f3c'-'#f4fff9' clut.png
magick banner_raw.png -alpha off -colorspace Gray clut.png -clut color.png
magick color.png alpha.png -alpha off -compose CopyOpacity -composite \
  -resize 170x255 -background none -gravity center -extent 256x256 -strip \
  ../public/factions/YulanBanner.png
```

# SoC.th.gl extractor

The extractor is used to extract the data from Songs of Conquest to the JSON files in `lib/collections`.

## How to use the extractor

It's required to have Songs of Conquest installed on your computer. This guide is for the Steam version, but should work for other versions too.

Next, you need to install [AssetRipper](https://github.com/AssetRipper/AssetRipper/), which is a tool to extract the game data. The latest tested version is [v1.0.13.1](https://github.com/AssetRipper/AssetRipper/releases/tag/1.0.13.1).

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

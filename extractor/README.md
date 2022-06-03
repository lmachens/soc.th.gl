# SoC.gg extractor

The extractor is used to extract the data from Songs of Conquest to the JSON files in `lib/collections`.

## How to use the extractor

It's required to have Songs of Conquest installed on your computer. This guide is for the Steam version, but should work for other versions too.

Next, you need to install [AssetRipper](https://github.com/AssetRipper/AssetRipper/), which is a tool to extract the game data. The latest tested version is [v0.2.0.3](https://github.com/AssetRipper/AssetRipper/releases/tag/0.2.0.3). This guide is for the GUI version of AssetRipper (`AssetRipperGUI_win64.zip`).

After you extracted the ZIP file, please run `AssetRipper.exe`.

Now, open the game folder like `C:\Program Files (x86)\Steam\steamapps\common\SongsOfConquest\SongsOfConquest_Data`.

Even if we are interested in some of the files, we will export everything. Click on `Export all Files` and select the folder of this README.md file target (`extractor`).

Exporting these files will take a while and a new folder called `SongsOfConquest` will be created.

After the export is done, we can start parsing the data.
First, install dependencies with `npm install`. Node v16 is required.

There are three scripts:

- `cache.mjs`: This script prepares a list of all the files based on their GUID. This is used to increase the execution time of the following scripts. We only need to run this if a new version of Songs of Conquest is released and we run AssetRipper again. The result of this script is a file called `out/cache.json`. Use `npm run cache` to run this script.
- `seed.mjs`: This script is generating the `termMap.json` and parses all manifest files of the game, which includes factions, skills, sprites and more. The results are stored in `out` folder as JSON files. Use `npm run seed` to run this script. It will take a while, so grab a cup of coffee ☕.
- `convert.mjs`: The JSON files from the `seed.mjs` script have much more information than we need. This script converts the data to a more usable format and copies these files to `lib/collections`. In addition, it required image/spritesheet files are copied to `public`. Use `npm run convert` to run this script.

You can call `npm start` if you want to run all scripts at once.

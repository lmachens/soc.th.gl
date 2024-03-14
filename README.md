![](/public/logo.png)

# SoC.gg - A Songs of Conquest fansite

- [Website](https://soc.th.gl)
- [Discord](https://th.gl/discord)
- [Songs of Conquest](https://www.songsofconquest.com)

## Features

- Full codex of all the game's units, skills, factions and wielders
- Spotlight search
- and more to come! Feel free to [suggest new features](https://github.com/lmachens/soc.gg/issues).

We have the approval and support of the game studio (Lavapotion) to use the game data in this project 🤘.

## Contribution

Join us on [Discord](https://th.gl/discord) if you like to contribute.

## Town Graph Improvements

If you are reading this, then you're the perfect candidate to improve the Town
Graph! Here are some ways in which you could contribute:

- Use terms to translate the graph into other languages.
- Add share button and sync URL with build.
- Add building sizes like S/M/L to the data
  (so that we can calculate needed town size).
- Calculate needed income for achieving build.
- Calculate recruitment costs and growth statistics
  (e.g., how long before you max the stack).

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The collection files in `lib/collections` are extracted from the game data. This is done by a different project, which is not part of the repository.
If you require more information, please add an [issue](https://github.com/lmachens/soc.gg/issues).

## Game data extractor

This project is based on the game data of Songs of Conquest. See [extractor/README.md](extractor/README.md) for more information.

## License

MIT

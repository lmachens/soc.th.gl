![](/public/logo.png)

# SoC.gg - A Songs of Conquest fansite

- [Website](https://soc.gg)
- [Discord](https://discord.com/invite/NTZu8Px)
- [Songs of Conquest](https://www.songsofconquest.com)
- [Analytics](https://apps.machens.dev/soc.gg)

## Features

- Full codex of all the game's units, skills, factions and wielders
- Spotlight search
- and more to come! Feel free to [suggest new features](https://github.com/lmachens/soc.gg/issues).

We have the approval and support of the game studio (Lavapotion) to use the game data in this project 🤘.

## Contribution

This app is Open Source. Contributors are highly welcome!
You can find open tasks and issues on [GitHub](https://github.com/lmachens/soc.gg/issues).

Join us on [Discord](https://discord.com/invite/NTZu8Px) if you like to contribute.

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

## Environment variables

The following list shows the environment variables you can set. You can find more information on [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables):

| KEY                          | VALUE                         |
| ---------------------------- | ----------------------------- |
| NEXT_PUBLIC_PLAUSIBLE_HOST   | Plausible API host (optional) |
| NEXT_PUBLIC_PLAUSIBLE_DOMAIN | Plausible domain (optional)   |

## Analytics

If you are interested in the analytics of this project, please visit the [dashboard](https://apps.machens.dev/soc.gg). It's based on [Plausible](https://plausible.io/), a privacy-friendly analytics solution without the need of cookie banners or GDPR consent.

## License

MIT

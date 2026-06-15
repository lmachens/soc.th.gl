# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

soc.th.gl is a fansite for the game "Songs of Conquest" - a codex/wiki containing game data about units, skills, factions, wielders, buildings, spells, artifacts, and random events. The site has official approval from the game studio (Lavapotion).

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 13 (Pages Router) with TypeScript
- **UI**: Mantine v5 component library
- **State**: Zustand for client-side state (account store)
- **Visualization**: ReactFlow for town graphs, Chart.js for savegame analytics

### Key Directories

- `pages/` - Next.js pages using dynamic routes (`[faction]`, `[type]`)
- `components/` - React components organized by feature (AppLayout, Towns, Skills, Savegame)
- `lib/` - Data access layer and utilities
- `lib/collections/` - JSON data files extracted from the game (DO NOT EDIT MANUALLY)
- `extractor/` - Separate Node.js tool for extracting game data
- `overwolf/` - Companion Overwolf app (excluded from main tsconfig)

### Data Flow

1. **Game Data Extraction**: The `extractor/` tool uses AssetRipper to extract game assets, then processes them through `cache.mjs` → `seed.mjs` → `convert.mjs` to generate JSON files in `lib/collections/`. See `extractor/README.md` for the full workflow and the **important AssetRipper version note below**.

2. **Data Access Layer** (`lib/*.ts`): Functions like `getFactions()`, `getUnits()`, `getSkills()` read from `lib/collections/*.json` and apply i18n translations via `getTerm()`

3. **Static Generation**: Pages use `withStaticBase()` wrapper in `lib/staticProps.ts` to inject common props (navigation links, terms) into all pages during build

### Updating game data after a patch / DLC

When a new game version or faction DLC ships, re-run the extractor and regenerate `lib/collections`:

1. **Use the README-pinned AssetRipper, not a newer one.** The extractor parses AssetRipper's YAML output, which is **version-sensitive**. Use AssetRipper **v1.0.13.1** (the May 2024 `AssetRipper_win_x64` build). Newer builds changed the serialization (`internalIDToNameTable` shape, single-page icon atlas, packed-hex `_statuses`) and silently break icon/sprite resolution. The GUI is a local web server — run it headless and drive it over HTTP: launch with `--launch-browser false --port <port>`, then `POST /LoadFolder` (game `…/SongsOfConquest_Data`) and `POST /Export` (Path = `extractor/SongsOfConquest`). Required settings (already the v1.0.13.1 defaults): Sprite Export = `Native`, Script Export = `Decompiled`.
2. Run `npm run cache && npm run seed && npm run convert` in `extractor/` (cache **must** be rebuilt after a fresh export).
3. **New factions need a static banner.** Faction pages use an animated `…AnimatedFactionBanner.gif` unless the type is in `STATIC_BANNER_FACTIONS` (`lib/factions.ts`, used by `getFactionBannerSrc`). The gif isn't extracted, so add the new faction there and create `public/factions/<Type>Banner.png` (256×256, e.g. tint the game's colorable `bannerSprite` and center it — see `extractor/README.md`).
4. New branching units (e.g. Yulan house upgrades) may lack resolved prefab visuals; `convert.mjs` tolerates a missing `sprite` via optional chaining, and the UI degrades gracefully.

### Localization

- Multi-language support via Next.js i18n (configured in `next.config.js`)
- Game terms stored in `lib/collections/termMap.json`, site terms in `siteTermMap.json`
- `getTerm(key, locale)` and `getSiteTerm(key, locale)` handle lookups with fallback to English
- Swedish locale disabled (placeholder only)

### Component Patterns

- `TermsProvider` context provides localized strings to all components
- `withStaticBase()` HOC wraps `getStaticProps` to add shared data
- Town planning uses ReactFlow with custom `BuildingNode` components

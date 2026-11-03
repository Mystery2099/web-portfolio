# Developer portfolio

Mathew Kennedy-Brewer's portfolio, built with SvelteKit 3, Svelte 5, TypeScript, Tailwind CSS 4, Bits UI, Lucide and TanStack (Query, Hotkeys, Table). Every page is prerendered to static HTML, and GitHub data loads in the browser.

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # type-check
pnpm build      # static site in build/
pnpm preview    # serve the build
```

## Editing content

Content lives in Markdown under `content/`. Lists go in each file's frontmatter (the YAML between the `---` lines) and prose goes in the body. Site-wide settings stay in TypeScript under `src/lib/data/`.

| File | What it holds |
| --- | --- |
| `content/projects/<slug>.md` | One project each. The file name is its URL (`/projects/<slug>`) |
| `content/about.md` | About intro, skills, interests, the philosophy statement, optional `portrait` |
| `content/experience.md` | Work, education, competitions, certifications, academic work, page intro |
| `content/home.md` | The intro paragraph on the home page |
| `src/lib/data/site.ts` | Name, email, GitHub, résumé links, LinkedIn |
| `src/lib/data/projects.ts` | The "Little Minecraft mods" card, current focus, tools list |
| `src/lib/data/taxonomy.ts` | Project categories and the "Built with" filters |
| `src/lib/data/nav.ts` | Pages shown in the dock, the classic nav and the command palette |

In page intros, `*emphasis*` gets the wavy underline. In the About philosophy statement (`### ` under `## Philosophy`), `**bold**` gets the stretch-on-hover effect.

### Project files

The frontmatter (between the `---` lines) holds the card details: `title`, `order`, `category`, `blurb`, `stack`, `repo` and so on. Copy an existing file to start a new project. Below it, write the case study:

```md
Overview paragraphs go first, with no heading.

## Features
- One bullet per feature

## Architecture
How it's put together. A `diagram:` in the frontmatter draws the boxes.

## Challenges
### Porting to 1.21
What was hard and how you solved it. Each ### becomes a card.

## Status
Where it stands. Put the short label in the frontmatter as `status:`.
```

A project gets its own page once it has an overview paragraph. Without one, its cards link straight to GitHub. Screenshots go in `static/` and are listed under `screenshots:` with `src` and `alt`.

Any paragraph starting with `TODO:` shows as a dashed placeholder while running `pnpm dev`, and is hidden on the live site. A section that only holds TODOs is hidden too.

Mistakes fail the build with the file name and the problem, e.g. `content/projects/voxlib.md: Unrecognized key: "stak"` or an unknown `## Section`. In YAML, wrap values containing `: ` or `, ` inside `{ }` in quotes.

### Still to fill in

- `portrait` in `content/about.md`, and screenshots for AlfredGO, HappyCMS, D&D 5e Spellbook, VoxLib and GearLever Turbo.
- Wooden Accents and Colorful Diamonds use images from their official Modrinth galleries (see `static/projects/SOURCES.md`). Published mods already have Modrinth download links.

The downloadable résumé is `static/Mathew_Kennedy-Brewer_Resume.pdf` (`site.resumePdf`). Replace the file to update it.

## How it's put together

- **Navigation**: `Dock.svelte` (floating dock) and `Rail.svelte` (classic nav) share `nav.ts`. The dock's "auto" position resolves to top (≥1280px), left (≥600px) or bottom (phones) in `prefs.svelte.ts`. An inline script in `app.html` applies saved preferences before first paint, so there's no flash.
- **Preferences**: theme (light/dark/system), nav style, dock position and the projects view are persisted with `runed`'s `PersistedState`.
- **Command palette**: Bits UI `Dialog` and `Command`. Entries are built in `src/lib/commands.ts`. Open it with Ctrl/⌘ K or `/` (TanStack Hotkeys).
- **Projects**: search, category and tech filters are kept in the URL (`/projects?tech=Kotlin`). The list view is a sortable TanStack Table.
- **Content**: `src/lib/content/plugin.ts` is a small Vite plugin that turns `content/*.md` into data at build time, using TanStack Markdown and validating frontmatter with Zod (`collections.ts`). The parser and validator never ship to the browser, and each project's write-up only loads on its own page.
- **GitHub**: `src/lib/github/` fetches from the public REST API through TanStack Query. Responses are persisted to localStorage for 24h to stay under GitHub's 60 unauthenticated requests per hour.

## Deploying

`.github/workflows/deploy.yml` type-checks, builds and deploys `build/` to Azure Static Web Apps. Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret first. `site.url` in `src/lib/data/site.ts` is the live address; link previews, canonical links, `/sitemap.xml` and `/robots.txt` are built from it. `static/staticwebapp.config.json` handles clean URLs, the 404 page and caching. The output is plain static files, so to move hosts you only need to replace the deploy job.

---
title: D&D 5e Spellbook
order: 5
ini: D&D
shape: sunny
tone: rose
glyph: book
category: web
categoryLabel: Web Application
kind: Web app
tagline: Web app · Svelte
primary: true
blurb: A responsive D&D 5e spell browser with search, class and level filters, cached API data, and theme options.
stack: [Svelte 5, Vite, Tailwind, REST API]
techs: [Svelte]
repo: https://github.com/Mystery2099/dnd-5e-spellbook
status: Core features implemented

facts:
  Framework: Svelte 5
  Styling: Tailwind
  Data: REST API

stackGroups:
  Frontend: [Svelte 5, Vite]
  Styling: [Tailwind]
  Data: [REST API]
---

I made this app to make looking through Dungeons & Dragons 5e spells a little easier. Instead of digging through pages of spell information, you can search, filter, and open the details of the spells you're interested in. I also wanted it to work well on both desktop and mobile, since something like this is useful to have open during a game.

## Features

- Browse spells from the D&D 5e API
- Search spells by name and filter by class or spell level
- Detailed spell information with Markdown rendering
- In-memory caching to avoid unnecessary API requests
- Light, dark, and system theme options
- Responsive layouts for desktop and mobile
- HTML sanitization for rendered Markdown

## Architecture

The frontend is built with Svelte 5, Vite, and Tailwind CSS. I separated the interface into components for the spell list, filters, spell details, and theme controls, while API requests, caching, and Markdown processing live in their own modules. The app retrieves its spell information from an external REST API rather than maintaining its own database.

## Challenges

### Avoiding unnecessary API requests

Fetching the same information repeatedly isn't particularly useful, especially when someone is browsing through a bunch of spells. I added in-memory caching with different expiration times for lists, individual spells, and classes. This reduces repeated requests without making the app overly complicated.

### Handling spell descriptions

Spell details can contain formatted text, so simply displaying everything as plain text wouldn't be ideal. I used Markdown rendering for the descriptions and sanitization for the resulting HTML. I also had to make the details view usable on narrower screens without cramming everything together.

## Status

The core spell browsing, filtering, caching, and theme features are implemented. Some things I'd like to add later are favorites, better persistent caching, offline support, and options for printing or exporting spell lists. It's a relatively small project, but it's been useful for experimenting with Svelte 5 and client-side application structure.

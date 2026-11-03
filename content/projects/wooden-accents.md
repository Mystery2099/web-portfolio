---
title: Wooden Accents
order: 1
ini: WA
shape: cookie
tone: sand
glyph: armchair
category: mc
categoryLabel: Minecraft & Modding
kind: Minecraft mod
tagline: Minecraft mod · Kotlin
primary: true
featured: true
blurb: A Minecraft mod that adds vanilla-style furniture, storage, and wooden building blocks for builders who want more options.
shortBlurb: Vanilla-style furniture, storage, and structural blocks for different wood types, with Fabric and NeoForge support.
stack: [Kotlin, Java, Fabric, NeoForge, Gradle]
featuredStack: [Kotlin, Fabric, NeoForge]
techs: [Kotlin, Java]
repo: https://github.com/The-Mystora-Project/WoodenAccentsMod
download: { label: Get it on Modrinth, href: https://modrinth.com/mod/wooden-accents-mod }
screenshots:
  - src: /projects/wooden-accents/structural-combinations.png
    alt: Wooden Accents thick pillars connecting to walls in Minecraft
status: In active development

facts:
  Languages: Kotlin, Java
  Loaders: Fabric, NeoForge
  Build: Gradle

stackGroups:
  Languages: [Kotlin, Java]
  Mod loaders: [Fabric, NeoForge]
  Tooling: [Gradle, Git]

screenshotHints:
  - "Gameplay capture: a finished build using the mod's blocks"
  - Bookshelves & storage
  - Block connections

diagram:
  label: "Diagram: the shared implementation feeds Fabric and NeoForge entry points, and Gradle builds one release per loader"
  top:
    name: shared
    note: Blocks, connections, interactions
  middle:
    - name: fabric
      note: Loader entry point
    - name: neoforge
      note: Loader entry point
  bottom:
    name: gradle build
    note: One release per loader
---

Wooden Accents is a Minecraft building and decoration mod I've been working on for several years. It started because I kept wishing vanilla Minecraft had a few more wooden blocks for building, especially furniture and smaller structural details. I don't want to completely change Minecraft's style; I just want to give builders more options that still look like they belong in the game.

## Features

- Chairs you can sit in, tables, coffee tables, and desks
- Kitchen counters, cabinets, desk drawers, and crates
- Narrow bookshelves and shelves with storage or display functionality
- Support beams, pillars, plank flooring, and plank walls
- Ladders, picket fences, and gates with custom connection behavior
- Variants for many vanilla wood types, including Nether wood types
- Fabric and NeoForge support for clients and dedicated servers

## Architecture

Wooden Accents is mostly written in Kotlin, with shared gameplay code and separate loader integration for Fabric and NeoForge. Gradle builds the loader-specific releases, and VoxLib handles a lot of the voxel shape utilities used throughout the mod. I've tried to keep common functionality reusable rather than duplicating it for every wood type or mod loader.

## Challenges

### Getting blocks to connect and behave correctly

A lot of the blocks aren't just static decorations. Ladders, beams, pillars, and other pieces need to change how they connect depending on what's around them, while furniture and storage blocks have their own interactions. Working through those behaviors has taught me quite a bit about Minecraft's block states, shapes, and interaction systems.

### Supporting multiple loaders and Minecraft versions

Minecraft modding changes quite a bit between versions, and Fabric and NeoForge don't always approach things the same way. I try to share as much implementation as possible while keeping the loader-specific integration separate. Maintaining older versions also takes time, so I'm focusing new features on newer versions and limiting maintenance of old releases to important fixes.

## Status

Wooden Accents is in active development, and it's probably the project I've spent the most time on. There's still a pretty long list of blocks and improvements I'd like to add, but I'm trying to focus on making the existing features work well before piling on more. New development is focused on modern Minecraft versions, while older releases remain available for existing worlds.

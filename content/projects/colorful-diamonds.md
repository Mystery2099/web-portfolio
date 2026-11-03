---
title: Colorful Diamonds
order: 6
ini: CD
shape: flower
tone: lav
glyph: gem
category: mc
categoryLabel: Minecraft & Modding
kind: Minecraft mod
tagline: Minecraft mod · Java
blurb: A Minecraft mod that lets players dye diamonds in 16 colors and craft matching tools, armor, and blocks.
stack: [Java, Fabric, Forge, Quilt]
techs: [Java]
repo: https://github.com/The-Mystora-Project/Colorful-Diamonds-Mod
status: Older project
download: { label: Get it on Modrinth, href: https://modrinth.com/mod/colorful-diamonds-mod }
screenshots:
  - src: /projects/colorful-diamonds/diamonds-and-blocks.png
    alt: The sixteen colored diamonds and matching diamond blocks
---

Colorful Diamonds is a Minecraft mod that lets you color diamonds using the game's 16 dyes, then use them to craft matching blocks, tools, armor, and horse armor. It was a fun way to experiment with adding more item and equipment variants without changing the core idea of diamonds. The project also gave me experience supporting more than one Minecraft mod loader.

## Features

- Sixteen colored diamond variants based on Minecraft dyes
- Matching blocks, tools, armor, and horse armor
- Shared Java implementation across Fabric, Forge, and Quilt

## Architecture

The mod is written in Java and organized into a shared module alongside Fabric, Forge, and Quilt modules. Most of the implementation is shared, with separate entry points and registration code for each loader. Gradle builds the different versions from the same repository.

## Challenges

### Managing variants across multiple loaders

Adding an entire set of colored materials means keeping quite a few related items and assets organized. Supporting three mod loaders adds another layer, since each one has its own registration and setup requirements. Using shared code reduced the amount of duplicate work and helped keep the different versions consistent.

## Status

This is an older mod project rather than one of my main current development priorities. Its source code is still available, and it's a good example of my earlier work with Java and multi-loader Minecraft modding.

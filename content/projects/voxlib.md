---
title: VoxLib
order: 2
ini: Vx
shape: clover
tone: teal
glyph: boxes
category: tools
categoryLabel: Libraries & Developer Tools
kind: Library
tagline: Library mod · Kotlin
primary: true
blurb: A Kotlin library for creating, combining, rotating, simplifying, and debugging Minecraft voxel shapes.
stack: [Kotlin, Fabric, NeoForge, Gradle, KDoc]
techs: [Kotlin]
repo: https://github.com/The-Mystora-Project/VoxLib
status: Actively maintained
download: { label: Get it on Modrinth, href: https://modrinth.com/mod/voxlib }

facts:
  Language: Kotlin
  Loaders: Fabric, NeoForge
  Docs: KDoc

stackGroups:
  Language: [Kotlin]
  Mod loaders: [Fabric, NeoForge]
  Documentation: [KDoc]
---

VoxLib originally started as utility code inside Wooden Accents. I was constantly dealing with Minecraft's `VoxelShape` API to build and rotate collision and outline shapes, and a lot of that code ended up being repetitive. Eventually it made more sense to turn those utilities into a separate library that I could reuse in other mods and that other developers could use too.

## Features

- Create cuboids using Minecraft's familiar 0–16 block coordinates
- Combine and conditionally assemble voxel shapes
- Rotate and flip shapes without rewriting them for each direction
- Built-in shape helpers for common block types
- Caching for repeated shape operations
- Simplified outlines and in-game debugging tools
- Kotlin API documentation and usage guides, including Java interoperability

## Architecture

VoxLib is written primarily in Kotlin and uses a shared module for its shape operations, caching, and other reusable functionality. Loader-specific modules connect it to Fabric and NeoForge. The idea is to provide a cleaner API without trying to replace Minecraft's underlying voxel shape system.

## Challenges

### Making directional shapes less repetitive

One of the original problems I wanted to solve was having to manually define essentially the same shape for different block directions. Rotation and transformation helpers let me define a shape once and adapt it for different orientations. This made my block code much easier to read, especially when dealing with connected or more detailed models.

### Keeping the utilities efficient

Voxel shapes are queried pretty frequently, so I didn't want convenience functions to come with unnecessary overhead. I added caching for repeated operations and worked on ways to simplify shapes when full detail isn't needed. Making a library convenient is nice, but it's not very helpful if it ends up slowing down the mods using it.

## Status

VoxLib is an actively maintained dependency for Wooden Accents and is also available for other mod developers to use. It supports Fabric and NeoForge on newer Minecraft versions, with older versions kept available for compatibility. I'm continuing to improve its API, documentation, and performance as I work on other mods.

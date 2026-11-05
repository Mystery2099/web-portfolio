---
title: AlfredGO
order: 4
ini: AG
shape: arch
tone: teal
glyph: dashboard
category: web
categoryLabel: Full-Stack Web Application
kind: Web app
tagline: Full-stack web app · SvelteKit
primary: true
featured: true
blurb: A prototype dashboard I built so Alfred State students and staff could find campus tools and resources in one place.
shortBlurb: A campus dashboard with role-based tools, favorites, announcements, admin controls, and PWA support.
stack: [SvelteKit, TypeScript, SQLite, Drizzle, PWA]
featuredStack: [SvelteKit, TypeScript, Drizzle]
techs: [TypeScript, Svelte]
repo: https://github.com/Mystery2099/alfred-go
status: Functional prototype

facts:
  Framework: SvelteKit
  Language: TypeScript
  Data: SQLite + Drizzle

stackGroups:
  Frontend: [SvelteKit, TypeScript]
  Data: [SQLite, Drizzle]
  Platform: [PWA]
---

AlfredGO is a prototype dashboard I built for my Web Programming 2 final project at Alfred State College. The idea was to have one place where students and staff could find campus tools, announcements, and other useful resources instead of having to remember where everything is. I wanted it to feel like an actual application, not just a page full of links.

## Features

- Personalized dashboard with announcements and recently used tools
- Browse and search campus resources by name, category, and tags
- Favorite and pin frequently used tools
- Authentication and role-based visibility for students, staff, and admins
- Admin tools for managing resources, categories, and announcements
- Progressive web app support, including offline functionality and push notifications
- SQLite database using Drizzle ORM

## Architecture

The application uses SvelteKit for the frontend and server-side functionality, with TypeScript throughout. SQLite stores application data, and Drizzle handles database access. Having everything in one SvelteKit project made sense for a class project of this size while still letting me separate the user interface, server logic, and database operations.

## Challenges

### Making the dashboard useful for different users

The dashboard isn't supposed to show everyone exactly the same things. Students, staff, and administrators have different needs, so I had to think about authentication and which tools should be visible for each role. That also meant keeping administration separate from the parts of the application regular users interact with.

### Building more than a static website

I wanted AlfredGO to behave like an application people could actually use, including on a phone. Features like favorites, announcements, and PWA support added quite a bit more to think about than just designing a dashboard. It was a good opportunity to work with both frontend and backend functionality in the same project.

## Status

AlfredGO is a class project and functional prototype, not an official Alfred State service. The main goal was to explore what a centralized campus dashboard could look like and implement the core features. There's still room for further refinement and testing if I decide to revisit it.

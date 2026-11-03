---
title: HappyCMS
order: 4
ini: HC
shape: flower
tone: lav
glyph: file
category: web
categoryLabel: Full-Stack Web Application
kind: Web app
tagline: Full-stack web app · PHP
primary: true
featured: true
blurb: A small content management system with a traditional PHP backend and a Svelte 5 frontend.
shortBlurb: A small CMS I built with PHP, SQLite, and Svelte 5, with authentication, content editing, and search.
stack: [PHP, Svelte 5, SQLite]
techs: [PHP, Svelte]
repo: https://github.com/Mystery2099/happycms
status: Working project

facts:
  Backend: PHP
  Frontend: Svelte 5
  Data: SQLite

stackGroups:
  Backend: [PHP]
  Frontend: [Svelte 5]
  Data: [SQLite]
---

HappyCMS is a small content management system I made using PHP, SQLite, and Svelte 5. I wanted to work with a more traditional PHP backend while still having a reactive frontend, instead of making the whole thing a single-page JavaScript backend application. It gave me a chance to put together authentication, database operations, and an interactive interface without relying on a large PHP framework.

## Features

- Authentication and protected content editing
- Create and manage content through a web interface
- Search and filter stored content
- SQLite for data storage
- Responsive layout with light and dark theme support
- Svelte 5 components for interactive parts of the interface

## Architecture

PHP handles the server-side routing, sessions, validation, and database operations. The frontend is built with Svelte 5, which handles interactive components and communicates with the PHP endpoints. SQLite keeps the persistence side relatively simple, which was a good fit for the scale of this project.

## Challenges

### Connecting PHP and Svelte

I wanted the PHP backend and Svelte frontend to each have a clear job. That meant deciding what should be handled by the server, what could stay in the browser, and how data should move between them. Keeping the responsibilities separate made the application easier to reason about as it grew.

### Authentication and protected operations

A content management system needs more than a nice interface if people can edit stored content. I had to account for sessions, validation, and making sure editing operations are handled by the backend. This was a good opportunity to get more experience with the parts of web development that aren't immediately visible on the page.

## Status

HappyCMS is a working project that I primarily built for experience with full-stack development. It covers the basic content-management workflow, but it's not intended to compete with larger CMS platforms. If I return to it, I'd focus on improving the editing experience, testing, and general maintainability.

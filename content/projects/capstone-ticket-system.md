---
title: Capstone Ticket System
order: 2
ini: TS
shape: arch
tone: rose
glyph: ticket
category: web
categoryLabel: Full-Stack Web Application
kind: Web app
tagline: Full-stack web app · SvelteKit + PostgreSQL
primary: true
featured: true
blurb: A support ticket system for a small IT team, with role-based permissions, internal notes, full-text search, and MFA, built on SvelteKit and PostgreSQL.
shortBlurb: A help desk app where requesters submit tickets, agents work the queue, and admins manage roles, with PostgreSQL behind it.
stack: [SvelteKit, Svelte 5, TypeScript, PostgreSQL, Drizzle, Better Auth, Tailwind CSS, Tiptap, Azure]
featuredStack: [SvelteKit, PostgreSQL, Drizzle]
techs: [TypeScript, Svelte]
repo: https://github.com/Mystery2099/capstone-ticket-system
status: Working, hosted on Azure

links:
  - label: Live site
    href: https://capstone-tickets-mkb.azurewebsites.net
    caption: Azure free tier, so the first load can take up to a minute

screenshots:
  - src: /projects/capstone-ticket-system/ticket-with-internal-note.png
    alt: An agent viewing a ticket with its description, status and priority controls, replies, and a highlighted internal note
  - src: /projects/capstone-ticket-system/workspace-dark.png
    alt: The ticket workspace in dark mode, with a sidebar of views and categories and a list of tickets
  - src: /projects/capstone-ticket-system/admin-edit-role.png
    alt: The role editor in Administration, with a checklist of permissions for the Agent role

facts:
  Framework: SvelteKit
  Language: TypeScript
  Data: PostgreSQL + Drizzle
  Hosting: Azure

stackGroups:
  Frontend: [Svelte 5, Tailwind CSS 4, Bits UI, Tiptap]
  Server: [SvelteKit, TypeScript, Better Auth, Superforms]
  Data: [PostgreSQL, Drizzle ORM, PGlite]
  Testing & ops: [Vitest, Playwright, GitHub Actions, Azure]

diagram:
  label: "Diagram: one SvelteKit server handles auth and permissions through Better Auth and data access through Drizzle, both backed by PostgreSQL"
  top:
    name: sveltekit server
    note: Routes, permissions, validation
  middle:
    - name: better auth
      note: Sessions, passwords, MFA
    - name: drizzle
      note: Queries, migrations
  bottom:
    name: postgresql
    note: Constraints, indexes, search
---

The Capstone Ticket System is a web-based support ticket system I built for my Open Source Database Lab in Applied Database Management. It's made for a fictional small IT support team: requesters submit tickets and follow their progress, agents assign and respond to them, and administrators manage accounts, roles, and categories. I modeled the interface on an email client, since I wanted it to feel familiar to people who aren't very technical.

## Features

- Separate views for requesters, agents, and administrators, with permissions saved per role
- Ticket workspace with a sidebar, ticket list, and reading pane on desktop, and a one-page-at-a-time layout on phones
- Internal notes that only support staff can see, filtered out on the server
- Full-text search with typo tolerance, quoted phrases, excluded words, and jumping straight to a ticket by number
- Rich-text descriptions and replies through a restricted Tiptap editor that stores Markdown
- An inbox for assignments and replies, with control over who gets notified
- Ticket history where every change is recorded alongside the comments
- Passwords, sessions, and authenticator-based MFA through Better Auth
- Keyboard shortcuts, drafts that survive failed submissions, and light and dark themes

## Architecture

The whole thing is one SvelteKit application instead of a separate API and frontend, which keeps the database credentials and query logic in one server-side place. Server routes and actions check the session, the user's permissions, and the submitted input before reading or changing anything, and the browser never talks to PostgreSQL directly. Drizzle handles queries and tracked migrations, and Better Auth owns the account, session, and MFA tables. Local development runs on PGlite, an embedded version of PostgreSQL, and the hosted version uses Azure Database for PostgreSQL with a restricted database login that only has the privileges the app needs.

## Challenges

### Keeping internal notes private

Internal notes are where agents talk about a ticket without the requester seeing it, so they can't leak anywhere. Hiding them on the ticket page wasn't enough, because search excerpts, comment counts, and the activity feed could all reveal them too. I ended up building the search document at query time from only the content the current user is allowed to see, and filtering everything else on the server before it's sent.

### Making every change traceable

Every ticket change, like a new status or assignee, is written together with a history entry in one transaction, with the ticket row locked while it changes. That way a failed history entry also undoes the change, and two people editing the same ticket can't overwrite each other. Later, a friend testing it pointed out that one line per change made phone users scroll too much, so the timeline now groups changes made by the same person close together while still keeping each one as its own row in the database.

### Deciding what not to build

My professor wanted file attachments, but doing them properly means a second place where data lives, with its own access rules and backups. I didn't have enough time to build and test that to the same standard as the rest of the project, so I wrote up how I would add them instead, using private Azure Blob Storage, attachments that inherit the visibility of their ticket or note, and changes to the backup plan.

## Status

The ticket system is working and hosted on Azure, along with documentation for the needs assessment, requirements, database design, security and recovery plan, and deployment. Linting, type checks, unit tests, and Playwright end-to-end tests run in GitHub Actions. Since it's on Azure's free tier, the first request after a while can be slow. File attachments, single sign-on, and MFA for every account are planned improvements I'd look at for a production version.

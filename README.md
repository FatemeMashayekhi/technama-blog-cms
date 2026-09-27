# Technama — Multi-Author Technology Magazine & Blog CMS

Technama is a portfolio-grade, full-stack content management system for a Persian technology magazine. It combines a public editorial website and a newsroom administration panel in a single codebase.

Built with Next.js, React, TypeScript, Tailwind CSS, and Supabase, the project was designed from the ground up for right-to-left content, Persian typography, accessibility, responsive behavior, and realistic editorial workflows.

> This project was created from start to finish with the help of ChatGPT—from product ideation, information architecture, and UI/UX design to implementation, code review, debugging, testing, and documentation.

## Overview

Technama provides two distinct but connected experiences:

- A public magazine website for reading articles, searching content, browsing categories and tags, and discovering authors
- An editorial dashboard for managing articles, authors, media, taxonomy, comments, analytics, and site settings

The goal is to demonstrate the design and development of a realistic CMS-scale product rather than a collection of disconnected screens. Routing, loading and empty states, error handling, filtering, forms, responsive layouts, metadata, and automated quality checks are all part of the project.

## Features

### Public Magazine

- Editorial homepage with featured stories, trending topics, and curated content
- Article archive with search, category filtering, sorting, and pagination
- Shareable URL-based filter and pagination state with correct browser Back/Forward behavior
- Article detail pages with a table of contents, reading time, sharing tools, author details, related articles, and comments
- Public category, author, and tag pages
- Search page with no-results, error, and not-found states
- Real newsletter subscriptions and moderated comment submission
- Fully responsive RTL interface

### Editorial Dashboard

- Newsroom dashboard with key content indicators
- Article creation and management with a TipTap rich-text editor
- Author and profile management
- Category and tag management
- Media library backed by Supabase Storage
- Comment moderation workflows
- Content analytics dashboard
- Multi-section settings interface
- Dedicated administration namespace under `/admin`

### UI, UX, and Accessibility

- Self-hosted Vazirmatn variable font
- Responsive layouts for mobile, tablet, and desktop
- Skip link and improved keyboard navigation
- Focus trapping and focus restoration in search and mobile navigation dialogs
- Touch-friendly interactive controls
- Support for `prefers-reduced-motion` and increased-contrast preferences
- Optimized hero imagery and rendering of below-the-fold content
- Dynamic metadata, sitemap, robots rules, and Web App Manifest

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 with App Router |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | TipTap |
| Backend | Supabase: PostgreSQL, Auth, Storage, and Row Level Security |
| Data schema | Drizzle ORM and SQL migrations |
| Validation | Zod |
| Icons | Lucide React |
| Font | Vazirmatn Variable |
| Quality | ESLint, TypeScript, Node Test Runner, and HTTP smoke tests |

## Getting Started

### Requirements

- Node.js `20.9` or later
- npm

### Installation

```bash
npm install
npm run dev
```

After starting the development server:

- Public website: `http://localhost:3000`
- Editorial dashboard: `http://localhost:3000/admin/dashboard`
- Sign-in page: `http://localhost:3000/login`

Legacy dashboard routes such as `/dashboard` and `/posts` redirect to their corresponding `/admin` routes for compatibility.

## Backend and Database Setup

The application uses Supabase when it is available and falls back to the versioned editorial seed only when the database is unavailable or empty. Complete the following steps to enable persistent storage and authentication:

1. Create a new Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the values from the Supabase project settings.
3. Run `supabase/migrations/202609120001_initial_cms.sql` using the Supabase SQL Editor or Supabase CLI.
4. Start the application and create the first account at `/login`.
5. Run `npm run seed:all` once to create the editorial author profiles and upsert the curated public articles, categories, and article-tag relations. The command is idempotent and requires `SUPABASE_SERVICE_ROLE_KEY`.
6. The first account receives the `admin` role; subsequent accounts receive the `author` role.
7. After creating the first administrator, set `NEXT_PUBLIC_ALLOW_SIGNUP=false` in `.env.local`. New team members can then be invited from the dashboard.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and is required for author invitations and administrative user management. Never expose it through a `NEXT_PUBLIC_` variable or commit it to Git. `.env.local` is ignored, while `.env.example` is intentionally tracked as a safe template.

### Security Model

- Authentication sessions are managed through secure cookies compatible with React Server Components.
- The Next.js Proxy performs the initial protection of `/admin` routes.
- Every API endpoint independently validates the authenticated user and their role.
- PostgreSQL Row Level Security is the final authorization boundary.
- Authors can modify only their own articles and media; editors and administrators receive broader permissions.
- Commenter email addresses are available only to authorized editorial users and are never returned by the public API.
- Uploaded files use user-specific paths, an allowlist of MIME types, and a 6 MB size limit.
- Database-backed rate limiting protects public comment and newsletter endpoints.

## Available Scripts

```bash
# Start the development server
npm run dev

# Run ESLint
npm run lint

# Run TypeScript checks
npm run typecheck

# Run automated quality tests
npm test

# Create a production build
npm run build

# Start the production server
npm start

# Test the main HTTP routes after starting the server
npm run test:smoke
```

Set `SMOKE_BASE_URL` to run the smoke test against a different address.

## Project Structure

```text
app/
├── admin/                 # Editorial dashboard routes
├── api/                   # Authenticated and public API endpoints
├── articles/              # Article archive and detail pages
├── authors/               # Author directory and profile pages
├── categories/            # Category directory and detail pages
├── tags/                  # Tag directory and detail pages
├── search/                # Public content search
├── login/                 # Authentication UI and server actions
├── layout.tsx             # Root layout and global metadata
├── sitemap.ts             # Sitemap generation
├── robots.ts              # Indexing rules
└── manifest.ts            # Web App Manifest

components/
├── public/                # Public magazine components
├── layout/                # Dashboard shell and navigation
├── editor/                # Article editor components
└── ...                    # Authors, media, comments, taxonomy, and analytics

db/                        # Drizzle schema definitions
lib/                       # Services, validation, auth, data access, and demo data
public/                    # Fonts, illustrations, and static assets
supabase/migrations/       # PostgreSQL schema, RLS policies, and storage setup
scripts/smoke-test.mjs     # HTTP route smoke test
tests/                     # Automated architecture and UI quality tests
```

## Data and Backend Status

The operational CMS core is connected to the real backend, including:

- Authentication and role-based access control
- Articles and revision history
- Categories and tags
- Author invitations and profile management
- Media storage
- Comment submission and moderation
- Newsletter subscriptions
- Site settings

Public content services retain a versioned editorial fallback so every published route remains reviewable if Supabase is temporarily unavailable. The Analytics dashboard currently uses sample data; live analytics requires event collection and aggregation infrastructure.

## ChatGPT Collaboration and GitHub History

Every stage of this project—from product definition and architecture to interface design, implementation, refactoring, testing, and documentation—was completed with the assistance of ChatGPT. Development happened incrementally and locally, with review feedback applied throughout the process.

This project was not hosted on GitHub from the beginning of its development. As a result, the public Git history does not contain every early development step. The first public commit represents an import of an already substantially developed project. This note is included to keep the development history transparent.

## Planned Improvements

- Add component and browser-based end-to-end tests
- Connect an email delivery provider to the newsletter subscriber list
- Add distributed rate limiting and CAPTCHA to public forms
- Implement event collection for live analytics
- Add secure draft previews and server-side scheduled publishing
- Deploy with error monitoring and Core Web Vitals tracking

## License

This project is currently maintained as a personal portfolio project. Review the repository license before commercial use, redistribution, or derivative publication.

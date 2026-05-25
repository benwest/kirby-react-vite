# kirby-react-vite

A boilerplate for building sites with [Kirby CMS](https://getkirby.com) as a headless backend and React as the frontend.

## Stack

- **[Kirby CMS](https://getkirby.com)** — content management, served as JSON via a custom plugin
- **[React 19](https://react.dev)** — UI
- **[React Router v7](https://reactrouter.com)** — client-side routing with data loaders
- **[Vite](https://vite.dev)** — dev server and build tool
- **[Tailwind CSS v4](https://tailwindcss.com)** — styling
- **[Zod](https://zod.dev)** — runtime validation of Kirby JSON responses
- **[Plop](https://plopjs.com)** — code generators for pages and components

## How it works

Kirby serves every page as JSON at `/<slug>.json` (and `/home.json` for the home page, `/site.json` for global site data). A React Router data loader fetches the current page's JSON and `site.json` in parallel on every navigation, validates the responses with Zod, and makes the data available through `usePage()` and `useSite()` hooks.

In production, Kirby's PHP templates render the HTML shell and inject the Vite-built assets. In development, Vite runs its own dev server alongside the PHP server.

## Prerequisites

- Node.js
- PHP 8.4+

## Getting started

```bash
npm install
npm run dev
```

This starts both the PHP server on `localhost:8000` and the Vite dev server on `localhost:8001`. Open `localhost:8000` in your browser.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start PHP + Vite dev servers |
| `npm run build` | Build frontend assets to `www/assets/build/` |
| `npm run serve` | Start the PHP server only |
| `npm run preview` | Build preview with PHP server |

## Project structure

```
kirby-react-vite/
├── src/
│   ├── components/
│   │   ├── App/            # Root app component
│   │   ├── HTML/           # Renders Kirby HTML field output
│   │   ├── Image/          # Image with srcset support
│   │   ├── Link/           # Re-exports react-router Link
│   │   ├── Page/           # PageProvider, usePage, useSite
│   │   └── RichText/       # Renders Kirby richtext HTML
│   ├── hooks/
│   │   ├── useEvent.ts     # Stable callback reference
│   │   ├── useMediaQuery.ts# Tailwind breakpoint matching
│   │   ├── useRect.ts      # ResizeObserver-based element rect
│   │   └── useWindowSize.ts
│   ├── pages/              # One file per Kirby template
│   │   ├── default.tsx
│   │   ├── error.tsx
│   │   └── home.tsx
│   ├── types/              # Zod schemas for Kirby data
│   │   ├── common.ts
│   │   ├── files.ts
│   │   ├── pages.ts
│   │   ├── site.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── getCssVariable.ts
│   │   ├── isUrlExternal.ts
│   │   ├── math.ts
│   │   └── props.ts        # bindProps, mergeProps
│   ├── loader.ts           # React Router data loader
│   └── main.tsx            # Entry point, router setup
└── www/
    ├── content/            # Kirby content files
    ├── site/
    │   ├── config/         # Kirby config (thumbs, markdown, etc.)
    │   ├── json/           # JSON templates (see below)
    │   │   ├── site.php
    │   │   ├── pages/
    │   │   ├── files/
    │   │   └── blocks/
    │   ├── plugins/
    │   │   ├── json/       # JSON routing plugin
    │   │   └── utils/      # Field/page helper methods
    │   └── templates/      # PHP HTML shells
    └── index.php
```

## Adding a page template

Use the plop generator:

```bash
npx plop page
```

Enter the template name (e.g. `about`). This creates `src/pages/about.tsx`.

You'll also need to:

1. Add a JSON template at `www/site/json/pages/about.php`:

```php
<?php
use Kirby\Cms\Page;

return function (Page $page) {
  return [
    'type'  => 'about',
    'title' => $page->title()->value(),
    'url'   => $page->url(),
  ];
};
```

2. Add a Zod schema in `src/types/pages.ts`:

```ts
export const AboutPageContent = z.object({
  type: z.literal("about"),
  url: z.string(),
  title: z.string(),
})
export type AboutPageContent = z.infer<typeof AboutPageContent>
```

3. Add it to the `PageContent` discriminated union in the same file.

## The `json` plugin

The `bewe/json` plugin (`www/site/plugins/json/`) adds `.json()` methods to Kirby's core objects and registers a `*.json` route.

Each call resolves a JSON template by trying candidates in order and returning the first match:

| Object | Candidates tried |
|--------|-----------------|
| `$page->json($type)` | `pages/$type`, `pages/{template}`, `pages/default` |
| `$site->json()` | `site` |
| `$file->json($type)` | `files/$type`, `files/{template}`, `files/{mime-type}`, `files/default` |
| `$block->json($type)` | `blocks/$type`, `blocks/{type}`, `blocks/default` |
| `$user->json($type)` | `users/$type`, `users/{role}`, `users/default` |

Collections (`$pages`, `$files`, etc.) have a `.json()` method that maps over items and returns an array.

The optional `$type` argument forces a specific template — useful when you want to render a subset of page data.

## The `utils` plugin

The `bewe/utils` plugin adds ergonomic helpers for building JSON responses:

- **`$field->to($callback)`** — extract a value from a field: `$page->title()->to(fn($v) => strtoupper($v))`
- **`$field->pipe($callback)`** — transform a field's value in place
- **`$field->with($callback)`** — work with a field clone
- **`$field->toPath()`** — convert a URL field to a site-relative path
- **`$page->to($callback)`**, **`$site->to($callback)`**, **`$collection->to($callback)`** — pipe any object through a callback

## Page data in React

The `loader` fetches `site.json` and the current page's JSON on every navigation:

```ts
// src/loader.ts
export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname, origin } = new URL(request.url)
  const pagePath = pathname === "/" ? "/home.json" : `${pathname}.json`
  const [site, page] = await Promise.all([
    fetchJson(new URL("/site.json", origin), request.signal),
    fetchJson(new URL(pagePath, origin), request.signal),
  ])
  return { site, page }
}
```

`PageProvider` validates both with Zod and provides them through context:

```tsx
// In any page component
const page = usePage("home")   // typed as HomePageContent
const site = useSite()         // typed as SiteContent
```

## Generators

```bash
npx plop component   # creates src/components/MyComponent/
npx plop page        # creates src/pages/mytemplate.tsx
```

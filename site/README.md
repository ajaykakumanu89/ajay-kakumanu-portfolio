# Static portfolio website

A local-first, static presentation of the existing public portfolio. It includes a homepage, about page, HTML resume, and readable documentation samples. No accounts, analytics, contact form, or third-party fonts are used. No confidential DocFusion content is included.

## Build and preview

On this Windows computer, run `preview.cmd` from this folder (or double-click it in File Explorer). It builds, checks, and serves the site, using Node and Marked from the local installation or the existing bundled runtime. It does not install software or publish anything. Keep the command window open while browsing; press **Ctrl+C** to stop it.

For the standard cross-platform workflow:

Requires Node.js 20 or later. From this directory:

```console
npm install
npm run build
npm run check
npm run preview
```

Open the printed local URL, normally `http://127.0.0.1:4173`. Press **Ctrl+C** in the server terminal when finished. The server listens on loopback only and serves only the generated `dist` directory.

If using an existing installation of Marked 17.0.5, `node scripts/build.mjs --marked-module <absolute-path-to-marked.esm.js>` can build without installing a duplicate package. The normal npm workflow does not need this flag.

## Content and structure

- `templates/home.html`: portfolio homepage.
- `assets/`: shared styling, progressive-enhancement JavaScript, and favicon.
- `scripts/build.mjs`: renders the public repository Markdown into six reader pages and copies the homepage and assets.
- `scripts/check-site.mjs`: checks generated files, local links and fragments, unresolved template tokens, and basic document structure.
- `scripts/serve.mjs`: dependency-free, loopback-only preview server.
- `preview.cmd`: Windows build/check/preview launcher; no installation or deployment.
- `dist/`: generated static output; excluded from Git.

The builder only reads explicitly selected public Markdown files. Code and fixture links point to their GitHub sources; it does not copy the deliberately broken link-checker fixtures into the website. Source Markdown stays the authoritative content for the reader pages. The existing draft, AI-assistance, and review-status disclosures remain visible.

The generated-file manifest records build-owned outputs. Rebuilds remove only obsolete files from that manifest; unrecognized files in `dist/` stop the build instead of being deleted. See [the local QA record](QA.md) for completed checks and limitations.

## Publication

The user approved public publication on October 20, 2026, after the initial local preview. Website address: [Ajay Kakumanu’s portfolio](https://ajaykakumanu89.github.io/ajay-kakumanu-portfolio/).

The repository’s `Publish portfolio` GitHub Actions workflow installs the locked dependency, builds and validates the pages, and deploys only `dist/` to GitHub Pages. It runs on relevant pushes to `main` and can be started manually from the Actions tab. The build job has read-only repository access; only the deployment job receives Pages deployment permissions. All internal navigation and assets use relative paths for the project URL.

The local preview commands remain local-only: they do not push or deploy. Original resume documents, private files, and the confidential DocFusion guide are not included in the site. The earlier [QA record](QA.md) documents the pre-publication local checks and their limitations.

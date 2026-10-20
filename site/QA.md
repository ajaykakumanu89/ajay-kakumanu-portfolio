# Pre-publication local preview verification

Verified on October 20, 2026. This records checks of the static presentation, not verification of every career claim or documentation sample.

- Build succeeded for seven static HTML pages using the existing bundled Marked 17.0.5 installation.
- Static checks passed: 209 local file references and 119 HTML fragments, required pages and basic document structure, duplicate IDs, unresolved template tokens, and excluded employer-product/confidential terms.
- Existing repository checks passed: 14 required files and 27 local Markdown links.
- The loopback preview returned HTTP 200.
- Homepage and quickstart layouts were inspected at desktop (1280 × 900) and mobile (390 × 844) sizes. Neither had horizontal page overflow in those checks.
- Mobile navigation expanded correctly. Escape closed the menu, and the quickstart link opened the reader page.
- A quickstart code-copy button displayed its successful copied state.
- The final mobile API-reference table check was not completed because the browser connection timed out. Full accessibility testing, external-link checking, and a complete cross-browser/device matrix were not performed.

Temporary viewport overrides were reset. The local preview server is stopped after testing; run `preview.cmd` to start it again.

At the time of these local preview checks, no GitHub push, Pages change, Site registration, deployment, or confidential DocFusion upload had been performed. Public publication was subsequently approved; see the site README and repository Actions for deployment status.

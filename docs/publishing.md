# Git repository and website publication

## Repository and audience

- Public repository: [ajaykakumanu89/ajay-kakumanu-portfolio](https://github.com/ajaykakumanu89/ajay-kakumanu-portfolio).
- Website address: [Ajay Kakumanu’s portfolio](https://ajaykakumanu89.github.io/ajay-kakumanu-portfolio/).
- Website source: `site/`, plus the explicitly selected public Markdown files in the builder.
- Publishing workflow: [Publish portfolio](../.github/workflows/pages.yml).

Publication was approved on October 20, 2026. The original resume documents, LinkedIn screenshots, unrelated HTML-review project, and confidential DocFusion guide are not included. Sample status and AI-assistance disclosures remain visible. A content license has not been selected.

## How publishing works

GitHub Pages uses **GitHub Actions** as its source. On relevant pushes to `main`, the workflow:

1. Checks out the repository with read-only access and no persisted Git credentials.
2. Uses Node.js 24 and `npm ci` with the committed lockfile and install scripts disabled.
3. Builds the seven static pages and checks local files, links, fragments, and content boundaries.
4. Uploads only `site/dist`, not the repository, private documents, or dependencies.
5. Deploys the artifact to the `github-pages` environment in a separate, minimally privileged job.

Do not infer successful publication from a push alone. Check the workflow’s deployment result and verify the live homepage and resume page. No paid hosting, custom domain purchase, or external account registration is configured.

## Preview and maintain

See [the site instructions](../site/README.md) to preview locally. Edit the homepage template or the public Markdown sources, not generated `site/dist` files. Run the build and checks before pushing. The preview launcher does not publish.

The repository-specific Git author is Ajay Kakumanu, `ajaykakumanu@outlook.com`; commit metadata is public. From the repository root:

```console
git status
git diff --check
python scripts/check_portfolio.py
git push origin main
```

Review [the content boundaries](content-review.md) before adding new material. Do not upload employer documents or confidential samples without appropriate sharing approval.

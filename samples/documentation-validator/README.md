# Documentation validator: experience and synthetic demonstration

Status: portfolio case-study draft with a runnable, original demonstration.

## The documentation problem

Large help deliveries need repeatable checks for links, layout problems, and release metadata. Manual verification takes time, and a clean build does not by itself establish that a reader can follow a link to the intended section.

## Relevant professional experience

My resume describes a Python workflow that checked local HTML/help links, PDF overflow, and version/date metadata, with results collected in Excel reports. In one exercise involving over 100 links in documentation for emulation products, manual link-verification work was reduced by approximately 50%.

That figure is a resume-reported result for that specific exercise. It is not a benchmark for this public demonstration or a claim about overall documentation productivity. Timing records, a reproducible before/after measurement, and independent confirmation are not included here.

## What is available in this repository

[check_links.py](check_links.py) is a new, standard-library Python demonstration written for this portfolio. It checks local links found in HTML `href` attributes and checks HTML fragments against `id` attributes or named anchors. It prints each result and returns exit code 1 if a checked link is broken, 0 if all checked links pass, and 2 for an input or parsing error.

The [synthetic index](fixtures/index.html) links to a real section and a deliberately missing section in the [synthetic guide](fixtures/guide.html). The guide also contains a valid link to its own section. All content is original demonstration material.

This implementation does **not** perform the PDF overflow, release-metadata, or Excel-report checks described in the professional experience above. It does not reuse employer source code, files, or documentation.

## Run the demonstration

Requires Python 3.10 or later; no packages or account are needed. From this sample directory:

```console
python check_links.py fixtures
```

Expected summary:

```text
Summary: 2 valid, 1 broken, 0 skipped (3 links checked).
```

The nonzero exit is intentional: `guide.html#missing-step` is a broken fragment. To check the valid subset:

```console
python check_links.py fixtures/guide.html
```

Expected summary and exit code:

```text
Summary: 1 valid, 0 broken, 0 skipped (1 links checked).
```

Exit code: `0`.

## Decisions and boundaries

- Files and directories are explicit inputs. Directories are scanned recursively for `.html` and `.htm` files.
- Paths are resolved relative to the referring HTML file. Query strings do not change the local filename. Percent-encoded paths and fragments are decoded.
- A fragment is checked only when its target is an HTML file. Existing non-HTML targets count as valid file links; their internal fragments are outside this demonstration's scope.
- External URLs, protocol-relative URLs, site-root paths such as `/help`, and links with a URI scheme are reported as skipped. No network requests are made.
- Directory targets, malformed URLs, missing files, and missing HTML anchors produce broken results. Directory index resolution and web-server routing are not implemented.
- This is a link check, not a complete accessibility, content-quality, security, or browser-rendering audit. It does not evaluate JavaScript-generated links or CSS.

## Evidence needed for a finished professional case study

Before publishing employer material or a more detailed account, confirm permission to share it. Anonymization alone does not establish permission. Add an approved explanation of the timing method, baseline, sample selection, and what work the approximately 50% reduction measured. Where records or permission are unavailable, keep the result attributed to the resume and keep the public code described as a synthetic demonstration.

Possible next implementation steps are a machine-readable report, duplicate-anchor warnings, and tests against a documented fixture set. These are planned work, not delivered features.

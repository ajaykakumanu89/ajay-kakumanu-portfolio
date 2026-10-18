# Ajay Kakumanu

Staff Technical Writer | Developer documentation | Documentation automation

I create documentation that helps people understand, use, and troubleshoot software. My work combines 15 years of technical-writing experience with API and command references, structured content, Python automation, and critically reviewed AI-assisted workflows. I also structure documentation for accurate knowledge-assistant retrieval and agent-ready engineering tasks.

## Selected work

| Project | What you can review | Status |
| --- | --- | --- |
| [Developer API documentation](samples/developer-api/README.md) | A local Task API, quickstart, expected results, and endpoint reference | Original portfolio demonstration |
| [Documentation validator](samples/documentation-validator/README.md) | A career case study and a separate synthetic HTML link-checking demonstration | Demonstration available; case study evidence review pending |
| [AI-assisted documentation](samples/ai-assisted-documentation/README.md) | A plan for showing source verification, editorial decisions, and corrections | Brief in progress; no completed evaluation claimed |

These projects are labelled by their actual scope. Newly written demonstrations are not presented as software shipped by a current or previous employer.

The initial sample code and documentation were drafted with AI assistance. Ajay's editorial review and revisions are pending before these are presented as personal writing samples.

## Professional background

I am a Staff Technical Writer at Synopsys. My experience spans enterprise software, semiconductor EDA, automotive, and aerospace documentation. I work with engineers and product teams to turn technical information into developer guides, API references, task-based instructions, release notes, and online help. My task, command, and API topics identify inputs, expected results, and constraints; retrieval-focused topics provide self-contained answers with product-version context.

I also build tools to check documentation and reduce repetitive verification work. My resume reports approximately 50% less manual link-verification effort in one exercise covering over 100 links. That figure applies to that exercise; it is not a benchmark for the public demonstration in this repository.

- [About my approach](ABOUT.md)
- [Professional resume](resume.md)
- [Portfolio content plan](docs/portfolio-plan.md)
- [Project case study template](docs/sample-template.md)

## Explore the repository

```text
.
├── README.md
├── ABOUT.md
├── resume.md
├── CONTRIBUTING.md
├── docs/
│   ├── portfolio-plan.md
│   ├── sample-template.md
│   ├── content-review.md
│   └── publishing.md
├── samples/
│   ├── developer-api/
│   ├── documentation-validator/
│   └── ai-assisted-documentation/
└── scripts/
    └── check_portfolio.py
```

## Run the local checks

Python 3.11 or later is sufficient; the demonstrations use the standard library.

From the repository root:

```powershell
python scripts/check_portfolio.py
```

This checks local Markdown file links and required portfolio files. It does not validate external websites, technical claims, or employer publication permissions. Each sample documents its own commands and limitations.

## Contact

[LinkedIn](https://www.linkedin.com/in/ajay-kakumanu-608403162/)

Based in Hyderabad, India.

## Publication status

This portfolio is prepared for public sharing on GitHub under `ajaykakumanu89/ajay-kakumanu-portfolio`. The sample review status is listed above. A public website and content license have not been selected. See [publishing instructions](docs/publishing.md) and the [content review](docs/content-review.md).

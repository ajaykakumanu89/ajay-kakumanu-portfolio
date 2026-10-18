# Git repository and publication

## Local repository

The portfolio is an independent Git repository on branch `main`, with an initial commit. Its repository-specific author identity is Ajay Kakumanu, `ajaykakumanu@outlook.com`. Run commands from its root directory.

```powershell
git status
git log --oneline -5
python scripts/check_portfolio.py
```

The author name and email were selected for this repository. They are part of commit metadata and will be visible when the commits are published.

## Before a remote push

The intended GitHub owner is `ajaykakumanu89`, the repository name is `ajay-kakumanu-portfolio`, and the selected visibility is public. Read the [content review](content-review.md) and inspect what will be shared:

```powershell
git status
git show --stat --oneline HEAD
git remote -v
```

The original resume, screenshots from LinkedIn, and existing HTML-review project are not included in this repository.

## Connect a GitHub repository

Create an empty public repository named `ajay-kakumanu-portfolio` in the `ajaykakumanu89` GitHub account. Do not initialize it with another README because this local repository already has its initial commit.

The local `origin` remote is configured for the intended repository. After the GitHub repository exists and Git authentication is available:

```powershell
git push -u origin main
```

The remote URL is `https://github.com/ajaykakumanu89/ajay-kakumanu-portfolio.git`. A configured remote URL alone does not establish that the repository has been created or uploaded. The push command does not create an account, repository, or public website.

## Website

The Markdown files are readable directly on GitHub. A separate website can be added later. No deployment workflow, hosting charges, domain purchase, or automatic publication is configured in this starter.

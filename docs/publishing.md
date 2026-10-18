# Git repository and publication

## Local repository

The portfolio is an independent Git repository. Run commands from its root directory.

```powershell
git status
git log --oneline -5
python scripts/check_portfolio.py
```

If an initial commit has not been created because Git has no author identity, set the identity you want attached to commits. These commands affect this repository only:

```powershell
git config user.name "YOUR NAME"
git config user.email "YOUR VERIFIED OR GITHUB NOREPLY EMAIL"
git add .
git commit -m "Create technical writing portfolio"
```

Use a verified address or your own GitHub-provided noreply address. Do not copy the example strings literally.

## Before a remote push

Read the [content review](content-review.md), confirm the repository visibility, and inspect what will be shared:

```powershell
git status
git show --stat --oneline HEAD
git remote -v
```

The original resume, screenshots from LinkedIn, and existing HTML-review project are not included in this repository.

## Connect a GitHub repository

Create an empty repository in the intended GitHub account with the chosen visibility. Do not initialize it with another README if this local repository already has its initial commit.

After creating the remote, replace the placeholder URL with its exact URL:

```powershell
git remote add origin https://github.com/YOUR-ACCOUNT/ajay-kakumanu-portfolio.git
git push -u origin main
```

These are instructions only. They do not create an account, remote repository, or public website.

## Website

The Markdown files are readable directly on GitHub. A separate website can be added later. No deployment workflow, hosting charges, domain purchase, or automatic publication is configured in this starter.

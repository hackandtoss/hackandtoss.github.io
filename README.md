# hackandtoss.github.io

Personal portfolio and cybersecurity resource hub built for GitHub Pages.

## Overview

This repo powers a multi-page portfolio site with:

- a shared Jekyll layout for the common head, navbar, and footer
- a light/dark theme toggle stored in `localStorage`
- project, resources, resume, and Mead Tracker pages
- Bootstrap, Font Awesome, and custom CSS/JS

## Tech Stack

| Layer | Technology |
| --- | --- |
| Site generator | Jekyll (GitHub Pages compatible) |
| Structure | HTML with Liquid front matter |
| Styling | Bootstrap 5.3 + custom CSS |
| Font | JetBrains Mono |
| Icons | Font Awesome 6 |
| Scripts | jQuery 3.6 + vanilla JS |
| PDF export | jsPDF + jspdf-autotable |

## Project Structure

```text
hackandtoss.github.io/
|-- _config.yml
|-- _includes/
|   |-- footer.html
|   |-- head.html
|   `-- navbar.html
|-- _layouts/
|   `-- default.html
|-- assets/
|-- css/
|   `-- style.css
|-- js/
|   |-- meadScript.js
|   `-- script.js
|-- index.html
|-- projects.html
|-- resources.html
|-- resume.html
`-- mead_tracker.html
```

## Running Locally

Because the root pages now rely on Jekyll layouts and includes, preview them through a Jekyll-compatible workflow rather than opening the source files directly.

If you already have Jekyll installed, a typical local preview is:

```powershell
jekyll serve
```

If you do not have Jekyll installed locally, GitHub Pages will render the site correctly after you push changes.

## Local Unicode Cleanup Tool

A local-only PowerShell helper lives at `.local/normalize-unicode.ps1`. The `.local/` directory is intentionally gitignored.

Audit the repo:

```powershell
powershell -ExecutionPolicy Bypass -File .\.local\normalize-unicode.ps1
```

Apply the configured replacements:

```powershell
powershell -ExecutionPolicy Bypass -File .\.local\normalize-unicode.ps1 -Fix
```

Target specific files or folders:

```powershell
powershell -ExecutionPolicy Bypass -File .\.local\normalize-unicode.ps1 -Path .\resume.html, .\resources.html
```

## Deployment

The site is intended for GitHub Pages so Jekyll can render the shared layout and includes automatically.

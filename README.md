# hackandtoss.github.io

Personal portfolio and cybersecurity resource hub built as a static GitHub Pages site.

## 🔍 Overview

A multi-page portfolio website showcasing cybersecurity projects, curated security resources, and a professional resume. Features a terminal-inspired brand identity (`hackandtoss@root~$`), light/dark theme toggle with `localStorage` persistence, and a dynamic role-cycling text animation on the landing page.

## 🛠 Tech Stack

| Layer     | Technology                                                    |
| --------- | ------------------------------------------------------------- |
| Structure | HTML5                                                         |
| Styling   | [Bootstrap 5.3](https://getbootstrap.com/) + custom CSS       |
| Font      | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (monospace) |
| Icons     | [Font Awesome 6](https://fontawesome.com/)                    |
| Scripts   | jQuery 3.6, vanilla JS                                        |
| PDF       | jsPDF + html2canvas + jspdf-autotable (Mead Tracker only)     |
| Hosting   | [GitHub Pages](https://pages.github.com/)                     |

## 📄 Pages

### Home (`index.html`)
Landing page with an animated role rotator (*Cybersecurity Enthusiast → Software Developer → Data Scientist → Bug Bounty Hunter*) and a 2×2 card grid linking to major sections.

### Projects (`projects.html`)
Showcases featured projects:
- **Mead Tracker** — Web app for tracking fermentation data (hosted on-site).
- **Random Password Generator** — C++ secure password tool ([GitHub](https://github.com/hackandtoss/CyberSecProjects)).
- **Honeypot Data Analysis** — Kaggle notebook analyzing cyber threat patterns ([Kaggle](https://www.kaggle.com/code/hackandtoss/honeypot-data-insights-into-cyber-threat-patterns)).

### Resources (`resources.html`)
Curated link collection organized into categories:
- Cybersecurity & OSINT
- Penetration Testing & Exploitation
- CS & Security Textbooks
- Firmware & Flipper Zero
- Digital Forensics & Reverse Engineering
- Scripting & Tool Cheat Sheets
- Security Automation & Cryptography
- Programming & Scripting

### Resume (`resume.html`)
Interactive resume with collapsible work-experience sections (Bootstrap accordion), education, certifications (GIAC GFACT), capstone project details, and a skills matrix.

### Mead Tracker (`mead_tracker.html`)
A fermentation tracking tool featuring:
- Date/time/hours input for each session
- Temperature & humidity logging
- Dynamic data table with per-row bubble count, strength rating, and notes
- Built-in stopwatch with lap timing and average calculation
- One-click PDF report generation via jsPDF

## 📁 Project Structure

```
hackandtoss.github.io/
├── index.html              # Landing page
├── projects.html           # Projects showcase
├── resources.html          # Curated resource links
├── resume.html             # Interactive resume
├── mead_tracker.html       # Fermentation tracker app
├── css/
│   └── style.css           # Global styles & dark-mode theme
├── js/
│   ├── script.js           # Theme toggle & role rotator
│   └── meadScript.js       # Mead Tracker logic (stopwatch, table, PDF)
└── assets/
    ├── favicon.svg
    ├── favicon.ico
    ├── logo.png
    ├── FlipperHacker2.svg
    └── SystemFailureHACKandTOSS.svg
```

## 🚀 Getting Started

This is a fully static site — no build step required.

```bash
# Clone the repo
git clone https://github.com/hackandtoss/hackandtoss.github.io.git
cd hackandtoss.github.io

# Open in your browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

Or serve locally with any static server:

```bash
npx serve .
```

## 🌐 Deployment

The site deploys automatically to **https://hackandtoss.github.io** via GitHub Pages whenever changes are pushed to the default branch.

## ✨ Features

- **Dark / Light Mode** — Toggle persisted across sessions via `localStorage`
- **Terminal-style Branding** — Blinking cursor navbar brand
- **Responsive Design** — Mobile-first Bootstrap 5 grid
- **PDF Export** — Generate fermentation reports from the Mead Tracker
- **Accessible Navigation** — Consistent navbar and footer across all pages

## 📬 Contact

- **Email:** [jobs.purge002@passinbox.com](mailto:jobs.purge002@passinbox.com)
- **LinkedIn:** [linkedin.com/in/john-johnson-77b15247](https://www.linkedin.com/in/john-johnson-77b15247)
- **GitHub:** [github.com/hackandtoss](https://github.com/hackandtoss)

## 📝 License

This project is open source. Feel free to fork and adapt for your own portfolio.

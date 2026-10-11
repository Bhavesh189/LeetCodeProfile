# LeetCode Profile Analyzer

A beautiful, mobile-friendly dashboard that turns any public LeetCode username into a visual profile — profile info, contest stats, solved breakdown, languages, skills, and recent accepted submissions.

Type a username, hit **Analyze**, and the dashboard fills in with animated cards. 🌙 Dark/light theme included.

## What it does

All features are observed in `script.js` / `index.html`:

- 🔍 **Username search** — enter any LeetCode username (or press Enter) to look them up
- 👤 **Profile card** — avatar, name, bio, rank, country, company, school, and GitHub / LinkedIn / X links (only shown when the profile has them)
- 🏆 **Contest analytics** — contest rating, global ranking, top %, and contests attended
- 🧠 **Problem solving** — Easy / Medium / Hard / Total solved with animated count-up numbers
- 💻 **Languages** — languages used and problems solved per language
- ⚡ **Skills** — skill tags from the user's LeetCode profile
- ✅ **Recent accepted** — last 5 accepted submissions with title, language, date, and status
- 🌓 **Dark / light theme toggle** — switch the whole UI theme with one click
- 🍞 **Toast notifications** — friendly errors like "Please enter a LeetCode username" or "User not found or API limits reached"

## Tech stack

- **Vanilla HTML + CSS + JavaScript** — no frameworks, no build step, no `npm install`
- **Font Awesome 6.5.1** (CDN) — icons
- **Google Fonts** (CDN) — Plus Jakarta Sans + JetBrains Mono
- **Data source:** the public [alfa-leetcode-api](https://alfa-leetcode-api.onrender.com) — the app calls 5 endpoints per search (`/profile`, `/contest`, `/solved`, `/language`, `/acSubmission?limit=5`)

## Project structure

```
.
├── index.html                 # Page layout: nav, search bar, dashboard cards
├── style.css                  # All styling, dark/light themes, animations
├── script.js                  # API calls + DOM rendering + theme toggle
├── .github/workflows/static.yml  # Auto-deploys to GitHub Pages on push to main
├── light-mode.png             # Image asset
└── download.png               # Image asset
```

## Run it locally

No build tools needed — it's a plain static site.

```bash
# Option 1: just open the file
open index.html          # or double-click it in your file explorer

# Option 2: serve it with a tiny local server (recommended, avoids any CDN/CORS quirks)
npx serve .              # then visit the shown URL
# or
python3 -m http.server    # then visit http://localhost:8000
```

The app needs an internet connection — it fetches data from the LeetCode API and loads icons/fonts from CDNs.

## Notes

- Live demo: auto-deployed via GitHub Pages on every push to `main` → https://bhavesh189.github.io/LeetCodeProfile/
- If a username doesn't exist or the API is rate-limited, you'll see a toast: *"User not found or API limits reached."*
- Missing profile fields (company, school, socials) fall back to friendly defaults like "Independent", "Self Taught", or "Earth".

# TerokaKu PWA v1.0.0

Offline-first visual discovery app for kids.

## Included in v1
- 13 Explore Worlds: Space, Animals, Vehicles, Earth, Ocean, Dinosaurs, Plants, Human Body, How Things Work, Countries & World, Science, Technology, English World.
- Interactive Solar System visual with tappable planets.
- Age-based explanation levels: Explorer (4–6), Discoverer (7–9), Investigator (10–12).
- BM / BM+English / English display modes.
- Device text-to-speech for explanations, English words, conversations and mini stories.
- English modules: vocabulary packs, Sentence Builder, Everyday Conversation, Mini Story, Word Hunt.
- My Discovery Book saved with localStorage.
- Installable PWA + offline service worker.
- No login, no cloud database, no analytics, no external runtime dependency.

## Run locally
A service worker requires HTTP/HTTPS (not file://). From this folder:

```bash
python -m http.server 8080
```

Then open http://localhost:8080

## Deploy
Upload every file/folder in this project to GitHub Pages or Cloudflare Pages. No build command is required.

For Cloudflare Pages using GitHub:
- Framework preset: None
- Build command: leave blank
- Build output directory: `/` (or the repository root option shown by Cloudflare)

## Data & privacy
Discovery progress and settings are stored only in the browser/device localStorage. Clearing site data removes the progress.

## Notes
The Solar System animation is intentionally illustrative and not to astronomical scale.
Speech quality/voice availability depends on voices installed by the OS/browser.

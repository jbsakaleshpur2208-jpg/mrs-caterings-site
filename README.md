# MRS Caterings website

Static website for Kaviarasan's MRS Caterings. No build step.

- Pages: `index.html`, `about.html`, `services.html`, `ilai.html`, `menu.html`, `gallery.html`, `clients.html`, `contact.html`
- Shared styles and scripts: `css/site.css`, `js/site.js`
- Gallery data: `data/feed.json` (filled automatically by `sync/instagram-sync.mjs` once Instagram is connected)
- Never commit the Instagram access token. Pass it as the `IG_ACCESS_TOKEN` environment variable.

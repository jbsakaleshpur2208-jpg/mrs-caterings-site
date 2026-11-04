# Instagram auto-sync

Cost: free. Meta's Instagram API has no usage fee for this.

## One-time setup
1. In the Instagram app: Settings → Account type and tools → make sure it is **Professional (Business or Creator)**.
2. developers.facebook.com → create an app (type: Business) → add the **Instagram** product → "API setup with Instagram login".
3. Add `mrs_caterings` as an Instagram tester/role, accept it in the Instagram app, then generate a **long-lived access token** (60 days). Permission needed: `instagram_business_basic`.
4. Test: `IG_ACCESS_TOKEN=xxxx node sync/instagram-sync.mjs`

## Keep it automatic
Run every 30 minutes, for example with cron:
`*/30 * * * * cd /path/to/site && IG_ACCESS_TOKEN=xxxx node sync/instagram-sync.mjs`
Each run downloads new reels, posts and stories into `assets/feed/`, updates `data/feed.json` and refreshes the token (store the new token it prints).
The website reads `data/feed.json` on every visit, so new content appears without any manual edit.

Stories disappear from Instagram after 24 hours, so the script archives them as it sees them and shows them for 7 days.

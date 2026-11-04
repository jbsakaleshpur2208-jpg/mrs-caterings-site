// Pulls reels, posts and stories from Instagram and writes data/feed.json + assets/feed/*.
// Free: uses Meta's official Instagram API. Needs a Business/Creator account and a token.
//   IG_ACCESS_TOKEN=...  node sync/instagram-sync.mjs
// Run it on a schedule (cron, or a GitHub Action every 30 min). See sync/README.md.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.IG_ACCESS_TOKEN;
if (!TOKEN) { console.error('Set IG_ACCESS_TOKEN'); process.exit(1); }
const API = 'https://graph.instagram.com';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FEED = path.join(ROOT, 'data/feed.json');
const MEDIA_DIR = path.join(ROOT, 'assets/feed');
const FIELDS = 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp';

const get = async (url) => {
  const r = await fetch(url);
  const j = await r.json();
  if (j.error) throw new Error(`${j.error.message} (code ${j.error.code})`);
  return j;
};
async function all(endpoint) {
  let url = `${API}/me/${endpoint}?fields=${FIELDS}&limit=50&access_token=${TOKEN}`, out = [];
  while (url && out.length < 200) { const j = await get(url); out = out.concat(j.data || []); url = j.paging?.next; }
  return out;
}
async function download(url, name) {
  if (!url) return null;
  const ext = /\.(mp4|mov)(\?|$)/i.test(url) ? 'mp4' : 'jpg';
  const rel = `assets/feed/${name}.${ext}`, abs = path.join(ROOT, rel);
  if (!existsSync(abs)) { const r = await fetch(url); await writeFile(abs, Buffer.from(await r.arrayBuffer())); }
  return rel;
}
const category = (c = '') => /virundhu|feast|leaf|இலை|விருந்து/i.test(c) ? 'feast'
  : /live|dosa|counter|kitchen|rasam|snack/i.test(c) ? 'kitchen'
  : /testimonial|client|team|quality/i.test(c) ? 'people' : 'event';

await mkdir(MEDIA_DIR, { recursive: true });

// 1. keep what we already archived (stories vanish from Instagram after 24h, so we never drop them)
let prev = [];
try { prev = JSON.parse(await readFile(FEED, 'utf8')).items || []; } catch {}
const byId = new Map(prev.filter(i => !String(i.id).startsWith('local-')).map(i => [i.id, i]));

// 2. fetch feed + stories
const [media, stories] = await Promise.all([all('media'), all('stories').catch(e => { console.warn('stories:', e.message); return []; })]);
for (const m of [...media.map(x => ({ ...x, _story: false })), ...stories.map(x => ({ ...x, _story: true }))]) {
  if (byId.has(m.id)) continue;
  const isVideo = m.media_type === 'VIDEO';
  const src = await download(m.media_url, m.id);
  const poster = isVideo ? await download(m.thumbnail_url, `${m.id}-poster`) : src;
  byId.set(m.id, {
    id: m.id,
    type: m._story ? 'story' : (m.media_product_type === 'REELS' ? 'reel' : (isVideo ? 'reel' : 'post')),
    category: category(m.caption),
    src, poster, permalink: m.permalink, caption: m.caption || '', timestamp: m.timestamp
  });
  console.log('new', m._story ? 'story' : 'item', m.id);
}

// 3. write feed (newest first). Stories older than 7 days are pruned to keep the site tidy.
const weekAgo = Date.now() - 7 * 864e5;
const items = [...byId.values()]
  .filter(i => i.type !== 'story' || new Date(i.timestamp).getTime() > weekAgo)
  .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
await writeFile(FEED, JSON.stringify({ source: 'instagram', updated: new Date().toISOString().slice(0, 10), items }, null, 1));
console.log(`feed.json: ${items.length} items`);

// 4. refresh the long-lived token (valid 60 days; refresh anytime after 24h old)
try {
  const t = await get(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`);
  console.log(`token refreshed, valid for ${Math.round(t.expires_in / 86400)} more days. Store this new value:`);
  console.log(t.access_token === TOKEN ? '(unchanged)' : t.access_token);
} catch (e) { console.warn('token refresh:', e.message); }

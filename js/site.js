/* MRS Caterings: shared layout, reveal, video modal and Instagram feed rendering */
(function () {
  const PHONE1 = '99655 55317', PHONE2 = '98427 55317', WA = '919965555317';
  const IG = 'https://www.instagram.com/mrs_caterings/';
  const PAGES = [
    ['index.html', 'Home'], ['about.html', 'Our Story'], ['services.html', 'Services'], ['ilai.html', 'Ilai Weddings'],
    ['menu.html', 'Menu'], ['gallery.html', 'Gallery'], ['clients.html', 'Clients'], ['contact.html', 'Contact']
  ];
  const here = (location.pathname.split('/').pop() || 'index.html');

  /* ---------- layout ---------- */
  /* logo typeface */
  if (!document.querySelector('link[data-poppins]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.poppins = ''; l.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap'; document.head.appendChild(l); }
  const header = document.getElementById('site-header');
  if (header) {
    header.outerHTML = `<header id="hdr"><div class="wrap nav">
      <a href="index.html" class="brand lock" aria-label="Kaviarasan's MRS Caterings, home"><img src="assets/img/hat.png" alt="" width="364" height="284"><span><i class="tm">கவியரசன்'s</i><span class="nm"><b>MRS</b><em>Caterings</em></span></span></a>
      <nav id="nav"><ul>${PAGES.slice(1, -1).map(([h, t]) => `<li><a href="${h}"${h === here ? ' class="act"' : ''}>${t}</a></li>`).join('')}</ul></nav>
      <a href="contact.html" class="btn hdr-cta">Book a Tasting</a>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i></i></button>
    </div></header>`;
    // mobile drawer also lists Home and Contact
    document.querySelector('#nav ul').insertAdjacentHTML('afterbegin', '<li class="m-only"><a href="index.html">Home</a></li>');
    document.querySelector('#nav ul').insertAdjacentHTML('beforeend', `<li class="m-only"><a href="contact.html"${here === 'contact.html' ? ' class="act"' : ''}>Contact</a></li>`);
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.outerHTML = `<footer style="padding:60px 0 38px"><div class="wrap">
      <div class="foot-grid">
        <div><a href="index.html" class="brand" aria-label="Kaviarasan's MRS Caterings, home"><img src="assets/img/logo.png" alt="Kaviarasan's MRS Caterings" width="498" height="339"></a>
          <p style="margin-top:18px;max-width:34ch;font-size:14px">Kaviarasan's MRS Caterings, founded by Dr. M.R. Srinivasan. Premium wedding and event catering across Tamil Nadu.</p></div>
        <div><h5>Explore</h5>${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
        <div><h5>Reach us</h5><a href="tel:+919965555317">${PHONE1}</a><a href="tel:+919842755317">${PHONE2}</a>
          <a href="mailto:mrscatering1989@gmail.com">mrscatering1989@gmail.com</a>
          <a href="${IG}" target="_blank" rel="noopener">Instagram @mrs_caterings</a>
          <a href="https://www.facebook.com/mrscatering/" target="_blank" rel="noopener">Facebook</a></div>
      </div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--mute)">
        <span>© ${new Date().getFullYear()} MRS Catering (Kaviarasan's MRS Caterings) · Gobichettipalayam · Erode · Coimbatore</span><span>Passionate to delight</span></div>
    </div></footer>
    <a class="wa" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.800 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200c0-5.400 4.400-9.800 9.900-9.800 2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.500 9.900-9.800 9.900z"/></svg><span>Chat on WhatsApp</span></a>
    <div class="modal" id="modal"><button aria-label="Close">×</button><div id="modalBody"></div></div>`;
  }

  /* ---------- nav behaviour ---------- */
  const hdr = document.getElementById('hdr'), nav = document.getElementById('nav'), bg = document.getElementById('burger');
  if (hdr) {
    const onS = () => hdr.classList.toggle('scrolled', scrollY > 40 || document.body.dataset.solid);
    addEventListener('scroll', onS, { passive: true }); onS();
    bg.addEventListener('click', () => { const o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o); });
    nav.addEventListener('click', e => { if (e.target.tagName === 'A') nav.classList.remove('open'); });
  }

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
  const reveal = (root = document) => root.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
  reveal();

  /* ---------- modal player ---------- */
  const modal = document.getElementById('modal'), body = document.getElementById('modalBody');
  const closeM = () => { body.innerHTML = ''; modal.classList.remove('on'); };
  function openItem(it) {
    const isVid = /\.(mp4|mov|webm)(\?|$)/i.test(it.src);
    body.innerHTML = isVid
      ? `<video controls autoplay playsinline src="${it.src}"></video>`
      : `<img src="${it.src}" alt="${esc(it.caption || '')}">`;
    modal.classList.add('on');
  }
  modal.addEventListener('click', e => { if (e.target === modal || e.target.tagName === 'BUTTON') closeM(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Instagram feed ---------- */
  // data/feed.json is written by sync/instagram-sync.mjs (auto) or seeded from local reels.
  let feedP;
  const loadFeed = () => feedP || (feedP = fetch('data/feed.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => ({ items: [], source: 'none' })));
  const card = (it, i) => `<div class="reel" data-i="${i}">
      <img src="${it.poster || it.src}" alt="${esc(it.caption)}" loading="lazy">
      ${it.type === 'story' ? '<span class="badge">Story</span>' : it.type === 'post' ? '<span class="badge">Post</span>' : ''}
      ${/\.(mp4|mov|webm)/i.test(it.src) ? '<div class="pl"></div>' : ''}
      <span>${esc((it.caption || '').split('\n')[0].slice(0, 60))}</span></div>`;

  document.querySelectorAll('[data-feed]').forEach(async el => {
    const feed = await loadFeed();
    const limit = +el.dataset.limit || 999;
    const kind = el.dataset.feed; // reels | posts | stories | all
    const all = (feed.items || []).slice().sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    const pick = kind === 'all' ? all.filter(i => i.type !== 'story') : all.filter(i => i.type === kind.replace(/s$/, ''));
    const list = pick.slice(0, limit);
    el._items = list;
    el.innerHTML = list.map(card).join('');
    el.addEventListener('click', e => { const c = e.target.closest('.reel'); if (c) openItem(el._items[+c.dataset.i]); });
    reveal(el);
    const meta = document.querySelector('[data-feed-meta]');
    if (meta) meta.remove();
  });

  const storyEl = document.querySelector('[data-stories]');
  if (storyEl) loadFeed().then(feed => {
    const st = (feed.items || []).filter(i => i.type === 'story');
    if (!st.length) { storyEl.remove(); return; }
    storyEl.innerHTML = st.map((it, i) => `<div class="story" data-i="${i}"><div class="ring"><img src="${it.poster || it.src}" alt=""></div><span>${esc((it.caption || 'Story').slice(0, 14))}</span></div>`).join('');
    storyEl.addEventListener('click', e => { const c = e.target.closest('.story'); if (c) openItem(st[+c.dataset.i]); });
  });

  /* ---------- Gallery filters ---------- */
  const filters = document.getElementById('filters');
  if (filters) filters.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    filters.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    const grid = document.querySelector('[data-feed]');
    grid.querySelectorAll('.reel').forEach((r, i) => {
      const it = grid._items[i];
      r.classList.toggle('hide', b.dataset.f !== 'all' && it.category !== b.dataset.f);
    });
  });

  /* ---------- Menu tabs ---------- */
  document.querySelectorAll('.menu-tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.menu-tabs button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('on', p.id === b.dataset.t));
  }));

  /* ---------- Enquiry form -> WhatsApp ---------- */
  const enq = document.getElementById('enq');
  if (enq) enq.addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(enq);
    const t = `Hello MRS Caterings,%0AName: ${f.get('name')}%0APhone: ${f.get('phone')}%0AEvent: ${f.get('event')}%0AGuests: ${f.get('guests') || '-'}%0ADate: ${f.get('date') || '-'}%0AVenue: ${f.get('venue') || '-'}%0A${encodeURIComponent(f.get('msg') || '')}`;
    window.open('https://wa.me/' + WA + '?text=' + t, '_blank');
  });
})();

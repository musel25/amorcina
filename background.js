import { MESSAGES, RARE_MESSAGES } from './messages.js';

const INTENSITY_CONFIG = {
  whisper: { dailyCap: 1,  cooldownMs: 0,           rarePct: 0.03 },
  gentle:  { dailyCap: 3,  cooldownMs: 45 * 60000,  rarePct: 0.05 },
  cozy:    { dailyCap: 5,  cooldownMs: 20 * 60000,  rarePct: 0.07 },
  test:    { dailyCap: 50, cooldownMs: 0,            rarePct: 0.30 },
};

const DOMAIN_MAP = [
  { domains: ['github.com','gitlab.com','bitbucket.org','stackoverflow.com','replit.com','codesandbox.io','claude.ai','chatgpt.com','v0.dev','cursor.sh'], ctx: 'coding' },
  { domains: ['tiktok.com','instagram.com','x.com','twitter.com','reddit.com','facebook.com','threads.net','pinterest.com','pinterest.es','pinterest.co.uk','tumblr.com','snapchat.com','bereal.com'], ctx: 'social' },
  { domains: ['youtube.com','netflix.com','twitch.tv','hulu.com','disneyplus.com','primevideo.com','hbomax.com','max.com','crunchyroll.com','vimeo.com'], ctx: 'video' },
  { domains: ['mail.google.com','outlook.live.com','outlook.office.com','fastmail.com','proton.me'], ctx: 'email' },
  { domains: ['docs.google.com','drive.google.com','notion.so','linear.app','quip.com','dropbox.com','canva.com','figma.com','miro.com','airtable.com'], ctx: 'docs' },
  { domains: ['calendar.google.com','fantastical.app','cron.com','cal.com','calendly.com'], ctx: 'planning' },
  { domains: ['spotify.com','soundcloud.com','deezer.com','music.apple.com','tidal.com','music.youtube.com'], ctx: 'music' },
  { domains: ['meet.google.com','zoom.us','teams.microsoft.com','webex.com','whereby.com','discord.com'], ctx: 'work' },
  { domains: ['google.com','bing.com','duckduckgo.com','search.yahoo.com','perplexity.ai'], ctx: 'search' },
  { domains: ['amazon.com','amazon.co.uk','amazon.de','amazon.fr','amazon.es','amazon.it','amazon.ca','amazon.com.mx','etsy.com','ebay.com','shopify.com','zara.com','asos.com','shein.com','aliexpress.com'], ctx: 'shopping' },
  { domains: ['coursera.org','duolingo.com','khanacademy.org','udemy.com','edx.org','skillshare.com','masterclass.com','brilliant.org'], ctx: 'learning' },
];

const EASTER_EGG_DOMAINS = ['youtube.com', 'instagram.com', 'github.com'];

const DEFAULT_STATE = {
  enabled: true,
  intensity: 'cozy',
  quietStart: '22:00',
  quietEnd: '09:00',
  pausedUntil: 0,
  backoffUntil: 0,
  history: [],
  dismissalTimes: [],
  lastContext: null,
  savedMessages: [],
  firstRunShown: false,
  firstRunAt: 0,
  firstMessageShown: false,
  shownToday: 0,
  shownTodayDate: '',
  lastTabId: null,
  lastHostname: null,
};

function hashText(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(31, h) + text.charCodeAt(i) | 0;
  }
  return String(Math.abs(h));
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isLateNight() {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
}

function isInQuietHours(quietStart, quietEnd) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = quietStart.split(':').map(Number);
  const [eh, em] = quietEnd.split(':').map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  if (s > e) return cur >= s || cur < e; // overnight range
  return cur >= s && cur < e;
}

function resolveContext(hostname) {
  const h = hostname.toLowerCase();
  for (const { domains, ctx } of DOMAIN_MAP) {
    for (const d of domains) {
      if (h === d || h.endsWith('.' + d)) return ctx;
    }
  }
  return 'ambient';
}

function shouldFire(s) {
  const now = Date.now();
  if (!s.enabled) return false;
  if (now < (s.backoffUntil || 0)) return false;
  if (now < (s.pausedUntil || 0)) return false;
  if (isInQuietHours(s.quietStart || '22:00', s.quietEnd || '09:00')) return false;

  const today = todayStr();
  const shownToday = s.shownTodayDate === today ? (s.shownToday || 0) : 0;
  const cfg = INTENSITY_CONFIG[s.intensity] || INTENSITY_CONFIG.gentle;
  if (shownToday >= cfg.dailyCap) return false;

  if (cfg.cooldownMs > 0 && s.history && s.history.length > 0) {
    const lastShown = Math.max(...s.history.map(h => h.shownAt));
    if (now - lastShown < cfg.cooldownMs) return false;
  }

  return true;
}

function pickMessage(hostname, s) {
  const cfg = INTENSITY_CONFIG[s.intensity] || INTENSITY_CONFIG.gentle;
  let context = resolveContext(hostname);

  if (isLateNight()) context = 'late';

  // First real message after reveal is forced ambient
  if (s.firstRunShown && !s.firstMessageShown) context = 'ambient';

  // Easter egg check
  const h = hostname.toLowerCase();
  const easterDomain = EASTER_EGG_DOMAINS.find(d => h === d || h.endsWith('.' + d));
  const useEasterEgg = !!(easterDomain && Math.random() < 0.25 && MESSAGES[easterDomain]?.length);

  // Rare check (independent of easter egg)
  const useRare = !useEasterEgg && Math.random() < cfg.rarePct;

  // Avoid same context twice in a row
  let effectiveCtx = context;
  if (!useEasterEgg && !useRare && s.lastContext === context && context !== 'ambient') {
    effectiveCtx = 'ambient';
  }

  let pool;
  if (useRare) {
    pool = RARE_MESSAGES;
    effectiveCtx = 'rare';
  } else if (useEasterEgg) {
    pool = MESSAGES[easterDomain] || MESSAGES.ambient;
    effectiveCtx = easterDomain;
  } else {
    pool = MESSAGES[effectiveCtx] || MESSAGES.ambient;
  }

  // 14-day dedup
  const cutoff = Date.now() - 14 * 24 * 3600000;
  const recentIds = new Set(
    (s.history || []).filter(h => h.shownAt > cutoff).map(h => h.id)
  );
  let available = pool.filter(t => !recentIds.has(hashText(t)));

  if (available.length === 0) {
    // All seen within 14 days — pick the one shown least recently
    const idToText = new Map(pool.map(t => [hashText(t), t]));
    const poolIds = new Set(pool.map(t => hashText(t)));
    const sorted = (s.history || [])
      .filter(h => poolIds.has(h.id))
      .sort((a, b) => a.shownAt - b.shownAt);
    const oldest = sorted[0] ? idToText.get(sorted[0].id) : null;
    available = oldest ? [oldest] : pool;
  }

  const text = available[Math.floor(Math.random() * available.length)];
  return { text, isRare: useRare, context: effectiveCtx, id: hashText(text) };
}

async function handleAlarmTick() {
  const s = await chrome.storage.local.get(null);
  if (!s.lastHostname || !s.lastTabId) return;
  if (!shouldFire(s)) return;

  const { text, isRare, context, id } = pickMessage(s.lastHostname, s);
  if (!text) return;

  const now = Date.now();
  const today = todayStr();
  const shownToday = s.shownTodayDate === today ? (s.shownToday || 0) : 0;
  const cutoff30 = now - 30 * 24 * 3600000;

  try {
    await chrome.tabs.sendMessage(s.lastTabId, {
      type: 'show',
      text,
      isRare,
      context,
      isLateNight: isLateNight(),
    });
  } catch {
    // Tab closed or navigated away — don't count this as shown
    return;
  }

  const newHistory = [...(s.history || []).filter(h => h.shownAt > cutoff30), { id, shownAt: now }];
  await chrome.storage.local.set({
    history: newHistory,
    lastContext: context,
    shownToday: shownToday + 1,
    shownTodayDate: today,
    firstMessageShown: s.firstRunShown ? true : (s.firstMessageShown || false),
  });

  if (s.intensity === 'test') {
    setTimeout(handleAlarmTick, 10000);
  }
}

async function handleDismiss(displayedAt) {
  const { dismissalTimes = [] } = await chrome.storage.local.get('dismissalTimes');
  const now = Date.now();
  const updated = [...dismissalTimes, { displayedAt, dismissedAt: now }].slice(-5);

  const patch = { dismissalTimes: updated };
  if (updated.length >= 3) {
    const last3 = updated.slice(-3);
    if (last3.every(t => t.dismissedAt - t.displayedAt < 2000)) {
      patch.backoffUntil = now + 24 * 3600000;
    }
  }
  await chrome.storage.local.set(patch);
}

async function handleSave(text, context) {
  const { savedMessages = [] } = await chrome.storage.local.get('savedMessages');
  const id = hashText(text);
  if (savedMessages.some(m => m.id === id)) return;
  await chrome.storage.local.set({
    savedMessages: [{ id, text, savedAt: Date.now(), context: context || 'rare' }, ...savedMessages],
  });
}

function ensureAlarm() {
  chrome.alarms.get('pacing', alarm => {
    if (!alarm) chrome.alarms.create('pacing', { periodInMinutes: 1 });
  });
}

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === 'install') {
    await chrome.storage.local.set(DEFAULT_STATE);
    chrome.tabs.create({ url: chrome.runtime.getURL('reveal.html') });
  }
  ensureAlarm();
});

chrome.runtime.onStartup.addListener(ensureAlarm);

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'pacing') handleAlarmTick();
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'hostname' && sender.tab?.id) {
    chrome.storage.local.set({ lastTabId: sender.tab.id, lastHostname: msg.hostname });
  }
  if (msg.type === 'dismiss') handleDismiss(msg.displayedAt);
  if (msg.type === 'save')    handleSave(msg.text, msg.context);
  return false;
});

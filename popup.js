function applyDim() {
  const h = new Date().getHours();
  if (h >= 22 || h < 6) {
    document.documentElement.setAttribute('data-dim', '');
  } else {
    document.documentElement.removeAttribute('data-dim');
  }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function midnightTonight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function midnightTomorrowNight() {
  const d = new Date();
  d.setHours(48, 0, 0, 0);
  return d.getTime();
}

function activePauseKey(pausedUntil) {
  const now = Date.now();
  if (!pausedUntil || now >= pausedUntil) return null;
  const tonight = midnightTonight();
  const tomorrow = midnightTomorrowNight();
  if (pausedUntil <= tonight) return '1h';
  if (pausedUntil <= tomorrow) return 'today';
  return 'tmrw';
}

applyDim();

const $ = id => document.getElementById(id);

async function render() {
  const s = await chrome.storage.local.get(null);
  const enabled = s.enabled !== false;
  const intensity = s.intensity || 'gentle';
  const quietStart = s.quietStart || '22:00';
  const quietEnd = s.quietEnd || '09:00';
  const pausedUntil = s.pausedUntil || 0;
  const savedCount = (s.savedMessages || []).length;
  const today = todayStr();
  const shownToday = s.shownTodayDate === today ? (s.shownToday || 0) : 0;

  // Status dot & label
  const dot = $('status-dot');
  const lbl = $('status-label');
  if (enabled) {
    dot.classList.remove('off');
    lbl.textContent = Date.now() < pausedUntil ? 'pausada' : 'escuchando';
  } else {
    dot.classList.add('off');
    lbl.textContent = 'pausada';
  }

  // Toggle
  const toggle = $('enabled-toggle');
  toggle.setAttribute('aria-checked', String(enabled));

  // Intensity
  document.querySelectorAll('.intensity-cell').forEach(cell => {
    cell.classList.toggle('active', cell.dataset.value === intensity);
  });

  // Quiet hours
  $('quiet-start').value = quietStart;
  $('quiet-end').value   = quietEnd;

  // Pause buttons
  const activeKey = activePauseKey(pausedUntil);
  document.querySelectorAll('.pause-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === activeKey);
  });

  // Counts
  $('shown-today').textContent = shownToday;
  $('saved-count').textContent = savedCount;
}

// Toggle on/off
$('enabled-toggle').addEventListener('click', async () => {
  const { enabled } = await chrome.storage.local.get('enabled');
  await chrome.storage.local.set({ enabled: !enabled });
  render();
});

// Intensity
$('intensity-grid').addEventListener('click', async e => {
  const cell = e.target.closest('.intensity-cell');
  if (!cell) return;
  await chrome.storage.local.set({ intensity: cell.dataset.value });
  render();
});

// Quiet hours
$('quiet-start').addEventListener('change', async e => {
  await chrome.storage.local.set({ quietStart: e.target.value });
});
$('quiet-end').addEventListener('change', async e => {
  await chrome.storage.local.set({ quietEnd: e.target.value });
});

// Pause buttons
$('pause-grid').addEventListener('click', async e => {
  const btn = e.target.closest('.pause-btn');
  if (!btn) return;
  const key = btn.dataset.value;
  const { pausedUntil } = await chrome.storage.local.get('pausedUntil');
  const activeKey = activePauseKey(pausedUntil);

  if (activeKey === key) {
    // Toggle off
    await chrome.storage.local.set({ pausedUntil: 0 });
  } else {
    let until;
    if (key === '1h')    until = Date.now() + 3600000;
    if (key === 'today') until = midnightTonight();
    if (key === 'tmrw')  until = midnightTomorrowNight();
    await chrome.storage.local.set({ pausedUntil: until });
  }
  render();
});

// Archive link
$('archive-link').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('archive.html') });
});

// Storage changes while popup is open (e.g. a toast fired)
chrome.storage.onChanged.addListener(render);

render();

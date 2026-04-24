(function () {
  // Apply dim if late night
  const h = new Date().getHours();
  if (h >= 22 || h < 6) {
    document.documentElement.setAttribute('data-dim', '');
  }

  document.getElementById('got-it').addEventListener('click', async () => {
    const now = Date.now();
    await chrome.storage.local.set({
      firstRunShown: true,
      firstRunAt: now,
      backoffUntil: now + 20 * 60 * 1000, // 20-minute silence after reveal
    });
    window.close();
  });
})();

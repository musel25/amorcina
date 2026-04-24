(() => {
  'use strict';

  const HOST_ID = 'amorcina-shadow-host';

  // Report hostname immediately and on SPA navigation
  function reportHostname() {
    chrome.runtime.sendMessage({ type: 'hostname', hostname: location.hostname });
  }
  reportHostname();

  const _pushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    _pushState(...args);
    reportHostname();
  };
  const _replaceState = history.replaceState.bind(history);
  history.replaceState = function (...args) {
    _replaceState(...args);
    reportHostname();
  };

  // Prevent double-injection on bfcache restore
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;
  Object.assign(host.style, {
    position: 'fixed',
    bottom: '0',
    right: '0',
    zIndex: '2147483646',
    pointerEvents: 'none',
    display: 'block',
    width: '0',
    height: '0',
  });
  document.body.appendChild(host);

  // Shadow DOM — closed to prevent host-page JS from reaching in
  const shadow = host.attachShadow({ mode: 'closed' });

  (async function initStyles() {
    const fontBase = chrome.runtime.getURL('fonts/');
    const cssUrl   = chrome.runtime.getURL('content.css');
    try {
      const resp = await fetch(cssUrl);
      let cssText = await resp.text();
      cssText = cssText.replace(/__FONT_BASE__\//g, fontBase);
      const sheet = new CSSStyleSheet();
      await sheet.replace(cssText);
      shadow.adoptedStyleSheets = [sheet];
    } catch (e) {
      // Fail silently — toast will still render, just unstyled
    }
  })();

  function isLateNight() {
    const h = new Date().getHours();
    return h >= 22 || h < 6;
  }

  let currentToast  = null;
  let displayedAt   = null;
  let autoDismissId = null;

  function removeToast(animate) {
    if (!currentToast) return;
    const toast = currentToast;
    currentToast = null;
    clearTimeout(autoDismissId);

    if (displayedAt !== null) {
      chrome.runtime.sendMessage({ type: 'dismiss', displayedAt });
      displayedAt = null;
    }

    host.style.pointerEvents = 'none';

    if (animate) {
      toast.classList.add('exit');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
      // Fallback if animationend doesn't fire (e.g. prefers-reduced-motion)
      setTimeout(() => toast.remove(), 400);
    } else {
      toast.remove();
    }
  }

  function renderToast({ text, isRare, context, isLateNight: dimFlag }) {
    removeToast(false);

    host.style.pointerEvents = 'auto';
    const dim = dimFlag || isLateNight();

    const toast = document.createElement('div');
    toast.className = isRare ? 'toast rare' : 'toast';
    if (dim) toast.setAttribute('data-dim', '');

    // Message text
    const msg = document.createElement('p');
    msg.className = 'msg';
    msg.textContent = text;
    toast.appendChild(msg);

    if (isRare) {
      // Floating hearts
      [{ left: '14%', delay: '0.2s' }, { left: '48%', delay: '1.1s' }, { left: '78%', delay: '1.8s' }]
        .forEach(({ left, delay }) => {
          const h = document.createElement('span');
          h.className = 'heart';
          h.textContent = '♡';
          h.style.left = left;
          h.style.animationDelay = delay;
          toast.appendChild(h);
        });

      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.textContent = '♡ guardar esta';
      saveBtn.addEventListener('click', e => {
        e.stopPropagation();
        chrome.runtime.sendMessage({ type: 'save', text, context });
        saveBtn.textContent = 'guardada ♡';
        saveBtn.disabled = true;
        saveBtn.classList.add('saved');
        setTimeout(() => removeToast(true), 800);
      });
      toast.appendChild(saveBtn);
    } else {
      // Signature line (normal toasts only)
      const from = document.createElement('span');
      from.className = 'from';
      from.textContent = 'de müsel';
      toast.appendChild(from);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'x';
    closeBtn.setAttribute('aria-label', 'cerrar nota');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      removeToast(true);
    });
    toast.appendChild(closeBtn);

    // Tap anywhere on the toast body to dismiss
    toast.addEventListener('click', () => removeToast(true));

    shadow.appendChild(toast);
    currentToast = toast;
    displayedAt  = Date.now();

    autoDismissId = setTimeout(() => removeToast(true), isRare ? 14000 : 7500);
  }

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'show') renderToast(msg);
  });
})();

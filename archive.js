(function () {
  // Apply dim if late night
  const h = new Date().getHours();
  if (h >= 22 || h < 6) {
    document.documentElement.setAttribute('data-dim', '');
  }

  const grid      = document.getElementById('notes-grid');
  const emptyEl   = document.getElementById('empty-state');
  const countEl   = document.getElementById('note-count');

  function cardRotation(id) {
    // Deterministic tilt from id hash, range -1.5deg to +1.5deg
    let n = 0;
    for (let i = 0; i < Math.min(id.length, 8); i++) {
      n = n * 10 + (id.charCodeAt(i) % 10);
    }
    const deg = ((n % 30) - 15) / 10;
    return deg.toFixed(2) + 'deg';
  }

  function formatDate(timestamp) {
    const d = new Date(timestamp);
    const days   = ['dom','lun','mar','mié','jue','vie','sáb'];
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
  }

  function buildCard(msg) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.style.setProperty('--r', cardRotation(msg.id));
    card.dataset.id = msg.id;

    const text = document.createElement('p');
    text.className = 'note-text';
    text.textContent = msg.text;

    const date = document.createElement('span');
    date.className = 'note-date';
    date.textContent = formatDate(msg.savedAt);

    const remove = document.createElement('button');
    remove.className = 'note-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'eliminar nota');
    remove.addEventListener('click', () => removeNote(msg.id, card));

    card.appendChild(remove);
    card.appendChild(text);
    card.appendChild(date);
    return card;
  }

  async function removeNote(id, card) {
    const { savedMessages = [] } = await chrome.storage.local.get('savedMessages');
    const updated = savedMessages.filter(m => m.id !== id);
    await chrome.storage.local.set({ savedMessages: updated });
    card.style.opacity = '0';
    card.style.transition = 'opacity 200ms';
    setTimeout(() => {
      card.remove();
      updateEmpty(updated.length);
    }, 200);
    countEl.textContent = updated.length;
  }

  function updateEmpty(count) {
    emptyEl.hidden = count > 0;
  }

  async function render() {
    const { savedMessages = [] } = await chrome.storage.local.get('savedMessages');
    grid.innerHTML = '';
    countEl.textContent = savedMessages.length;
    updateEmpty(savedMessages.length);
    savedMessages.forEach(msg => grid.appendChild(buildCard(msg)));
  }

  document.getElementById('back-btn').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else window.close();
  });

  render();
})();

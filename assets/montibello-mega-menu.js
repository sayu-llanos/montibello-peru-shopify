/* Montibello desktop mega menu + mobile drawer accordion behaviour. */
(() => {
  if (window.__montibelloMega) return;
  window.__montibelloMega = true;

  const OPEN_DELAY = 60;
  const CLOSE_DELAY = 180;
  let openKey = null;
  let openTimer;
  let closeTimer;

  const triggers = () => document.querySelectorAll('[data-mega-trigger]');
  const panel = (key) => document.querySelector(`[data-mega-panel="${key}"]`);

  function setOpen(key) {
    if (key === openKey) return;
    openKey = key;
    triggers().forEach((t) => t.setAttribute('aria-expanded', String(t.dataset.megaTrigger === key)));
    document.querySelectorAll('[data-mega-panel]').forEach((p) => {
      p.hidden = p.dataset.megaPanel !== key;
    });
    document.documentElement.toggleAttribute('data-montibello-mega-open', Boolean(key));
  }

  const scheduleOpen = (key) => {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    openTimer = setTimeout(() => setOpen(key), openKey ? 0 : OPEN_DELAY);
  };
  const scheduleClose = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setOpen(null), CLOSE_DELAY);
  };

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const t = e.target.closest('[data-mega-trigger]');
    if (t) scheduleOpen(t.dataset.megaTrigger);
    else if (e.target.closest('[data-mega-panel]')) { clearTimeout(closeTimer); clearTimeout(openTimer); }
    else if (openKey) scheduleClose();
  });

  document.documentElement.addEventListener('mouseleave', () => openKey && scheduleClose());

  const canHover = window.matchMedia('(hover: hover)');

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-mega-trigger]');
    if (t) {
      const key = t.dataset.megaTrigger;
      // Touch-only devices: first tap opens the panel, second tap follows the link.
      if (!canHover.matches && openKey !== key) {
        e.preventDefault();
        setOpen(key);
      }
      return;
    }
    if (openKey && !e.target.closest('[data-mega-panel]')) setOpen(null);
  });

  document.addEventListener('focusin', (e) => {
    const t = e.target.closest && e.target.closest('[data-mega-trigger]');
    if (t) { clearTimeout(closeTimer); setOpen(t.dataset.megaTrigger); }
    else if (openKey && !e.target.closest('[data-mega-panel]')) setOpen(null);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openKey) {
      const t = document.querySelector(`[data-mega-trigger="${openKey}"]`);
      setOpen(null);
      t && t.focus();
    }
  });

  window.matchMedia('(max-width: 749px)').addEventListener('change', () => setOpen(null));

  /* Mobile drawer: one open at a time per level. */
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.open) return;
    const sel = d.matches('[data-mega-drawer]') ? '[data-mega-drawer]' : d.matches('[data-mega-drawer-group]') ? '[data-mega-drawer-group]' : null;
    if (!sel) return;
    const scope = d.matches('[data-mega-drawer]') ? d.closest('ul') : d.parentElement;
    scope && scope.querySelectorAll(sel).forEach((o) => { if (o !== d) o.open = false; });
  }, true);
})();

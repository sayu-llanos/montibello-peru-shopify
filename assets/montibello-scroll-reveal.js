(() => {
  if (window.__montibelloRevealInit) return;
  window.__montibelloRevealInit = true;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  const observeAll = () => {
    document.querySelectorAll('[data-montibello-reveal]:not(.is-visible)').forEach((el) => observer.observe(el));
  };

  observeAll();
  document.addEventListener('shopify:section:load', observeAll);
})();

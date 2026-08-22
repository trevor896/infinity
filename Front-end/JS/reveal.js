(function () {
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (revealItems.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealItems.forEach((el) => observer.observe(el));
})();


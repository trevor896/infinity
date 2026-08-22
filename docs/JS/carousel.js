(function () {
  const script = document.currentScript;
  const root = script && script.closest ? script.closest('.carousel') : null;
  // If the script is not placed inside .carousel, fall back to first carousel on page.
  const carouselRoot = root || document.querySelector('.carousel');
  if (!carouselRoot) return;

  const track = carouselRoot.querySelector('.carousel-track');
  const slides = Array.from(carouselRoot.querySelectorAll('.carousel-slide'));
  const prevBtn = carouselRoot.querySelector('[data-carousel-prev]');
  const nextBtn = carouselRoot.querySelector('[data-carousel-next]');
  const dots = Array.from(carouselRoot.querySelectorAll('[data-carousel-dot]'));

  if (!track || slides.length === 0) return;

  let index = slides.findIndex((s) => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  function apply() {
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });

    dots.forEach((d, i) => {
      d.setAttribute('aria-selected', String(i === index));
      d.classList.toggle('is-active', i === index);
    });

    const viewport = carouselRoot.querySelector('.carousel-viewport');
    const slideWidth = viewport ? viewport.clientWidth : 0;
    track.style.transform = 'translateX(' + -index * slideWidth + 'px)';
  }

  function next() {
    index = (index + 1) % slides.length;
    apply();
  }

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    apply();
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = Number(dot.getAttribute('data-carousel-dot'));
      if (!Number.isNaN(i)) {
        index = i;
        apply();
      }
    });
  });

  // Keyboard support when carousel is focused
  carouselRoot.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  window.addEventListener('resize', apply, { passive: true });

  apply();
})();


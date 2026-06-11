(() => {
  const body = document.body;
  const openMenu = document.querySelector('[data-menu-open]');
  const closeMenu = document.querySelector('[data-menu-close]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-mobile-overlay]');

  function toggleMenu(state) {
    if (!mobileMenu || !overlay) return;
    mobileMenu.classList.toggle('open', state);
    overlay.classList.toggle('open', state);
    body.classList.toggle('menu-open', state);
    openMenu?.setAttribute('aria-expanded', String(state));
  }

  openMenu?.addEventListener('click', () => toggleMenu(true));
  closeMenu?.addEventListener('click', () => toggleMenu(false));
  overlay?.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll('.mobile-links a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -55px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const slides = [...document.querySelectorAll('[data-slide]')];
  const dots = [...document.querySelectorAll('[data-slide-dot]')];
  const previous = document.querySelector('[data-slide-prev]');
  const next = document.querySelector('[data-slide-next]');
  const slider = document.querySelector('[data-slider]');
  let currentSlide = 0;
  let autoPlay;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipePointerId = null;
  let swipeMoved = false;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentSlide));
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
      dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
    });
  }

  function startAutoPlay() {
    if (slides.length < 2) return;
    clearInterval(autoPlay);
    autoPlay = setInterval(() => showSlide(currentSlide + 1), 6500);
  }

  previous?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoPlay();
  });

  next?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoPlay();
    });
  });

  slider?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider?.addEventListener('mouseleave', startAutoPlay);
  slider?.addEventListener('focusin', () => clearInterval(autoPlay));
  slider?.addEventListener('focusout', startAutoPlay);

  slider?.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('button, a')) return;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    swipePointerId = event.pointerId;
    swipeMoved = false;
  });

  slider?.addEventListener('pointermove', (event) => {
    if (event.pointerId !== swipePointerId) return;
    const distanceX = event.clientX - swipeStartX;
    const distanceY = event.clientY - swipeStartY;
    if (Math.abs(distanceX) > 12 && Math.abs(distanceX) > Math.abs(distanceY)) {
      swipeMoved = true;
      clearInterval(autoPlay);
    }
  });

  slider?.addEventListener('pointerup', (event) => {
    if (event.pointerId !== swipePointerId) return;
    const distanceX = event.clientX - swipeStartX;
    const distanceY = event.clientY - swipeStartY;
    const swipeThreshold = Math.max(45, slider.clientWidth * 0.08);

    if (Math.abs(distanceX) >= swipeThreshold && Math.abs(distanceX) > Math.abs(distanceY) * 1.15) {
      showSlide(currentSlide + (distanceX < 0 ? 1 : -1));
    }

    swipePointerId = null;
    startAutoPlay();
  });

  slider?.addEventListener('pointercancel', () => {
    swipePointerId = null;
    startAutoPlay();
  });

  slider?.addEventListener('click', (event) => {
    if (!swipeMoved) return;
    event.preventDefault();
    swipeMoved = false;
  }, true);

  showSlide(0);
  startAutoPlay();

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.faq-card');
      const answer = card?.querySelector('.faq-answer');
      if (!card || !answer) return;
      const opening = !card.classList.contains('open');
      card.classList.toggle('open', opening);
      button.setAttribute('aria-expanded', String(opening));
      answer.style.maxHeight = opening ? `${answer.scrollHeight}px` : '0px';
    });
  });
})();

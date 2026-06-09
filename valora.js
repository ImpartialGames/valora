/* === VALORA shared JS === */
    (function () {
      const nav = document.getElementById('mainNav');
      const slider = document.getElementById('navSlider');
      if (!nav || !slider) return;

      const links = nav.querySelectorAll('a');

      links.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
          slider.style.left   = link.offsetLeft + 'px';
          slider.style.width  = link.offsetWidth + 'px';
          slider.style.opacity = '1';
        });
      });

      nav.addEventListener('mouseleave', function () {
        slider.style.opacity = '0';
      });
    })();

    (function () {
      const header = document.querySelector('.valora-header');
      const hero   = document.querySelector('.valora-hero');
      if (!header || !hero) return;

      header.classList.add('nav-transparent');

      function update() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        header.classList.toggle('nav-transparent', heroBottom > 80);
      }

      window.addEventListener('scroll', update, { passive: true });
      update();
    })();

    /* ---- Hero entrance stagger ---- */
    ;(function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var content = document.querySelector('.hero-content');
      if (!content) return;
      var items = [
        { el: content.querySelector('.hero-monogram'), delay:   0 },
        { el: content.querySelector('h1'),             delay: 120 },
        { el: content.querySelector('.hero-line'),     delay: 220 },
        { el: content.querySelector('p'),              delay: 340 },
        { el: content.querySelector('.hero-actions'),  delay: 440 }
      ];
      /* Pré-cacher */
      items.forEach(function (item) {
        if (!item.el) return;
        item.el.style.opacity   = '0';
        item.el.style.transform = 'translateY(22px)';
      });
      /* Animer en cascade */
      items.forEach(function (item) {
        if (!item.el) return;
        setTimeout(function () {
          item.el.style.transition =
            'opacity 0.65s cubic-bezier(0.22,0.6,0.36,1),' +
            'transform 0.65s cubic-bezier(0.22,0.6,0.36,1)';
          item.el.style.opacity   = '1';
          item.el.style.transform = 'translateY(0)';
          if (item.el.classList.contains('hero-line')) {
            item.el.style.transformOrigin = 'left center';
          }
        }, item.delay + 80);
      });
    })();

    /* ---- Scroll reveal IntersectionObserver ---- */
    ;(function () {
      if (!('IntersectionObserver' in window)) return;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el    = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal, .reveal-left, .reveal-line')
        .forEach(function (el) { observer.observe(el); });
    })();

    /* ---- Parallax hero background RAF + passive scroll ---- */
    ;(function () {
      var hero = document.querySelector('.valora-hero');
      if (!hero) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var ticking = false;
      var scrollY = 0;
      var FACTOR  = 0.30;

      function update() {
        hero.style.setProperty('--parallax-y', (scrollY * FACTOR) + 'px');
        ticking = false;
      }

      window.addEventListener('scroll', function () {
        scrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });
    })();

    /* ---- Menu mobile : toggle + focus trap + ESC + clic extérieur ---- */
    ;(function () {
      var burger = document.getElementById('navBurger');
      var menu   = document.getElementById('mobileMenu');
      var header = document.querySelector('.valora-header');
      if (!burger || !menu || !header) return;
      var panel   = menu.querySelector('.mobile-menu-panel');
      var closeBtn = document.getElementById('mobileMenuClose');
      var lastFocused = null;

      function focusable() {
        return panel.querySelectorAll('a[href], button:not([disabled])');
      }

      function openMenu() {
        lastFocused = document.activeElement;
        menu.hidden = false;
        void menu.offsetWidth; /* reflow pour la transition */
        menu.classList.add('is-open');
        header.classList.add('menu-open');
        document.body.classList.add('menu-locked');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Fermer le menu');
        var f = focusable();
        if (f.length) f[0].focus();
        document.addEventListener('keydown', onKeydown);
      }

      function closeMenu() {
        menu.classList.remove('is-open');
        header.classList.remove('menu-open');
        document.body.classList.remove('menu-locked');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Ouvrir le menu');
        document.removeEventListener('keydown', onKeydown);
        window.setTimeout(function () { menu.hidden = true; }, 420);
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }

      function onKeydown(e) {
        if (e.key === 'Escape') { closeMenu(); return; }
        if (e.key === 'Tab') {
          var f = focusable();
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
          }
        }
      }

      burger.addEventListener('click', openMenu);
      if (closeBtn) closeBtn.addEventListener('click', closeMenu);
      menu.addEventListener('click', function (e) {
        if (e.target.closest('[data-close]')) closeMenu();
      });
    })();

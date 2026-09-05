/* ============================================================
   ONE SPARK — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL BEHAVIOUR ---- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.06)';
    } else {
      navbar.style.borderBottomColor = '#2e2926';
    }
    lastScroll = current;
  });

  /* ---- MOBILE HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.program-card, .outcome-item, .involved-card, .about-image-wrap, .sustain-image-wrap, ' +
    '.partner-block, .budget-row:not(.header), .sustain-item, .mission-block, .gallery-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- BUDGET BARS (animate on scroll) ---- */
  const budgetRows = document.querySelectorAll('.budget-row[data-pct]');

  // Initially set widths to 0 for animation
  budgetRows.forEach(row => {
    const bar = row.querySelector('.budget-bar');
    if (bar) {
      const targetWidth = bar.style.width;
      bar.dataset.target = targetWidth;
      bar.style.width = '0%';
    }
  });

  const budgetObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.budget-bar');
          if (bar && bar.dataset.target) {
            setTimeout(() => {
              bar.style.width = bar.dataset.target;
            }, 100);
          }
          budgetObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  budgetRows.forEach(row => budgetObserver.observe(row));

  /* ---- DONATION AMOUNT BUTTONS ---- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-amount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) customInput.value = '';
    });
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      if (customInput.value) {
        amountBtns.forEach(b => b.classList.remove('active'));
      }
    });
  }

  /* ---- TOAST NOTIFICATION ---- */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ---- DONATE FORM ---- */
  const donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('donor-name');
      const emailEl = document.getElementById('donor-email');
      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';

      if (!name) {
        showToast('Please enter your full name.');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address.');
        if (emailEl) emailEl.focus();
        return;
      }

      // Get selected amount
      const activeBtn = donateForm.querySelector('.amount-btn.active');
      const custom = customInput ? customInput.value.trim() : '';
      const amount = custom || (activeBtn ? activeBtn.dataset.amount : '');

      if (!amount || Number(amount) <= 0) {
        showToast('Please select or enter a donation amount.');
        return;
      }

      // Simulate submission
      const submitBtn = donateForm.querySelector('.btn-donate');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast(`Thank you, ${name}. Your donation of $${amount} is being processed.`);
        donateForm.reset();
        amountBtns.forEach(b => b.classList.remove('active'));
        if (amountBtns[2]) amountBtns[2].classList.add('active');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('c-name');
      const emailEl = document.getElementById('c-email');
      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';

      if (!name) {
        showToast('Please enter your full name.');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address.');
        if (emailEl) emailEl.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast(`Message received. We'll be in touch with you soon, ${name}.`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    // Skip donation triggers (they open the modal instead)
    if (link.hasAttribute('data-donate')) return;

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = href.length > 1 ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        const offset = 64; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- DONATION MODAL (Sponsor a Student) ---- */
  function initDonateModal() {
    let modal = document.getElementById('donate-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'donate-modal';
      modal.className = 'donate-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML =
        '<div class="donate-modal-backdrop" data-donate-close></div>' +
        '<div class="donate-modal-card">' +
        '  <button class="donate-modal-close" data-donate-close aria-label="Close">&times;</button>' +
        '  <h3 class="donate-modal-title">Sponsor a Student</h3>' +
        '  <p class="donate-modal-sub">Support a young person through mobile money. Send your donation to either number below.</p>' +
        '  <div class="donate-mno-grid">' +
        '    <div class="donate-mno">' +
        '      <span class="mno-logo airtel-logo">airtel</span>' +
        '      <span class="mno-name">Airtel Money</span>' +
        '      <span class="mno-number">+256 7XX XXX XXX</span>' +
        '    </div>' +
        '    <div class="donate-mno">' +
        '      <span class="mno-logo mtn-logo">MTN</span>' +
        '      <span class="mno-name">MTN MoMo</span>' +
        '      <span class="mno-number">+256 7XX XXX XXX</span>' +
        '    </div>' +
        '  </div>' +
        '  <p class="donate-modal-note">Thank you for your generosity &mdash; every shilling empowers a future.</p>' +
        '</div>';
      document.body.appendChild(modal);
    }

    const openModal = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-donate]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    modal.querySelectorAll('[data-donate-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
  initDonateModal();

  /* ---- SUBTLE HEADING ANIMATION ---- */
  const headingEls = document.querySelectorAll(
    '.hero-headline, .hero-sub, .section-tag, .section-title, .section-intro, .stat-bar-title'
  );
  headingEls.forEach(el => el.classList.add('anim-up'));

  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          headingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  headingEls.forEach(el => headingObserver.observe(el));

  /* ---- HOPE DOODLE ART ---- */
  const doodles = [
    { cls: 'doodle--orange', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 42S7 32.5 7 20.5C7 14.5 11.5 10.5 16 10.5c3 0 5.5 1.8 8 4.5 2.5-2.7 5-4.5 8-4.5 4.5 0 9 4 9 10 0 12-17 21.5-17 21.5Z"/></svg>' },
    { cls: 'doodle--green', svg: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 42S15 32 15 20c0-6 5-10 10-10 3 0 5.5 1.8 7 4 1.5-2.2 4-4 7-4 5 0 10 4 10 10 0 12-17 22-17 22Z"/><path d="M5 26c-3 1.5-3 6.5 0 8.5 2 1.4 4.5 1 6-.5"/><path d="M59 26c3 1.5 3 6.5 0 8.5-2 1.4-4.5 1-6-.5"/></svg>' },
    { cls: 'doodle--gold', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 26h30v12H9z"/><path d="M19 38v-6h10v6"/><path d="M7 26c0-6.5 6-10.5 17-13 11 2.5 17 6.5 17 13"/><path d="M24 17c-1.6-2.2-4.2-2.6-4.7-.7-.3 1.3.9 2.6 4.7 4.5 3.8-1.9 5-3.2 4.7-4.5-.5-1.9-3.1-1.5-4.7.7Z"/></svg>' },
    { cls: 'doodle--orange', svg: '<svg viewBox="0 0 48 48" fill="currentColor"><path d="M24 5c1.4 10 6 14.6 16 16-10 1.4-14.6 6-16 16-1.4-10-6-14.6-16-16 10-1.4 14.6-6 16-16Z"/></svg>' },
    { cls: 'doodle--green', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 42V26"/><path d="M24 33c0-8 6-13 13-13 0 8-6 13-13 13Z"/><path d="M24 27c0-6-5-11-11-11 0 6 5 11 11 11Z"/></svg>' },
    { cls: 'doodle--gold', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="24" r="9"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.2 4.2M33.3 33.3l4.2 4.2M37.5 10.5l-4.2 4.2M14.7 33.3l-4.2 4.2"/></svg>' },
    { cls: 'doodle--orange', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M24 6l4.7 10.4L40 17l-8.4 7.6 2.4 11.4L24 30.6 14 36l2.4-11.4L8 17l11.3-.6z"/></svg>' },
    { cls: 'doodle--green', svg: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 36c0-12 7-20 16-20s16 8 16 20"/><path d="M14 36c0-8 5-14 10-14s10 6 10 14"/><path d="M20 36c0-4 2-7 4-7s4 3 4 7"/></svg>' }
  ];

  const doodlePositions = [
    { pos: 'doodle--left', w: '92px', h: '92px' },
    { pos: 'doodle--right-top', w: '64px', h: '64px' },
    { pos: 'doodle--left-bottom', w: '72px', h: '72px' }
  ];

  document.querySelectorAll('section:not(#hero), .gallery-hero').forEach((target, i) => {
    doodlePositions.forEach((p, j) => {
      const doodle = doodles[(i * doodlePositions.length + j) % doodles.length];
      const el = document.createElement('span');
      el.className = 'doodle ' + doodle.cls + ' ' + p.pos;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = doodle.svg;
      el.style.width = p.w;
      el.style.height = p.h;
      el.style.animationDelay = (j * 0.9) + 's';
      el.style.animationDuration = (6 + (j % 3)) + 's';
      target.appendChild(el);
    });
  });

  /* ---- UTILITY ---- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- STAGGERED CARD ANIMATIONS ---- */
  // Add small delays to cards within the same parent
  document.querySelectorAll('.programs-grid').forEach(grid => {
    grid.querySelectorAll('.program-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.07}s`;
    });
  });
  document.querySelectorAll('.involved-grid').forEach(grid => {
    grid.querySelectorAll('.involved-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  /* ---- FOOTER CURRENT YEAR ---- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();

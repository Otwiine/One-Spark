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
    '.program-card, .outcome-item, .context-card, .involved-card, ' +
    '.partner-block, .budget-row:not(.header), .sustain-item, .mission-block'
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
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 64; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
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
  document.querySelectorAll('.context-grid').forEach(grid => {
    grid.querySelectorAll('.context-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
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

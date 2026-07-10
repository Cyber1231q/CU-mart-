// =========================================================
// CU Mart — interactions
// =========================================================
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Open / closed indicator (7am - 10pm daily) ---------- */
  var openDot = document.getElementById('openDot');
  var openText = document.getElementById('openText');

  function updateOpenStatus() {
    if (!openDot || !openText) return;
    var now = new Date();
    var hour = now.getHours();
    var isOpen = hour >= 7 && hour < 22;

    openDot.classList.remove('is-open', 'is-closed');
    openDot.classList.add(isOpen ? 'is-open' : 'is-closed');
    openText.textContent = isOpen ? 'Open now · till 10pm' : 'Closed · opens 7am';
  }
  updateOpenStatus();

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.cat-card, .deal-card, .why-item, .voice-card, .section-head, .card-section-inner, .visit-grid'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Sticky header shrink shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 12) {
      header.style.boxShadow = '0 8px 24px -18px rgba(22,33,28,0.6)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Pre-order form validation ---------- */
  var form = document.getElementById('preorderForm');
  var formStatus = document.getElementById('formStatus');

  function setFieldError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById('err-' + fieldId);
    if (!input || !errorEl) return;
    if (message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function isValidPhone(value) {
    var digits = value.replace(/\s+/g, '');
    return /^[0-9+]{7,15}$/.test(digits);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var order = document.getElementById('order').value.trim();

      var hasError = false;

      if (name.length < 2) {
        setFieldError('name', 'Please enter your full name.');
        hasError = true;
      } else {
        setFieldError('name', '');
      }

      if (!isValidPhone(phone)) {
        setFieldError('phone', 'Enter a valid phone number.');
        hasError = true;
      } else {
        setFieldError('phone', '');
      }

      if (order.length < 3) {
        setFieldError('order', 'Tell us at least one item you need.');
        hasError = true;
      } else {
        setFieldError('order', '');
      }

      if (hasError) {
        formStatus.textContent = 'Please fix the highlighted fields.';
        formStatus.classList.remove('success');
        return;
      }

      // INTENTIONAL VULN (VA coursework — DOM-based XSS, OWASP A03:2021 Injection):
      // raw `name` is written via innerHTML instead of textContent, so HTML/JS in the
      // "Full name" field is parsed and executed. Test payload: <img src=x onerror=alert(document.domain)>
      // Fix: use formStatus.textContent = ... (as before) or escape the value before interpolating.
      formStatus.innerHTML = 'Thanks, ' + name + '! Your pre-order request is noted — swing by the till to confirm.';
      formStatus.classList.add('success');
      form.reset();
    });
  }

});

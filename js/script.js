/* ==========================================================================
   MAGA.DEV — behaviour
   Modules:
     initHeaderScroll   — sticky header background on scroll
     initMobileNav      — hamburger drawer
     initActiveSection  — highlights the current section in the nav
     initReveal         — fade-up reveals on scroll
     initHeroPointer    — subtle cursor-driven glow in the hero
     initCaseDialogs    — case study overlays
     initContactForm    — client-side validation (demo form, no backend)
     initYear           — auto-updating copyright year
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MOBILE_QUERY = '(max-width: 899px)';

  /** Translation lookup — falls back to the key if i18n.js failed to load. */
  var i18n = window.MagaI18n || { init: function () {}, t: function (key) { return key; } };
  var t = function (key) { return i18n.t(key); };

  /* ------------------------------------------------------------------ utils */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    return reduceMotion.matches;
  }

  /** Locks page scroll while an overlay is open. Ref-counted: nested owners are safe. */
  var scrollLock = (function () {
    var owners = 0;
    return {
      lock: function () {
        owners += 1;
        document.body.classList.add('is-locked');
      },
      unlock: function () {
        owners = Math.max(0, owners - 1);
        if (owners === 0) document.body.classList.remove('is-locked');
      }
    };
  })();

  /* --------------------------------------------------------- header on scroll */

  function initHeaderScroll() {
    var header = $('#site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ----------------------------------------------------------- mobile drawer */

  function initMobileNav() {
    var burger = $('#burger');
    var nav = $('#nav');
    var scrim = $('#nav-scrim');
    if (!burger || !nav || !scrim) return;

    var isOpen = false;

    function open() {
      if (isOpen) return;
      isOpen = true;
      nav.classList.add('is-open');
      scrim.hidden = false;
      // next frame so the transition runs from the hidden state
      window.requestAnimationFrame(function () { scrim.classList.add('is-visible'); });
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', t('a11y.menuClose'));
      scrollLock.lock();
    }

    function close(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      nav.classList.remove('is-open');
      scrim.classList.remove('is-visible');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', t('a11y.menuOpen'));
      scrollLock.unlock();

      window.setTimeout(function () {
        if (!isOpen) scrim.hidden = true;
      }, prefersReducedMotion() ? 0 : 400);

      if (returnFocus) burger.focus();
    }

    burger.addEventListener('click', function () {
      if (isOpen) close(false); else open();
    });

    scrim.addEventListener('click', function () { close(false); });

    // Close after choosing a section, so the anchor jump is visible.
    $$('.nav__link, .nav__foot a', nav).forEach(function (link) {
      link.addEventListener('click', function () { close(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen) close(true);
    });

    // The shared aria-label depends on drawer state, so restate it after a
    // language switch overwrote it with the "open" wording.
    document.addEventListener('i18n:change', function () {
      burger.setAttribute('aria-label', t(isOpen ? 'a11y.menuClose' : 'a11y.menuOpen'));
    });

    // Keep the drawer in a sane state when the layout switches to desktop.
    var mq = window.matchMedia(MOBILE_QUERY);
    var onChange = function (event) { if (!event.matches) close(false); };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }

  /* -------------------------------------------------------- active nav state */

  function initActiveSection() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = document.querySelector(id);
      if (!section) return;
      map[id.slice(1)] = link;
      sections.push(section);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.remove('is-active'); });
        var active = map[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* --------------------------------------------------------------- reveals */

  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    items.forEach(function (item) {
      var delay = item.getAttribute('data-reveal-delay');
      if (delay) item.style.setProperty('--reveal-delay', delay);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

    items.forEach(function (item) { observer.observe(item); });
  }

  /* ---------------------------------------------------------- hero pointer */

  function initHeroPointer() {
    var hero = $('#hero');
    var glow = hero && $('.hero__glow', hero);
    if (!glow) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var pending = false;
    var x = 70;
    var y = 32;

    function apply() {
      glow.style.setProperty('--mx', x + '%');
      glow.style.setProperty('--my', y + '%');
      pending = false;
    }

    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(apply);
    }, { passive: true });
  }

  /* ---------------------------------------------------------- case dialogs */

  function initCaseDialogs() {
    var triggers = $$('[data-case]');
    if (!triggers.length) return;

    var supportsDialog = typeof HTMLDialogElement === 'function' &&
      typeof HTMLDialogElement.prototype.showModal === 'function';

    if (!supportsDialog) {
      // Without <dialog> support, send the visitor to the live site instead of
      // opening a broken overlay.
      triggers.forEach(function (trigger) { trigger.hidden = true; });
      return;
    }

    var lastFocused = null;
    var locked = [];   // dialogs currently holding a scroll lock

    /** Runs exactly once per open/close cycle, whatever closed the dialog. */
    function cleanup(dialog) {
      dialog.classList.remove('is-open');

      var index = locked.indexOf(dialog);
      if (index !== -1) {
        locked.splice(index, 1);
        scrollLock.unlock();
      }

      // Deferred: the browser restores focus itself while closing, so claim it
      // back on the next task to land on the trigger the visitor came from.
      var target = lastFocused;
      lastFocused = null;
      if (!target) return;
      window.setTimeout(function () {
        if (document.contains(target)) target.focus();
      }, 0);
    }

    function openCase(dialog, trigger) {
      lastFocused = trigger;
      dialog.showModal();
      locked.push(dialog);
      scrollLock.lock();
      window.requestAnimationFrame(function () {
        dialog.classList.add('is-open');
      });
      // Focus the panel itself: screen readers land at the top of the case and
      // Tab still reaches the close button first.
      var scroller = $('.case__scroll', dialog);
      if (scroller) {
        scroller.scrollTop = 0;
        scroller.focus();
      }
    }

    function closeCase(dialog) {
      if (!dialog.open) {
        cleanup(dialog);
        return;
      }
      dialog.classList.remove('is-open');
      // dialog.close() fires `close`, which runs cleanup().
      var finish = function () { if (dialog.open) dialog.close(); else cleanup(dialog); };
      if (prefersReducedMotion()) finish();
      else window.setTimeout(finish, 320);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var dialog = document.getElementById(trigger.getAttribute('data-case'));
        if (dialog) openCase(dialog, trigger);
      });
    });

    $$('.case').forEach(function (dialog) {
      $$('[data-case-close]', dialog).forEach(function (button) {
        button.addEventListener('click', function () { closeCase(dialog); });
      });

      // Esc is handled natively by <dialog>; intercept it to run the animation.
      dialog.addEventListener('cancel', function (event) {
        event.preventDefault();
        closeCase(dialog);
      });

      // Click outside the panel closes the case.
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeCase(dialog);
      });

      // Single cleanup point — also covers a close triggered by the browser.
      dialog.addEventListener('close', function () { cleanup(dialog); });
    });
  }

  /* ------------------------------------------------------------ contact form */

  function initContactForm() {
    var form = $('#contact-form');
    if (!form) return;

    var status = $('#form-status', form);
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    var rules = {
      name: function (value) {
        if (!value) return t('err.nameRequired');
        if (value.length < 2) return t('err.nameShort');
        return '';
      },
      email: function (value) {
        if (!value) return t('err.emailRequired');
        if (!EMAIL_RE.test(value)) return t('err.emailInvalid');
        return '';
      },
      message: function (value) {
        if (!value) return t('err.messageRequired');
        if (value.length < 10) return t('err.messageShort');
        return '';
      }
    };

    function setFieldState(input, message) {
      var field = input.closest('.field');
      var error = document.getElementById(input.id + '-error');
      if (field) field.classList.toggle('has-error', Boolean(message));
      if (error) error.textContent = message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      return setFieldState(input, rule(input.value.trim()));
    }

    var inputs = $$('.field__input', form);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) validateField(input);
      });
    });

    function setStatus(text, state, mailtoHref) {
      status.className = 'form__status' + (state ? ' ' + state : '');
      status.textContent = text;
      if (mailtoHref) {
        status.appendChild(document.createTextNode(' '));
        var link = document.createElement('a');
        link.href = mailtoHref;
        link.textContent = t('form.mailLink');
        status.appendChild(link);
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus(t('form.checkFields'), 'is-error');
        firstInvalid.focus();
        return;
      }

      // No backend is connected — say so honestly and offer a working fallback.
      var name = $('#name', form).value.trim();
      var email = $('#email', form).value.trim();
      var message = $('#message', form).value.trim();

      var mailto = 'mailto:magomedovmg71@gmail.com' +
        '?subject=' + encodeURIComponent(t('form.mailSubject') + name) +
        '&body=' + encodeURIComponent(message + '\n\n—\n' + name + '\n' + email);

      setStatus(t('form.demo'), 'is-ok', mailto);
    });

    // Messages already on screen would be stranded in the previous language.
    document.addEventListener('i18n:change', function () {
      setStatus('', '');
      inputs.forEach(function (input) {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) validateField(input);
      });
    });
  }

  /* ------------------------------------------------------------------- year */

  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------- boot */

  function init() {
    i18n.init();
    initHeaderScroll();
    initMobileNav();
    initActiveSection();
    initReveal();
    initHeroPointer();
    initCaseDialogs();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

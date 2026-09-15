/* ==========================================================================
   MAGOMEDOV.WEB — behaviour
   Modules:
     initHeaderScroll   — sticky header background on scroll
     initMobileNav      — hamburger drawer
     initActiveSection  — highlights the current section in the nav
     initReveal         — fade-up reveals on scroll
     initHeroPointer    — subtle cursor-driven glow in the hero
     initCaseDialogs    — case study overlays
     initContactForm    — validation + delivery to Telegram via a Worker
     initYear           — auto-updating copyright year
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MOBILE_QUERY = '(max-width: 899px)';

  /* Contact channels. ENDPOINT is a Cloudflare Worker that keeps the Telegram
     bot token on the server side — nothing secret is exposed here. */
  var ENDPOINT = 'https://magadev-form.magomedovmg71.workers.dev';
  var MAIL = 'magomedovmg71@gmail.com';
  var WHATSAPP = '79226765715';

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

    // The hero is observed without a link, so scrolling back to the top clears
    // the highlight instead of leaving the last section marked as current.
    var hero = document.getElementById('hero');
    if (hero) sections.push(hero);

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

    items.forEach(function (item) {
      // Браузер восстанавливает позицию прокрутки при перезагрузке, а переход
      // по якорю сразу бросает вниз страницы. Всё, что осталось выше экрана,
      // показываем без анимации: иначе оно всплывало бы при возврате наверх.
      if (item.getBoundingClientRect().bottom < 0) {
        item.classList.add('is-visible');
        return;
      }
      observer.observe(item);
    });
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
      phone: function (value) {
        if (!value) return t('err.phoneRequired');
        // Считаем только цифры — скобки, дефисы и пробелы каждый пишет по-своему.
        var digits = value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) return t('err.phoneInvalid');
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

    /**
     * @param {string} text
     * @param {string} state
     * @param {Array<{href: string, label: string}>} [links] appended after the text
     */
    function setStatus(text, state, links) {
      status.className = 'form__status' + (state ? ' ' + state : '');
      status.textContent = text;
      (links || []).forEach(function (item) {
        status.appendChild(document.createTextNode(' '));
        var link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        if (item.href.indexOf('http') === 0) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        status.appendChild(link);
      });
    }

    /** Ready-to-send message for the channels the visitor opens themselves. */
    function composeText(lead) {
      return t('form.leadIntro') + lead.name + '.\n\n' + lead.message +
        '\n\n' + lead.email + '\n' + lead.phone;
    }

    function mailtoLink(lead) {
      return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(t('form.mailSubject') + lead.name) +
        '&body=' + encodeURIComponent(lead.message + '\n\n—\n' + lead.name + '\n' + lead.email + '\n' + lead.phone);
    }

    function whatsappLink(lead) {
      return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(composeText(lead));
    }

    var submitButton = $('button[type="submit"]', form);
    var sending = false;

    function setBusy(state) {
      sending = state;
      if (submitButton) submitButton.disabled = state;
      form.classList.toggle('is-sending', state);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (sending) return;

      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus(t('form.checkFields'), 'is-error');
        firstInvalid.focus();
        return;
      }

      var lead = {
        name: $('#name', form).value.trim(),
        email: $('#email', form).value.trim(),
        phone: $('#phone', form).value.trim(),
        message: $('#message', form).value.trim()
      };

      // Old browsers without fetch still get a working path, just a manual one.
      if (typeof window.fetch !== 'function') {
        setStatus(t('form.noFetch'), 'is-error', [
          { href: mailtoLink(lead), label: t('form.mailLink') },
          { href: whatsappLink(lead), label: t('form.waLink') }
        ]);
        return;
      }

      setBusy(true);
      setStatus(t('form.sending'), '');

      window.fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          message: lead.message,
          website: $('#website', form) ? $('#website', form).value : '',
          lang: i18n.lang || 'ru',
          page: window.location.pathname
        })
      }).then(function (response) {
        return response.json().catch(function () { return { ok: response.ok }; });
      }).then(function (result) {
        if (!result || !result.ok) throw new Error(result && result.error);
        if (typeof window.ym === 'function') window.ym(112315744, 'reachGoal', 'form_submit');
        form.reset();
        inputs.forEach(function (input) { setFieldState(input, ''); });
        setStatus(t('form.sent'), 'is-ok', [
          { href: whatsappLink(lead), label: t('form.waLink') }
        ]);
      }).catch(function () {
        // Nothing was delivered — offer the two channels that never fail.
        setStatus(t('form.failed'), 'is-error', [
          { href: whatsappLink(lead), label: t('form.waLink') },
          { href: mailtoLink(lead), label: t('form.mailLink') }
        ]);
      }).then(function () {
        setBusy(false);
      });
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

  /* ----------------------------------------------------- smooth page scroll */

  /* Wheel input is intercepted and the page eases towards a target instead of
     jumping. The step is damped and the coefficient is low, so the movement is
     slow and heavy. Mouse only: on touch screens the native scroll is better.

     Two details that matter:
     — the step is derived from frame time, not frame count, so 60 Hz and
       144 Hz move at the same speed;
     — the screen scrolls in whole pixels, so anything slower than one pixel
       per frame is bound to shudder. On the tail the motion switches to an
       even one-pixel-per-frame run until it lands. */

  function initSmoothScroll() {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    var target = window.scrollY;
    var current = window.scrollY;
    var ease = prefersReducedMotion() ? 0.12 : 0.048;
    var damp = prefersReducedMotion() ? 0.8 : 0.55;
    var cap = 170;
    var running = false;
    var lastFrame = 0;
    var lastY = -1;

    function limit() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function toPixels(event) {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    }

    function frame(now) {
      var gap = target - current;

      if (Math.abs(gap) < 1) {
        current = target;
        var end = Math.round(current);
        if (end !== lastY) { window.scrollTo(0, end); lastY = end; }
        running = false;
        lastFrame = 0;
        return;
      }

      var dt = lastFrame ? Math.min(now - lastFrame, 50) : 16.7;
      lastFrame = now;
      var k = 1 - Math.pow(1 - ease, dt / 16.7);

      var move = gap * k;
      if (Math.abs(move) < 1) {
        move = (gap > 0 ? 1 : -1) * Math.min(1, Math.abs(gap));
      }

      current += move;
      var y = Math.round(current);
      if (y !== lastY) { window.scrollTo(0, y); lastY = y; }

      window.requestAnimationFrame(frame);
    }

    function run() {
      if (!running) {
        running = true;
        window.requestAnimationFrame(frame);
      }
    }

    window.addEventListener('wheel', function (event) {
      if (event.ctrlKey) return;                                 // leave zoom alone
      if (document.body.classList.contains('is-locked')) return;  // an overlay is open
      if (event.target && event.target.closest &&
          event.target.closest('.case__scroll, .nav-drawer, dialog')) return;

      event.preventDefault();

      var move = toPixels(event) * damp;
      move = Math.max(-cap, Math.min(move, cap));
      target = Math.max(0, Math.min(target + move, limit()));
      run();
    }, { passive: false });

    /* Keys, the scrollbar and anchor jumps move the page past us — pick the
       position back up so the next wheel event does not snap. */
    window.addEventListener('scroll', function () {
      if (!running) { target = current = lastY = window.scrollY; }
    }, { passive: true });

    window.addEventListener('resize', function () {
      target = Math.min(target, limit());
    }, { passive: true });

    /* The browser skips frames in a hidden tab: coming back, resync so the
       page does not lurch towards a stale target. */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        target = current = lastY = window.scrollY;
        running = false;
        lastFrame = 0;
      }
    });

    /* Anchor links go through the same easing instead of the native jump. */
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var id = link.getAttribute('href');
        if (!id || id.length < 2) return;
        var dest = $(id);
        if (!dest) return;

        event.preventDefault();
        var header = document.documentElement.style.getPropertyValue('--header-h');
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
        target = Math.max(0, Math.min(dest.getBoundingClientRect().top + window.scrollY - offset - 24, limit()));
        run();
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
    initSmoothScroll();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

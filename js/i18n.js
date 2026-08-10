/* ==========================================================================
   MAGA.DEV — RU / EN

   Russian is the source language and lives directly in index.html, so the page
   is complete and readable without JavaScript. This file holds the English
   translations plus the strings JavaScript builds at runtime (form messages).

   Markup contract:
     data-i18n="key"       — replaces innerHTML
     data-i18n-aria="key"  — replaces aria-label
     data-i18n-alt="key"   — replaces alt

   Public API (window.MagaI18n):
     .lang            current language code
     .t(key)          runtime string in the current language
     .set(lang)       switch language
     'i18n:change'    event dispatched on document after a switch
   ========================================================================== */

window.MagaI18n = (function () {
  'use strict';

  var STORAGE_KEY = 'maga-lang';
  var DEFAULT_LANG = 'ru';

  /* ------------------------------------------------------------ dictionary */

  var EN = {
    /* Accessibility labels */
    'a11y.skip': 'Skip to content',
    'a11y.home': 'MAGA.DEV — back to top',
    'a11y.nav': 'Main navigation',
    'a11y.footerNav': 'Footer navigation',
    'a11y.caseClose': 'Close case study',

    /* Navigation & buttons */
    'nav.work': 'Projects',
    'nav.about': 'About',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'cta.talk': "Let's talk",
    'cta.viewProjects': 'View projects',
    'cta.viewProject': 'View project',
    'cta.live': 'View live project',
    'cta.code': 'View code',
    'cta.case': 'View case',
    'cta.start': 'Start a project',

    /* Hero */
    'hero.eyebrow': 'Web development — available for new projects',
    'hero.l1': 'Websites that',
    'hero.l2': 'make businesses',
    'hero.l3': 'look <em>better.</em>',
    'hero.lead': 'I build modern, fast and responsive websites for business.',
    'hero.m1': 'Web Development',
    'hero.m2': 'UI',
    'hero.m3': 'Performance',
    'hero.r1': '03 — selected projects',
    'hero.scroll': 'Scroll',

    /* Section labels */
    'sec.work': 'Work',
    'sec.about': 'About',
    'sec.stack': 'Stack',
    'sec.process': 'Process',
    'sec.why': 'Why',
    'sec.contact': 'Contact',

    'work.title': 'Selected work',
    'work.sub': 'Three projects that show how I approach design and development.',

    /* Shared facts */
    'fact.role': 'Role',
    'fact.roleVal': 'Design &amp; Development',
    'fact.stack': 'Stack',
    'fact.year': 'Year',
    'fact.langs': 'Languages',
    'cap.mobile': 'Mobile version',

    /* Project 01 — VELAR */
    'p1.cat': 'Automotive / Detailing',
    'p1.open': 'Open the VELAR DETAIL website in a new tab',
    'p1.desc': 'A premium detailing studio website with services, a work gallery, a Before&nbsp;/&nbsp;After block and a booking form.',
    'p1.cap1': 'Before / After — interactive comparison',
    'p1.alt1': 'VELAR DETAIL homepage: a dark detailing studio page with a large headline and a booking button',
    'p1.alt2': 'Before / After block on the VELAR DETAIL website with an interactive comparison slider',
    'p1.alt3': 'Mobile version of the VELAR DETAIL website on a phone screen',
    'p1.alt4': 'Services section of the VELAR DETAIL website with service cards leading into the price list',

    /* Project 02 — SHAFRAN */
    'p2.cat': 'Restaurant / Hospitality',
    'p2.open': 'Open the SHAFRAN website in a new tab',
    'p2.desc': 'A modern restaurant website built around atmosphere, menu, photography and table booking.',
    'p2.cap1': 'Menu by category',
    'p2.cap2': 'Gallery',
    'p2.alt1': 'SHAFRAN restaurant homepage with a full-screen photograph and headline',
    'p2.alt2': 'Menu section of the SHAFRAN website with dish photography and prices',
    'p2.alt3': 'Mobile version of the SHAFRAN restaurant website on a phone screen',
    'p2.alt4': 'Interior and food gallery on the SHAFRAN restaurant website',

    /* Project 03 — ATLAS */
    'p3.cat': 'Architecture / Studio',
    'p3.open': 'Open the ATLAS ARCHITECTS website in a new tab',
    'p3.desc': 'A premium website for an architecture studio, designed and built from scratch.',
    'p3.drawing': 'Drawing',
    'p3.building': 'Building',
    'p3.cap1': 'Editorial project grid',
    'p3.alt1': 'ATLAS ARCHITECTS homepage with a large architectural photograph and headline',
    'p3.alt2': 'Comparison slider on the ATLAS ARCHITECTS website: an architectural drawing on the left, the finished building on the right',
    'p3.alt3': 'Project grid on the ATLAS ARCHITECTS website with large architectural photography',
    'p3.alt4': 'Mobile version of the ATLAS ARCHITECTS website on a smartphone screen',

    /* About */
    'about.title': 'Building websites,<br>not templates.',
    'about.p1': 'I build websites that look current, load fast and work equally well on desktop, tablet and phone.',
    'about.p2': 'Every project is written by hand — no page builders, no heavy templates.',
    'trait.1': 'Responsive',
    'trait.2': 'Fast',
    'trait.3': 'SEO-ready',
    'trait.4': 'Modern UI',

    /* Capabilities */
    'cap.title': 'Capabilities',
    'cap.t1': 'Semantic markup',
    'cap.t2': 'Grid · Flexbox · Animations',
    'cap.t3': 'Vanilla, no frameworks',
    'cap.n4': 'Responsive Design',
    'cap.n5': 'UI Development',
    'cap.t5': 'Interface and composition',
    'cap.t6': 'Version control',
    'cap.t7': 'Hosting and deployment',
    'cap.n9': 'Performance',
    'cap.t9': 'Weight, images, fonts',
    'cap.n10': 'Accessibility',
    'cap.t10': 'Keyboard · contrast · ARIA',

    /* Process */
    'process.title': 'How I work',
    'step.1t': 'Discussion',
    'step.1d': 'I get to know the task, the business and the goals of the project.',
    'step.2t': 'Design',
    'step.2d': 'I work out the structure, the composition and the visual language.',
    'step.3t': 'Development',
    'step.3d': 'I build the responsive site and its interactive elements.',
    'step.4t': 'Testing',
    'step.4d': 'I check the mobile version, speed, accessibility and that everything works.',
    'step.5t': 'Launch',
    'step.5d': 'I prepare the site for publication.',

    /* Why */
    'why.title': 'Built for business.',
    'why.n1': 'Modern design',
    'why.d1': 'The site looks current and professional.',
    'why.n2': 'Responsive',
    'why.d2': 'Works correctly on desktop, tablet and phone.',
    'why.n3': 'Performance',
    'why.d3': 'Clean code and attention to loading speed.',

    /* Contact */
    'contact.title': 'Have a project<br>in mind?',
    'contact.sub': 'Tell me about your task — we will work out which website fits your business.',
    'contact.direct': 'Direct',
    'contact.note': 'I answer by email, Telegram and WhatsApp.',
    'form.notice': 'I reply within one working day. If a messenger suits you better — write on <strong>Telegram</strong> or <strong>WhatsApp</strong>.',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.send': 'Send message',

    /* Footer */
    'footer.tagline': 'Web development &amp; digital experiences.',
    'footer.menu': 'Menu',
    'footer.links': 'Elsewhere',
    'footer.email': 'Email',
    'footer.code': 'Atlas source <span aria-hidden="true">↗</span>',
    'footer.by': 'Designed &amp; built by MAGA.DEV',

    /* Case studies — shared headings */
    'case.h1': 'Project',
    'case.h2': 'Challenge',
    'case.h3': 'Approach',
    'case.h4': 'Features',
    'case.h5': 'Technologies',
    'case.h6': 'Result',

    /* Case 01 — VELAR */
    'c1.lead': 'A premium detailing studio website: services, pricing, a work gallery, a Before / After block and a booking form.',
    'c1.s1': 'A one-page website for a detailing studio. The goal was to show the level of the work and take the visitor through to a booking. Dark automotive styling, a warm gold accent, large type.',
    'c1.s2': 'Detailing is sold by the result, and the result is hard to explain in words. The page had to show the before / after difference first, and only then ask for the booking.',
    'c1.s3': 'A clear sequence of screens: services → pricing → work → booking. Every block ends with an obvious next step. The dark palette keeps attention on the cars.',
    'c1.feat': '<li>Interactive Before / After slider</li><li>Services block and transparent pricing</li><li>Booking form with validation</li><li>Mobile menu, responsive from 320px</li>',
    'c1.s6': 'The finished site is published on GitHub Pages and available at a direct link. It opens on desktop and mobile, and every interactive element runs without third-party libraries.',

    /* Case 02 — SHAFRAN */
    'c2.lead': 'A modern restaurant website built around atmosphere, menu, photography and table booking.',
    'c2.s1': 'A website for an Eastern cuisine restaurant. A full-screen photograph, a warm dark palette, and sections for the restaurant, menu, gallery, booking and contacts.',
    'c2.s2': 'A restaurant website has two kinds of visitor: one wants to understand the place, the other wants to book a table quickly. Both had to be served without losing the atmosphere.',
    'c2.s3': 'Large photography and calm typography carry the atmosphere; the booking button in the header carries the action on every screen. The menu is split by category so it is comfortable to browse on a phone.',
    'c2.feat': '<li>Menu by category with dish photography</li><li>Interior and plating gallery</li><li>Booking form with validation</li><li>Sticky navigation and mobile menu</li>',
    'c2.tech': '<li>HTML5</li><li>CSS3</li><li>JavaScript</li><li>WebP + srcset</li><li>Self-hosted variable fonts</li><li>GitHub Pages</li>',
    'c2.s6': 'The site is published on GitHub Pages. Images are served as WebP in several sizes and the fonts are self-hosted as latin + cyrillic subsets, so the page stays light despite the amount of photography.',

    /* Case 03 — ATLAS */
    'c3.lead': 'A premium website for an architecture studio, designed and built from scratch.',
    'c3.s1': 'A website for an architecture studio — a long read covering the studio, its projects, services, process and team. A bilingual RU / EN interface, a monochrome palette and a strict grid.',
    'c3.s2': 'Architecture is sold by the image, not the copy. The interface must not compete with the photography — while still holding a long page together and working in two languages.',
    'c3.s3': 'An editorial grid, plenty of air, restrained motion. The central idea is the “Drawing → Building” slider: the visitor turns the project from a drawing into a finished building.',
    'c3.feat': '<li>Bilingual RU / EN interface</li><li>“Drawing → Building” slider</li><li>Animated statistics</li><li>FAQ accordion with correct keyboard behaviour</li>',
    'c3.moreLabel': 'Full list of technical features',
    'c3.more': '<li>Responsive layout and mobile navigation</li><li>Smooth scrolling and keyboard navigation</li><li>prefers-reduced-motion support</li><li>Accessibility: aria attributes, focus states, contrast</li><li>SEO: meta tags, Open Graph, Schema.org</li><li>sitemap.xml and robots.txt</li><li>Image optimisation for different screens</li>',
    'c3.s6': 'The site is published and its source code is open on GitHub. It is the most editorial and the most technically complete of the three: two languages, an interactive slider and a full set of SEO and accessibility work.',

    /* Runtime strings */
    'meta.title': 'MAGA.DEV — Modern websites for business',
    'meta.description': 'MAGA.DEV — modern, fast and responsive websites for business. Three real projects: a detailing studio, a restaurant and an architecture practice.',
    'a11y.menuOpen': 'Open menu',
    'a11y.menuClose': 'Close menu',
    'a11y.lang': 'Переключить на русский',
    'err.nameRequired': 'Tell me what to call you.',
    'err.nameShort': 'Your name needs at least 2 characters.',
    'err.emailRequired': 'Add an email so I can reply.',
    'err.emailInvalid': 'Check the email format — for example name@example.com',
    'trait.1d': 'Looks right on a phone, a tablet and a wide monitor alike.',
    'trait.2d': 'Compressed images, self-hosted fonts, not a single extra library.',
    'trait.3d': 'Semantic markup, meta tags and Schema.org from day one.',
    'trait.4d': 'Considered typography and composition instead of a ready-made template.',
    'err.phoneRequired': 'Add a phone number so I can call back.',
    'err.phoneInvalid': 'Check the number — for example +7 900 000-00-00',
    'err.messageRequired': 'Describe the task in a couple of words.',
    'err.messageShort': 'A little too short — add some detail (10 characters minimum).',
    'form.checkFields': 'Please check the highlighted fields.',
    'form.sending': 'Sending…',
    'form.sent': 'Sent — I will reply within one working day.',
    'form.failed': 'Could not send it. Reach me directly:',
    'form.noFetch': 'Your browser is too old for this form. Reach me directly:',
    'form.mailLink': 'Send it as an email →',
    'form.waLink': 'Duplicate on WhatsApp →',
    'form.mailSubject': 'Project — ',
    'form.leadIntro': 'Hello! My name is '
  };

  /* Runtime strings that are not present anywhere in the markup. */
  var RU = {
    'meta.title': 'MAGA.DEV — Разработка современных сайтов для бизнеса',
    'meta.description': 'MAGA.DEV — веб-разработка современных, быстрых и адаптивных сайтов для бизнеса. Три реальных проекта: детейлинг-студия, ресторан и архитектурное бюро.',
    'a11y.menuOpen': 'Открыть меню',
    'a11y.menuClose': 'Закрыть меню',
    'a11y.lang': 'Switch to English',
    'err.nameRequired': 'Укажите, как к вам обращаться.',
    'err.nameShort': 'Имя должно содержать минимум 2 символа.',
    'err.emailRequired': 'Укажите email для ответа.',
    'err.emailInvalid': 'Проверьте формат email — например, name@example.com',
    'err.phoneRequired': 'Укажите телефон, чтобы я мог перезвонить.',
    'err.phoneInvalid': 'Проверьте номер — например, +7 900 000-00-00',
    'err.messageRequired': 'Опишите задачу хотя бы в двух словах.',
    'err.messageShort': 'Слишком коротко — добавьте деталей (минимум 10 символов).',
    'form.checkFields': 'Проверьте отмеченные поля.',
    'form.sending': 'Отправляю…',
    'form.sent': 'Заявка отправлена — отвечу в течение рабочего дня.',
    'form.failed': 'Не получилось отправить. Напишите напрямую:',
    'form.noFetch': 'Браузер устарел и не может отправить форму. Напишите напрямую:',
    'form.mailLink': 'Отправить письмом →',
    'form.waLink': 'Продублировать в WhatsApp →',
    'form.mailSubject': 'Проект — ',
    'form.leadIntro': 'Здравствуйте! Меня зовут '
  };

  var DICT = { en: EN, ru: RU };

  /* ---------------------------------------------------------------- engine */

  var lang = DEFAULT_LANG;

  function readStoredLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === 'en' || stored === 'ru' ? stored : null;
    } catch (error) {
      return null;   // private mode / storage disabled
    }
  }

  function storeLang(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) { /* nothing to do */ }
  }

  function t(key) {
    var pack = DICT[lang] || {};
    if (Object.prototype.hasOwnProperty.call(pack, key)) return pack[key];
    if (Object.prototype.hasOwnProperty.call(RU, key)) return RU[key];
    return key;
  }

  /**
   * Applies one translated value to an element. The Russian original is cached
   * on first use, so switching back needs no second dictionary.
   */
  function applyTo(element, attribute, key, cacheProp) {
    if (!(cacheProp in element)) {
      element[cacheProp] = attribute ? element.getAttribute(attribute) : element.innerHTML;
    }

    var value = lang === DEFAULT_LANG ? element[cacheProp] : EN[key];
    if (typeof value !== 'string') return;

    if (attribute) element.setAttribute(attribute, value);
    else element.innerHTML = value;
  }

  function render() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      applyTo(nodes[i], null, nodes[i].getAttribute('data-i18n'), '_ruHtml');
    }

    nodes = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) {
      applyTo(nodes[i], 'aria-label', nodes[i].getAttribute('data-i18n-aria'), '_ruAria');
    }

    nodes = document.querySelectorAll('[data-i18n-alt]');
    for (i = 0; i < nodes.length; i++) {
      applyTo(nodes[i], 'alt', nodes[i].getAttribute('data-i18n-alt'), '_ruAlt');
    }

    document.documentElement.lang = lang;
    document.title = t('meta.title');

    // Описание страницы тоже переключаем: его читают при отправке ссылки
    // в мессенджер и голосовые помощники.
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('meta.description'));

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', t('a11y.lang'));
      var options = toggle.querySelectorAll('.lang__opt');
      for (i = 0; i < options.length; i++) {
        var code = (options[i].textContent || '').trim().toLowerCase();
        options[i].classList.toggle('is-current', code === lang);
      }
    }
  }

  function set(next) {
    if (next !== 'ru' && next !== 'en') return;
    if (next === lang) return;
    lang = next;
    storeLang(lang);
    render();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
  }

  function init() {
    var stored = readStoredLang();
    if (stored) lang = stored;
    render();

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        set(lang === 'ru' ? 'en' : 'ru');
      });
    }
  }

  return {
    init: init,
    set: set,
    t: t,
    get lang() { return lang; }
  };
})();

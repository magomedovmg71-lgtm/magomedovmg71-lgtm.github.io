/* ==========================================================================
   MAGOMEDOV.WEB — RU / EN

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
    'a11y.home': 'MAGOMEDOV.WEB — back to top',
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
    'hero.eyebrow': 'Web developer - open for new projects',
    'hero.l1': 'Websites that',
    'hero.l2': 'make businesses',
    'hero.l3': 'look <em>better.</em>',
    'hero.lead': 'A business-card site or a company site: design, a mobile version and a request form.',
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

    'work.title': 'Website examples',
    'wl.naruki': 'Coffee shop & street food',
    'wl.usta': 'Barbershop',
    'wl.shafran': 'Restaurant',
    'work.sub': 'Websites for a coffee shop, a barbershop and a restaurant. Each one is live.',

    /* Shared facts */
    'fact.role': 'Role',
    'fact.roleVal': 'Design &amp; Development',
    'fact.stack': 'Stack',
    'fact.year': 'Year',
    'fact.langs': 'Languages',
    'cap.mobile': 'Mobile version',

    /* Project 01 — NA RUKI */
    'p0.cat': 'Coffee shop and street food / Delivery',
    'p0.open': 'Open the NA RUKI website in a new tab',
    'p0.desc': 'A coffee shop with street food: a 22-item menu with filtering, a cart and a three-step checkout — delivery, pickup or dine-in. The delivery fee is calculated by district, and guests book a specific table rather than “somewhere”. A breakfast combo is built from two dishes, with the discount calculated automatically and switched on by the hour.',
    'p0.cap1': 'A 22-item menu with category filtering',
    'p0.alt1': 'NA RUKI coffee shop homepage: a large headline and photos of coffee to go',
    'p0.alt2': 'NA RUKI menu page: dish cards with photos, prices and a category filter',
    'p0.alt3': 'Mobile version of the NA RUKI coffee shop website on a phone screen',
    'p0.alt4': 'NA RUKI combo block: breakfast and coffee pickers, 490 ₽ instead of 680 ₽',
    'p0.cap2': 'Combo: pick a pair, discount applied in the cart',

    /* Project 02 — USTA */
    'p1.cat': 'Barbershop / Services',
    'p1.open': 'Open the USTA website in a new tab',
    'p1.desc': 'A barbershop website: price list, barbers, a work gallery and online booking. Smooth inertia scrolling written by hand, no libraries.',
    'p1.cap1': 'Work gallery with arrow controls',
    'p1.alt1': 'USTA barbershop homepage: a dark page with a large name and a booking button',
    'p1.alt2': 'Work gallery on the USTA website: a strip of haircut photos with arrow controls',
    'p1.alt3': 'Mobile version of the USTA barbershop website on a phone screen',
    'p1.alt4': 'Price list on the USTA website: service rows with dotted leaders and prices',

    /* Project 03 — SHAFRAN */
    'p2.cat': 'Restaurant / Hospitality',
    'p2.open': 'Open the SHAFRAN website in a new tab',
    'p2.desc': 'A modern restaurant website built around atmosphere, menu, photography and table booking.',
    'p2.cap1': 'Menu by category',
    'p2.cap2': 'Gallery',
    'p2.alt1': 'SHAFRAN restaurant homepage with a full-screen photograph and headline',
    'p2.alt2': 'Menu section of the SHAFRAN website with dish photography and prices',
    'p2.alt3': 'Mobile version of the SHAFRAN restaurant website on a phone screen',
    'p2.alt4': 'Interior and food gallery on the SHAFRAN restaurant website',


    /* About */
    'about.title': 'Built from scratch,<br>no templates.',
    'about.p1': 'My name is Magomed, I am a web developer based in Makhachkala. I build websites that look current, load fast and work equally well on desktop, tablet and phone.',
    'about.p2': 'Every project is written by hand — no page builders, no heavy templates. I work with clients from any city in Russia, entirely online.',
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
    'process.title': 'How I build a website',
    'step.1t': 'Discussion',
    'step.1d': 'I get to know the task, the business and the goals of the project.',
    'step.2t': 'Design',
    'step.2d': 'I work out the structure, the composition and the visual language.',
    'step.3t': 'Development',
    'step.3d': 'I build the responsive site and its interactive elements.',
    'step.4t': 'Testing',
    'step.4d': 'I check the mobile version, loading speed, and that forms and buttons work.',
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
    'contact.note': 'I answer calls, WhatsApp, email and Telegram.',
    'form.notice': 'I reply within one working day. If a messenger suits you better — write on <strong>Telegram</strong> or <strong>WhatsApp</strong>.',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.send': 'Send message',

    /* Footer */
    'footer.tagline': 'Websites for business.',
    'footer.services': 'Services',
    'svc.cafe': 'Café website',
    'svc.barber': 'Barbershop website',
    'svc.restaurant': 'Restaurant website',
    'svc.card': 'Business-card website',
    'svc.landing': 'Landing page',
    'footer.menu': 'Menu',
    'footer.links': 'Elsewhere',
    'footer.email': 'Email',
    'footer.by': 'Designed &amp; built by MAGOMEDOV.WEB',

    /* Case studies — shared headings */
    'case.h1': 'Project',
    'case.h2': 'Challenge',
    'case.h3': 'Approach',
    'case.h4': 'Features',
    'case.h5': 'Technologies',
    'case.h6': 'Result',

    /* Case 01 — USTA */
    'c1.lead': 'A barbershop website: price list, barbers, a work gallery and online booking. Dark styling, a brass accent, smooth scrolling without libraries.',
    'c1.s1': 'A one-page website for a barbershop. The goal was to take the visitor through to a booking. A dark base, brass as the only accent, large signboard type.',
    'c1.s2': 'Barbershops usually have no website: prices and booking live in chat, and the guest never sees the full list of services. The page had to make prices and free slots clear at a glance, without a phone call.',
    'c1.s3': 'The order of screens follows the guest: prices → barbers → work → booking. The price list is set in rows with dotted leaders, the way an old barbershop board reads — a second to scan.',
    'c1.feat': '<li>Smooth inertia scrolling, written by hand</li><li>Full-screen hero with changing frames and parallax</li><li>Work gallery with arrow controls</li><li>Booking form with validation and a bot trap</li>',
    'c1.s6': 'The page is ready in 40 ms, ships two files of its own and not a single external library. Scrolling moves in whole pixels and does not shudder as it settles — measured, not assumed.',

    /* Case 02 — SHAFRAN */
    'c2.lead': 'A modern restaurant website built around atmosphere, menu, photography and table booking.',
    'c2.s1': 'A website for an Eastern cuisine restaurant. A full-screen photograph, a warm dark palette, and sections for the restaurant, menu, gallery, booking and contacts.',
    'c2.s2': 'A restaurant website has two kinds of visitor: one wants to understand the place, the other wants to book a table quickly. Both had to be served without losing the atmosphere.',
    'c2.s3': 'Large photography and calm typography carry the atmosphere; the booking button in the header carries the action on every screen. The menu is split by category so it is comfortable to browse on a phone.',
    'c2.feat': '<li>Menu by category with dish photography</li><li>Interior and plating gallery</li><li>Booking form with validation</li><li>Sticky navigation and mobile menu</li>',
    'c2.tech': '<li>HTML5</li><li>CSS3</li><li>JavaScript</li><li>WebP + srcset</li><li>Self-hosted variable fonts</li><li>GitHub Pages</li>',
    'c2.s6': 'The site is published on GitHub Pages. Images are served as WebP in several sizes and the fonts are self-hosted as latin + cyrillic subsets, so the page stays light despite the amount of photography.',


    /* Runtime strings */
    'meta.title': 'Websites for business across Russia | MAGOMEDOV.WEB',
    'meta.description': 'I build websites for business: a business-card site or a company site with design, a mobile version and a request form. Examples: a coffee shop, a barbershop, a restaurant.',
    'a11y.menuOpen': 'Open menu',
    'a11y.menuClose': 'Close menu',
    'a11y.lang': 'RU / EN, переключить на русский',
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
    'form.failed': 'Could not send — the connection seems to be down. Nothing is lost: tap below and the message opens already filled in.',
    'form.noFetch': 'This browser is too old to send the form. Nothing is lost: tap below and the message opens already filled in.',
    'form.mailLink': 'Send it as an email →',
    'form.waLink': 'Duplicate on WhatsApp →',
    'form.mailSubject': 'Project — ',
    'form.leadIntro': 'Hello! My name is '
  };

  /* Runtime strings that are not present anywhere in the markup. */
  var RU = {
    'meta.title': 'Создание сайтов для бизнеса по всей России | MAGOMEDOV.WEB',
    'meta.description': 'Делаю сайты для бизнеса: сайт-визитка или сайт компании с дизайном, версией для телефона и формой заявок. Примеры: кофейня, барбершоп, ресторан.',
    'a11y.menuOpen': 'Открыть меню',
    'a11y.menuClose': 'Закрыть меню',
    'a11y.lang': 'RU / EN, switch to English',
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
    'form.failed': 'Не получилось отправить — похоже, пропала связь. Данные не потеряны: нажмите, и сообщение откроется уже заполненным.',
    'form.noFetch': 'Браузер устарел и не может отправить форму. Данные не потеряны: нажмите, и сообщение откроется уже заполненным.',
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

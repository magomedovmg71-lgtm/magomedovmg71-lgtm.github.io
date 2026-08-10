/**
 * MAGOMEDOV.DEV — приём заявок с формы обратной связи.
 *
 * Сайт статический и лежит на GitHub Pages, поэтому отправлять заявки напрямую
 * в Telegram он не может: для этого пришлось бы положить токен бота в открытый
 * JavaScript. Этот Worker стоит посередине и хранит токен у себя — в код сайта
 * попадает только его адрес.
 *
 * Секреты задаются командой `wrangler secret put ИМЯ`:
 *   TELEGRAM_TOKEN    — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID  — числовой id получателя
 *   RESEND_API_KEY    — необязательно: если задан, заявка дублируется на почту
 *   MAIL_TO           — необязательно: адрес для копии
 */

// Отвечаем только своему сайту. Локальные адреса — чтобы можно было
// проверять форму до публикации.
const ALLOWED_ORIGINS = [
  'https://magomedovmg71-lgtm.github.io',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

const LIMITS = { name: 100, email: 200, phone: 40, message: 4000 };

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Метод не поддерживается' }, 405, cors);
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: 'Запрос с чужого адреса' }, 403, cors);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: 'Не удалось прочитать данные' }, 400, cors);
    }

    // Ловушка для ботов: поле спрятано от людей, заполнить его может только
    // автомат. Отвечаем «успехом», чтобы спамер не понял, что его отсеяли.
    if (data.website) {
      return json({ ok: true }, 200, cors);
    }

    const name = clean(data.name, LIMITS.name);
    const email = clean(data.email, LIMITS.email);
    const phone = clean(data.phone, LIMITS.phone);
    const message = clean(data.message, LIMITS.message);

    const problem = validate(name, email, phone, message);
    if (problem) return json({ ok: false, error: problem }, 400, cors);

    const meta = {
      country: request.headers.get('CF-IPCountry') || '—',
      lang: clean(data.lang, 8) || '—',
      page: clean(data.page, 200) || '—'
    };

    try {
      await sendTelegram(env, { name, email, phone, message, meta });
    } catch (error) {
      return json({ ok: false, error: 'Не удалось отправить. Попробуйте позже.' }, 502, cors);
    }

    // Копия на почту — только если ключ задан. Падение письма не должно
    // ломать заявку: в Telegram она уже ушла.
    if (env.RESEND_API_KEY && env.MAIL_TO) {
      try {
        await sendEmail(env, { name, email, phone, message, meta });
      } catch (error) {
        // Telegram уже доставил, заявка не потеряна. Но причину записываем:
        // без неё молчаливо сломавшаяся почта осталась бы незамеченной.
        console.error('Письмо не ушло:', error.message);
      }
    }

    return json({ ok: true }, 200, cors);
  }
};

/* ---------------------------------------------------------------- helpers */

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
  });
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function validate(name, email, phone, message) {
  if (name.length < 2) return 'Укажите имя';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Проверьте адрес почты';

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Проверьте номер телефона';

  if (message.length < 10) return 'Опишите задачу подробнее';
  return null;
}

/** Ссылка, по которой номер из заявки открывается прямо в WhatsApp. */
function whatsappHref(phone) {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  return `https://wa.me/${digits}`;
}

// Telegram ломается на «<», «&» в HTML-режиме, поэтому экранируем.
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegram(env, { name, email, phone, message, meta }) {
  const text = [
    '🔔 <b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    // Телефон ссылкой — нажатие сразу открывает звонок или WhatsApp.
    `<b>Телефон:</b> <a href="tel:${escapeHtml(phone.replace(/\s/g, ''))}">${escapeHtml(phone)}</a>` +
      ` · <a href="${whatsappHref(phone)}">WhatsApp</a>`,
    `<b>Почта:</b> ${escapeHtml(email)}`,
    '',
    '<b>Задача:</b>',
    escapeHtml(message),
    '',
    `<i>${escapeHtml(meta.country)} · ${escapeHtml(meta.lang)} · ${escapeHtml(meta.page)}</i>`
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text
    })
  });

  if (!response.ok) {
    throw new Error(`Telegram ответил ${response.status}`);
  }
}

async function sendEmail(env, { name, email, phone, message, meta }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Заявки с сайта <onboarding@resend.dev>',
      to: [env.MAIL_TO],
      reply_to: email,
      subject: `Заявка с сайта — ${name}`,
      text: [
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Почта: ${email}`,
        '',
        'Задача:',
        message,
        '',
        `${meta.country} · ${meta.lang} · ${meta.page}`
      ].join('\n')
    })
  });

  if (!response.ok) {
    throw new Error(`Resend ответил ${response.status}: ${await response.text()}`);
  }
}

# MAGOMEDOV.DEV — портфолио веб-разработчика

Одностраничный сайт-портфолио: тёмная премиальная подача, три реальных проекта,
кейсы и форма связи. Без фреймворков и сборщиков — чистые HTML, CSS и JavaScript.

**Языки интерфейса:** русский (по умолчанию) и английский — переключатель `RU / EN`
в шапке. Выбор запоминается в `localStorage`.

---

## Структура

```
/
├── index.html          — вся разметка, включая три кейса в <dialog>
├── css/
│   └── style.css       — токены дизайна + все секции
├── js/
│   ├── i18n.js         — английский словарь и переключатель языка
│   └── script.js       — поведение (меню, кейсы, форма, анимации)
├── fonts/              — Inter (woff2, подмножества latin + cyrillic)
├── images/             — скриншоты проектов, favicon, OG-изображение
├── worker/             — Cloudflare Worker, принимающий заявки с формы
├── robots.txt
├── sitemap.xml
└── README.md
```

## Запуск

Сайт статический — достаточно открыть `index.html` в браузере.

Для проверки «как на хостинге» можно поднять локальный сервер:

```bash
npx http-server -p 8080 -c-1
# затем открыть http://127.0.0.1:8080/
```

## Публикация

Подойдёт любой статический хостинг: GitHub Pages, Netlify, Vercel, обычный хостинг по FTP.
Для GitHub Pages достаточно загрузить содержимое папки в репозиторий и включить Pages
в настройках репозитория.

---

## Контакты на сайте

| Канал | Ссылка | Где на сайте |
|---|---|---|
| Почта | `magomedovmg71@gmail.com` | шапка, контакты, подвал, форма |
| Telegram | `https://t.me/+79226765715` | шапка, контакты, подвал |
| WhatsApp | `https://wa.me/79226765715` | шапка, контакты, подвал |

Телефон продублирован в Schema.org (`Person.telephone`).

Telegram открывается по номеру. Если появится короткий ник (`@nickname`) — заменить
ссылку на `https://t.me/nickname`, так солиднее выглядит в адресной строке.

## Где опубликовано

Репозиторий `magomedovmg71-lgtm/magomedovmg71-lgtm.github.io`, ветка `main`.
Имя репозитория совпадает с именем пользователя, поэтому GitHub отдаёт сайт
по короткому адресу **https://magomedovmg71-lgtm.github.io/** — без подпапки.

### При переезде на свой домен

1. `index.html` — заменить адрес в `canonical`, `og:url`, `og:image`, `twitter:image`
   и трёх `@id` в JSON-LD
2. `sitemap.xml` и `robots.txt` — заменить адрес
3. `worker/index.js` — добавить домен в `ALLOWED_ORIGINS`, затем `npx wrangler deploy`

Найти все места разом:

```bash
grep -rn "magomedovmg71-lgtm.github.io/\"" index.html sitemap.xml robots.txt
```

**Про Atlas Architects.** Раньше проект жил на Netlify, но та ссылка была приватной
и просила войти в аккаунт. Сейчас сайт опубликован на GitHub Pages из ветки `master`
репозитория `atlas-architects` и открывается по адресу
`https://magomedovmg71-lgtm.github.io/atlas-architects/` — именно он стоит в портфолио.

---

## Проекты на сайте

| # | Проект | Ссылка |
|---|---|---|
| 01 | VELAR DETAIL — детейлинг-студия | https://magomedovmg71-lgtm.github.io/velar-detail/ |
| 02 | SHAFRAN — ресторан | https://magomedovmg71-lgtm.github.io/shafran/ |
| 03 | ATLAS ARCHITECTS — архитектурное бюро | https://magomedovmg71-lgtm.github.io/atlas-architects/ · [код](https://github.com/magomedovmg71-lgtm/atlas-architects) |

Превью проектов — реальные скриншоты этих сайтов, снятые в двойном разрешении
(десктоп 2880×1800, мобильный 1170×2532). Каждый сохранён в WebP в трёх размерах —
`*-800w.webp`, обычный (1440px) и `*-2880w.webp` — и подключён через `srcset` + `sizes`,
поэтому браузер берёт подходящий файл и картинка остаётся резкой на Retina
и на широких мониторах, где карточка растягивается до 1560px.

## Форма обратной связи

Заявки приходят в Telegram-бот **@magadev_leads_bot** за секунду. В заявке — имя,
телефон, почта и текст. Телефон приходит ссылкой: одно нажатие — звонок или WhatsApp.

```
Форма на сайте  →  Cloudflare Worker  →  Telegram
                    (токен бота здесь)
```

Сайт статический, поэтому напрямую в Telegram он писать не может: токен бота попал бы
в открытый JavaScript. Между ними стоит Worker — он хранит токен у себя, а в коде сайта
лежит только его адрес (`ENDPOINT` в `js/script.js`).

### Что защищает форму

| Заслон | Что делает |
|---|---|
| Проверка Origin | принимает запросы только с адресов из `ALLOWED_ORIGINS` |
| Скрытое поле-ловушка | спам-боты заполняют его и молча отсеиваются |
| Проверка полей | имя, формат почты, номер телефона (10–15 цифр), длина сообщения |
| Обрезка длины | имя 100 · почта 200 · телефон 40 · сообщение 4000 символов |

Если отправка не удалась, посетитель видит рабочие запасные ссылки — WhatsApp
и почту с уже подставленными данными.

### Worker

Код — в папке `worker/`. Секретов в нём нет, их хранит Cloudflare.

```bash
cd worker
npx wrangler deploy                     # опубликовать изменения
npx wrangler secret put TELEGRAM_TOKEN  # заменить токен бота
npx wrangler tail                       # смотреть логи вживую
```

Секреты: `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID`. Необязательные `RESEND_API_KEY` и `MAIL_TO` —
если их задать, заявка продублируется на почту.

**При переезде на свой домен** добавьте его в `ALLOWED_ORIGINS` в `worker/index.js`
и заново выполните `npx wrangler deploy`, иначе форма начнёт отвечать «Запрос с чужого адреса».

## SEO

`title`, `description`, `canonical`, Open Graph, Twitter Card, `robots` с
`max-image-preview:large`, Schema.org (`WebSite`, `Person` с услугой и телефоном,
`ItemList` из трёх проектов). При переключении языка меняются `lang`, `title`
и `description`.

`robots.txt` лежит в корне домена, поэтому поисковики его читают и находят
`sitemap.xml` сами. Так работает только у репозитория с именем
`magomedovmg71-lgtm.github.io`: сайт в подпапке (`/что-то/`) робот бы не увидел,
потому что robots.txt ищут строго по адресу `домен/robots.txt`.

## Что реализовано

- Адаптив от 320px до 1440px+, без горизонтальной прокрутки
- Sticky-шапка, меняющая фон при прокрутке; мобильное меню-drawer
- Кейсы в нативном `<dialog>`: фокус-ловушка, Esc, клик по фону, блокировка прокрутки
- Анимации появления на `IntersectionObserver`, полностью отключаются при `prefers-reduced-motion`
- Доступность: семантическая разметка, состояния фокуса, `aria`-атрибуты, контраст
- SEO: `title`, `description`, `canonical`, Open Graph, Twitter Card, Schema.org (`WebSite`, `Person`, `ItemList`)
- Производительность: локальные шрифты (67 КБ), WebP c `srcset` в трёх размерах, `loading="lazy"`, ноль внешних запросов

## Технологии

HTML5 · CSS3 (Grid, Flexbox, custom properties) · JavaScript (ES5-совместимый, без зависимостей)

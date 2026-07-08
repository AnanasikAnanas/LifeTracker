# Трекер Жизни

Frontend-прототип Telegram Mini App на React + TypeScript + Vite.

## Локальный запуск

На этой машине обычная команда `npm` может быть сломана из-за глобального пути, поэтому рабочий вариант:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' install
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

После починки npm можно использовать стандартно:

```powershell
npm install
npm run dev
```

## Сборка

```powershell
npm run build
```

Готовые статические файлы появятся в `dist`.

## Как открыть прямо из Telegram

1. Соберите проект: `npm run build`.
2. Задеплойте папку `dist` на HTTPS-хостинг. Подойдут Vercel, Netlify, Cloudflare Pages, GitHub Pages или свой сервер с SSL.
3. Откройте `@BotFather`.
4. Выберите бота: `/mybots` -> нужный бот.
5. Откройте `Bot Settings` -> `Configure Mini App` -> `Enable Mini App`.
6. Укажите HTTPS URL деплоя, например `https://your-domain.com`.
7. Чтобы приложение запускалось из профиля бота, настройте Main Mini App в BotFather.
8. Чтобы приложение запускалось из меню чата с ботом, настройте Menu Button и укажите тот же URL.

## Автонастройка кнопки меню бота

После деплоя можно прописать кнопку меню через Bot API:

```powershell
$env:BOT_TOKEN='123456789:replace_with_your_bot_token'
$env:MINI_APP_URL='https://your-domain.com'
$env:MENU_BUTTON_TEXT='Трекер Жизни'
npm run telegram:setup
```

Скрипт вызывает `setChatMenuButton` и добавляет команду `/start`. Main Mini App всё равно лучше включить в BotFather: там Telegram показывает кнопку запуска в профиле бота и позволяет загрузить промо-материалы.

## Что уже подключено для Telegram

- `telegram-web-app.js` подключен в `index.html`.
- Приложение вызывает `Telegram.WebApp.ready()` и `expand()`.
- Используются цвета темы Telegram, viewport height и safe area.
- Работает нативная кнопка BackButton Telegram.
- Имя пользователя берется из `initDataUnsafe.user`.
- Данные сохраняются в `Telegram.WebApp.CloudStorage`, если Mini App открыт внутри Telegram.
- В обычном браузере используется fallback на `localStorage`.
- Есть экран `Журнал` для идей, заметок и целей.
- Есть удаление записей, настройка дневной цели калорий, экспорт JSON и сброс данных.
- Есть конфиги для Vercel и Netlify.

## Следующий production-шаг

Для реального аккаунта и синхронизации между устройствами лучше добавить backend, который валидирует `initData` Telegram и хранит данные пользователя в базе. Текущая версия уже годится как frontend Mini App без backend, но доверять данным пользователя на клиенте нельзя.

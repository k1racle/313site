const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(CONTENT_FILE) && fs.existsSync(path.join(ROOT, 'content.json'))) {
  fs.copyFileSync(path.join(ROOT, 'content.json'), CONTENT_FILE);
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '313';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const MAX_BODY_SIZE = 80 * 1024 * 1024;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
};

function resolveFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  if (pathname === '/' || pathname === '/admin') return path.join(ROOT, 'index.html');

  const candidates = [
    path.join(ROOT, pathname.slice(1)),
    path.join(ROOT, 'public', pathname.slice(1)),
    path.join(ROOT, 'fonts', pathname.slice(1).replace(/^fonts\//, '')),
  ];

  if (pathname.startsWith('/media/uploads/')) {
    candidates.unshift(path.join(UPLOAD_DIR, pathname.slice('/media/uploads/'.length)));
  }

  for (const filePath of candidates) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  }

  return path.extname(pathname) ? null : path.join(ROOT, 'index.html');
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        reject(new Error('Слишком большой JSON'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function isAdmin(req) {
  return req.headers['x-admin-password'] === ADMIN_PASSWORD;
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readBookings() {
  return readJsonFile(BOOKINGS_FILE, []);
}

function publicBooking(booking) {
  return {
    id: booking.id,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    name: booking.name,
    phone: booking.phone,
    messenger: booking.messenger,
    email: booking.email,
    comment: booking.comment,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

function bookingMessage(booking) {
  return [
    'Новая заявка СТУДИЯ 313',
    `Услуга: ${booking.service}`,
    `Дата: ${booking.date}`,
    `Время: ${booking.time}`,
    `Имя: ${booking.name}`,
    `Телефон: ${booking.phone}`,
    booking.messenger ? `Мессенджер: ${booking.messenger}` : '',
    booking.email ? `Email: ${booking.email}` : '',
    booking.comment ? `Комментарий: ${booking.comment}` : '',
  ].filter(Boolean).join('\n');
}

async function sendTelegram(chatId, text) {
  if (!TELEGRAM_BOT_TOKEN || !chatId || typeof fetch !== 'function') return false;
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  return response.ok;
}

function requireAdmin(req, res) {
  if (isAdmin(req)) return false;
  sendText(res, 401, 'Неверный пароль администратора');
  return true;
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    if (requireAdmin(req, res)) return true;
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (pathname === '/api/content' && req.method === 'GET') {
    if (!fs.existsSync(CONTENT_FILE)) {
      sendJson(res, 200, {});
      return true;
    }

    try {
      sendJson(res, 200, JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')));
    } catch (error) {
      sendText(res, 500, `Не удалось прочитать content.json: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/content' && req.method === 'POST') {
    if (requireAdmin(req, res)) return true;
    try {
      const data = JSON.parse(await readRequestBody(req));
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
      sendJson(res, 200, data);
    } catch (error) {
      sendText(res, 400, `Не удалось сохранить контент: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/content/reset' && req.method === 'POST') {
    if (requireAdmin(req, res)) return true;
    if (fs.existsSync(CONTENT_FILE)) fs.unlinkSync(CONTENT_FILE);
    sendJson(res, 200, {});
    return true;
  }

  if (pathname === '/api/bookings' && req.method === 'GET') {
    if (requireAdmin(req, res)) return true;
    try {
      sendJson(res, 200, readBookings());
    } catch (error) {
      sendText(res, 500, `Не удалось прочитать бронирования: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/bookings/public' && req.method === 'GET') {
    try {
      const busy = readBookings()
        .filter((item) => item.status !== 'cancelled')
        .map((item) => ({ date: item.date, time: item.time }));
      sendJson(res, 200, busy);
    } catch (error) {
      sendText(res, 500, `Не удалось прочитать занятые слоты: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/booking/submit' && req.method === 'POST') {
    try {
      const data = JSON.parse(await readRequestBody(req));
      const bookings = readBookings();
      const date = String(data.date || '').trim();
      const time = String(data.time || '').trim();
      if (!date || !time || !data.name || !data.phone) throw new Error('Заполните дату, время, имя и телефон');
      if (bookings.some((item) => item.date === date && item.time === time && item.status !== 'cancelled')) throw new Error('Это время уже занято');
      const booking = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        service: String(data.service || '').trim(),
        date,
        time,
        name: String(data.name || '').trim(),
        phone: String(data.phone || '').trim(),
        messenger: String(data.messenger || '').trim(),
        email: String(data.email || '').trim(),
        telegramChatId: String(data.telegramChatId || '').trim(),
        comment: String(data.comment || '').trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      bookings.push(booking);
      writeJsonFile(BOOKINGS_FILE, bookings);
      const message = bookingMessage(booking);
      const content = readJsonFile(CONTENT_FILE, {});
      const adminChatId = TELEGRAM_ADMIN_CHAT_ID || content.booking?.telegram?.adminChatId || '';
      await Promise.allSettled([
        sendTelegram(adminChatId, message),
        sendTelegram(booking.telegramChatId, `Ваша заявка принята.\n${message}`),
      ]);
      sendJson(res, 200, publicBooking(booking));
    } catch (error) {
      sendText(res, 400, `Не удалось создать заявку: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/bookings/status' && req.method === 'POST') {
    if (requireAdmin(req, res)) return true;
    try {
      const data = JSON.parse(await readRequestBody(req));
      const bookings = readBookings();
      const booking = bookings.find((item) => item.id === data.id);
      if (!booking) throw new Error('Заявка не найдена');
      booking.status = String(data.status || booking.status || 'new');
      booking.updatedAt = new Date().toISOString();
      writeJsonFile(BOOKINGS_FILE, bookings);
      sendJson(res, 200, booking);
    } catch (error) {
      sendText(res, 400, `Не удалось обновить заявку: ${error.message}`);
    }
    return true;
  }

  if (pathname === '/api/upload' && req.method === 'POST') {
    if (requireAdmin(req, res)) return true;
    try {
      const { name, data } = JSON.parse(await readRequestBody(req));
      const match = String(data || '').match(/^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) throw new Error('Ожидался файл в формате data URL');
      const ext = path.extname(name || '').toLowerCase() || `.${match[1].split('/')[1]}`;
      const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext.replace(/[^.a-z0-9]/g, '')}`;
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, safeName), Buffer.from(match[2], 'base64'));
      sendJson(res, 200, { url: `/media/uploads/${safeName}`, type: match[1] });
    } catch (error) {
      sendText(res, 400, `Не удалось загрузить файл: ${error.message}`);
    }
    return true;
  }

  if (pathname.startsWith('/api/')) {
    sendText(res, 404, 'API endpoint not found');
    return true;
  }

  return false;
}

http
  .createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
    if (await handleApi(req, res, pathname)) return;

    const filePath = resolveFile(req.url || '/');
    if (!filePath) {
      sendText(res, 404, 'Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => console.log(`Studio 313 is running at http://localhost:${PORT}`));

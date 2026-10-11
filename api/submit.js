// Receives a completed survey, validates it, and appends it to the Google Sheet via the Apps Script web app.
// Env vars (Vercel → Project → Settings → Environment Variables):
//   GOOGLE_SCRIPT_URL  – the Apps Script web app URL (ends in /exec)
//   SHEET_SECRET       – same value as SECRET in apps-script/Code.gs
const { QUESTIONS } = require('../questions.js');

const PHONE_RE = /^\+91[6-9]\d{9}$/;
const FIELDS = Object.values(QUESTIONS);

// Option ids → labels, keeping only ids that exist for that question.
function labels(q, ids) {
  if (!Array.isArray(ids)) return '';
  const map = new Map(q.options);
  return ids.filter(id => map.has(id)).map(id => map.get(id)).join('; ');
}

function clean(s, max) {
  return typeof s === 'string' ? s.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') return Promise.resolve(JSON.parse(req.body));
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 20000) reject(new Error('too large')); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) return res.status(500).json({ ok: false, error: 'GOOGLE_SCRIPT_URL is not configured' });

  let b;
  try { b = await readBody(req); } catch (e) { return res.status(400).json({ ok: false, error: 'Invalid JSON' }); }

  const responseId = clean(b.responseId, 64);
  const branch = b.preferredExperience === 'home' || b.preferredExperience === 'salon' ? b.preferredExperience : null;
  if (!responseId || !branch) return res.status(400).json({ ok: false, error: 'Missing responseId or preferredExperience' });

  const row = {
    responseId,
    firstName: clean(b.firstName, 40),
    phone: typeof b.phone === 'string' && PHONE_RE.test(b.phone) ? b.phone : '',
    marketingConsent: b.marketingConsent === true ? 'Yes' : 'No',
    preferredExperience: branch === 'home' ? 'At home' : 'Salon',
    completedAt: clean(b.completedAt, 40),
    offerCode: clean(b.offerCode, 32),
    utmSource: clean(b.utmSource, 100),
    utmMedium: clean(b.utmMedium, 100),
    utmCampaign: clean(b.utmCampaign, 100),
    userAgent: clean(req.headers['user-agent'], 300)
  };
  FIELDS.forEach(q => { row[q.field] = labels(q, b[q.field]); });

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: process.env.SHEET_SECRET || '', row }),
      redirect: 'follow'
    });
    const text = await r.text();
    let out;
    try { out = JSON.parse(text); } catch (e) { out = null; }
    if (!r.ok || !out || !out.ok) {
      console.error('Sheet write failed', r.status, text.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'Could not save response' });
    }
    return res.status(200).json({ ok: true, duplicate: !!out.duplicate });
  } catch (e) {
    console.error('Sheet request error', e);
    return res.status(502).json({ ok: false, error: 'Could not reach sheet' });
  }
};

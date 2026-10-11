/**
 * nector survey → Google Sheet
 *
 * Paste this into the sheet's Extensions ▸ Apps Script, set SECRET, then
 * Deploy ▸ New deployment ▸ Web app (Execute as: Me, Who has access: Anyone).
 * Put the /exec URL in Vercel as GOOGLE_SCRIPT_URL and SECRET as SHEET_SECRET.
 */
const SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
const SHEET_NAME = 'Responses';
const TIMEZONE = 'Asia/Kolkata';

// [header, key in the row sent by /api/submit]
const COLUMNS = [
  ['Submitted at (IST)', null],
  ['Response ID', 'responseId'],
  ['First name', 'firstName'],
  ['Phone', 'phone'],
  ['Marketing consent', 'marketingConsent'],
  ['Preferred experience', 'preferredExperience'],
  ['Home: services used', 'homeServicesUsed'],
  ['Home: what could be better', 'homeServicePainPoint'],
  ['Home: extra service wanted', 'desiredAdditionalService'],
  ['Salon: visit frequency', 'salonVisitFrequency'],
  ['Salon: why the salon', 'salonPreferenceReason'],
  ['Salon: what would bring it home', 'homeConversionFactor'],
  ['Salon: open to trying at home', 'servicesOpenToTryingAtHome'],
  ['Offer code', 'offerCode'],
  ['Completed at (client, UTC)', 'completedAt'],
  ['UTM source', 'utmSource'],
  ['UTM medium', 'utmMedium'],
  ['UTM campaign', 'utmCampaign'],
  ['User agent', 'userAgent']
];

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad json' }); }
  if (!body || body.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });
  const row = body.row || {};
  if (!row.responseId) return json({ ok: false, error: 'missing responseId' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet();
    // Ignore retries of a response that's already in the sheet.
    const idCol = 2;
    if (sheet.getLastRow() > 1) {
      const hit = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(String(row.responseId)).matchEntireCell(true).findNext();
      if (hit) return json({ ok: true, duplicate: true });
    }
    const now = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow(COLUMNS.map(([, key]) => key ? safe(row[key]) : now));
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json({ ok: true, service: 'nector-survey' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(c => c[0]));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('D:D').setNumberFormat('@'); // keep +91… as text
  }
  return sheet;
}

// Store as text; stop values like "=…" or "+91…" being read as formulas or numbers.
function safe(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

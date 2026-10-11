# nector survey

The nector self-care survey from Claude Design, built as a plain static page. Every completed response is added to a Google Sheet as one row.

```
Browser (index.html)  ──POST /api/submit──▶  Vercel function (api/submit.js)
                                                │ validates, maps option ids → labels
                                                ▼
                                   Google Apps Script web app (apps-script/Code.gs)
                                                │ checks secret, skips duplicate IDs
                                                ▼
                                   Google Sheet → "Responses" tab
```

A response is sent when the person reaches the offer screen. If it fails, the browser retries, and keeps a copy on the device to send on the next visit. Each response has an ID, so a retry never creates a duplicate row.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole survey: screens, styles, logic |
| `questions.js` | Questions, options and the offer code. Edit copy here; the page and the API both read it |
| `api/submit.js` | Vercel serverless function that validates the response and forwards it to the sheet |
| `apps-script/Code.gs` | Paste into the Google Sheet's Apps Script. Writes the rows |

## Setup

### 1. Google Sheet (about 5 minutes)

1. Create a Google Sheet, then open **Extensions ▸ Apps Script**.
2. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
3. Change `SECRET` to a long random string, then save.
4. Click **Deploy ▸ New deployment**. Choose the type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy** and authorise when asked.
5. Copy the **Web app URL** (it ends in `/exec`). Opening it in a browser should show `{"ok":true,"service":"nector-survey"}`.

The `Responses` tab and its header row are created automatically when the first response arrives.

> If you change `Code.gs` later, use **Deploy ▸ Manage deployments ▸ Edit ▸ Version: New version**. That keeps the same URL.

### 2. Vercel

1. Import this GitHub repo in Vercel. Use the framework preset **Other**, with no build command and no output directory.
2. Under **Settings ▸ Environment Variables**, add:
   - `GOOGLE_SCRIPT_URL`: the `/exec` URL from step 1
   - `SHEET_SECRET`: the same value as `SECRET` in `Code.gs`
3. Deploy. If you added the variables after the first deploy, redeploy.

### 3. Test

Open the site, go through the survey, and check that a row appears in the sheet within a few seconds. If no row appears, check **Vercel ▸ Project ▸ Logs** for `Sheet write failed`.

## Customising

- **Offer code, benefit or terms:** `OFFER` in `questions.js`.
- **Questions and options:** `QUESTIONS` in `questions.js`. If you add or rename a field, also add a column for it in `COLUMNS` in `Code.gs`.
- **"Discover your nector experience" button:** set `CTA_URL` near the top of the script in `index.html`. If it's empty, the button shows the "Coming soon" screen.
- **Campaign tracking:** links with `?utm_source=…&utm_medium=…&utm_campaign=…` are saved to the sheet.
- **Images:** the five Pexels URLs in `IMG` in `index.html`.

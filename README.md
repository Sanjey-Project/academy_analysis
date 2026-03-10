# Academy Analysis Frontend

## Run Locally

This frontend is a static HTML/CSS/JavaScript application inside the `frontend/` folder.

Do not open the HTML files directly with `file://`.
Use a local HTTP server so ES modules and browser requests work correctly.

### Option 1: Python

If Python is installed:

```powershell
cd "C:\Users\Sanjey kannaa\Desktop\PROJECT LEARNING\academy_analysis\frontend"
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

### Option 2: VS Code Live Server

If you use VS Code:

1. Open the `academy_analysis` folder.
2. Open the `frontend/` folder or `index.html`.
3. Start Live Server.
4. Open the generated local URL in the browser.

## Main Pages

After the server starts, use these routes:

- `http://localhost:5500/index.html`
- `http://localhost:5500/login.html`
- `http://localhost:5500/dashboard.html`
- `http://localhost:5500/students.html`
- `http://localhost:5500/analytics.html`
- `http://localhost:5500/subjects.html`
- `http://localhost:5500/leaderboard.html`
- `http://localhost:5500/profile.html`
- `http://localhost:5500/upload.html`
- `http://localhost:5500/reports.html`

## What To Test

### Basic UI

1. Open `login.html`.
2. Submit the form.
3. Confirm redirect to `dashboard.html`.
4. Move through all sidebar pages.
5. Toggle dark/light theme.
6. Resize to mobile width and confirm layout remains usable.

### Student Analytics

1. Open `students.html`.
2. Search by student name or ID.
3. Change the grade filter.
4. Confirm the table updates correctly.

### Charts

1. Open `dashboard.html`, `analytics.html`, `subjects.html`, and `profile.html`.
2. Confirm all charts render.
3. Toggle theme and confirm the page still works.

### Upload And Reports

1. Open `upload.html`.
2. Submit sample marks data.
3. Open `reports.html`.
4. Click `Export CSV`.

Note:
The backend endpoints are placeholders. If the backend is not running, the UI should still stay stable and show warning messages.

## Frontend Error Reporting

Frontend errors are configured to post to the Google Chat webhook from the browser.

Covered cases:

- Uncaught JavaScript errors
- Unhandled promise rejections
- API request failures
- API non-2xx responses
- Handled failures in upload and report actions

### Quick Verification

Use browser DevTools on any page and run:

```js
throw new Error("Manual frontend error test");
```

Or:

```js
Promise.reject(new Error("Manual rejection test"));
```

Then confirm a message appears in the configured Google Chat space.

## Important Limitation

The Google Chat webhook URL is currently embedded in frontend code.
That means it is visible to anyone who can inspect the client bundle.

For production use, move webhook posting to a backend endpoint and let the frontend call the backend instead.

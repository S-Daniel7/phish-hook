# Visual Quiz (backend JS / MongoDB Atlas)

This page is the frontend for the **Express backend** (`server.js`) that uses the `scam_training` and `attempts` collections in MongoDB Atlas (database: `appdb`).

## How to run

1. **Start the Express backend** (in the folder that has `server.js` and `db.js`):
   ```bash
   node server.js
   ```
   It listens on **port 3000** by default.

2. **Start the Next.js app** on a different port so they don’t conflict:
   ```bash
   npm run dev -- -p 3001
   ```

3. **Set backend URL** (only if Express is not on 3000). In fish-webapp `.env`:
   ```env
   EXPRESS_BACKEND_URL=http://localhost:3000
   ```

4. Open **http://localhost:3000/visual-quiz** (or 3000 if you run Next there).

## Quiz document shape (MongoDB `scam_training`)

Each quiz in the `scam_training` collection should have:

| Field     | Type     | Required | Description |
|----------|----------|----------|-------------|
| `level`  | number   | yes      | Quiz level (1, 2, 3, …). |
| `flags`  | string[] | yes      | Correct “red flag” answers. |
| `options`| string[] | no       | All choices shown to the user (flags + wrong answers). If missing, only `flags` are shown. |
| `title`  | string   | no       | Quiz title. |
| `scenario` | string | no     | Short scenario or prompt. |
| `image`  | string   | no       | Image URL. |

Example:

```json
{
  "level": 1,
  "title": "Email phishing",
  "scenario": "Which of these are red flags in this email?",
  "flags": ["Sense of urgency (due today / late fees)", "No identifying details (your name, company, service)"],
  "options": [
    "Sense of urgency (due today / late fees)",
    "No identifying details (your name, company, service)",
    "Polite greeting",
    "Company logo"
  ]
}
```

## API (via Next.js proxy)

- **GET** `/api/visual-quiz/quiz?level=1` → proxied to Express `GET /quiz?level=1`
- **POST** `/api/visual-quiz/attempt` → proxied to Express `POST /attempt` (body: `userId`, `quizId`, `selectedFlags`)

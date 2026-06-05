# Atlas

Your complete financial map.

Atlas is a starter skeleton for a personal finance web app focused on expenses, accounts, loans, debts, budgets, savings goals and insights.

## Stack

- Vite
- Vanilla JavaScript modules
- Firebase Auth
- Firebase Firestore
- Firebase Analytics
- Plain CSS

## Folder structure

```txt
atlas-starter/
├── index.html
├── package.json
├── vite.config.js
├── public/
├── scripts/
└── src/
    ├── assets/
    ├── components/
    ├── config/
    │   └── firebase.js
    ├── features/
    │   ├── accounts/
    │   ├── auth/
    │   ├── budgets/
    │   ├── dashboard/
    │   ├── goals/
    │   ├── loans/
    │   ├── settings/
    │   └── transactions/
    ├── lib/
    ├── routes/
    ├── services/
    ├── styles/
    └── utils/
```

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Firebase

Your Firebase config is already wired in `src/config/firebase.js`.

For cleaner production usage, create a `.env` file using `.env.example` and move the values there.

## Suggested next Codex prompt

```txt
Continue building Atlas from this skeleton. Keep the project modular. First implement Firebase Google sign in, protected routes, and Firestore CRUD for transactions. Do not rewrite the whole app. Add only necessary files and update existing modules cleanly.
```

## Git push

```bash
git init
git add .
git commit -m "Initial Atlas starter"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

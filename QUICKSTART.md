# FinanceTracker - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies (2 minutes)
```bash
cd pep
npm install
```

### 2. Create Firebase Project (1 minute)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project → name: `finance-tracker`
3. Click web app icon (</>) → register app
4. Copy your configuration

### 3. Add Firebase Config (1 minute)
Create `.env.local` in project root:
```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 4. Enable Firestore & Auth (1 minute)
In Firebase Console:
- Firestore Database → Create Database → Test Mode
- Authentication → Enable Email/Password

---

## ▶️ Running the App

```bash
npm run dev
```

Open: **http://localhost:5173**

---

## ✅ First Steps

### 1. Create Account
- **Sign Up** → Enter email, password, name
- Example:
  - Email: `user@example.com`
  - Password: `password123`
  - Name: `John Doe`

### 2. Add Your First Transaction
- Click **"Add Transaction"** button
- **Type**: Income
- **Amount**: 1000
- **Category**: Salary
- **Date**: Today
- **Description**: Weekly paycheck
- Click **"Add Transaction"**

### 3. View Dashboard
- Check Summary Cards (Balance, Income, Expenses)
- See transaction in list
- Click expand arrow for details

### 4. Explore Features
- **Search**: Filter by description/category
- **Filter**: By transaction type
- **Edit**: Click pencil icon
- **Delete**: Click trash icon
- **Dark Mode**: Click moon icon in navbar

---

## 📁 File Structure Overview

```
src/
├── config/firebase.js          ← Firebase setup
├── services/
│   ├── authService.js          ← Login/logout logic
│   └── transactionService.js   ← Add/edit/delete
├── components/                 ← UI pieces
│   ├── Navbar.jsx
│   ├── SummaryCards.jsx
│   └── TransactionList.jsx
├── pages/                      ← Full pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── Dashboard.jsx
├── hooks/useTransactions.js    ← Data management
├── context/ThemeContext.jsx    ← Dark mode
└── styles/global.css           ← Global styling
```

---

## 💡 Quick Tips

### Environment Variables
- Store in `.env.local` (never commit)
- Reload dev server after changes
- Use `import.meta.env.VITE_*` to access

### Firestore Database
- Transactions stored in `transactions` collection
- Each transaction has `userId` field
- Auto-sorted by `date` DESC

### Adding Categories
Find in `TransactionForm.jsx`:
```javascript
const CATEGORIES = {
  income: ['Salary', 'Freelance', ...],
  expense: ['Food & Dining', ...]
};
```

### Customizing Colors
Edit `src/styles/global.css`:
```css
:root {
  --accent-primary: #6366f1;  ← Change this
  --accent-secondary: #ec4899;
}
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Vite auto-tries port 5174 |
| Firebase not connecting | Check `.env.local` values |
| Can't sign up | Check email isn't already used |
| Dark mode not working | Clear localStorage, refresh |
| Charts not showing | Need at least 1 transaction |

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Installation
npm install            # Install dependencies
npm install <package>  # Add new package

# Linting
npm run lint          # Check code quality
```

---

## 📚 Learn More

- **React**: https://react.dev
- **Firebase**: https://firebase.google.com/docs
- **Vite**: https://vitejs.dev
- **Recharts**: https://recharts.org

---

## 🎯 Next Steps

1. ✅ Fork the project
2. ✅ Deploy to Vercel/Netlify
3. ✅ Add more features
4. ✅ Share with friends!

---

**Ready? Let's track some finances! 💰**

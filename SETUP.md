# FinanceTracker Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- A **Firebase account** (free tier is fine)
- A **code editor** (VS Code recommended)

---

## 🚀 Step 1: Initial Project Setup

### Clone or Download the Project
```bash
cd pep
```

### Install Node Dependencies
```bash
npm install
```

This will install all required packages including:
- React & React Router
- Firebase SDK
- Recharts (for charts)
- Lucide React (for icons)
- Vite (build tool)

**Expected time:** 2-5 minutes (depends on internet speed)

---

## 🔥 Step 2: Firebase Console Setup

### 2.1 Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `finance-tracker` (or your preferred name)
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (optional) and click **"Create project"**
6. Wait for project creation (1-2 minutes)

### 2.2 Get Firebase Configuration
1. In Firebase Console, click the **web icon** (</>) to create a web app
2. App name: `FinanceTracker`
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration code
6. Click **"Continue to console"**

**You'll need these values:**
```
apiKey
authDomain
projectId
storageBucket
messagingSenderId
appId
```

### 2.3 Enable Firestore Database
1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** for development
4. Select your database location
5. Click **"Create"**
6. Wait for database initialization

### 2.4 Configure Firestore Rules
After database creation, go to **"Rules"** tab and replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Click **"Publish"**

### 2.5 Enable Authentication
1. Go to **"Authentication"**
2. Click **"Get Started"**
3. Click **"Email/Password"**
4. Enable **"Email/Password"** toggling
5. Enable **"Email link (passwordless sign-in)"** (optional)
6. Click **"Save"**

---

## 🔐 Step 3: Environment Configuration

### 3.1 Create Firebase Config File
Two options:

**Option A: Using Environment Variables (Recommended)**
1. Create `.env.local` file in project root
2. Add your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Update `src/config/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

**Option B: Direct Configuration**
1. Open `src/config/firebase.js`
2. Replace placeholder values with your Firebase credentials
3. ⚠️ **DO NOT commit** `.env.local` to version control!

### 3.2 Add .env to .gitignore
Ensure `.env.local` is in `.gitignore`:
```
# .gitignore
.env
.env.local
.env.*.local
```

---

## 🏃 Step 4: Run the Application

### Development Mode
```bash
npm run dev
```

**Output:**
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## ✅ Step 5: Verify Setup

### Test the Application
1. **Sign Up Page** - Create a new account
   - Email: `test@example.com`
   - Password: `test123456` (must be 6+ characters)
   - Name: `Test User`

2. **Dashboard** - After login, you should see:
   - Navigation bar with logo
   - Summary cards (Balance, Income, Expenses)
   - Empty transaction list
   - "Add Transaction" button

3. **Add a Transaction**
   - Click **"Add Transaction"**
   - Select type: **Income**
   - Amount: **1000**
   - Category: **Salary**
   - Date: **Today's date**
   - Description: **Monthly salary**
   - Click **"Add Transaction"**

4. **Verify in Firestore**
   - Go to Firebase Console → Firestore Database
   - Check if transaction appears in `transactions` collection

5. **Test Dark Mode**
   - Click moon icon in navbar
   - Verify dark theme applies

### Troubleshooting

**Problem: "Cannot find module 'firebase'"**
- Solution: Run `npm install firebase`

**Problem: "Firebase config is undefined"**
- Solution: Check `src/config/firebase.js` has correct values
- Verify `.env.local` file exists and is being read

**Problem: "Authentication not working"**
- Solution: Ensure Authentication is enabled in Firebase Console
- Check Firestore rules are not too restrictive

**Problem: "Port 5173 already in use"**
- Solution: Vite will automatically try port 5174
- Or manually specify: `npm run dev -- --port 3000`

---

## 📚 Project Structure Reference

```
pep/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── SummaryCards.jsx # Balance cards
│   │   ├── TransactionList.jsx # Transaction table
│   │   ├── TransactionForm.jsx # Add/Edit form
│   │   ├── Charts.jsx       # Analytics charts
│   │   └── *.css            # Component styles
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx    # Login form
│   │   ├── RegisterPage.jsx # Sign up form
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   └── *.css            # Page styles
│   ├── services/            # Firebase operations
│   │   ├── authService.js   # Auth functions
│   │   └── transactionService.js # Firestore functions
│   ├── context/             # React Context
│   │   └── ThemeContext.jsx # Dark/Light mode
│   ├── hooks/               # Custom hooks
│   │   └── useTransactions.js # Transaction logic
│   ├── config/              # Configuration
│   │   └── firebase.js      # Firebase config
│   ├── styles/              # Global styles
│   │   └── global.css       # Global theme
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Index styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── .env.example            # Environment template
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

---

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Easiest)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy (follows interactive prompts)
vercel

# 3. Add environment variables in Vercel dashboard
# Settings → Environment Variables → Add VITE_FIREBASE_* variables
```

### Option 2: Deploy to Firebase Hosting
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize Firebase project
firebase init hosting

# 4. Build and deploy
npm run build
firebase deploy
```

### Option 3: Deploy to Netlify
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click **"New site from Git"**
4. Connect your GitHub account
5. Select repository
6. Build command: `npm run build`
7. Publish directory: `dist`
8. Add environment variables
9. Deploy

---

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` to Git
- ✅ Use Firestore rules to restrict access
- ✅ Enable Email/Password authentication only
- ✅ Enable CORS for your domain only
- ✅ Regularly update dependencies: `npm audit`
- ✅ Use strong passwords (8+ characters)
- ✅ Enable two-factor authentication on Firebase account

---

## 📖 Additional Resources

- **React Documentation**: https://react.dev
- **Firebase Documentation**: https://firebase.google.com/docs
- **Vite Documentation**: https://vitejs.dev
- **Recharts Documentation**: https://recharts.org
- **Lucide Icons**: https://lucide.dev

---

## ❓ FAQ

**Q: Can I use this template for production?**
A: Yes! But ensure you follow security best practices and update Firestore rules accordingly.

**Q: How do I change the color theme?**
A: Edit `src/styles/global.css` and modify CSS custom properties in `:root` section.

**Q: How do I add more transaction categories?**
A: Edit the `CATEGORIES` object in `src/components/TransactionForm.jsx` and `src/components/TransactionList.jsx`.

**Q: Can I export transaction data?**
A: Currently not built-in, but can be added by implementing CSV export functionality.

**Q: How do I backup transaction data?**
A: Use Firebase Console → Firestore Database → Backups section.

---

## 📧 Support

For issues:
1. Check the Troubleshooting section above
2. Review Firebase documentation
3. Check browser console for errors (F12)
4. Review network requests in DevTools

---

**You're all set! Happy tracking! 💰**

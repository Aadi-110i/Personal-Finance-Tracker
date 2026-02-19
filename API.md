# FinanceTracker - API & Services Documentation

## 📚 Table of Contents

1. [Firebase Config](#firebase-config)
2. [Authentication Service](#authentication-service)
3. [Transaction Service](#transaction-service)
4. [Custom Hooks](#custom-hooks)
5. [Context & State](#context--state)
6. [Component Props](#component-props)

---

## Firebase Config

### File: `src/config/firebase.js`

Initializes and exports Firebase services.

```javascript
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Exports
export const auth          // Firebase Authentication instance
export const db            // Firestore Database instance
export default app         // Firebase App instance
```

### Usage

```javascript
import { auth, db } from '@/config/firebase';
```

---

## Authentication Service

### File: `src/services/authService.js`

Handles user authentication with Firebase.

### Functions

#### `registerUser(email, password, displayName)`
Creates a new user account.

**Parameters:**
- `email` (string): User email address
- `password` (string): Password (min 6 chars)
- `displayName` (string): User's display name

**Returns:** Promise<User>

**Example:**
```javascript
import { registerUser } from '@/services/authService';

try {
  const user = await registerUser('john@example.com', 'password123', 'John Doe');
  console.log('User created:', user.email);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

**Error Codes:**
- `auth/email-already-in-use`
- `auth/weak-password`
- `auth/invalid-email`

---

#### `loginUser(email, password)`
Signs in an existing user.

**Parameters:**
- `email` (string): User email
- `password` (string): User password

**Returns:** Promise<UserCredential>

**Example:**
```javascript
import { loginUser } from '@/services/authService';

try {
  const { user } = await loginUser('john@example.com', 'password123');
  console.log('Logged in as:', user.email);
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    console.error('User not found');
  } else if (error.code === 'auth/wrong-password') {
    console.error('Wrong password');
  }
}
```

**Error Codes:**
- `auth/user-not-found`
- `auth/wrong-password`
- `auth/invalid-email`

---

#### `logoutUser()`
Signs out the current user.

**Returns:** Promise<void>

**Example:**
```javascript
import { logoutUser } from '@/services/authService';

await logoutUser();
console.log('User logged out');
```

---

#### `onAuthChange(callback)`
Listens for authentication state changes.

**Parameters:**
- `callback` (function): Called when auth state changes
  - Receives: `user` object or `null`

**Returns:** Unsubscribe function

**Example:**
```javascript
import { onAuthChange } from '@/services/authService';

const unsubscribe = onAuthChange((user) => {
  if (user) {
    console.log('User is logged in:', user.email);
  } else {
    console.log('User is logged out');
  }
});

// Cleanup
unsubscribe();
```

---

## Transaction Service

### File: `src/services/transactionService.js`

Manages transactions in Firestore database.

### Functions

#### `addTransaction(userId, transactionData)`
Creates a new transaction.

**Parameters:**
- `userId` (string): User ID from auth
- `transactionData` (object): Transaction details
  ```javascript
  {
    type: 'income' | 'expense',
    category: 'Salary',
    amount: '1000',
    date: '2024-01-15',
    description: 'Monthly salary',
    notes: 'Optional notes'
  }
  ```

**Returns:** Promise<DocumentReference>

**Example:**
```javascript
import { addTransaction } from '@/services/transactionService';

const docRef = await addTransaction(userId, {
  type: 'income',
  category: 'Salary',
  amount: '5000',
  date: '2024-01-15',
  description: 'Monthly salary',
  notes: ''
});

console.log('Transaction added:', docRef.id);
```

---

#### `getTransactions(userId)`
Fetches all transactions for a user.

**Parameters:**
- `userId` (string): User ID from auth

**Returns:** Promise<Array>

**Example:**
```javascript
import { getTransactions } from '@/services/transactionService';

const transactions = await getTransactions(userId);
console.log('User transactions:', transactions);

// Returns:
// [
//   {
//     id: 'doc-id-1',
//     type: 'income',
//     category: 'Salary',
//     amount: '5000',
//     date: '2024-01-15',
//     description: 'Monthly salary',
//     createdAt: '2024-01-15T10:30:00Z'
//   },
//   ...
// ]
```

**Features:**
- Auto-sorted by date (newest first)
- Returns empty array on error
- Filters by user ID automatically

---

#### `updateTransaction(transactionId, updatedData)`
Updates an existing transaction.

**Parameters:**
- `transactionId` (string): Document ID
- `updatedData` (object): Fields to update
  ```javascript
  {
    amount: '6000',
    category: 'Bonus',
    description: 'Updated description'
  }
  ```

**Returns:** Promise<void>

**Example:**
```javascript
import { updateTransaction } from '@/services/transactionService';

await updateTransaction('doc-id', {
  amount: '6000',
  description: 'Updated salary'
});

console.log('Transaction updated');
```

---

#### `deleteTransaction(transactionId)`
Deletes a transaction.

**Parameters:**
- `transactionId` (string): Document ID to delete

**Returns:** Promise<void>

**Example:**
```javascript
import { deleteTransaction } from '@/services/transactionService';

await deleteTransaction('doc-id');
console.log('Transaction deleted');
```

---

## Custom Hooks

### File: `src/hooks/useTransactions.js`

React hook for managing transactions with automatic sync.

#### `useTransactions(userId)`

**Parameters:**
- `userId` (string|null): User ID from auth

**Returns:** Object
```javascript
{
  transactions: Array,          // Array of transaction objects
  loading: boolean,             // Loading state during fetch
  error: string|null,           // Error message if failed
  createTransaction: Function,  // Add new transaction
  editTransaction: Function,    // Update transaction
  removeTransaction: Function   // Delete transaction
}
```

**Example:**
```javascript
import { useTransactions } from '@/hooks/useTransactions';

const { 
  transactions, 
  loading, 
  error, 
  createTransaction, 
  editTransaction, 
  removeTransaction 
} = useTransactions(user?.uid);

// Access transactions
console.log(transactions); // [{id, type, amount, ...}]

// Check loading state
if (loading) return <p>Loading...</p>;

// Handle errors
if (error) return <p>Error: {error}</p>;

// Create transaction
await createTransaction({
  type: 'expense',
  category: 'Food & Dining',
  amount: '50',
  date: '2024-01-15',
  description: 'Dinner'
});

// Edit transaction
await editTransaction('doc-id', {
  amount: '75',
  category: 'Entertainment'
});

// Delete transaction
await removeTransaction('doc-id');
```

**Features:**
- Auto-fetches on mount
- Real-time synchronization
- Handles errors gracefully
- Updates local state immediately
- Cleans up on unmount

---

## Context & State

### File: `src/context/ThemeContext.jsx`

React Context for theme management.

#### `ThemeProvider`

Wrapper component providing theme to entire app.

**Example:**
```javascript
import { ThemeProvider } from '@/context/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>
```

#### `useTheme()`

Hook to access theme state.

**Returns:** Object
```javascript
{
  isDark: boolean,      // Current theme mode
  toggleTheme: Function // Toggle between light/dark
}
```

**Example:**
```javascript
import { useTheme } from '@/context/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current mode: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

**Features:**
- Persists to localStorage
- Respects system preference
- Global access via context
- 300ms smooth transition

---

## Component Props

### `Navbar`

Navigation bar component.

**Props:**
```javascript
{
  user: {
    email: string,
    displayName: string,
    photoURL?: string,
    uid: string
  },
  onLogout: Function  // Called when logout clicked
}
```

**Example:**
```javascript
<Navbar user={currentUser} onLogout={handleLogout} />
```

---

### `SummaryCards`

Balance/Income/Expense cards.

**Props:**
```javascript
{
  transactions: Array [
    {
      id: string,
      type: 'income' | 'expense',
      amount: string,
      // ... other fields
    },
    // ...
  ]
}
```

**Example:**
```javascript
<SummaryCards transactions={transactionsList} />
```

---

### `TransactionList`

Transaction table with filtering/sorting.

**Props:**
```javascript
{
  transactions: Array,        // Transaction array
  onEdit: Function,          // Called when edit clicked
  onDelete: Function,        // Called when delete clicked
  loading: boolean           // Show loading spinner
}
```

**Example:**
```javascript
<TransactionList 
  transactions={transactions}
  onEdit={(transaction) => console.log(transaction)}
  onDelete={(id) => console.log('Delete:', id)}
  loading={isLoading}
/>
```

---

### `TransactionForm`

Add/Edit transaction form modal.

**Props:**
```javascript
{
  onSubmit: Function,        // Form submission
  onCancel: Function,        // Close form
  initialData?: Object       // Pre-fill for edit
}
```

**Example:**
```javascript
<TransactionForm 
  onSubmit={(data) => createTransaction(data)}
  onCancel={() => closeForm()}
  initialData={editingTransaction}
/>
```

---

### `Charts`

Analytics charts component.

**Props:**
```javascript
{
  transactions: Array  // Full transaction array
}
```

**Example:**
```javascript
<Charts transactions={transactionsList} />
```

---

## Data Structures

### Transaction Object

```javascript
{
  id: "auto-generated-id",
  userId: "user-uid",
  type: "income" | "expense",
  category: "Category Name",
  amount: "1000.00",         // Stored as string
  date: "2024-01-15",        // Format: YYYY-MM-DD
  description: "Description",
  notes: "Optional notes",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### User Object

```javascript
{
  uid: "unique-user-id",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: null,
  metadata: {
    createdAt: "2024-01-01T...",
    lastSignInTime: "2024-01-15T..."
  }
}
```

---

## Error Handling

### Firebase Auth Errors

```javascript
try {
  await loginUser(email, password);
} catch (error) {
  switch (error.code) {
    case 'auth/user-not-found':
      console.error('User not found');
      break;
    case 'auth/wrong-password':
      console.error('Wrong password');
      break;
    case 'auth/email-already-in-use':
      console.error('Email already in use');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

### Firestore Errors

```javascript
try {
  const transactions = await getTransactions(userId);
} catch (error) {
  console.error('Failed to fetch transactions:', error);
  // Gracefully falls back to empty array
}
```

---

## Best Practices

### 1. Always Clean Up Listeners
```javascript
useEffect(() => {
  const unsubscribe = onAuthChange(callback);
  return () => unsubscribe(); // Cleanup
}, []);
```

### 2. Validate Before Submission
```javascript
const handleSubmit = (formData) => {
  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    setError('Invalid amount');
    return;
  }
  createTransaction(formData);
};
```

### 3. Handle Loading States
```javascript
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return <TransactionList transactions={transactions} />;
```

### 4. Use Key Props in Lists
```javascript
{transactions.map(transaction => (
  <TransactionItem key={transaction.id} data={transaction} />
))}
```

---

## Troubleshooting

**Q: Hook returned undefined**
A: Ensure `userId` is not null before calling hook

**Q: Changes not reflecting**
A: Check if state is properly updated in hook

**Q: Firebase connection error**
A: Verify firebaseConfig in `.env.local`

**Q: Transaction not saving**
A: Check Firestore rules allow authenticated access

---

## Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Hooks](https://react.dev/reference/react)
- [Context API](https://react.dev/reference/react/useContext)

---

**Happy coding! 💻**

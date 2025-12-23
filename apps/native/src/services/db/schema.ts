/**
 * @fileoverview SQLite database schema definitions
 * @module @kakeibo/native/services/db
 *
 * Defines all table schemas for the SQLite database.
 * Matches the web platform's IndexedDB schema for cross-platform compatibility.
 *
 * Platform: Native only
 */

/**
 * SQL table creation statements
 * Version: 1
 */
export const SCHEMA_VERSION = 1;

/**
 * Users table
 * Stores user account information
 */
export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE,
    displayName TEXT,
    photoURL TEXT,
    settings TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;

/**
 * Accounts table
 * Stores financial accounts (bank, cash, credit card, etc.)
 */
export const CREATE_ACCOUNTS_TABLE = `
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`;

/**
 * Categories table
 * Stores expense and income categories with hierarchy support
 */
export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    parentId TEXT,
    isDefault INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE CASCADE
  );
`;

/**
 * Transactions table
 * Stores all financial transactions
 */
export const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    subcategoryId TEXT,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    tags TEXT,
    isRecurring INTEGER NOT NULL DEFAULT 0,
    recurringId TEXT,
    toAccountId TEXT,
    goalId TEXT,
    isEssential INTEGER NOT NULL DEFAULT 0,
    synced INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategoryId) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (toAccountId) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE SET NULL
  );
`;

/**
 * Budgets table
 * Stores budget allocations with multi-category support
 */
export const CREATE_BUDGETS_TABLE = `
  CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    period TEXT NOT NULL,
    categoryIds TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`;

/**
 * Goals table
 * Stores savings and debt goals
 */
export const CREATE_GOALS_TABLE = `
  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    targetAmount REAL NOT NULL,
    currentAmount REAL NOT NULL DEFAULT 0,
    deadline TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    accountId TEXT,
    icon TEXT NOT NULL DEFAULT 'target',
    color TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE SET NULL
  );
`;

/**
 * Indexes for optimized queries
 */
export const CREATE_INDEXES = [
  // Users
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',

  // Accounts
  'CREATE INDEX IF NOT EXISTS idx_accounts_userId ON accounts(userId);',
  'CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(type);',
  'CREATE INDEX IF NOT EXISTS idx_accounts_isActive ON accounts(isActive);',
  'CREATE INDEX IF NOT EXISTS idx_accounts_userId_type ON accounts(userId, type);',

  // Categories
  'CREATE INDEX IF NOT EXISTS idx_categories_userId ON categories(userId);',
  'CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);',
  'CREATE INDEX IF NOT EXISTS idx_categories_parentId ON categories(parentId);',
  'CREATE INDEX IF NOT EXISTS idx_categories_userId_type ON categories(userId, type);',
  'CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");',

  // Transactions
  'CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions(userId);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_userId_date ON transactions(userId, date);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_userId_categoryId ON transactions(userId, categoryId);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_userId_accountId ON transactions(userId, accountId);',
  'CREATE INDEX IF NOT EXISTS idx_transactions_goalId ON transactions(goalId);',

  // Budgets
  'CREATE INDEX IF NOT EXISTS idx_budgets_userId ON budgets(userId);',
  'CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period);',

  // Goals
  'CREATE INDEX IF NOT EXISTS idx_goals_userId ON goals(userId);',
  'CREATE INDEX IF NOT EXISTS idx_goals_type ON goals(type);',
  'CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);',
  'CREATE INDEX IF NOT EXISTS idx_goals_userId_status ON goals(userId, status);',
];

/**
 * All table creation statements
 */
export const CREATE_TABLES = [
  CREATE_USERS_TABLE,
  CREATE_ACCOUNTS_TABLE,
  CREATE_CATEGORIES_TABLE,
  CREATE_TRANSACTIONS_TABLE,
  CREATE_BUDGETS_TABLE,
  CREATE_GOALS_TABLE,
];

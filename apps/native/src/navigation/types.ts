export type TransactionsStackParamList = {
  transactions: undefined;
  transactionDetail: { id: string };
  addTransaction: undefined;
  editTransaction: { id: string };
};

export type BudgetsStackParamList = {
  budgets: undefined;
  budgetDetail: { id: string };
  addBudget: undefined;
  editBudget: { id: string };
};

export type GoalsStackParamList = {
  goals: undefined;
  goalDetail: { id: string };
  addGoal: undefined;
  editGoal: { id: string };
  contributeGoal: { id: string };
};

export type AccountsStackParamList = {
  accounts: undefined;
  accountDetail: { id: string };
  addAccount: undefined;
  editAccount: { id: string };
};

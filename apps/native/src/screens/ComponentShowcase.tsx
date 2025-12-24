/**
 * @fileoverview UI Component Showcase Screen
 * @module @kakeibo/native/screens
 *
 * Test screen for all custom UI components
 */

import type { Account, BudgetProgress, Category, Goal } from '@kakeibo/core';
import { Inbox } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/common';
import { TransactionCard } from '../components/features';
import { AccountCard } from '../components/features/accounts';
import { BudgetCard } from '../components/features/budgets';
import { GoalCard } from '../components/features/goals';
import {
  Badge,
  Button,
  Card,
  CategoryIcon,
  type CategoryOption,
  CategorySelect,
  type CategorySelection,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Modal,
  ProgressBar,
  Select,
  type SelectOption,
  SkeletonLoader,
  type Subcategory,
  ToastContainer,
  toast,
} from '../components/ui';

export const HeroUITestScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showEmpty, setShowEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectOptions: SelectOption[] = [
    { value: '1', label: 'Food & Dining' },
    { value: '2', label: 'Transportation' },
    { value: '3', label: 'Shopping' },
    { value: '4', label: 'Entertainment' },
  ];

  // Mock category data for CategorySelect
  const categoryOptions: CategoryOption[] = [
    { value: 'cat-1', label: 'Food & Dining', icon: 'utensils', color: '#f59e0b' },
    { value: 'cat-2', label: 'Transportation', icon: 'car', color: '#5B6EF5' },
    { value: 'cat-3', label: 'Shopping', icon: 'shopping-cart', color: '#10b981' },
    { value: 'cat-4', label: 'Entertainment', icon: 'film', color: '#f43f5e' },
    { value: 'cat-5', label: 'Housing', icon: 'home', color: '#8b5cf6' },
    { value: 'cat-6', label: 'Healthcare', icon: 'heart-pulse', color: '#ec4899' },
    { value: 'cat-7', label: 'Other Expenses', icon: 'more-horizontal', color: '#64748b' },
  ];

  const subcategories: Subcategory[] = [
    { id: 'sub-1', name: 'Groceries', categoryId: 'cat-1' },
    { id: 'sub-2', name: 'Restaurants', categoryId: 'cat-1' },
    { id: 'sub-3', name: 'Coffee & Drinks', categoryId: 'cat-1' },
    { id: 'sub-4', name: 'Fast Food', categoryId: 'cat-1' },
    { id: 'sub-5', name: 'Public Transit', categoryId: 'cat-2' },
    { id: 'sub-6', name: 'Gas & Fuel', categoryId: 'cat-2' },
    { id: 'sub-7', name: 'Parking', categoryId: 'cat-2' },
    { id: 'sub-8', name: 'Clothing', categoryId: 'cat-3' },
    { id: 'sub-9', name: 'Electronics', categoryId: 'cat-3' },
    { id: 'sub-10', name: 'Home Goods', categoryId: 'cat-3' },
  ];

  const handleCategorySelection = (selection: CategorySelection) => {
    setSelectedCategory(selection.categoryId);
    setSelectedSubcategory(selection.subcategoryId);
    const categoryName = categoryOptions.find((c) => c.value === selection.categoryId)?.label;
    const subcategoryName = selection.subcategoryId
      ? subcategories.find((s) => s.id === selection.subcategoryId)?.name
      : undefined;
    const message = subcategoryName
      ? `Selected: ${categoryName} / ${subcategoryName}`
      : `Selected: ${categoryName}`;
    toast.success(message);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastContainer />
      <ScrollView
        className="flex-1 bg-surface-950"
        contentContainerClassName="p-4 gap-2"
        endFillColorClassName="accent-gray-100"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
          UI Component Showcase
        </Text>

        {/* Buttons */}
        <Section title="Buttons">
          <View className="gap-3">
            <Button variant="primary" onPress={() => toast.success('Primary button pressed!')}>
              Primary Button
            </Button>
            <Button variant="secondary" onPress={() => toast.info('Secondary button pressed')}>
              Secondary Button
            </Button>
            <Button variant="danger" onPress={() => toast.error('Danger button!')}>
              Danger Button
            </Button>
            <Button variant="success" onPress={() => toast.success('Success!')}>
              Success Button
            </Button>
            <Button variant="ghost" onPress={() => toast.info('Ghost button')}>
              Ghost Button
            </Button>
            <Button variant="outline" onPress={() => toast.info('Outline button')}>
              Outline Button
            </Button>
            <Button variant="primary" loading>
              Loading Button
            </Button>
            <Button variant="primary" disabled>
              Disabled Button
            </Button>
          </View>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={inputValue}
            onChangeText={setInputValue}
            helperText="We'll never share your email"
          />
          <Input
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            error="Password is required"
          />
          <Input label="Disabled" placeholder="Disabled input" disabled />
        </Section>

        {/* Select */}
        <Section title="Select">
          <Select
            label="Category"
            value={selectedValue}
            onValueChange={setSelectedValue}
            options={selectOptions}
            placeholder="Select a category"
          />
        </Section>

        {/* CategorySelect */}
        <Section title="CategorySelect">
          <CategorySelect
            label="Expense Category"
            options={categoryOptions}
            subcategories={subcategories}
            value={selectedCategory}
            subcategoryValue={selectedSubcategory}
            onSelectionChange={handleCategorySelection}
            placeholder="Search categories..."
            helperText="Search by category or subcategory name"
          />
          <Text className="text-surface-400 text-xs mt-2">
            Features: Search, expandable subcategories, icons, breadcrumb selection display
          </Text>
        </Section>

        {/* DatePicker */}
        <Section title="DatePicker">
          <DatePicker label="Transaction Date" value={selectedDate} onChange={setSelectedDate} />
        </Section>

        {/* Checkboxes */}
        <Section title="Checkboxes">
          <Checkbox checked={isChecked} onCheckedChange={setIsChecked} label="Accept terms" />
          <Checkbox checked={true} onCheckedChange={() => {}} label="Checked" />
          <Checkbox checked={false} onCheckedChange={() => {}} label="Unchecked" />
          <Checkbox checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <View className="flex-row flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </View>
        </Section>

        {/* Chips */}
        <Section title="Chips">
          <View className="flex-row flex-wrap gap-2">
            <Chip label="Groceries" variant="primary" />
            <Chip label="Transport" variant="success" />
            <Chip label="Entertainment" variant="warning" />
            <Chip
              label="Removable"
              variant="danger"
              onClose={() => toast.success('Chip removed')}
            />
            <Chip label="Clickable" variant="neutral" onPress={() => toast.info('Chip clicked')} />
            <Chip
              label="Both"
              variant="primary"
              onPress={() => toast.info('Pressed')}
              onClose={() => toast.success('Closed')}
            />
          </View>
          <Text className="text-surface-500 text-xs mt-2">Different sizes:</Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            <Chip label="Small" variant="primary" size="sm" />
            <Chip label="Medium" variant="success" size="md" />
            <Chip label="Large" variant="warning" size="lg" />
          </View>
        </Section>

        {/* Progress Bars */}
        <Section title="Progress Bars">
          <ProgressBar progress={25} color="primary" showPercentage />
          <ProgressBar progress={60} color="success" showPercentage />
          <ProgressBar progress={85} color="warning" showPercentage />
          <ProgressBar progress={100} color="danger" showPercentage />
        </Section>

        {/* Category Icons */}
        <Section title="Category Icons">
          <View className="flex-row flex-wrap gap-4">
            <View className="items-center">
              <View className="w-12 h-12 rounded-lg bg-success-500/20 items-center justify-center mb-1">
                <CategoryIcon icon="shopping-cart" color="#10b981" size="lg" />
              </View>
              <Text className="text-surface-400 text-xs">Shopping</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 rounded-lg bg-primary-500/20 items-center justify-center mb-1">
                <CategoryIcon icon="car" color="#5B6EF5" size="lg" />
              </View>
              <Text className="text-surface-400 text-xs">Transport</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 rounded-lg bg-warning-500/20 items-center justify-center mb-1">
                <CategoryIcon icon="utensils" color="#f59e0b" size="lg" />
              </View>
              <Text className="text-surface-400 text-xs">Food</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 rounded-lg bg-danger-500/20 items-center justify-center mb-1">
                <CategoryIcon icon="home" color="#f43f5e" size="lg" />
              </View>
              <Text className="text-surface-400 text-xs">Housing</Text>
            </View>
          </View>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <Card variant="default" padding="md">
            <Text className="text-surface-100 font-semibold mb-1">Default Card</Text>
            <Text className="text-surface-400 text-sm">This is a default card variant</Text>
          </Card>
          <Card variant="elevated" padding="lg">
            <Text className="text-surface-100 font-semibold mb-1">Elevated Card</Text>
            <Text className="text-surface-400 text-sm">This card has a shadow</Text>
          </Card>
          <Card variant="outlined" padding="md" onPress={() => toast.info('Card pressed!')}>
            <Text className="text-surface-100 font-semibold mb-1">Pressable Card</Text>
            <Text className="text-surface-400 text-sm">Tap me!</Text>
          </Card>
        </Section>

        {/* Skeleton Loaders */}
        <Section title="Skeleton Loaders">
          <Button variant="secondary" onPress={() => setIsLoading(!isLoading)}>
            {isLoading ? 'Hide Skeleton' : 'Show Skeleton'}
          </Button>
          {isLoading && (
            <View className="mt-4">
              <SkeletonLoader variant="list" count={3} />
            </View>
          )}
        </Section>

        {/* Empty State */}
        <Section title="Empty State">
          <Button variant="secondary" onPress={() => setShowEmpty(!showEmpty)}>
            {showEmpty ? 'Hide Empty State' : 'Show Empty State'}
          </Button>
          {showEmpty && (
            <Card variant="default" padding="none" className="mt-4">
              <EmptyState
                icon={Inbox}
                title="No transactions yet"
                description="Add your first transaction to get started"
                action={{
                  label: 'Add Transaction',
                  onPress: () => toast.success('Action pressed!'),
                }}
              />
            </Card>
          )}
        </Section>

        {/* Modal */}
        <Section title="Modal">
          <Button variant="primary" onPress={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            footer={
              <View className="flex-row gap-3">
                <Button variant="secondary" onPress={() => setIsModalOpen(false)} fullWidth>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={() => {
                    toast.success('Confirmed!');
                    setIsModalOpen(false);
                  }}
                  fullWidth
                >
                  Confirm
                </Button>
              </View>
            }
          >
            <Text className="text-surface-300 text-base mb-4">
              This is an example modal with a title, content, and footer with actions.
            </Text>
            <Input label="Name" placeholder="Enter your name" />
          </Modal>
        </Section>

        {/* Toast Triggers */}
        <Section title="Toast Notifications">
          <View className="gap-3">
            <Button variant="success" onPress={() => toast.success('Operation successful!')}>
              Show Success Toast
            </Button>
            <Button variant="danger" onPress={() => toast.error('Something went wrong!')}>
              Show Error Toast
            </Button>
            <Button variant="secondary" onPress={() => toast.warning('Warning message!')}>
              Show Warning Toast
            </Button>
            <Button variant="primary" onPress={() => toast.info('Information message')}>
              Show Info Toast
            </Button>
          </View>
        </Section>

        {/* Transaction Cards */}
        <Section title="Transaction Cards">
          <TransactionCard
            id="tr-1"
            description="Grocery shopping at Whole Foods"
            amount={127.45}
            type="expense"
            date="2024-12-22"
            category={{ name: 'Food & Dining', icon: 'utensils', color: '#f59e0b' }}
            subcategory={{ name: 'Groceries' }}
            isEssential={true}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onEdit={() => toast.info('Edit transaction')}
            onDelete={() => toast.error('Delete transaction')}
          />
          <TransactionCard
            id="tr-2"
            description="Salary payment"
            amount={5000}
            type="income"
            date="2024-12-15"
            category={{ name: 'Salary', icon: 'dollar-sign', color: '#10b981' }}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onDelete={() => toast.error('Delete transaction')}
          />
          <TransactionCard
            id="tr-3"
            description="Transfer to savings"
            amount={500}
            type="transfer"
            date="2024-12-20"
            accountName="Checking"
            toAccountName="Savings"
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onDelete={() => toast.error('Delete transaction')}
            variant="compact"
          />
          <TransactionCard
            id="tr-4"
            description="Emergency fund contribution"
            amount={200}
            type="goal-contribution"
            date="2024-12-18"
            goalName="Emergency Fund"
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onDelete={() => toast.error('Delete transaction')}
          />
        </Section>

        {/* Budget Cards */}
        <Section title="Budget Cards">
          <BudgetCard
            budgetProgress={
              {
                budget: {
                  id: 'bud-1',
                  userId: 'user-1',
                  name: 'Groceries',
                  categoryIds: ['cat-1'],
                  amount: 500,
                  period: 'monthly',
                  rollover: false,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                spent: 350,
                remaining: 150,
                percentage: 70,
                isOverBudget: false,
                isWarning: true,
                activeAlerts: [50],
              } as BudgetProgress
            }
            categories={[
              {
                id: 'cat-1',
                userId: 'user-1',
                name: 'Food & Dining',
                type: 'expense',
                icon: 'utensils',
                color: '#f59e0b',
                isDefault: false,
                order: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Category,
            ]}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onEdit={() => toast.info('Edit budget')}
            onDelete={() => toast.error('Delete budget')}
          />
          <BudgetCard
            budgetProgress={
              {
                budget: {
                  id: 'bud-2',
                  userId: 'user-1',
                  name: 'Entertainment',
                  categoryIds: ['cat-2', 'cat-3'],
                  amount: 200,
                  period: 'monthly',
                  rollover: false,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                spent: 220,
                remaining: -20,
                percentage: 110,
                isOverBudget: true,
                isWarning: false,
                activeAlerts: [100, 90],
              } as BudgetProgress
            }
            categories={[
              {
                id: 'cat-2',
                userId: 'user-1',
                name: 'Movies',
                type: 'expense',
                icon: 'film',
                color: '#8b5cf6',
                isDefault: false,
                order: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Category,
              {
                id: 'cat-3',
                userId: 'user-1',
                name: 'Music',
                type: 'expense',
                icon: 'music',
                color: '#ec4899',
                isDefault: false,
                order: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Category,
            ]}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onEdit={() => toast.info('Edit budget')}
            onDelete={() => toast.error('Delete budget')}
          />
        </Section>

        {/* Goal Cards */}
        <Section title="Goal Cards">
          <GoalCard
            goal={
              {
                id: 'goal-1',
                userId: 'user-1',
                name: 'Emergency Fund',
                type: 'savings',
                targetAmount: 10000,
                currentAmount: 7500,
                deadline: new Date('2025-12-31'),
                status: 'active',
                icon: 'target',
                color: '#5B6EF5',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Goal
            }
            currentAmount={7500}
            progress={75}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            formatDate={(date) =>
              new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            daysUntilDeadline={9}
            onContribute={() => toast.success('Contribute to goal')}
            onEdit={() => toast.info('Edit goal')}
            onDelete={() => toast.error('Delete goal')}
          />
          <GoalCard
            goal={
              {
                id: 'goal-2',
                userId: 'user-1',
                name: 'Vacation to Japan',
                type: 'savings',
                targetAmount: 5000,
                currentAmount: 4200,
                deadline: new Date('2026-03-15'),
                status: 'active',
                icon: 'plane',
                color: '#10b981',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Goal
            }
            currentAmount={4200}
            progress={84}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            formatDate={(date) =>
              new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            daysUntilDeadline={84}
            onContribute={() => toast.success('Contribute to goal')}
            onEdit={() => toast.info('Edit goal')}
            onDelete={() => toast.error('Delete goal')}
          />
          <GoalCard
            goal={
              {
                id: 'goal-3',
                userId: 'user-1',
                name: 'Pay Off Credit Card',
                type: 'debt',
                targetAmount: 5000,
                currentAmount: 3200,
                status: 'active',
                icon: 'credit-card',
                color: '#f43f5e',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Goal
            }
            currentAmount={3200}
            progress={64}
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            onContribute={() => toast.success('Add payment')}
            onEdit={() => toast.info('Edit goal')}
            onDelete={() => toast.error('Delete goal')}
          />
        </Section>

        {/* Account Cards */}
        <Section title="Account Cards">
          <AccountCard
            account={
              {
                id: 'acc-1',
                userId: 'user-1',
                name: 'Main Checking',
                type: 'bank',
                balance: 5432.5,
                color: '#5B6EF5',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Account
            }
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            getTypeLabel={(type) => {
              const labels = {
                bank: 'Bank Account',
                cash: 'Cash',
                credit: 'Credit Card',
                investment: 'Investment',
                wallet: 'E-Wallet',
              };
              return labels[type] || type;
            }}
            onTransfer={() => toast.info('Transfer from account')}
            onEdit={() => toast.info('Edit account')}
            onDelete={() => toast.error('Delete account')}
          />
          <AccountCard
            account={
              {
                id: 'acc-2',
                userId: 'user-1',
                name: 'Chase Credit Card',
                type: 'credit',
                balance: -1200.0,
                color: '#f43f5e',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Account
            }
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            getTypeLabel={(type) => {
              const labels = {
                bank: 'Bank Account',
                cash: 'Cash',
                credit: 'Credit Card',
                investment: 'Investment',
                wallet: 'E-Wallet',
              };
              return labels[type] || type;
            }}
            onTransfer={() => toast.info('Transfer from account')}
            onEdit={() => toast.info('Edit account')}
            onDelete={() => toast.error('Delete account')}
          />
          <AccountCard
            account={
              {
                id: 'acc-3',
                userId: 'user-1',
                name: 'Savings Account',
                type: 'bank',
                balance: 12500.75,
                color: '#10b981',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Account
            }
            formatCurrency={(amt) => `$${amt.toFixed(2)}`}
            getTypeLabel={(type) => {
              const labels = {
                bank: 'Bank Account',
                cash: 'Cash',
                credit: 'Credit Card',
                investment: 'Investment',
                wallet: 'E-Wallet',
              };
              return labels[type] || type;
            }}
            onTransfer={() => toast.info('Transfer from account')}
            onEdit={() => toast.info('Edit account')}
            onDelete={() => toast.error('Delete account')}
          />
        </Section>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View className="mb-6">
    <Text className="text-surface-200 text-lg font-semibold mb-3">{title}</Text>
    <View className="gap-3">{children}</View>
  </View>
);

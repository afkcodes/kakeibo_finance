/**
 * @fileoverview Subcategory definitions and utility functions
 * @module @kakeibo/core/types
 *
 * Defines subcategories for detailed transaction classification.
 * Provides comprehensive subcategory mappings for all default categories.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Subcategory interface
 *
 * Subcategories provide an additional level of detail beyond the main category.
 * For example, "Groceries" category might have "Food Items", "Household", "Personal Care"
 */
export interface Subcategory {
  /** Unique subcategory identifier */
  id: string;

  /** Subcategory name */
  name: string;

  /** Optional icon (uses parent category icon if not provided) */
  icon?: string;
}

/**
 * Subcategory definitions mapped by category name
 *
 * Key: category name (lowercase, hyphenated)
 * Value: array of subcategories for that category
 *
 * Design notes:
 * - Subcategories represent different aspects/types within a category
 * - "All" is implicitly the default when no subcategory is selected
 * - Keep it simple - 3-5 subcategories max per category
 * - Covers both expense and income categories
 */
export const categorySubcategories: Record<string, Subcategory[]> = {
  // 🍽️ Food & Dining
  groceries: [
    { id: 'groceries-food', name: 'Food Items' },
    { id: 'groceries-household', name: 'Household' },
    { id: 'groceries-personal-care', name: 'Personal Care' },
  ],
  restaurants: [
    { id: 'restaurants-dine-in', name: 'Dine In' },
    { id: 'restaurants-takeout', name: 'Takeout' },
    { id: 'restaurants-delivery', name: 'Delivery' },
  ],
  'coffee-and-snacks': [
    { id: 'coffee-and-snacks-coffee', name: 'Coffee' },
    { id: 'coffee-and-snacks-snacks', name: 'Snacks' },
    { id: 'coffee-and-snacks-drinks', name: 'Drinks' },
  ],

  // 🏠 Housing & Utilities
  housing: [
    { id: 'housing-rent', name: 'Rent' },
    { id: 'housing-mortgage', name: 'Mortgage' },
    { id: 'housing-maintenance', name: 'Maintenance' },
    { id: 'housing-repairs', name: 'Repairs' },
  ],
  utilities: [
    { id: 'utilities-electricity', name: 'Electricity' },
    { id: 'utilities-water', name: 'Water' },
    { id: 'utilities-gas', name: 'Gas' },
    { id: 'utilities-internet', name: 'Internet' },
    { id: 'utilities-phone', name: 'Phone' },
  ],

  // 🚗 Transportation
  vehicle: [
    { id: 'vehicle-fuel', name: 'Fuel' },
    { id: 'vehicle-maintenance', name: 'Maintenance' },
    { id: 'vehicle-insurance', name: 'Insurance' },
    { id: 'vehicle-parking', name: 'Parking' },
    { id: 'vehicle-emi', name: 'EMI/Loan' },
  ],
  transport: [
    { id: 'transport-public', name: 'Public Transit' },
    { id: 'transport-cab', name: 'Cab/Rideshare' },
    { id: 'transport-rental', name: 'Rental' },
  ],

  // 🛍️ Shopping
  shopping: [
    { id: 'shopping-clothing', name: 'Clothing' },
    { id: 'shopping-footwear', name: 'Footwear' },
    { id: 'shopping-home', name: 'Home & Furniture' },
    { id: 'shopping-accessories', name: 'Accessories' },
  ],
  electronics: [
    { id: 'electronics-phones', name: 'Phones' },
    { id: 'electronics-computers', name: 'Computers' },
    { id: 'electronics-accessories', name: 'Accessories' },
    { id: 'electronics-appliances', name: 'Appliances' },
  ],

  // 🎬 Entertainment
  entertainment: [
    { id: 'entertainment-streaming', name: 'Streaming' },
    { id: 'entertainment-movies', name: 'Movies' },
    { id: 'entertainment-gaming', name: 'Gaming' },
    { id: 'entertainment-events', name: 'Events' },
    { id: 'entertainment-books', name: 'Books' },
  ],
  'sports-and-fitness': [
    { id: 'sports-and-fitness-gym', name: 'Gym' },
    { id: 'sports-and-fitness-sports', name: 'Sports' },
    { id: 'sports-and-fitness-equipment', name: 'Equipment' },
  ],

  // ✈️ Travel
  travel: [
    { id: 'travel-flights', name: 'Flights' },
    { id: 'travel-hotels', name: 'Hotels' },
    { id: 'travel-transport', name: 'Local Transport' },
    { id: 'travel-activities', name: 'Activities' },
    { id: 'travel-food', name: 'Food & Dining' },
  ],

  // 🏥 Healthcare
  healthcare: [
    { id: 'healthcare-doctor', name: 'Doctor' },
    { id: 'healthcare-medicine', name: 'Medicine' },
    { id: 'healthcare-tests', name: 'Lab Tests' },
    { id: 'healthcare-dental', name: 'Dental' },
    { id: 'healthcare-vision', name: 'Vision' },
  ],
  'personal-care': [
    { id: 'personal-care-grooming', name: 'Grooming' },
    { id: 'personal-care-skincare', name: 'Skincare' },
    { id: 'personal-care-haircare', name: 'Haircare' },
    { id: 'personal-care-spa', name: 'Spa & Wellness' },
  ],

  // 📚 Education
  education: [
    { id: 'education-tuition', name: 'Tuition' },
    { id: 'education-courses', name: 'Courses' },
    { id: 'education-books', name: 'Books & Supplies' },
    { id: 'education-exams', name: 'Exams & Certifications' },
  ],

  // 💰 Financial
  financial: [
    { id: 'financial-loans', name: 'Loan Payment' },
    { id: 'financial-credit-card', name: 'Credit Card' },
    { id: 'financial-bank-fees', name: 'Bank Fees' },
    { id: 'financial-taxes', name: 'Taxes' },
  ],
  insurance: [
    { id: 'insurance-health', name: 'Health' },
    { id: 'insurance-life', name: 'Life' },
    { id: 'insurance-home', name: 'Home' },
    { id: 'insurance-other', name: 'Other' },
  ],

  // 👶 Family
  family: [
    { id: 'family-childcare', name: 'Childcare' },
    { id: 'family-kids-activities', name: 'Kids Activities' },
    { id: 'family-support', name: 'Family Support' },
    { id: 'family-elderly-care', name: 'Elderly Care' },
  ],
  pets: [
    { id: 'pets-food', name: 'Food' },
    { id: 'pets-vet', name: 'Vet' },
    { id: 'pets-grooming', name: 'Grooming' },
    { id: 'pets-supplies', name: 'Supplies' },
  ],

  // 🔧 Subscriptions
  subscriptions: [
    { id: 'subscriptions-streaming', name: 'Streaming' },
    { id: 'subscriptions-software', name: 'Software' },
    { id: 'subscriptions-news', name: 'News & Magazines' },
    { id: 'subscriptions-memberships', name: 'Memberships' },
  ],

  // 💼 Income Categories
  salary: [
    { id: 'salary-base', name: 'Base Salary' },
    { id: 'salary-bonus', name: 'Bonus' },
    { id: 'salary-overtime', name: 'Overtime' },
    { id: 'salary-allowances', name: 'Allowances' },
  ],
  freelance: [
    { id: 'freelance-project', name: 'Project' },
    { id: 'freelance-consulting', name: 'Consulting' },
    { id: 'freelance-retainer', name: 'Retainer' },
  ],
  business: [
    { id: 'business-sales', name: 'Sales' },
    { id: 'business-services', name: 'Services' },
    { id: 'business-commission', name: 'Commission' },
  ],
  investments: [
    { id: 'investments-dividends', name: 'Dividends' },
    { id: 'investments-interest', name: 'Interest' },
    { id: 'investments-capital-gains', name: 'Capital Gains' },
  ],
  'rental-income': [
    { id: 'rental-income-property', name: 'Property' },
    { id: 'rental-income-equipment', name: 'Equipment' },
  ],
};

/**
 * Get subcategories for a category by its name or ID
 *
 * Handles multiple input formats:
 * - Category name with spaces: "Coffee & Snacks"
 * - Category name hyphenated: "coffee-and-snacks"
 * - Category ID with prefix: "expense-coffee-and-snacks"
 *
 * @param categoryNameOrId - Category name or ID
 * @returns Array of subcategories (empty if none defined)
 *
 * @example
 * ```ts
 * const subs = getSubcategoriesForCategory('Groceries');
 * // Returns: [{ id: 'groceries-food', name: 'Food Items' }, ...]
 * ```
 */
export function getSubcategoriesForCategory(categoryNameOrId: string): Subcategory[] {
  // Normalize the key - handle both category IDs and names
  const key = categoryNameOrId
    .toLowerCase()
    .replace(/^(expense|income)-/, '') // Remove type prefix if present
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and');

  return categorySubcategories[key] || [];
}

/**
 * Check if a category has subcategories defined
 *
 * @param categoryNameOrId - Category name or ID
 * @returns True if category has subcategories
 *
 * @example
 * ```ts
 * if (hasSubcategories('Groceries')) {
 *   // Show subcategory selector
 * }
 * ```
 */
export function hasSubcategories(categoryNameOrId: string): boolean {
  return getSubcategoriesForCategory(categoryNameOrId).length > 0;
}

/**
 * Get a subcategory by its ID
 *
 * Searches across all categories to find a subcategory by its unique ID.
 *
 * @param subcategoryId - Subcategory ID to find
 * @returns Subcategory if found, undefined otherwise
 *
 * @example
 * ```ts
 * const sub = getSubcategoryById('groceries-food');
 * // Returns: { id: 'groceries-food', name: 'Food Items' }
 * ```
 */
export function getSubcategoryById(subcategoryId: string): Subcategory | undefined {
  // Find in all subcategories
  for (const subcategories of Object.values(categorySubcategories)) {
    const found = subcategories.find((s) => s.id === subcategoryId);
    if (found) return found;
  }
  return undefined;
}

/**
 * @fileoverview Category Select Component with Subcategory Support
 * @module @kakeibo/web/components/ui/CategorySelect
 */

import { cn } from '@kakeibo/core';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, X } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CategoryIcon } from '../CategoryIcon';

export interface CategoryOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface CategorySelection {
  categoryId: string;
  subcategoryId?: string;
}

export interface CategorySelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: CategoryOption[];
  subcategories?: Subcategory[];
  placeholder?: string;
  value?: string;
  subcategoryValue?: string;
  onValueChange?: (value: string) => void;
  onSelectionChange?: (selection: CategorySelection) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
}

interface FilteredCategory {
  category: CategoryOption;
  subcategories: Subcategory[];
  matchType: 'category' | 'subcategory' | 'both';
}

const CategorySelect = forwardRef<HTMLInputElement, CategorySelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      subcategories = [],
      placeholder = 'Search categories...',
      value,
      subcategoryValue,
      onValueChange,
      onSelectionChange,
      disabled,
      name,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedSubcategory = subcategoryValue
      ? subcategories.find((s) => s.categoryId === value && s.id === subcategoryValue)
      : undefined;

    // Auto-expand all categories with subcategories on mount
    useEffect(() => {
      if (subcategories.length > 0) {
        const categoriesWithSubs = new Set<string>();
        options.forEach((option) => {
          const hasSubs = subcategories.some((s) => s.categoryId === option.value);
          if (hasSubs) {
            categoriesWithSubs.add(option.value);
          }
        });
        setExpandedCategories(categoriesWithSubs);
      }
    }, [subcategories, options]);

    // Smart filter: search both categories AND subcategories
    const filteredResults = useMemo((): FilteredCategory[] => {
      const query = searchQuery.toLowerCase().trim();

      const results = options
        .map((category) => {
          // Get subcategories for this category
          const allSubcategories = subcategories.filter((s) => s.categoryId === category.value);
          const categoryMatches = !query || category.label.toLowerCase().includes(query);

          if (!query) {
            // No search - show all with collapsed subcategories
            return {
              category,
              subcategories: allSubcategories,
              matchType: 'category' as const,
            };
          }

          // Check if subcategories match
          const matchingSubcategories = allSubcategories.filter((sub) =>
            sub.name.toLowerCase().includes(query)
          );

          if (categoryMatches && matchingSubcategories.length > 0) {
            // Both category and some subcategories match
            return {
              category,
              subcategories: allSubcategories, // Show all subs when category matches
              matchType: 'both' as const,
            };
          }
          if (categoryMatches) {
            // Only category matches - show all subcategories
            return {
              category,
              subcategories: allSubcategories,
              matchType: 'category' as const,
            };
          }
          if (matchingSubcategories.length > 0) {
            // Only subcategories match - show only matching subcategories
            return {
              category,
              subcategories: matchingSubcategories,
              matchType: 'subcategory' as const,
            };
          }

          return null;
        })
        .filter((result): result is FilteredCategory => result !== null);

      // Sort: put "others" or "other" at the bottom
      return results.sort((a, b) => {
        const aIsOther = a.category.label.toLowerCase().includes('other');
        const bIsOther = b.category.label.toLowerCase().includes('other');
        if (aIsOther && !bIsOther) return 1;
        if (!aIsOther && bIsOther) return -1;
        return 0;
      });
    }, [options, searchQuery, subcategories]);

    // Build flat list for keyboard navigation
    const flatItems = useMemo(() => {
      const items: Array<{
        type: 'category' | 'subcategory';
        category: CategoryOption;
        subcategory?: Subcategory;
      }> = [];

      for (const { category, subcategories: subs } of filteredResults) {
        items.push({ type: 'category', category });

        // Include subcategories if expanded or if there's a search query
        if (searchQuery || expandedCategories.has(category.value)) {
          for (const sub of subs) {
            items.push({ type: 'subcategory', category, subcategory: sub });
          }
        }
      }

      return items;
    }, [filteredResults, expandedCategories, searchQuery]);

    // Auto-expand categories when searching
    useEffect(() => {
      if (searchQuery) {
        // Expand all filtered categories when searching
        const categoriesToExpand = new Set(filteredResults.map((r) => r.category.value));
        setExpandedCategories(categoriesToExpand);
      }
    }, [searchQuery, filteredResults]);

    // Reset highlight when filtered options change
    useEffect(() => {
      setHighlightedIndex(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
      if (open && listRef.current) {
        const highlightedEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
        highlightedEl?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, open]);

    const handleSelectCategory = (category: CategoryOption) => {
      onValueChange?.(category.value);
      onSelectionChange?.({ categoryId: category.value, subcategoryId: undefined });
      setOpen(false);
      setSearchQuery('');
      setExpandedCategories(new Set());
    };

    const handleSelectSubcategory = (category: CategoryOption, subcategory: Subcategory) => {
      onValueChange?.(category.value);
      onSelectionChange?.({
        categoryId: category.value,
        subcategoryId: subcategory.id,
      });
      setOpen(false);
      setSearchQuery('');
      setExpandedCategories(new Set());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      if (!open) setOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          setOpen(true);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((i) => (i < flatItems.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => (i > 0 ? i - 1 : flatItems.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          {
            const item = flatItems[highlightedIndex];
            if (item) {
              if (item.type === 'subcategory' && item.subcategory) {
                handleSelectSubcategory(item.category, item.subcategory);
              } else {
                handleSelectCategory(item.category);
              }
            }
          }
          break;
        case 'Escape':
          setOpen(false);
          setSearchQuery('');
          break;
        case 'Tab':
          setOpen(false);
          setSearchQuery('');
          break;
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.('');
      onSelectionChange?.({ categoryId: '', subcategoryId: undefined });
      setSearchQuery('');
      inputRef.current?.focus();
    };

    // Display value: show search query when typing, otherwise show selected label
    const getDisplayValue = () => {
      if (open) return searchQuery;
      if (!selectedOption) return '';
      if (selectedSubcategory) {
        return `${selectedOption.label} / ${selectedSubcategory.name}`;
      }
      return selectedOption.label;
    };

    let currentIndex = -1;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-surface-200 text-[13px] font-medium mb-1.5">{label}</label>
        )}

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Anchor asChild>
            <div
              role="button"
              tabIndex={disabled ? -1 : 0}
              onClick={() => !disabled && setOpen(true)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-3 h-11 text-[14px] transition-colors duration-200 cursor-text',
                'border bg-surface-800/60',
                disabled && 'opacity-50 cursor-not-allowed',
                error
                  ? 'border-danger-500 focus-within:border-danger-500 focus-within:ring-danger-500/30'
                  : 'border-surface-700/30 focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500',
                className
              )}
            >
              {/* Selected category icon - always reserve space when value exists */}
              {selectedOption?.icon && (
                <span
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    open && 'hidden'
                  )}
                  style={{
                    backgroundColor: `${selectedOption.color || '#6b7280'}20`,
                  }}
                >
                  <CategoryIcon icon={selectedOption.icon} color={selectedOption.color} size="sm" />
                </span>
              )}

              <input
                ref={(node) => {
                  // Handle both refs
                  if (typeof ref === 'function') ref(node);
                  else if (ref) ref.current = node;
                  (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                }}
                type="text"
                name={name}
                value={getDisplayValue()}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  'flex-1 bg-transparent outline-none min-w-0',
                  'text-surface-100 placeholder:text-surface-500'
                )}
                autoComplete="off"
              />

              {/* Clear button */}
              {value && !open && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 rounded hover:bg-surface-700/50 text-surface-500 hover:text-surface-300 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-surface-500 shrink-0 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </div>
          </Popover.Anchor>

          <Popover.Portal>
            <Popover.Content
              className={cn(
                'overflow-hidden rounded-lg border border-surface-700 bg-surface-800 shadow-xl',
                'animate-in fade-in-0 zoom-in-95',
                'z-50 w-(--radix-popover-trigger-width)'
              )}
              side="bottom"
              sideOffset={4}
              avoidCollisions={false}
              onOpenAutoFocus={(e: Event) => e.preventDefault()}
            >
              <div ref={listRef} className="p-1.5 max-h-80 overflow-y-auto">
                {filteredResults.length === 0 ? (
                  <div className="px-3 py-6 text-center text-[13px] text-surface-500">
                    No categories found
                  </div>
                ) : (
                  filteredResults.map(({ category, subcategories: subs, matchType }) => {
                    const hasSubcategories = subs.length > 0;
                    const categoryIndex = ++currentIndex;

                    return (
                      <div key={category.value}>
                        {/* Category row */}
                        <div
                          role="button"
                          tabIndex={0}
                          data-index={categoryIndex}
                          onClick={() => handleSelectCategory(category)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectCategory(category);
                            }
                          }}
                          onMouseEnter={() => setHighlightedIndex(categoryIndex)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[14px] cursor-pointer select-none outline-none text-left',
                            'text-surface-200 transition-colors',
                            categoryIndex === highlightedIndex && 'bg-surface-700/50',
                            category.disabled && 'opacity-50 pointer-events-none',
                            category.value === value && !subcategoryValue && 'text-primary-400'
                          )}
                        >
                          {category.icon && (
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${category.color || '#6b7280'}20`,
                              }}
                            >
                              <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                            </span>
                          )}
                          <span className="flex-1 truncate font-medium">{category.label}</span>
                          {category.value === value && !subcategoryValue && (
                            <Check className="h-4 w-4 text-primary-400 shrink-0" />
                          )}
                        </div>

                        {/* Subcategories - always shown */}
                        {hasSubcategories && (
                          <div className="ml-6 border-l border-surface-700/50 pl-2 mb-1">
                            {subs.map((sub) => {
                              const subIndex = ++currentIndex;
                              const isSelected =
                                category.value === value && subcategoryValue === sub.id;
                              const isSubMatch =
                                matchType === 'subcategory' &&
                                sub.name.toLowerCase().includes(searchQuery.toLowerCase());

                              return (
                                <div
                                  role="button"
                                  tabIndex={0}
                                  key={sub.id}
                                  data-index={subIndex}
                                  onClick={() => handleSelectSubcategory(category, sub)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleSelectSubcategory(category, sub);
                                    }
                                  }}
                                  onMouseEnter={() => setHighlightedIndex(subIndex)}
                                  className={cn(
                                    'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] cursor-pointer select-none',
                                    'text-surface-400 transition-colors',
                                    subIndex === highlightedIndex &&
                                      'bg-surface-700/50 text-surface-200',
                                    isSelected && 'text-primary-400',
                                    isSubMatch && 'text-surface-200 font-medium'
                                  )}
                                >
                                  <span className="flex-1 truncate">{sub.name}</span>
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {error && <p className="mt-1.5 text-[12px] text-danger-400">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-[12px] text-surface-400">{helperText}</p>
        )}
      </div>
    );
  }
);

CategorySelect.displayName = 'CategorySelect';

export { CategorySelect };

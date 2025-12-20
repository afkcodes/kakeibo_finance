# Design System Architecture

This document explains how styles are organized across the monorepo for maximum code reuse between web and React Native.

## File Structure

```
packages/core/src/styles/
├── theme.css       # Cross-platform design tokens (REQUIRED for all apps)
└── web.css         # Web-only styles (DO NOT import in native apps)
```

## theme.css - Cross-Platform Tokens

**Location:** `packages/core/src/styles/theme.css`

**Purpose:** Single source of truth for design tokens that work on both web (Tailwind v4) and React Native (UniWind).

**Contains:**
- ✅ Colors (primary, success, danger, warning, info, surface/gray scales)
- ✅ Spacing scale (0-96)
- ✅ Border radius (sm-3xl, full)
- ✅ Shadows (sm-2xl, inner, none)
- ✅ Typography (font families, sizes, weights, line heights)
- ✅ Z-index layers (dropdown, modal, tooltip, etc.)

**Imported by:**
- `apps/web/src/styles.css`
- `apps/native/src/global.css`

**Usage:**
```tsx
// Works on both web and native
<View className="bg-primary-600 text-white rounded-xl p-4 shadow-lg">
  <Text className="text-2xl font-bold">Hello World</Text>
</View>
```

## web.css - Web-Only Styles

**Location:** `packages/core/src/styles/web.css`

**Purpose:** Web-specific CSS features that don't work in React Native.

**Contains:**
- ❌ Hover states (`:hover`, `:focus`)
- ❌ CSS animations & `@keyframes`
- ❌ Media queries (`@media`)
- ❌ Backdrop filters (`backdrop-filter`)
- ❌ Scrollbar styling (`::-webkit-scrollbar`)
- ❌ Pseudo-elements (`::before`, `::after`)
- ❌ Complex gradients with `background-clip`
- ❌ Web-only utilities (`.glass`, `.gradient-text`, etc.)

**Imported by:**
- `apps/web/src/styles.css` ✅
- `apps/native/src/global.css` ❌ (DO NOT IMPORT)

**Usage:**
```tsx
// Web only - use Pressable states in native instead
<button className="btn-gradient hover:scale-105 animate-fade-in">
  Click me
</button>
```

## Import Pattern

### Web App (`apps/web/src/styles.css`)
```css
@import 'tailwindcss';

/* Cross-platform tokens */
@import '../../../packages/core/src/styles/theme.css';

/* Web-specific styles */
@import '../../../packages/core/src/styles/web.css';
```

### Native App (`apps/native/src/global.css`)
```css
@import 'tailwindcss';
@import 'uniwind';

/* Cross-platform tokens ONLY */
@import '../../../packages/core/src/styles/theme.css';
```

## React Native Limitations

UniWind doesn't support these CSS features:
- ❌ Hover states → Use `<Pressable>` with `onPressIn`/`onPressOut`
- ❌ Grid layouts → Use `flex` instead
- ❌ Animations → Use `react-native-reanimated`
- ❌ Pseudo-elements → Use separate `<View>` components
- ❌ Media queries → Use `Platform.OS` or `useWindowDimensions()`

## Platform-Specific Variants

UniWind provides platform prefixes:
```tsx
<View className="ios:pt-12 android:pt-8 web:pt-4">
  {/* Different padding per platform */}
</View>
```

## Adding New Tokens

### Cross-Platform Token (goes in theme.css)
```css
@theme {
  /* Add to theme.css if it works on both platforms */
  --color-brand-purple: #5B6EF5;
  --spacing-custom: 2.5rem;
}
```

### Web-Only Style (goes in web.css)
```css
/* Add to web.css if it uses hover, animations, etc. */
.custom-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(91, 110, 245, 0.3);
}
```

## Color Palette Reference

### Semantic Colors
- **Primary:** Purple Blue (`#5B6EF5`) - Main brand color
- **Success/Income:** Emerald Green (`#10b981`) - Positive actions
- **Danger/Expense:** Rose (`#f43f5e`) - Negative actions, destructive
- **Warning:** Amber (`#f59e0b`) - Alerts, cautions
- **Info:** Cyan (`#06b6d4`) - Informational messages

### Surface/Gray (Dark Theme Optimized)
- `surface-50` to `surface-200`: Light text on dark backgrounds
- `surface-700` to `surface-950`: Dark backgrounds, cards, borders

## Component Patterns

### Shared Component (works everywhere)
```tsx
// TestButton.tsx (can be in packages/core)
export const TestButton = ({ variant }) => (
  <Pressable className={`
    rounded-lg px-6 py-3
    ${variant === 'primary' ? 'bg-primary-600' : 'bg-surface-700'}
  `}>
    <Text className="text-white font-semibold">Click me</Text>
  </Pressable>
);
```

### Web-Specific Component
```tsx
// WebButton.tsx (only in apps/web)
export const WebButton = () => (
  <button className="btn-gradient hover:scale-105 animate-fade-in">
    Click me
  </button>
);
```

## Best Practices

1. ✅ Always add universally supported tokens to `theme.css`
2. ✅ Test new tokens on both web and native before committing
3. ✅ Use platform variants (`ios:`, `android:`, `web:`) for platform-specific adjustments
4. ✅ Prefer Tailwind utility classes over custom CSS
5. ❌ Don't add hover states to shared components
6. ❌ Don't import `web.css` in React Native apps
7. ❌ Don't use grid layouts in shared components

## Migration from Old Kakeibo Project

When migrating styles from `/home/ashish/projects/kakeibo`:

1. **Check if cross-platform compatible:**
   - Colors, spacing, typography, shadows → `theme.css`
   - Basic border radius, z-index → `theme.css`

2. **Move web-specific features:**
   - Hover effects, animations, keyframes → `web.css`
   - Backdrop filters, scrollbar styles → `web.css`
   - Media queries, pseudo-elements → `web.css`

3. **Test on both platforms:**
   - Run `yarn dev` in `apps/web`
   - Run `yarn ios` or `yarn android` in `apps/native`
   - Verify POC buttons render identically

## Questions?

- **Q: Can I use custom fonts on both platforms?**
  - A: Yes, but they must be loaded differently. Web uses `@font-face`, native needs `react-native.config.js`.

- **Q: Do shadows work on React Native?**
  - A: Yes, but they're rendered differently. Use shadow tokens from `theme.css`.

- **Q: Can I use opacity in colors?**
  - A: Yes, use `bg-primary-600/50` for 50% opacity on both platforms.

- **Q: What about dark mode?**
  - A: Tailwind v4 dark mode variants work: `dark:bg-surface-900`.

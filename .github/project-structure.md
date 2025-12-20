# Kakeibo v2 - Development Guide

## Project Overview

**Kakeibo v2** is a cross-platform personal finance management app built with a modern monorepo architecture using Turborepo, supporting both web (React) and mobile (React Native) platforms with shared business logic.

## Project Structure

```
kakeibo-v2/
├── apps/
│   ├── web/              # @kakeibo/web - React web app (Vite + TanStack Router)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── routes/
│   │   │   ├── main.tsx
│   │   │   └── styles.css
│   │   └── vite.config.ts
│   │
│   └── native/           # @kakeibo/native - React Native mobile app
│       ├── src/
│       │   ├── global.css
│       │   └── uniwind-types.d.ts
│       ├── App.tsx
│       ├── babel.config.js
│       └── metro.config.js
│
└── packages/
    └── core/             # @kakeibo/core - Shared logic, types, state
        └── src/
            ├── styles/   # Shared design tokens
            │   ├── theme.css  # Cross-platform tokens
            │   └── web.css    # Web-only styles
            └── index.ts
```

## Tech Stack

### Core

- **Monorepo:** Turborepo ^2.6.3 with smart caching
- **Package Manager:** Yarn ^4.7.0 (via Corepack)
- **TypeScript:** ^5.9.3 across all packages
- **Linting/Formatting:** Biome ^2.3.10 (fast Rust-based)
- **Git Hooks:** Lefthook ^2.0.12
- **Commit Lint:** Commitlint ^20.2.0 (conventional commits)
- **Versioning:** Changesets ^2.29.8

### Web App (@kakeibo/web)

- **Framework:** React ^19.2.0
- **Build Tool:** Vite ^7.1.7
- **Routing:** TanStack Router ^1.132.0
- **Styling:** Tailwind CSS ^4.0.6
- **Icons:** Lucide React ^0.545.0
- **Testing:** Vitest ^3.0.5 + Testing Library ^16.2.0

### Native App (@kakeibo/native)

- **Framework:** React Native ^0.83.1
- **Styling:** Tailwind CSS ^4.1.18 + UniWind ^1.2.2
- **Safe Areas:** react-native-safe-area-context ^5.5.2
- **Module Resolution:** babel-plugin-module-resolver ^5.0.2

### Shared Core (@kakeibo/core)

- **State Management:** Zustand ^5.0.9
- **Validation:** Zod ^4.2.1
- **Date Utils:** date-fns ^4.1.0

## Path Aliases

All apps and packages use `~` for path aliases:

```typescript
// Import from local src
import { Button } from '~/components/Button';
import { useAuth } from '~/hooks/useAuth';

// Import from core package
import { store } from '@kakeibo/core';
```

**Configuration:**

- **TypeScript:** `"~/*": ["./src/*"]` in tsconfig.json
- **Web (Vite):** Configured in vite.config.ts with fileURLToPath
- **Native (Metro):** Configured in metro.config.js + babel.config.js

## Styling System

### Cross-Platform Tokens

Shared design tokens in `packages/core/src/styles/theme.css`:

- **Colors:** primary, success, danger, warning, info, surface
- **Spacing:** 0 to 96 (0px to 384px)
- **Border Radius:** none to 3xl
- **Font Sizes:** xs to 9xl
- **Shadows:** sm to 2xl
- **Uses OKLCH:** Better perceptual uniformity

### Platform-Specific

- **Web:** Import `theme.css` + `web.css` (animations, hover states)
- **Native:** Import `theme.css` only via UniWind

### Key Patterns

```css
/* Primary color scale */
--color-primary-500: oklch(0.57 0.22 265);

/* Success (income) */
--color-success-500: oklch(0.65 0.18 160);

/* Danger (expense) */
--color-danger-500: oklch(0.59 0.22 10);

/* Dark surfaces */
--color-surface-800: oklch(0.20 0 0);
--color-surface-900: oklch(0.13 0 0);
```

## Code Standards

### Biome Configuration

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "quoteStyle": "single",
    "trailingCommas": "es5",
    "semicolons": "always"
  },
  "assist": {
    "actions": {
      "source": { "organizeImports": "on" }
    }
  }
}
```

### Rules

- ✅ Single quotes for strings
- ✅ 2-space indentation
- ✅ 100 character line width
- ✅ Semicolons required
- ✅ Auto-organize imports (Node.js imports first)
- ✅ No unused variables (error)
- ✅ Avoid explicit `any` (warn)
- ✅ Use `node:` protocol for Node.js builtins (`node:path`, `node:url`)

## Commit Convention

Format: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert  
**Scopes:** core, web, mobile, deps, config, release

**Examples:**

```bash
feat(web): add transaction list page
fix(mobile): resolve SafeArea padding issue
chore(deps): upgrade React to 19.2.0
refactor(core): extract validation to Zod schemas
```

## Git Hooks (Lefthook)

**Pre-commit:**

- `yarn run format` - Auto-format with Biome
- `yarn run lint` - Lint all packages via Turbo

**Commit-msg:**

- `npx commitlint` - Validate conventional commits

## Scripts

### Development

```bash
yarn dev              # Start all apps in dev mode
yarn dev:web          # Web app only (http://localhost:3000)
yarn dev:native       # Metro bundler only
yarn android          # Run Android app
yarn ios              # Run iOS app
```

### Building

```bash
yarn build            # Build all packages (Turbo cached)
yarn build:core       # Build core package only
yarn build:web        # Build web app only
```

### Quality

```bash
yarn type-check       # TypeScript check all packages
yarn lint             # Lint all (Biome + Turbo)
yarn format           # Format all files
yarn clean            # Clean build artifacts + cache
```

### Versioning

```bash
yarn changeset        # Create a changeset
yarn version          # Bump versions from changesets
yarn release          # Build + publish packages
```

## Turborepo Tasks

Configured in `turbo.json`:

- **build:** Cached, depends on `^build` (upstream packages)
- **dev/start/android/ios:** Not cached, persistent
- **type-check/lint:** Cached, depends on `^build`
- **clean:** Not cached

## Best Practices

### Import Order

Biome auto-organizes imports:

1. Node.js builtins (`node:url`, `node:path`)
2. External packages (`react`, `zustand`)
3. Internal aliases (`~/components`, `@kakeibo/core`)

### Component Patterns

```tsx
// Web component example
import { Link } from '@tanstack/react-router';
import { Home } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="p-4 bg-surface-800">
      <Link to="/" className="flex items-center gap-2">
        <Home size={24} />
        <span>Home</span>
      </Link>
    </nav>
  );
}
```

```tsx
// Native component example
import { Text, View } from 'react-native';

export function Card() {
  return (
    <View className="p-4 bg-surface-800 rounded-xl">
      <Text className="text-surface-50 text-lg">Card Title</Text>
    </View>
  );
}
```

### State Management

Use Zustand from `@kakeibo/core`:

```typescript
import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Validation

Use Zod schemas from `@kakeibo/core`:

```typescript
import { z } from 'zod';

const TransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.date(),
});

type Transaction = z.infer<typeof TransactionSchema>;
```

## Testing

**Web (Vitest):**

```bash
cd apps/web
yarn test
```

**Native (Jest):**

```bash
cd apps/native
yarn test
```

## Environment Requirements

- Node.js >= 20
- Yarn >= 4 (via Corepack)
- For mobile: Android Studio / Xcode

## Key Files

- **turbo.json** - Turborepo pipeline config
- **biome.json** - Linting/formatting rules
- **lefthook.yml** - Git hooks
- **commitlint.config.js** - Commit message rules
- **packages/core/src/styles/theme.css** - Design tokens

## DO's

✅ Use `~` path alias for local imports  
✅ Import shared tokens from `@kakeibo/core`  
✅ Use Tailwind classes with design system tokens  
✅ Run `yarn lint` before committing (auto via Lefthook)  
✅ Write conventional commits with proper scopes  
✅ Use Zustand for state, Zod for validation  
✅ Import Node.js builtins with `node:` protocol  
✅ Run Turbo commands from root for caching benefits  

## DON'Ts

❌ Don't import web-only styles in React Native  
❌ Don't use hover states in shared components  
❌ Don't hardcode colors - use design tokens  
❌ Don't bypass git hooks (they enforce quality)  
❌ Don't use `npm` - always use `yarn`  
❌ Don't import from `src` directly - use `~` alias  
❌ Don't commit without running type-check  
❌ Don't use inline styles - prefer Tailwind classes

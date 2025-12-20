# Kakeibo Finance

A cross-platform personal finance management app built with a modern monorepo architecture.

## 📦 Structure

### Apps

**@kakeibo/web** - Web application with TanStack Router
- **React** ^19.2.3
- **TanStack Router** ^1.132.0
- **Vite** ^7.3.0

**@kakeibo/native** - React Native mobile application
- **React Native** ^0.83.1
- Full native support (Android & iOS)

### Packages

**@kakeibo/core** - Shared business logic, types, and state management
- **Zustand** ^5.0.9 - State management
- **Zod** ^4.2.1 - Schema validation
- **date-fns** ^4.1.0 - Date utilities

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Corepack enabled (comes with Node.js 20+)
- For mobile: Android Studio / Xcode

### Installation

```bash
# Enable Corepack (one-time setup)
corepack enable

# Install dependencies
yarn install

# Start development
yarn dev:web      # Web app (http://localhost:3000)
yarn dev:native   # Mobile (Metro bundler)
```

### Mobile Setup

**Android:**

```bash
cd apps/native
yarn android
```

**iOS:**

```bash
cd apps/native
yarn ios
```

## 🛠️ Tech Stack

- **Yarn** ^4.7.0 - Package manager with Corepack
- **Turborepo** ^2.6.3 - Monorepo orchestration with smart caching
- **TypeScript** ^5.9.3 - Type safety across all packages
- **Biome** ^2.3.10 - Fast linting and formatting
- **Lefthook** ^2.0.12 - Git hooks for quality checks
- **Commitlint** ^20.2.0 - Conventional commit enforcement
- **Changesets** ^2.29.8 - Version management and changelogs

## 📝 Available Scripts

### Development

```bash
yarn dev:web      # Start web dev server
yarn dev:native   # Start Metro bundler
yarn android      # Run Android app
yarn ios          # Run iOS app
```

### Building

```bash
yarn build        # Build all packages
yarn build:core   # Build core library only
yarn build:web    # Build web app only
```

### Quality Checks

```bash
yarn type-check   # TypeScript type checking
yarn lint         # Lint all packages with Biome
yarn format       # Format code with Biome
yarn clean        # Clean build artifacts
```

### Testing

```bash
yarn test         # Run all tests
```

### Versioning & Release

```bash
yarn changeset    # Create a new changeset
yarn version      # Bump versions based on changesets
yarn release      # Build and publish packages
```

## 🏗️ Project Structure

```
kakeibo-v2/
├── apps/
│   ├── web/               # Web application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── native/            # React Native app
│       ├── android/       # Android native code
│       ├── ios/           # iOS native code
│       └── package.json
├── packages/
│   └── core/              # Shared business logic
│       ├── src/
│       ├── dist/          # Compiled output
│       └── package.json
├── turbo.json             # Turborepo configuration
├── biome.json             # Biome linter/formatter config
├── lefthook.yml           # Git hooks configuration
└── package.json           # Root workspace config
```

## 📋 Commit Convention

Format: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert  
**Scopes:** core, web, native, deps, config, release

Examples:

- `feat(web): add transaction filtering`
- `fix(native): resolve navigation crash`
- `chore(deps): update dependencies`

## 📄 License

MIT

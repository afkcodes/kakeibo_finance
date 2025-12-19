# Kakeibo Finance

A cross-platform personal finance management app built with a modern monorepo architecture.

## 📦 Packages

### @kakeibo/core
Shared business logic, types, and state management
- **Zustand** ^5.0.9 - State management
- **Zod** ^4.2.1 - Schema validation
- **date-fns** ^4.1.0 - Date utilities

### @kakeibo/web
Web application with TanStack Router
- **React** ^19.2.3
- **TanStack Router** ^1.132.0
- **Vite** ^7.3.0

### @kakeibo/mobile
React Native mobile application
- **React Native** ^0.83.1
- Full native support (Android & iOS)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- pnpm 9.15.0+
- For mobile: Android Studio / Xcode

### Installation

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev:web      # Web app (http://localhost:3000)
pnpm dev:mobile   # Mobile (Metro bundler)
```

### Mobile Setup

**Android:**
```bash
cd packages/mobile
pnpm android
```

**iOS:**
```bash
cd packages/mobile
pnpm ios
```

## 🛠️ Tech Stack

- **Turborepo** ^2.6.3 - Monorepo orchestration with smart caching
- **TypeScript** ^5.9.3 - Type safety across all packages
- **Biome** ^2.3.10 - Fast linting and formatting
- **Lefthook** ^2.0.12 - Git hooks for quality checks
- **Commitlint** ^20.2.0 - Conventional commit enforcement
- **Changesets** ^2.29.8 - Version management and changelogs

## 📝 Available Scripts

### Development

```bash
pnpm dev:web      # Start web dev server
pnpm dev:mobile   # Start Metro bundler
```

### Building

```bash
pnpm build        # Build all packages
pnpm build:core   # Build core library only
```

### Quality Checks

```bash
pnpm type-check   # TypeScript type checking
pnpm lint         # Lint all packages with Biome
```

### Testing

```bash
pnpm test         # Run all tests
pnpm test:web     # Web tests only
pnpm test:mobile  # Mobile tests only
```

### Versioning & Release

```bash
pnpm changeset    # Create a new changeset
pnpm version      # Bump versions based on changesets
```

## 🏗️ Project Structure

```
kakeibo-v2/
├── packages/
│   ├── core/              # Shared business logic
│   │   ├── src/
│   │   ├── dist/          # Compiled output
│   │   └── package.json
│   ├── web/               # Web application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── mobile/            # React Native app
│       ├── src/
│       ├── android/       # Android native code
│       ├── ios/           # iOS native code
│       └── package.json
├── turbo.json            # Turborepo configuration
├── biome.json            # Biome linter/formatter config
├── lefthook.yml          # Git hooks configuration
└── pnpm-workspace.yaml   # Workspace definition
```

## 📋 Commit Convention

Format: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert  
**Scopes:** core, web, mobile, deps, config, release

Examples:
- `feat(web): add transaction filtering`
- `fix(mobile): resolve navigation crash`
- `chore(deps): update dependencies`

## 📄 License

MIT

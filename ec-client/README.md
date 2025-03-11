# E-Commerce Client Application

This is the frontend for the e-commerce application, built with Next.js, TypeScript, Apollo Client for GraphQL, and Styled Components.

## Features

- User Authentication (login, register, profile management)
- Product Catalog with search, filtering, and sorting
- Shopping Cart functionality
- Wishlist for saving products
- Order Processing and History
- Responsive Design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at http://localhost:3000.

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Start Storybook (component development)
npm run storybook

# Build Storybook
npm run build-storybook
```

## Code Quality Tools

### ESLint

ESLint is configured with rules for:

- React best practices
- TypeScript validation
- Accessibility (a11y)
- Import organization
- Next.js optimizations

To run ESLint:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

### Prettier

Prettier is used for consistent code formatting. The configuration can be found in `.prettierrc`.

To format all files:

```bash
npm run format
```

### Husky and lint-staged

The project uses Husky to run pre-commit hooks, and lint-staged to run linters on staged files before committing:

- ESLint runs on all staged JavaScript and TypeScript files
- Prettier formats all staged files

This ensures that all committed code follows the project's coding standards.

## Testing

The project uses Jest and React Testing Library for testing. Test files are co-located with the component files with a `.test.tsx` extension.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
  ├── components/      # Reusable components
  │   ├── layout/      # Layout components
  │   ├── products/    # Product-related components
  │   └── ui/          # Basic UI components
  ├── contexts/        # React Context providers
  ├── graphql/         # GraphQL queries and mutations
  │   ├── mutations/   # GraphQL mutations
  │   └── queries/     # GraphQL queries
  ├── hooks/           # Custom React hooks
  ├── lib/             # Library code (e.g., Apollo client)
  ├── pages/           # Next.js pages
  ├── styles/          # Global styles and theme
  ├── types/           # TypeScript type definitions
  └── utils/           # Utility functions
```

## Styling

The application uses Styled Components for styling, with a theme defined in `src/styles/theme.ts`.

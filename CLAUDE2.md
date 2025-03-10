Thank you for implementing the initial setup of the e-commerce backend with GraphQL and Prisma. I've successfully run the GraphQL server using docker-compose and verified it's working at http://localhost:4000/graphql.

Now I need you to implement the remaining parts of the project as outlined in our original requirements. Please focus on the following components:

## 1. Frontend (Next.js) Implementation
- Set up a Next.js project with TypeScript
- Implement Apollo Client configuration
- Create the basic page structure:
  - Homepage with featured products
  - Product listing page with filtering/sorting
  - Product detail page
  - Shopping cart
  - Checkout flow
  - User profile/dashboard
  - Admin dashboard

## 2. UI Components & Styling
- Set up styled-components
- Implement a component library with basic elements (buttons, cards, forms)
- Configure Storybook for component documentation
- Create responsive layouts for mobile and desktop
- Implement a consistent theme/design system

## 3. Authentication
- Implement user authentication flow (signup, login, forgot password)
- Set up JWT-based auth or AWS Cognito integration
- Create protected routes for user-specific pages
- Implement admin authorization

## 4. Testing Setup
- Configure Jest and React Testing Library
- Write unit tests for key components and utilities
- Set up Cypress for E2E testing
- Implement basic E2E test scenarios (user registration, product browsing, checkout)

## 5. Code Quality & DevOps
- Set up ESLint and Prettier configurations
- Configure Husky for pre-commit hooks
- Create GitHub Actions workflow for CI/CD
- Document the deployment process

Please provide full implementation code, configuration files, and clear documentation for each component. Start with the Next.js frontend setup and Apollo Client integration so I can begin seeing the UI take shape while connecting to the existing GraphQL backend.

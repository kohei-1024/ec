// Import jest-dom
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    return <img {...props} />;
  },
}));

import { formatPrice, formatDate } from './format';

describe('formatPrice', () => {
  it('formats a number as a price with $ and 2 decimal places', () => {
    expect(formatPrice(10)).toBe('$10.00');
    expect(formatPrice(10.5)).toBe('$10.50');
    expect(formatPrice(10.99)).toBe('$10.99');
    expect(formatPrice(10.999)).toBe('$11.00');
  });
});

describe('formatDate', () => {
  it('formats a date string to a human-readable format', () => {
    // Mock Date to ensure consistent testing
    const originalDate = global.Date;

    // Create a fixed date instance before mocking the constructor
    const fixedDate = new originalDate('2023-01-01T00:00:00Z');

    // Mock Date constructor to return the fixed date
    global.Date = jest.fn(() => fixedDate) as any;

    // Test with fixed date
    const formattedDate = formatDate('2023-01-01T00:00:00Z');

    expect(formattedDate).toMatch(/Jan 1, 2023/);

    // Restore the original Date constructor
    global.Date = originalDate;
  });
});

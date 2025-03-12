# Storybook Guide for EC-App

This guide provides information on how to use Storybook in the EC-App project for component development, testing, and documentation.

## What is Storybook?

Storybook is a development environment for UI components. It allows you to browse a component library, view the different states of each component, and interactively develop and test components in isolation.

## Getting Started

### Running Storybook

```bash
# Start Storybook on port 6006
npm run storybook

# Build Storybook static site
npm run build-storybook
```

### Storybook UI

Once running, Storybook provides:

- A navigation sidebar for all component stories
- Canvas area for viewing components
- Controls panel for manipulating component props
- Docs tab for component documentation
- Additional addons for accessibility testing, responsive views, etc.

## Creating Stories

Stories are organized by component and placed alongside the component files. Each component should have a corresponding `.stories.tsx` file.

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import YourComponent from './YourComponent';

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
  },
  tags: ['autodocs'], // Enable auto-generated docs
  argTypes: {
    // Define props controls
    propName: {
      control: 'text', // or 'select', 'boolean', etc.
      description: 'Description of this prop',
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    propName: 'value',
  },
};

// Variant story
export const WithSpecialFeature: Story = {
  args: {
    propName: 'specialValue',
    specialFeature: true,
  },
};
```

## Project Structure

Stories are organized into categories such as:

- `UI/` - Basic UI components like Button, Card, TextField
- `Layout/` - Layout components like Header, Footer
- `Products/` - Product-related components
- `Forms/` - Form components and patterns

## Best Practices

1. **Write a variety of stories for each component:**

   - Default/basic usage
   - Different variations based on props
   - Edge cases (long text, empty states, error states)

2. **Keep stories simple and focused:**

   - Each story should demonstrate one specific state or feature
   - Use clear, descriptive story names

3. **Use proper documentation:**

   - Add descriptions to components and their props
   - Include usage examples in the documentation

4. **Test accessibility:**

   - Use the accessibility addon to catch issues
   - Ensure components meet WCAG standards

5. **Test responsiveness:**
   - Use the viewport addon to test different screen sizes
   - Create responsive-specific stories when needed

## Mocks and Decorators

We use several mocks to handle Next.js specific features:

- `nextImage.js` - Mocks Next.js Image component
- Router mock in `preview.js` - Mocks Next.js router
- Context providers in `preview.js` - Wraps all stories with necessary providers

## Adding New Components

When adding new components:

1. Create your component file
2. Create the corresponding `.stories.tsx` file
3. Define basic and variant stories
4. Add proper documentation and prop controls
5. Test across different viewports and for accessibility

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Component-Driven Development](https://www.componentdriven.org/)
- [Storybook Addons](https://storybook.js.org/addons/)

import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    // The Header is full-width, so use a different layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default header state
export const Default: Story = {
  render: () => <Header />,
};

// Render the Header with a note about its mobile functionality
export const WithStoryDescription: Story = {
  render: () => (
    <div>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Header Component</h2>
        <p>
          This header component adapts to different screen sizes. On mobile devices, the navigation
          links collapse into a hamburger menu that can be toggled open and closed.
        </p>
        <p>The header includes:</p>
        <ul>
          <li>A logo that links to the home page</li>
          <li>Main navigation links (Home, Products, Categories, About)</li>
          <li>
            Action icons for Cart, Wishlist, and Profile with badge indicators for non-empty carts
            and wishlists
          </li>
          <li>Responsive design with a mobile menu for smaller screens</li>
        </ul>
        <p>
          <strong>Note:</strong> Try resizing your browser window to see how the header adapts to
          different screen sizes.
        </p>
      </div>
    </div>
  ),
};

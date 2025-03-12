import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from './ProductCard';
import { Product } from '@/types/models';

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Premium Headphones',
  description:
    'High-quality wireless headphones with noise cancellation and premium sound quality. Great for music, gaming, and video calls.',
  price: 199.99,
  stock: 25,
  images: ['https://via.placeholder.com/300x200?text=Headphones'],
  category: {
    id: '101',
    name: 'Electronics',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta = {
  title: 'Products/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    product: {
      description: 'Product data',
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const WithLongDescription: Story = {
  args: {
    product: {
      ...mockProduct,
      description:
        'These premium wireless headphones feature active noise cancellation, 30-hour battery life, premium sound quality with deep bass and crisp highs, comfortable memory foam ear cups, and a sleek design. Perfect for travel, work, or relaxation, they also include a built-in microphone for calls and voice assistant support.',
    },
  },
};

export const WithLongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Ultra Premium Professional Studio Quality Noise Cancelling Wireless Headphones',
    },
  },
};

export const LowStock: Story = {
  args: {
    product: {
      ...mockProduct,
      stock: 2,
    },
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      stock: 0,
    },
  },
};

export const HighPrice: Story = {
  args: {
    product: {
      ...mockProduct,
      price: 999.99,
    },
  },
};

export const WithMultipleImages: Story = {
  args: {
    product: {
      ...mockProduct,
      images: [
        'https://via.placeholder.com/300x200?text=Headphones+1',
        'https://via.placeholder.com/300x200?text=Headphones+2',
        'https://via.placeholder.com/300x200?text=Headphones+3',
      ],
    },
  },
};

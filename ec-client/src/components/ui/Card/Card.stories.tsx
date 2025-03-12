import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import styled from 'styled-components';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Card shadow elevation',
    },
    padding: {
      control: 'boolean',
      description: 'Whether card has padding',
    },
    onClick: { action: 'clicked' },
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
`;

const CardText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray};
`;

export const Default: Story = {
  args: {
    elevation: 'low',
    padding: true,
    children: (
      <CardContent>
        <CardTitle>Card Title</CardTitle>
        <CardText>
          This is a simple card component with default styling. It has some text content and uses
          the "low" elevation shadow.
        </CardText>
      </CardContent>
    ),
  },
};

export const MediumElevation: Story = {
  args: {
    elevation: 'medium',
    padding: true,
    children: (
      <CardContent>
        <CardTitle>Medium Elevation</CardTitle>
        <CardText>
          This card has a medium elevation shadow, giving it a more pronounced appearance than the
          low elevation card.
        </CardText>
      </CardContent>
    ),
  },
};

export const HighElevation: Story = {
  args: {
    elevation: 'high',
    padding: true,
    children: (
      <CardContent>
        <CardTitle>High Elevation</CardTitle>
        <CardText>
          This card has a high elevation shadow, making it stand out the most. Use this for
          important content or dialogs.
        </CardText>
      </CardContent>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    elevation: 'low',
    padding: false,
    children: (
      <div>
        <img
          src="https://via.placeholder.com/400x200"
          alt="Placeholder"
          style={{ borderRadius: '8px 8px 0 0', width: '100%', display: 'block' }}
        />
        <div style={{ padding: '1rem' }}>
          <CardTitle>Card Without Padding</CardTitle>
          <CardText style={{ marginTop: '0.5rem' }}>
            This card has padding set to false, allowing content like images to extend to the edges.
            Individual elements can apply their own padding as needed.
          </CardText>
        </div>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    elevation: 'low',
    padding: true,
    onClick: () => alert('Card clicked!'),
    children: (
      <CardContent>
        <CardTitle>Clickable Card</CardTitle>
        <CardText>
          This card has an onClick handler, making it clickable. The cursor will change to a pointer
          when hovering over the card, and the shadow will increase slightly to indicate it's
          interactive.
        </CardText>
      </CardContent>
    ),
  },
};

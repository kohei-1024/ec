import React from 'react';

export default {
  title: 'Example/SimpleButton',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    onClick: { action: 'clicked' },
  },
};

// Create Button component using standard JS without JSX
function SimpleButton({ label, backgroundColor, size, onClick }) {
  const style = {
    backgroundColor,
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
  };

  return React.createElement(
    'button',
    {
      onClick: onClick,
      style: style,
    },
    label
  );
}

export const Primary = {
  render: args => SimpleButton(args),
  args: {
    label: 'Button',
    backgroundColor: '#3f51b5',
    size: 'medium',
  },
};

export const Secondary = {
  render: args => SimpleButton(args),
  args: {
    label: 'Secondary Button',
    backgroundColor: '#f50057',
    size: 'medium',
  },
};

export const Large = {
  render: args => SimpleButton(args),
  args: {
    label: 'Large Button',
    backgroundColor: '#3f51b5',
    size: 'large',
  },
};

export const Small = {
  render: args => SimpleButton(args),
  args: {
    label: 'Small Button',
    backgroundColor: '#3f51b5',
    size: 'small',
  },
};

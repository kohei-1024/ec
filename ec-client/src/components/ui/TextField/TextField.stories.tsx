import type { Meta, StoryObj } from '@storybook/react';
import TextField from './TextField';
import { Mail, Lock, Search as SearchIcon, Eye, EyeOff } from 'react-feather';
import { useState } from 'react';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label text',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether text field takes full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether text field is disabled',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'Input type',
    },
    startIcon: {
      description: 'Icon at the start of the input',
    },
    endIcon: {
      description: 'Icon at the end of the input',
    },
    onChange: { action: 'changed' },
  },
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    placeholder: 'example@email.com',
    type: 'email',
    startIcon: <Mail size={18} />,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    startIcon: <Lock size={18} />,
    endIcon: <Eye size={18} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'example@email.com',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
    startIcon: <Mail size={18} />,
  },
};

export const SearchField: Story = {
  args: {
    placeholder: 'Search...',
    startIcon: <SearchIcon size={18} />,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    value: 'johndoe',
    disabled: true,
  },
};

// Example of a more complex story with state
export const PasswordWithToggle: Story = {
  render: function Render(args) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
      <TextField
        {...args}
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        startIcon={<Lock size={18} />}
        endIcon={
          <div style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        }
      />
    );
  },
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

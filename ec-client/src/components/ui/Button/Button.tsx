import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// This is now a function that returns a function that takes the props
const getButtonStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return (props: any) => css`
        background-color: ${props.theme.colors.primary};
        color: ${props.theme.colors.light};
        &:hover {
          background-color: ${darken(props.theme.colors.primary, 0.1)};
        }
        &:active {
          background-color: ${darken(props.theme.colors.primary, 0.2)};
        }
      `;
    case 'secondary':
      return (props: any) => css`
        background-color: ${props.theme.colors.secondary};
        color: ${props.theme.colors.light};
        &:hover {
          background-color: ${darken(props.theme.colors.secondary, 0.1)};
        }
        &:active {
          background-color: ${darken(props.theme.colors.secondary, 0.2)};
        }
      `;
    case 'outlined':
      return (props: any) => css`
        background-color: transparent;
        color: ${props.theme.colors.primary};
        border: 1px solid ${props.theme.colors.primary};
        &:hover {
          background-color: rgba(63, 81, 181, 0.08);
        }
        &:active {
          background-color: rgba(63, 81, 181, 0.16);
        }
      `;
    case 'text':
      return (props: any) => css`
        background-color: transparent;
        color: ${props.theme.colors.primary};
        &:hover {
          background-color: rgba(63, 81, 181, 0.08);
        }
        &:active {
          background-color: rgba(63, 81, 181, 0.16);
        }
      `;
    default:
      return (props: any) => css`
        background-color: ${props.theme.colors.primary};
        color: ${props.theme.colors.light};
      `;
  }
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return (props: any) => css`
        padding: ${props.theme.spacing.xs} ${props.theme.spacing.md};
        font-size: ${props.theme.fontSizes.sm};
      `;
    case 'medium':
      return (props: any) => css`
        padding: ${props.theme.spacing.sm} ${props.theme.spacing.lg};
        font-size: ${props.theme.fontSizes.md};
      `;
    case 'large':
      return (props: any) => css`
        padding: ${props.theme.spacing.md} ${props.theme.spacing.xl};
        font-size: ${props.theme.fontSizes.lg};
      `;
    default:
      return (props: any) => css`
        padding: ${props.theme.spacing.sm} ${props.theme.spacing.lg};
        font-size: ${props.theme.fontSizes.md};
      `;
  }
};

// Utility function to darken a color
function darken(color: string, amount: number): string {
  // Simple darken implementation
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) * (1 - amount);
    const g = ((num >> 8) & 0x00ff) * (1 - amount);
    const b = (num & 0x0000ff) * (1 - amount);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }
  return color;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  outline: none;
  border: none;

  /* Apply variant styles */
  ${({ variant = 'primary' }) => getButtonStyles(variant)}

  /* Apply size styles */
  ${({ size = 'medium' }) => getButtonSize(size)}
  
  /* Full width */
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  /* Disabled state */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Loading state */
  ${({ isLoading }) =>
    isLoading &&
    css`
      position: relative;
      color: transparent;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1em;
        height: 1em;
        margin-left: -0.5em;
        margin-top: -0.5em;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-color: transparent transparent currentColor currentColor;
        animation: button-loading-spinner 0.8s linear infinite;
      }

      @keyframes button-loading-spinner {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
    `}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth,
  isLoading,
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      {...rest}
    >
      {startIcon && !isLoading && <span className="button-start-icon">{startIcon}</span>}
      {children}
      {endIcon && !isLoading && <span className="button-end-icon">{endIcon}</span>}
    </StyledButton>
  );
};

export default Button;

import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray};

  &.start-icon {
    left: ${({ theme }) => theme.spacing.md};
  }

  &.end-icon {
    right: ${({ theme }) => theme.spacing.md};
  }
`;

const StyledInput = styled.input<{ error?: string; hasStartIcon?: boolean; hasEndIcon?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.lightGray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.light};
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary)};
    box-shadow: 0 0 0 1px
      ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
  }

  ${({ hasStartIcon, theme }) =>
    hasStartIcon &&
    css`
      padding-left: ${theme.spacing.xxl};
    `}

  ${({ hasEndIcon, theme }) =>
    hasEndIcon &&
    css`
      padding-right: ${theme.spacing.xxl};
    `}
    
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, fullWidth, startIcon, endIcon, ...rest }, ref) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <div style={{ position: 'relative' }}>
          {startIcon && <IconWrapper className="start-icon">{startIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            error={error}
            hasStartIcon={!!startIcon}
            hasEndIcon={!!endIcon}
            {...rest}
          />
          {endIcon && <IconWrapper className="end-icon">{endIcon}</IconWrapper>}
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;

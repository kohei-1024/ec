import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  padding?: boolean;
  onClick?: () => void;
  className?: string;
}

const getShadow = (elevation: CardProps['elevation'], theme: any) => {
  switch (elevation) {
    case 'low':
      return theme.shadows.sm;
    case 'medium':
      return theme.shadows.md;
    case 'high':
      return theme.shadows.lg;
    default:
      return theme.shadows.sm;
  }
};

const StyledCard = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ elevation, theme }) => getShadow(elevation, theme)};
  padding: ${({ padding, theme }) => (padding ? theme.spacing.lg : 0)};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover {
    box-shadow: ${({ onClick, elevation, theme }) =>
      onClick
        ? getShadow(elevation === 'high' ? 'high' : 'medium', theme)
        : getShadow(elevation, theme)};
  }
`;

const Card: React.FC<CardProps> = ({
  children,
  elevation = 'low',
  padding = true,
  onClick,
  className,
}) => {
  return (
    <StyledCard elevation={elevation} padding={padding} onClick={onClick} className={className}>
      {children}
    </StyledCard>
  );
};

export default Card;

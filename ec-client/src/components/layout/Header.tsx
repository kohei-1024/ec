import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, ShoppingCart, User } from 'react-feather';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.light};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.navbar};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.light};
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: ${({ theme }) => theme.zIndex.navbar};

  a {
    padding: ${({ theme }) => theme.spacing.md} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

    &:last-child {
      border-bottom: none;
    }
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  text-decoration: none;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { items: wishlistItems } = useWishlist();
  const { cart } = useCart();

  const isActive = (path: string) => router.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <a>
          <Logo>ShopApp</Logo>
        </a>
      </Link>

      <Nav>
        <Link href="/" passHref legacyBehavior>
          <NavLink $active={isActive('/')}>Home</NavLink>
        </Link>
        <Link href="/products" passHref legacyBehavior>
          <NavLink $active={isActive('/products')}>Products</NavLink>
        </Link>
        <Link href="/categories" passHref legacyBehavior>
          <NavLink $active={isActive('/categories')}>Categories</NavLink>
        </Link>
        <Link href="/about" passHref legacyBehavior>
          <NavLink $active={isActive('/about')}>About</NavLink>
        </Link>
      </Nav>

      <ActionsContainer>
        <Link href="/cart" passHref legacyBehavior>
          <IconButton as="a" aria-label="Cart">
            <ShoppingCart size={20} />
            {(cart?.items?.length ?? 0) > 0 && <Badge>{cart?.items?.length ?? 0}</Badge>}
          </IconButton>
        </Link>
        <Link href="/wishlist" passHref legacyBehavior>
          <IconButton as="a" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistItems?.length > 0 && <Badge>{wishlistItems.length}</Badge>}
          </IconButton>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <IconButton as="a" aria-label="Account">
            <User size={20} />
          </IconButton>
        </Link>
      </ActionsContainer>

      <MobileMenuIcon onClick={toggleMobileMenu}>{mobileMenuOpen ? '✕' : '☰'}</MobileMenuIcon>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <Link href="/" passHref legacyBehavior>
          <NavLink $active={isActive('/')}>Home</NavLink>
        </Link>
        <Link href="/products" passHref legacyBehavior>
          <NavLink $active={isActive('/products')}>Products</NavLink>
        </Link>
        <Link href="/categories" passHref legacyBehavior>
          <NavLink $active={isActive('/categories')}>Categories</NavLink>
        </Link>
        <Link href="/about" passHref legacyBehavior>
          <NavLink $active={isActive('/about')}>About</NavLink>
        </Link>
        <Link href="/cart" passHref legacyBehavior>
          <NavLink $active={isActive('/cart')}>Cart</NavLink>
        </Link>
        <Link href="/wishlist" passHref legacyBehavior>
          <NavLink $active={isActive('/wishlist')}>Wishlist</NavLink>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <NavLink $active={isActive('/profile')}>Profile</NavLink>
        </Link>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;

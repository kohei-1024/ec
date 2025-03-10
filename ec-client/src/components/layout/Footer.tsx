import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.lightGray};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.light};
    text-decoration: underline;
  }
`;

const BottomFooter = styled.div`
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Shop</FooterTitle>
          <Link href="/products" passHref legacyBehavior>
            <FooterLink>All Products</FooterLink>
          </Link>
          <Link href="/categories" passHref legacyBehavior>
            <FooterLink>Categories</FooterLink>
          </Link>
          <Link href="/deals" passHref legacyBehavior>
            <FooterLink>Deals & Offers</FooterLink>
          </Link>
          <Link href="/new-arrivals" passHref legacyBehavior>
            <FooterLink>New Arrivals</FooterLink>
          </Link>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Customer Service</FooterTitle>
          <Link href="/contact" passHref legacyBehavior>
            <FooterLink>Contact Us</FooterLink>
          </Link>
          <Link href="/faq" passHref legacyBehavior>
            <FooterLink>FAQ</FooterLink>
          </Link>
          <Link href="/shipping" passHref legacyBehavior>
            <FooterLink>Shipping & Delivery</FooterLink>
          </Link>
          <Link href="/returns" passHref legacyBehavior>
            <FooterLink>Returns & Exchanges</FooterLink>
          </Link>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>About Us</FooterTitle>
          <Link href="/about" passHref legacyBehavior>
            <FooterLink>Our Story</FooterLink>
          </Link>
          <Link href="/blog" passHref legacyBehavior>
            <FooterLink>Blog</FooterLink>
          </Link>
          <Link href="/careers" passHref legacyBehavior>
            <FooterLink>Careers</FooterLink>
          </Link>
          <Link href="/press" passHref legacyBehavior>
            <FooterLink>Press</FooterLink>
          </Link>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <Link href="/terms" passHref legacyBehavior>
            <FooterLink>Terms of Service</FooterLink>
          </Link>
          <Link href="/privacy" passHref legacyBehavior>
            <FooterLink>Privacy Policy</FooterLink>
          </Link>
          <Link href="/cookies" passHref legacyBehavior>
            <FooterLink>Cookie Policy</FooterLink>
          </Link>
          <Link href="/accessibility" passHref legacyBehavior>
            <FooterLink>Accessibility</FooterLink>
          </Link>
        </FooterSection>
      </FooterContent>
      
      <BottomFooter>
        <Copyright>
          &copy; {new Date().getFullYear()} ShopApp. All rights reserved.
        </Copyright>
        <SocialLinks>
          <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            📘
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            🐦
          </SocialLink>
          <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            📷
          </SocialLink>
          <SocialLink href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            📌
          </SocialLink>
        </SocialLinks>
      </BottomFooter>
    </FooterContainer>
  );
};

export default Footer;
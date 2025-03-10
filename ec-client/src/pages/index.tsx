import React from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = styled.section`
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 400px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 300px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  
  img {
    object-fit: cover;
  }
`;

const HeroButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: #2c3e8c;
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeaturedProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  background-color: ${({ theme }) => theme.colors.light};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProductPrice = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  position: relative;
  height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: scale(1.02);
  }
`;

const CategoryImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  
  img {
    object-fit: cover;
  }
`;

const CategoryTitle = styled.h3`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.light};
  z-index: 1;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 -${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.light};
`;

const CTATitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CTAText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
    transform: translateY(-2px);
  }
`;

// Mock data for now - in a real app, this would come from API
const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    image: 'https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Headphones'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Smart+Watch'
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Speaker'
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Laptop+Stand'
  }
];

const categories = [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://placehold.co/300x200/333333/FFFFFF/png?text=Electronics'
  },
  {
    id: '2',
    name: 'Clothing',
    image: 'https://placehold.co/300x200/333333/FFFFFF/png?text=Clothing'
  },
  {
    id: '3',
    name: 'Home & Garden',
    image: 'https://placehold.co/300x200/333333/FFFFFF/png?text=Home'
  }
];

const Home = () => {
  return (
    <Layout>
      <HeroSection>
        <HeroImage>
          <Image
            src="https://placehold.co/1920x1080/4a6cf7/FFFFFF/png?text=Hero+Image"
            alt="Hero image"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </HeroImage>
        <HeroContent>
          <HeroTitle>Discover Amazing Products</HeroTitle>
          <HeroSubtitle>
            Shop the latest trends with our curated collection of premium products.
          </HeroSubtitle>
          <Link href="/products" passHref legacyBehavior>
            <HeroButton>Shop Now</HeroButton>
          </Link>
        </HeroContent>
      </HeroSection>

      <section>
        <SectionTitle>Featured Products</SectionTitle>
        <FeaturedProducts>
          {featuredProducts.map((product) => (
            <Link 
              href={{
                pathname: '/products/[id]',
                query: { id: product.id }
              }}
              key={product.id}
              legacyBehavior
            >
              <a>
                <ProductCard>
                  <ProductImageContainer>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      style={{ objectFit: "cover" }} 
                    />
                  </ProductImageContainer>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              </a>
            </Link>
          ))}
        </FeaturedProducts>
      </section>

      <section>
        <SectionTitle>Shop by Category</SectionTitle>
        <Categories>
          {categories.map((category) => (
            <Link 
              href={{
                pathname: '/categories/[id]',
                query: { id: category.id }
              }}
              key={category.id} 
              legacyBehavior
            >
              <a>
                <CategoryCard>
                  <CategoryImage>
                    <Image 
                      src={category.image} 
                      alt={category.name} 
                      fill 
                      style={{ objectFit: "cover" }} 
                    />
                  </CategoryImage>
                  <CategoryTitle>{category.name}</CategoryTitle>
                </CategoryCard>
              </a>
            </Link>
          ))}
        </Categories>
      </section>

      <CTASection>
        <CTATitle>Join Our Newsletter</CTATitle>
        <CTAText>
          Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
        </CTAText>
        <Link href="/subscribe" passHref legacyBehavior>
          <CTAButton>Subscribe Now</CTAButton>
        </Link>
      </CTASection>
    </Layout>
  );
};

export default Home;
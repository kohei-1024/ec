import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/models';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

const Card = styled.div`
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

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
`;

const ProductContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProductTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <Link href={`/products/${product.id}`} passHref>
        <a>
          <ImageContainer>
            <Image
              src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </ImageContainer>
        </a>
      </Link>
      
      <ProductContent>
        <Link href={`/products/${product.id}`} passHref>
          <a>
            <ProductTitle>{product.name}</ProductTitle>
          </a>
        </Link>
        
        <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
        
        <ProductDescription>{product.description}</ProductDescription>
        
        <ButtonsContainer>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleAddToCart}
            isLoading={isLoading}
          >
            Add to Cart
          </Button>
          
          <Link href={`/products/${product.id}`} passHref>
            <Button as="a" variant="primary" size="small">
              View Details
            </Button>
          </Link>
        </ButtonsContainer>
      </ProductContent>
    </Card>
  );
};

export default ProductCard;
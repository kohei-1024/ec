import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const WishlistContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const WishlistTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const EmptyWishlist = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const WishlistCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.light};
  transition: ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ClearButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const WishlistPage: React.FC = () => {
  const router = useRouter();
  const { items, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [productId]: true }));
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [`cart-${productId}`]: true }));
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  const handleClearWishlist = async () => {
    try {
      if (confirm('Are you sure you want to clear your wishlist?')) {
        await clearWishlist();
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    }
  };

  return (
    <Layout>
      <WishlistContainer>
        <WishlistTitle>My Wishlist</WishlistTitle>
        
        {items.length === 0 ? (
          <EmptyWishlist>
            <p>Your wishlist is empty.</p>
            <Button 
              variant="primary"
              onClick={() => router.push('/products')}
            >
              Browse Products
            </Button>
          </EmptyWishlist>
        ) : (
          <>
            <ClearButton 
              variant="outlined"
              onClick={handleClearWishlist}
              isLoading={isLoading}
            >
              Clear Wishlist
            </ClearButton>
            
            <WishlistGrid>
              {items.map(product => (
                <WishlistCard key={product.id}>
                  <Link href={`/products/${product.id}`} passHref>
                    <a>
                      <ProductImageContainer>
                        <Image
                          src={product.images[0] || 'https://placehold.co/600x400/eeeeee/999999/png?text=No+Image'}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </ProductImageContainer>
                    </a>
                  </Link>
                  
                  <ProductInfo>
                    <Link href={`/products/${product.id}`} passHref>
                      <a>
                        <ProductName>{product.name}</ProductName>
                      </a>
                    </Link>
                    <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                    
                    <ButtonsContainer>
                      <Button
                        variant="outlined"
                        size="small"
                        isLoading={loadingStates[product.id]}
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        Remove
                      </Button>
                      
                      <Button
                        variant="primary"
                        size="small"
                        isLoading={loadingStates[`cart-${product.id}`]}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Add to Cart
                      </Button>
                    </ButtonsContainer>
                  </ProductInfo>
                </WishlistCard>
              ))}
            </WishlistGrid>
          </>
        )}
      </WishlistContainer>
    </Layout>
  );
};

export default WishlistPage;
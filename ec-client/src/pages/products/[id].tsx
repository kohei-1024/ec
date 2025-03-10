import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { GET_PRODUCT } from '@/graphql/queries/products';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart } from 'react-feather';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Mock data for development
const MOCK_PRODUCTS = {
  '1': {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation technology. Enjoy crystal-clear sound and extended battery life for all-day listening.',
    price: 129.99,
    stock: 15,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Headphones+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Headphones+2',
      'https://placehold.co/600x400/2a4cd7/FFFFFF/png?text=Headphones+3'
    ],
    category: {
      id: '1',
      name: 'Electronics'
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  '2': {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with health monitoring, notifications, and a sleek design. Track your fitness goals and stay connected on the go.',
    price: 199.99,
    stock: 8,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Smart+Watch+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Smart+Watch+2'
    ],
    category: {
      id: '1',
      name: 'Electronics'
    },
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z'
  },
  '3': {
    id: '3',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360° sound and waterproof design. Perfect for outdoor adventures or home use with impressive bass and clarity.',
    price: 79.99,
    stock: 20,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Speaker+1'
    ],
    category: {
      id: '1',
      name: 'Electronics'
    },
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z'
  },
  '4': {
    id: '4',
    name: 'Laptop Stand',
    description: 'Ergonomic laptop stand with adjustable height and angle. Improve your posture and keep your device cool with the ventilated design.',
    price: 49.99,
    stock: 25,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Laptop+Stand+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Laptop+Stand+2'
    ],
    category: {
      id: '3',
      name: 'Home & Garden'
    },
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-04-05T00:00:00Z'
  }
};

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ProductImageSection = styled.div`
  flex: 1;
  position: relative;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 50%;
  }
`;

const MainImageContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    border-color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  }
`;

const ProductInfoSection = styled.div`
  flex: 1;
`;

const Breadcrumbs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const BreadcrumbLink = styled.a`
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const ProductTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProductCategory = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    align-items: center;
  }
`;

const WishlistButton = styled(Button)<{ $isInWishlist: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    transition: all 0.2s ease;
  }
  
  ${({ $isInWishlist, theme }) => $isInWishlist && `
    background-color: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primaryDark};
      border-color: ${theme.colors.primaryDark};
    }
  `}
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StockInfo = styled.div<{ inStock: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 500;
  color: ${({ theme, inStock }) => inStock ? theme.colors.success : theme.colors.error};
`;

const ProductDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const RelatedProducts = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  
  h2 {
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
  }
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // GraphQL query for development with server
  const { data, loading: gqlLoading, error: gqlError } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id || process.env.NODE_ENV === 'development', // Skip in development mode
  });
  
  // Use mock data in development, real data in production
  useEffect(() => {
    if (!id) return;
    
    const getProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In development, use mock data
        if (process.env.NODE_ENV === 'development') {
          const mockProduct = MOCK_PRODUCTS[id as string];
          if (mockProduct) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setProduct(mockProduct);
          } else {
            setError({ message: 'Product not found in mock data' });
          }
        } else {
          // In production, use GraphQL data
          if (data?.product) {
            setProduct(data.product);
          } else if (gqlError) {
            setError(gqlError);
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    getProductData();
  }, [id, data, gqlError]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleWishlistToggle = async () => {
    if (!product) return;
    
    try {
      setIsWishlistLoading(true);
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };
  
  if (loading) return (
    <Layout>
      <div>Loading product information...</div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div>Error loading product: {error.message}</div>
    </Layout>
  );
  
  if (!product) return (
    <Layout>
      <div>Product not found</div>
    </Layout>
  );
  
  const images = product.images || [];
  const inStock = product.stock > 0;
  
  return (
    <Layout>
      <Breadcrumbs>
        <Link href="/" legacyBehavior>
          <a>Home</a>
        </Link>
        <span>/</span>
        <Link href="/products" legacyBehavior>
          <a>Products</a>
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link 
              href={{
                pathname: "/categories/[id]",
                query: { id: product.category.id }
              }}
              legacyBehavior
            >
              <a>{product.category.name}</a>
            </Link>
            <span>/</span>
          </>
        )}
        <span>{product.name}</span>
      </Breadcrumbs>
      
      <ProductContainer>
        <ProductImageSection>
          <MainImageContainer>
            <Image
              src={images[selectedImage] || 'https://placehold.co/600x400/eeeeee/999999/png?text=No+Image'}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </MainImageContainer>
          
          {images.length > 1 && (
            <ThumbnailsContainer>
              {images.map((image, index) => (
                <Thumbnail 
                  key={index} 
                  $active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Thumbnail>
              ))}
            </ThumbnailsContainer>
          )}
        </ProductImageSection>
        
        <ProductInfoSection>
          <ProductTitle>{product.name}</ProductTitle>
          
          {product.category && (
            <ProductCategory>
              Category: {product.category.name}
            </ProductCategory>
          )}
          
          <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
          
          <StockInfo inStock={inStock}>
            {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </StockInfo>
          
          <ProductActions>
            <QuantitySelector>
              <QuantityButton onClick={decreaseQuantity} disabled={quantity <= 1}>
                -
              </QuantityButton>
              <QuantityInput 
                type="number" 
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={product.stock}
              />
              <QuantityButton onClick={increaseQuantity} disabled={quantity >= product.stock}>
                +
              </QuantityButton>
            </QuantitySelector>
            
            <Button 
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              variant="primary"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <WishlistButton 
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              variant="outlined"
              $isInWishlist={isInWishlist(product.id)}
            >
              {isWishlistLoading ? 'Updating...' : (
                <>
                  <Heart 
                    size={16} 
                    fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                  />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </>
              )}
            </WishlistButton>
          </ProductActions>
          
          <ProductDescription>
            <h2>Description</h2>
            <p>{product.description}</p>
          </ProductDescription>
        </ProductInfoSection>
      </ProductContainer>
    </Layout>
  );
};

export default ProductDetailPage;
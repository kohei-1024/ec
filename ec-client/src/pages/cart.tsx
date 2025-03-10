import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const CartContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const CartTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CartEmpty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  color: ${({ theme }) => theme.colors.textLight};
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItems = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const CartItem = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  margin-right: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 120px;
    height: 120px;
  }
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CartItemName = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const CartItemPrice = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 40px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const SummaryTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:last-of-type {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const TotalLabel = styled.span`
  font-weight: 600;
`;

const TotalValue = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContinueShoppingLink = styled.a`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CartPage = () => {
  const { cart, isLoading, error, updateCartItem, removeFromCart, clearCart, totalItems, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState(false);
  
  const TAX_RATE = 0.08; // 8% tax
  const SHIPPING_COST = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;
  
  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));
      await updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };
  
  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    router.push('/checkout');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <CartContainer>
          <CartTitle>Your Cart</CartTitle>
          <div>Loading your cart...</div>
        </CartContainer>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <CartContainer>
          <CartTitle>Your Cart</CartTitle>
          <div>Error loading your cart: {error}</div>
        </CartContainer>
      </Layout>
    );
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <CartContainer>
          <CartTitle>Your Cart</CartTitle>
          <CartEmpty>
            <p>Your cart is empty</p>
            <Link href="/products" passHref legacyBehavior>
              <Button as="a" variant="primary">Start Shopping</Button>
            </Link>
          </CartEmpty>
        </CartContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {processing && (
        <LoadingOverlay>
          <div>Processing your order...</div>
        </LoadingOverlay>
      )}
      
      <CartContainer>
        <CartTitle>Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</CartTitle>
        
        <CartGrid>
          <CartItems>
            {cart.items.map((item) => (
              <CartItem key={item.id}>
                <CartItemImage>
                  <Link 
                    href={{
                      pathname: '/products/[id]',
                      query: { id: item.product.id }
                    }}
                    legacyBehavior
                  >
                    <a>
                      <Image
                        src={item.product.images[0] || 'https://placehold.co/120x120/eeeeee/999999/png?text=No+Image'}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </a>
                  </Link>
                </CartItemImage>
                
                <CartItemDetails>
                  <Link 
                    href={{
                      pathname: '/products/[id]',
                      query: { id: item.product.id }
                    }}
                    legacyBehavior
                  >
                    <a>
                      <CartItemName>{item.product.name}</CartItemName>
                    </a>
                  </Link>
                  <CartItemPrice>${(item.product.price * item.quantity).toFixed(2)}</CartItemPrice>
                  
                  <CartItemActions>
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updating[item.id] || item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityInput 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        min={1}
                        disabled={updating[item.id]}
                      />
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updating[item.id]}
                      >
                        +
                      </QuantityButton>
                    </QuantitySelector>
                    
                    <RemoveButton 
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating[item.id]}
                    >
                      Remove
                    </RemoveButton>
                  </CartItemActions>
                </CartItemDetails>
              </CartItem>
            ))}
          </CartItems>
          
          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Tax (8%)</SummaryLabel>
              <SummaryValue>${tax.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Shipping</SummaryLabel>
              <SummaryValue>
                {SHIPPING_COST === 0 ? 'Free' : `$${SHIPPING_COST.toFixed(2)}`}
              </SummaryValue>
            </SummaryRow>
            
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>${total.toFixed(2)}</TotalValue>
            </TotalRow>
            
            <CheckoutButton 
              variant="primary"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </CheckoutButton>
            
            <Link href="/products" passHref legacyBehavior>
              <ContinueShoppingLink>Continue Shopping</ContinueShoppingLink>
            </Link>
          </CartSummary>
        </CartGrid>
      </CartContainer>
    </Layout>
  );
};

export default CartPage;
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '@/graphql/mutations/orders';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

const CheckoutContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const CheckoutTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 3fr 2fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FullWidthRow = styled(FormRow)`
  grid-column: 1 / -1;
`;

const OrderSummary = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.light};
`;

const SummaryTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SummaryItems = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
`;

const ItemPrice = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ItemQuantity = styled.div`
  margin-left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
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

const FormError = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PaymentMethodSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PaymentMethod = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const RadioInput = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const PaymentIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

// Payment method options
const paymentMethods = [
  { id: 'credit-card', name: 'Credit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'apple-pay', name: 'Apple Pay', icon: '🍎' },
  { id: 'google-pay', name: 'Google Pay', icon: 'G' },
];

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, isLoading: cartLoading, clearCart, totalItems, subtotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER);
  
  // State for order information
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Order success state
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Calculate order totals
  const TAX_RATE = 0.08; // 8% tax
  const SHIPPING_COST = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;
  
  // Fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email
      }));
    }
  }, [user]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !cartLoading) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, cartLoading, router]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // ZIP code validation
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    // Credit card validation
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Please use format MM/YY';
      }
      
      if (!formData.cardCVC) {
        newErrors.cardCVC = 'Security code is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = 'Please enter a valid security code';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // For development, we'll mock the order creation
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock order ID
      const mockOrderId = `ORDER-${Math.floor(Math.random() * 10000)}`;
      
      // Set success state
      setOrderSuccess(true);
      setOrderId(mockOrderId);
      
      // Clear cart
      clearCart();
    } else {
      try {
        // Create order with GraphQL in production
        const { data } = await createOrder({
          variables: {
            input: {
              address: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                phone: formData.phone
              }),
              paymentId: formData.paymentMethod === 'credit-card' 
                ? `CARD-${formData.cardNumber.slice(-4)}` 
                : `${formData.paymentMethod.toUpperCase()}`
            }
          }
        });
        
        if (data?.createOrder) {
          setOrderSuccess(true);
          setOrderId(data.createOrder.id);
          clearCart();
        }
      } catch (error) {
        console.error('Error creating order:', error);
        setErrors({
          submit: 'There was a problem processing your order. Please try again.'
        });
      }
    }
  };
  
  // Loading states
  if (cartLoading) {
    return (
      <Layout>
        <CheckoutContainer>
          <CheckoutTitle>Checkout</CheckoutTitle>
          <div>Loading your cart...</div>
        </CheckoutContainer>
      </Layout>
    );
  }
  
  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <CheckoutContainer>
          <CheckoutTitle>Checkout</CheckoutTitle>
          <div>Your cart is empty. Please add items to your cart before checking out.</div>
          <Button 
            onClick={() => router.push('/products')}
            variant="primary"
            style={{ marginTop: '1rem' }}
          >
            Continue Shopping
          </Button>
        </CheckoutContainer>
      </Layout>
    );
  }
  
  // Order success
  if (orderSuccess) {
    return (
      <Layout>
        <CheckoutContainer>
          <CheckoutTitle>Order Confirmation</CheckoutTitle>
          <SuccessMessage>
            <h2>Thank you for your order!</h2>
            <p>Your order #{orderId} has been placed successfully.</p>
            <p>You will receive a confirmation email shortly.</p>
          </SuccessMessage>
          <Button 
            onClick={() => router.push('/products')}
            variant="primary"
            fullWidth
          >
            Continue Shopping
          </Button>
        </CheckoutContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <CheckoutContainer>
        <CheckoutTitle>Checkout</CheckoutTitle>
        
        <form onSubmit={handleSubmit}>
          <CheckoutGrid>
            <div>
              <FormSection>
                <SectionTitle>Contact Information</SectionTitle>
                <FormGrid>
                  <FormRow>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      fullWidth
                    />
                  </FormRow>
                </FormGrid>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Shipping Address</SectionTitle>
                <FormGrid>
                  <FullWidthRow>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      fullWidth
                    />
                  </FullWidthRow>
                  <FormRow>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      error={errors.state}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      error={errors.zipCode}
                      fullWidth
                    />
                  </FormRow>
                  <FormRow>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      fullWidth
                      disabled
                    />
                  </FormRow>
                </FormGrid>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Payment Method</SectionTitle>
                <PaymentMethodSelector>
                  {paymentMethods.map(method => (
                    <PaymentMethod 
                      key={method.id} 
                      $selected={formData.paymentMethod === method.id}
                    >
                      <RadioInput
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                      />
                      <PaymentIcon>{method.icon}</PaymentIcon>
                      {method.name}
                    </PaymentMethod>
                  ))}
                </PaymentMethodSelector>
                
                {formData.paymentMethod === 'credit-card' && (
                  <FormGrid>
                    <FullWidthRow>
                      <TextField
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        error={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        fullWidth
                      />
                    </FullWidthRow>
                    <FullWidthRow>
                      <TextField
                        label="Name on Card"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        error={errors.cardName}
                        fullWidth
                      />
                    </FullWidthRow>
                    <FormRow>
                      <TextField
                        label="Expiry Date"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        error={errors.cardExpiry}
                        placeholder="MM/YY"
                        fullWidth
                      />
                    </FormRow>
                    <FormRow>
                      <TextField
                        label="Security Code"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        error={errors.cardCVC}
                        placeholder="CVC"
                        fullWidth
                      />
                    </FormRow>
                  </FormGrid>
                )}
              </FormSection>
              
              {errors.submit && (
                <FormError>{errors.submit}</FormError>
              )}
            </div>
            
            <OrderSummary>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <SummaryItems>
                {cart.items.map(item => (
                  <SummaryItem key={item.id}>
                    <ItemInfo>
                      <ItemName>{item.product.name}</ItemName>
                      <ItemPrice>${item.product.price.toFixed(2)} each</ItemPrice>
                    </ItemInfo>
                    <ItemQuantity>x{item.quantity}</ItemQuantity>
                    <SummaryValue>${(item.product.price * item.quantity).toFixed(2)}</SummaryValue>
                  </SummaryItem>
                ))}
              </SummaryItems>
              
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
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={orderLoading}
              >
                Place Order
              </Button>
            </OrderSummary>
          </CheckoutGrid>
        </form>
      </CheckoutContainer>
    </Layout>
  );
};

export default CheckoutPage;
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '@/graphql/mutations/orders';
// import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

const ProfileContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const ProfileTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 2fr;
  }
`;

const ProfileSidebar = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: sticky;
    top: ${({ theme }) => theme.spacing.xl};
    align-self: start;
  }
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  position: relative;
  background-color: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProfileName = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProfileEmail = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProfileNav = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NavItem = styled.div<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.lightGray : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const OrdersList = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OrderCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const OrderNumber = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const OrderInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
    flex-direction: column;
  }
`;

const OrderDate = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const OrderStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $status }) => {
    switch ($status) {
      case 'PENDING':
        return theme.colors.warning;
      case 'PROCESSING':
        return theme.colors.info;
      case 'SHIPPED':
        return theme.colors.primary;
      case 'DELIVERED':
        return theme.colors.success;
      case 'CANCELLED':
        return theme.colors.error;
      default:
        return theme.colors.lightGray;
    }
  }};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
`;

const OrderBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const OrderItems = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const OrderItem = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const OrderItemInfo = styled.div`
  flex: 1;
`;

const OrderItemName = styled.div`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const OrderItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: flex-end;
  font-weight: 600;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormContainer = styled.div`
  max-width: 600px;
`;

const FormTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Mock data for development
const MOCK_ORDERS = [
  {
    id: 'ORDER-1234',
    status: 'DELIVERED',
    total: 159.97,
    items: [
      {
        id: 'item1',
        product: {
          id: '1',
          name: 'Wireless Headphones',
          price: 129.99,
          images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Headphones'],
        },
        quantity: 1,
        price: 129.99,
      },
      {
        id: 'item2',
        product: {
          id: '4',
          name: 'Laptop Stand',
          price: 29.98,
          images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Laptop+Stand'],
        },
        quantity: 1,
        price: 29.98,
      },
    ],
    createdAt: '2023-06-15T10:30:00Z',
  },
  {
    id: 'ORDER-5678',
    status: 'SHIPPED',
    total: 79.99,
    items: [
      {
        id: 'item3',
        product: {
          id: '3',
          name: 'Bluetooth Speaker',
          price: 79.99,
          images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Speaker'],
        },
        quantity: 1,
        price: 79.99,
      },
    ],
    createdAt: '2023-07-22T14:45:00Z',
  },
  {
    id: 'ORDER-9012',
    status: 'PROCESSING',
    total: 399.98,
    items: [
      {
        id: 'item4',
        product: {
          id: '2',
          name: 'Smart Watch',
          price: 199.99,
          images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Smart+Watch'],
        },
        quantity: 2,
        price: 399.98,
      },
    ],
    createdAt: '2023-08-10T09:15:00Z',
  },
];

const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout, updateUser } = useAuth();

  // Get the active tab from query params or default to 'orders'
  const activeTab = (router.query.tab as string) || 'orders';

  // Query for user orders
  const { data, loading: ordersLoading } = useQuery(GET_USER_ORDERS, {
    skip: process.env.NODE_ENV === 'development' || !isAuthenticated,
  });

  // State for account settings form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form with user data when available
  React.useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab },
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: Record<string, string> = {};

    if (!profileForm.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!profileForm.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!profileForm.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation only if trying to change password
    if (profileForm.newPassword) {
      if (!profileForm.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }

      if (profileForm.newPassword.length < 8) {
        errors.newPassword = 'New password must be at least 8 characters';
      }

      if (profileForm.newPassword !== profileForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);

    // Submit if no errors
    if (Object.keys(errors).length === 0) {
      // In development, just log the form data
      if (process.env.NODE_ENV === 'development') {
        console.warn('Profile form submitted:', profileForm);
        alert('Profile updated successfully');
      } else {
        // In production, call the updateUser mutation
        updateUser({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          ...(profileForm.newPassword
            ? {
                currentPassword: profileForm.currentPassword,
                newPassword: profileForm.newPassword,
              }
            : {}),
        });
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <ProfileContainer>
          <ProfileTitle>My Account</ProfileTitle>
          <div>Loading your profile...</div>
        </ProfileContainer>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login?redirect=/profile');
    return null;
  }

  // Get orders data
  const orders = process.env.NODE_ENV === 'development' ? MOCK_ORDERS : data?.orders || [];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Layout>
      <ProfileContainer>
        <ProfileTitle>My Account</ProfileTitle>

        <ProfileGrid>
          <ProfileSidebar>
            <ProfileCard>
              <ProfileAvatar>
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '👤'}
              </ProfileAvatar>
              <ProfileInfo>
                <ProfileName>
                  {user?.firstName} {user?.lastName}
                </ProfileName>
                <ProfileEmail>{user?.email}</ProfileEmail>
              </ProfileInfo>
            </ProfileCard>

            <ProfileNav>
              <NavItem $active={activeTab === 'orders'} onClick={() => handleTabChange('orders')}>
                My Orders
              </NavItem>
              <NavItem
                $active={activeTab === 'settings'}
                onClick={() => handleTabChange('settings')}
              >
                Account Settings
              </NavItem>
              <NavItem onClick={handleLogout}>Logout</NavItem>
            </ProfileNav>
          </ProfileSidebar>

          <TabContent>
            {activeTab === 'orders' && (
              <>
                <h2>My Orders</h2>
                {ordersLoading ? (
                  <div>Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div>
                    <p>You haven&apos;t placed any orders yet.</p>
                    <Button
                      onClick={() => router.push('/products')}
                      variant="primary"
                      style={{ marginTop: '1rem' }}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <OrdersList>
                    {orders.map((order: any) => (
                      <OrderCard key={order.id}>
                        <OrderHeader>
                          <OrderNumber>Order #{order.id}</OrderNumber>
                          <OrderInfo>
                            <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                            <OrderStatus $status={order.status}>{order.status}</OrderStatus>
                          </OrderInfo>
                        </OrderHeader>
                        <OrderBody>
                          <OrderItems>
                            {order.items.map((item: any) => (
                              <OrderItem key={item.id}>
                                <OrderItemImage>
                                  <Image
                                    src={
                                      item.product.images[0] ||
                                      'https://placehold.co/120x120/eeeeee/999999/png?text=No+Image'
                                    }
                                    alt={item.product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </OrderItemImage>
                                <OrderItemInfo>
                                  <OrderItemName>{item.product.name}</OrderItemName>
                                  <OrderItemMeta>
                                    <span>Qty: {item.quantity}</span>
                                    <span>${item.price.toFixed(2)}</span>
                                  </OrderItemMeta>
                                </OrderItemInfo>
                              </OrderItem>
                            ))}
                          </OrderItems>
                          <OrderTotal>Total: ${order.total.toFixed(2)}</OrderTotal>
                        </OrderBody>
                      </OrderCard>
                    ))}
                  </OrdersList>
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <FormContainer>
                <FormTitle>Account Settings</FormTitle>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleInputChange}
                      error={formErrors.firstName}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleInputChange}
                      error={formErrors.lastName}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleInputChange}
                      error={formErrors.email}
                      fullWidth
                    />
                  </FormGroup>

                  <FormTitle>Change Password</FormTitle>
                  <FormGroup>
                    <TextField
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={handleInputChange}
                      error={formErrors.currentPassword}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <TextField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={profileForm.newPassword}
                      onChange={handleInputChange}
                      error={formErrors.newPassword}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={handleInputChange}
                      error={formErrors.confirmPassword}
                      fullWidth
                    />
                  </FormGroup>

                  <ActionButtons>
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </ActionButtons>
                </form>
              </FormContainer>
            )}
          </TabContent>
        </ProfileGrid>
      </ProfileContainer>
    </Layout>
  );
};

export default ProfilePage;

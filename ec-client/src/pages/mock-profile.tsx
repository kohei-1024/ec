import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import Link from 'next/link';

// Simple styled components for the mock page
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div``;

const Content = styled.div``;

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 36px;
  color: #666;
`;

const Name = styled.h2`
  margin: 0 0 5px;
  font-size: 20px;
`;

const Email = styled.p`
  color: #666;
  margin: 0 0 15px;
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${props => (props.active ? '#f0f0f0' : 'transparent')};
  border-radius: 4px;
  margin-bottom: 5px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const OrderCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrderNumber = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const OrderInfo = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 500px) {
    margin-top: 10px;
  }
`;

const OrderDate = styled.span`
  color: #666;
`;

const OrderStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'DELIVERED':
        return '#4caf50';
      case 'SHIPPED':
        return '#2196f3';
      case 'PROCESSING':
        return '#ff9800';
      case 'PENDING':
        return '#ffc107';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#e0e0e0';
    }
  }};
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const OrderBody = styled.div`
  padding: 15px;
`;

const OrderItems = styled.div`
  margin-bottom: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  background-color: #e0e0e0;
  border-radius: 4px;
  flex-shrink: 0;
`;

const OrderItemInfo = styled.div`
  flex: 1;
`;

const OrderItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const OrderItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  background-color: ${props => (props.primary ? '#2196f3' : 'white')};
  color: ${props => (props.primary ? 'white' : '#333')};
  border: 1px solid ${props => (props.primary ? '#2196f3' : '#ddd')};
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: ${props => (props.primary ? '#1976d2' : '#f5f5f5')};
  }
`;

// Mock data
const MOCK_USER = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'CUSTOMER',
};

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
          images: [],
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
          images: [],
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
          images: [],
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
          images: [],
        },
        quantity: 2,
        price: 399.98,
      },
    ],
    createdAt: '2023-08-10T09:15:00Z',
  },
];

const MockProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [profileForm, setProfileForm] = useState({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    email: MOCK_USER.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

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
      <Container>
        <Title>My Account</Title>

        <Grid>
          <Sidebar>
            <Card>
              <ProfileInfo>
                <Avatar>{MOCK_USER.firstName.charAt(0)}</Avatar>
                <Name>
                  {MOCK_USER.firstName} {MOCK_USER.lastName}
                </Name>
                <Email>{MOCK_USER.email}</Email>
              </ProfileInfo>

              <NavItem active={activeTab === 'orders'} onClick={() => handleTabChange('orders')}>
                My Orders
              </NavItem>
              <NavItem
                active={activeTab === 'settings'}
                onClick={() => handleTabChange('settings')}
              >
                Account Settings
              </NavItem>
              <NavItem onClick={() => alert('Logged out successfully')}>Logout</NavItem>
            </Card>
          </Sidebar>

          <Content>
            {activeTab === 'orders' && (
              <Card>
                <h2>My Orders</h2>
                {MOCK_ORDERS.map(order => (
                  <OrderCard key={order.id}>
                    <OrderHeader>
                      <OrderNumber>Order #{order.id}</OrderNumber>
                      <OrderInfo>
                        <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                        <OrderStatus status={order.status}>{order.status}</OrderStatus>
                      </OrderInfo>
                    </OrderHeader>
                    <OrderBody>
                      <OrderItems>
                        {order.items.map(item => (
                          <OrderItem key={item.id}>
                            <OrderItemImage />
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
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <h2>Account Settings</h2>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <h2>Change Password</h2>
                  <FormGroup>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={profileForm.newPassword}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <div>
                    <Button primary type="submit">
                      Save Changes
                    </Button>
                    <Button type="button">Cancel</Button>
                  </div>
                </form>
              </Card>
            )}
          </Content>
        </Grid>
      </Container>
    </Layout>
  );
};

export default MockProfilePage;

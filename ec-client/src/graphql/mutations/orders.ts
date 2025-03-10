import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      total
      items {
        id
        product {
          id
          name
          price
        }
        quantity
        price
      }
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders {
    orders {
      id
      status
      total
      items {
        id
        product {
          id
          name
          price
          images
        }
        quantity
        price
      }
      createdAt
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($id: ID!) {
    order(id: $id) {
      id
      status
      total
      address
      paymentId
      items {
        id
        product {
          id
          name
          price
          images
        }
        quantity
        price
      }
      createdAt
      updatedAt
    }
  }
`;
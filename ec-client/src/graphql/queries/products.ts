import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $search: String
    $categoryId: ID
    $sortBy: String
    $sortDirection: String
    $limit: Int
    $offset: Int
  ) {
    products(
      search: $search
      categoryId: $categoryId
      sortBy: $sortBy
      sortDirection: $sortDirection
      limit: $limit
      offset: $offset
    ) {
      edges {
        id
        name
        description
        price
        stock
        images
        categoryId
        category {
          id
          name
        }
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      images
      categoryId
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      parentId
      parent {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      description
      parentId
      parent {
        id
        name
      }
      children {
        id
        name
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($limit: Int = 4) {
    products(
      limit: $limit
      sortBy: "createdAt"
      sortDirection: "desc"
    ) {
      edges {
        id
        name
        description
        price
        stock
        images
        category {
          id
          name
        }
      }
    }
  }
`;
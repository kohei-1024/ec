import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from '@/graphql/queries/cart';
import { Cart, Product } from '@/types/models';
import { useAuth } from './AuthContext';

// Mock cart for development
const MOCK_CART = {
  id: 'cart1',
  items: [
    {
      id: 'item1',
      quantity: 1,
      product: {
        id: '1',
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation technology.',
        price: 129.99,
        stock: 15,
        images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Headphones'],
      },
    },
    {
      id: 'item2',
      quantity: 2,
      product: {
        id: '3',
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360° sound and waterproof design.',
        price: 79.99,
        stock: 20,
        images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Speaker'],
      },
    },
  ],
};

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  error: null,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // GraphQL operations for production
  const {
    data,
    loading: gqlLoading,
    refetch,
  } = useQuery(GET_CART, {
    skip: !isAuthenticated || process.env.NODE_ENV === 'development',
    fetchPolicy: 'network-only',
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [clearCartMutation] = useMutation(CLEAR_CART);

  // Handle cart data (mock in development, real in production)
  useEffect(() => {
    const getCartData = async () => {
      setIsLoading(true);

      try {
        if (process.env.NODE_ENV === 'development') {
          // Simulate network delay in development
          await new Promise(resolve => setTimeout(resolve, 500));
          setCart(MOCK_CART as Cart);
        } else {
          // Use real API data in production
          if (data?.cart) {
            setCart(data.cart);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load cart data');
      } finally {
        setIsLoading(false);
      }
    };

    getCartData();
  }, [data]);

  // Calculate cart totals
  const totalItems = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const subtotal =
    cart?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;

  // Cart operations
  const addToCart = async (productId: string, quantity: number) => {
    try {
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        // Find the product in our mock data
        const mockProductMap = {
          '1': {
            id: '1',
            name: 'Wireless Headphones',
            description: 'Premium wireless headphones with noise cancellation technology.',
            price: 129.99,
            stock: 15,
            images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Headphones'],
          },
          '2': {
            id: '2',
            name: 'Smart Watch',
            description: 'Feature-packed smartwatch with health monitoring and notifications.',
            price: 199.99,
            stock: 8,
            images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Smart+Watch'],
          },
          '3': {
            id: '3',
            name: 'Bluetooth Speaker',
            description: 'Portable Bluetooth speaker with 360° sound and waterproof design.',
            price: 79.99,
            stock: 20,
            images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Speaker'],
          },
          '4': {
            id: '4',
            name: 'Laptop Stand',
            description: 'Ergonomic laptop stand with adjustable height and angle.',
            price: 49.99,
            stock: 25,
            images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Laptop+Stand'],
          },
        };

        const product = mockProductMap[productId as keyof typeof mockProductMap];
        if (!product) {
          throw new Error('Product not found');
        }

        // Update mock cart
        const updatedCart = { ...MOCK_CART };
        const existingItemIndex = updatedCart.items.findIndex(
          item => item.product.id === productId
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          updatedCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          const newItemId = `item${updatedCart.items.length + 1}`;
          updatedCart.items.push({
            id: newItemId,
            quantity,
            product,
          });
        }

        // Update state
        setCart(updatedCart as Cart);
      } else {
        // Real implementation for production
        await addToCartMutation({
          variables: { productId, quantity },
          update: (cache, { data }) => {
            if (data?.addToCart) {
              // Update the cart data
              refetch();
            }
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        // Update mock cart
        const updatedCart = { ...MOCK_CART };
        const itemIndex = updatedCart.items.findIndex(item => item.id === itemId);

        if (itemIndex >= 0) {
          updatedCart.items[itemIndex].quantity = quantity;
          setCart(updatedCart as Cart);
        } else {
          throw new Error('Cart item not found');
        }
      } else {
        // Real implementation for production
        await updateCartItemMutation({
          variables: { id: itemId, quantity },
          update: () => {
            // Update the cart data
            refetch();
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        // Update mock cart
        const updatedCart = { ...MOCK_CART };
        const itemIndex = updatedCart.items.findIndex(item => item.id === itemId);

        if (itemIndex >= 0) {
          updatedCart.items.splice(itemIndex, 1);
          setCart(updatedCart as Cart);
        } else {
          throw new Error('Cart item not found');
        }
      } else {
        // Real implementation for production
        await removeFromCartMutation({
          variables: { id: itemId },
          update: () => {
            // Update the cart data
            refetch();
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        // Clear mock cart
        const updatedCart = { ...MOCK_CART, items: [] };
        setCart(updatedCart as unknown as Cart);
      } else {
        // Real implementation for production
        await clearCartMutation({
          update: () => {
            // Update the cart data
            refetch();
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Product } from '@/types/models';
import { useAuth } from './AuthContext';
// import { Badge } from '@/components/Badge';

// Define these GraphQL mutations later
// import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, GET_WISHLIST } from '@/graphql/mutations/wishlist';

// Mock data for development
const MOCK_PRODUCTS: { [key: string]: Product } = {
  '1': {
    id: '1',
    name: 'Wireless Headphones',
    description:
      'Premium wireless headphones with noise cancellation technology. Enjoy crystal-clear sound and extended battery life for all-day listening.',
    price: 129.99,
    stock: 15,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Headphones+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Headphones+2',
      'https://placehold.co/600x400/2a4cd7/FFFFFF/png?text=Headphones+3',
    ],
    category: {
      id: '1',
      name: 'Electronics',
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  '2': {
    id: '2',
    name: 'Smart Watch',
    description:
      'Feature-packed smartwatch with health monitoring, notifications, and a sleek design. Track your fitness goals and stay connected on the go.',
    price: 199.99,
    stock: 8,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Smart+Watch+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Smart+Watch+2',
    ],
    category: {
      id: '1',
      name: 'Electronics',
    },
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
  },
  '3': {
    id: '3',
    name: 'Bluetooth Speaker',
    description:
      'Portable Bluetooth speaker with 360° sound and waterproof design. Perfect for outdoor adventures or home use with impressive bass and clarity.',
    price: 79.99,
    stock: 20,
    images: ['https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Speaker+1'],
    category: {
      id: '1',
      name: 'Electronics',
    },
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
  },
  '4': {
    id: '4',
    name: 'Laptop Stand',
    description:
      'Ergonomic laptop stand with adjustable height and angle. Improve your posture and keep your device cool with the ventilated design.',
    price: 49.99,
    stock: 25,
    images: [
      'https://placehold.co/600x400/4a6cf7/FFFFFF/png?text=Laptop+Stand+1',
      'https://placehold.co/600x400/3a5ce7/FFFFFF/png?text=Laptop+Stand+2',
    ],
    category: {
      id: '3',
      name: 'Home & Garden',
    },
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-04-05T00:00:00Z',
  },
};

type WishlistContextType = {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  isLoading: false,
  error: null,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  clearWishlist: async () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Mock mutation functions
  // const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST);
  // const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setItems(JSON.parse(savedWishlist));
        }
      } catch (err) {
        console.error('Failed to load wishlist from localStorage:', err);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage:', err);
    }
  }, [items]);

  const addToWishlist = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        const product = MOCK_PRODUCTS[productId as keyof typeof MOCK_PRODUCTS];
        if (!product) {
          throw new Error('Product not found');
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if product is already in wishlist
        if (!items.some(item => item.id === productId)) {
          setItems(prevItems => [...prevItems, product as Product]);
        }
      } else {
        // For production, use GraphQL mutation
        // const { data } = await addToWishlistMutation({
        //   variables: { productId }
        // });
        // if (data?.addToWishlist) {
        //   setItems(data.addToWishlist.items);
        // }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product to wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        setItems(prevItems => prevItems.filter(item => item.id !== productId));
      } else {
        // For production, use GraphQL mutation
        // const { data } = await removeFromWishlistMutation({
        //   variables: { productId }
        // });
        // if (data?.removeFromWishlist) {
        //   setItems(data.removeFromWishlist.items);
        // }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove product from wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For development, just clear the local state
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        setItems([]);
      } else {
        // For production, implement a clearWishlist mutation
        // const { data } = await clearWishlistMutation();
        // if (data?.clearWishlist) {
        //   setItems([]);
        // }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;

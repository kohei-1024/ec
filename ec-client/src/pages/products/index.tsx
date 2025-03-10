import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { GET_PRODUCTS, GET_CATEGORIES } from '@/graphql/queries/products';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useCart } from '@/contexts/CartContext';

// Mock data for development
const MOCK_PRODUCTS = {
  edges: [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation technology.',
      price: 129.99,
      stock: 15,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Headphones'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2023-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with health monitoring and notifications.',
      price: 199.99,
      stock: 8,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Smart+Watch'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-02-20T00:00:00Z',
      updatedAt: '2023-02-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with 360° sound and waterproof design.',
      price: 79.99,
      stock: 20,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Speaker'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-03-10T00:00:00Z',
      updatedAt: '2023-03-10T00:00:00Z'
    },
    {
      id: '4',
      name: 'Laptop Stand',
      description: 'Ergonomic laptop stand with adjustable height and angle.',
      price: 49.99,
      stock: 25,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Laptop+Stand'],
      category: { id: '3', name: 'Home & Garden' },
      createdAt: '2023-04-05T00:00:00Z',
      updatedAt: '2023-04-05T00:00:00Z'
    },
    {
      id: '5',
      name: 'Mechanical Keyboard',
      description: 'Premium mechanical keyboard with RGB lighting and customizable switches.',
      price: 89.99,
      stock: 12,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Keyboard'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-05-12T00:00:00Z',
      updatedAt: '2023-05-12T00:00:00Z'
    },
    {
      id: '6',
      name: 'Ergonomic Mouse',
      description: 'Vertical ergonomic mouse designed for comfort during long work sessions.',
      price: 39.99,
      stock: 30,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=Mouse'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-06-18T00:00:00Z',
      updatedAt: '2023-06-18T00:00:00Z'
    },
    {
      id: '7',
      name: 'USB-C Hub',
      description: 'All-in-one USB-C hub with multiple ports for all your connectivity needs.',
      price: 59.99,
      stock: 18,
      images: ['https://placehold.co/300x200/4a6cf7/FFFFFF/png?text=USB+Hub'],
      category: { id: '1', name: 'Electronics' },
      createdAt: '2023-07-22T00:00:00Z',
      updatedAt: '2023-07-22T00:00:00Z'
    },
    {
      id: '8',
      name: 'Desk Organizer',
      description: 'Minimalist desk organizer to keep your workspace clean and efficient.',
      price: 29.99,
      stock: 22,
      images: ['https://placehold.co/300x200/333333/FFFFFF/png?text=Desk+Organizer'],
      category: { id: '3', name: 'Home & Garden' },
      createdAt: '2023-08-30T00:00:00Z',
      updatedAt: '2023-08-30T00:00:00Z'
    }
  ],
  totalCount: 8
};

const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: '2', name: 'Clothing', description: 'Apparel and fashion items' },
  { id: '3', name: 'Home & Garden', description: 'Products for home and outdoor spaces' }
];

const ProductsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

// Use a regular div instead of extending TextField to avoid the styled-component error
const SearchInputWrapper = styled.div`
  min-width: 250px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.md};
  min-width: 150px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProductCard = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  background-color: ${({ theme }) => theme.colors.light};
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProductPrice = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProductActions = styled.div`
  margin-top: auto;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.colors.light : theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  min-width: 40px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.lightGray};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});
  const [productsData, setProductsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  
  const ITEMS_PER_PAGE = 8;
  
  // Fetch products from GraphQL in production
  const { data: gqlProductsData, loading: gqlProductsLoading, error: gqlProductsError, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      search: searchTerm || undefined,
      categoryId: categoryFilter || undefined,
      sortBy,
      sortDirection,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    },
    fetchPolicy: 'network-only',
    skip: process.env.NODE_ENV === 'development', // Skip in development
  });
  
  // Fetch categories from GraphQL in production
  const { data: gqlCategoriesData, loading: gqlCategoriesLoading } = useQuery(GET_CATEGORIES, {
    skip: process.env.NODE_ENV === 'development', // Skip in development
  });
  
  // Use mock data in development, real data in production
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        
        if (process.env.NODE_ENV === 'development') {
          // Filter and sort mock products
          let filteredProducts = [...MOCK_PRODUCTS.edges];
          
          // Apply search filter
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
              product.name.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower)
            );
          }
          
          // Apply category filter
          if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product => 
              product.category.id === categoryFilter
            );
          }
          
          // Apply sorting
          filteredProducts.sort((a, b) => {
            if (sortBy === 'name') {
              return sortDirection === 'asc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            } else if (sortBy === 'price') {
              return sortDirection === 'asc'
                ? a.price - b.price
                : b.price - a.price;
            } else { // createdAt
              return sortDirection === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
          });
          
          // Apply pagination
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setProductsData({
            products: {
              edges: paginatedProducts,
              totalCount: filteredProducts.length
            }
          });
          
          setCategoriesData({
            categories: MOCK_CATEGORIES
          });
        } else {
          // In production, use GraphQL data
          if (gqlProductsData) {
            setProductsData(gqlProductsData);
          }
          
          if (gqlCategoriesData) {
            setCategoriesData(gqlCategoriesData);
          }
          
          if (gqlProductsError) {
            setProductsError(gqlProductsError);
          }
        }
      } catch (err) {
        setProductsError(err);
      } finally {
        setProductsLoading(false);
      }
    };
    
    fetchData();
  }, [searchTerm, categoryFilter, sortBy, sortDirection, currentPage, gqlProductsData, gqlCategoriesData, gqlProductsError]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortDirection] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    setCurrentPage(1); // Reset to first page on new sort
  };
  
  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    try {
      setIsAddingToCart((prev) => ({ ...prev, [productId]: true }));
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };
  
  // Calculate total pages
  const totalCount = productsData?.products?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Determine range around current page
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range to always show 3 pages
      if (rangeEnd - rangeStart < 2) {
        if (rangeStart === 2) {
          rangeEnd = Math.min(4, totalPages - 1);
        } else if (rangeEnd === totalPages - 1) {
          rangeStart = Math.max(2, totalPages - 3);
        }
      }
      
      // Add ellipsis if needed
      if (rangeStart > 2) {
        pageNumbers.push('...');
      }
      
      // Add pages in range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (rangeEnd < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <Layout>
      <ProductsContainer>
        <ProductsHeader>
          <Title>All Products</Title>
          <SearchFilterContainer>
            <SearchInputWrapper>
              <TextField
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchInputWrapper>
          </SearchFilterContainer>
        </ProductsHeader>
        
        <FiltersContainer>
          <FilterSelect value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categoriesData?.categories?.map((category: { id: string; name: string }) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FilterSelect>
          
          <FilterSelect value={`${sortBy}-${sortDirection}`} onChange={handleSortChange}>
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </FilterSelect>
        </FiltersContainer>
        
        {productsLoading ? (
          <LoadingContainer>Loading products...</LoadingContainer>
        ) : productsError ? (
          <NoResults>Error loading products. Please try again.</NoResults>
        ) : productsData?.products?.edges?.length === 0 ? (
          <NoResults>No products found matching your criteria.</NoResults>
        ) : (
          <ProductsGrid>
            {productsData?.products?.edges?.map((product: any) => (
              <ProductCard key={product.id}>
                <Link 
                  href={{
                    pathname: '/products/[id]',
                    query: { id: product.id }
                  }}
                  legacyBehavior
                >
                  <a>
                    <ProductImageContainer>
                      <Image
                        src={product.images[0] || 'https://placehold.co/300x200/eeeeee/999999/png?text=No+Image'}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </ProductImageContainer>
                  </a>
                </Link>
                <ProductInfo>
                  <ProductCategory>{product.category?.name}</ProductCategory>
                  <Link 
                    href={{
                      pathname: '/products/[id]',
                      query: { id: product.id }
                    }}
                    legacyBehavior
                  >
                    <a>
                      <ProductName>{product.name}</ProductName>
                    </a>
                  </Link>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <ProductActions>
                    <Button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAddingToCart[product.id]}
                      variant="primary"
                      fullWidth
                    >
                      {isAddingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </ProductActions>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </PaginationButton>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <PaginationButton key={`ellipsis-${index}`} disabled>
                  ...
                </PaginationButton>
              ) : (
                <PaginationButton
                  key={`page-${page}`}
                  $active={page === currentPage}
                  onClick={() => setCurrentPage(Number(page))}
                >
                  {page}
                </PaginationButton>
              )
            ))}
            
            <PaginationButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </PaginationButton>
          </Pagination>
        )}
      </ProductsContainer>
    </Layout>
  );
};

export default ProductsPage;
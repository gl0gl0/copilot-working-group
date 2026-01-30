import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '../../contexts/CartContext';
import { useProduct } from '../../hooks/useProduct';
import { Product } from '../../types/product';
import * as productService from '../../services';

// Mock the product service
vi.mock('../../services', () => ({
  productService: {
    getProduct: vi.fn(),
  },
}));

// Simple test component that mimics the ProductPage behavior
const ProductPageTest = () => {
  const { data: product, isLoading, error } = useProduct();

  return (
    <div>
      {isLoading && <p>Loading product...</p>}
      {error && <p>Error loading product: {error.message}</p>}
      {product && <div data-testid="product-detail">{product.title}</div>}
    </div>
  );
};

function createTestRouter(productId: string = '1') {
  const rootRoute = createRootRoute();
  
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: ProductPageTest,
  });

  const routeTree = rootRoute.addChildren([productRoute]);

  const memoryHistory = createMemoryHistory({
    initialEntries: [`/products/${productId}`],
  });

  return createRouter({
    routeTree,
    history: memoryHistory,
  });
}

function renderProductPage(productId: string = '1') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createTestRouter(productId);

  const Wrapper = () => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>
  );

  return render(<Wrapper />);
}

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'Test description',
  category: 'Electronics',
  price: 99.99,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days',
  thumbnail: 'https://example.com/thumbnail.jpg',
  images: ['https://example.com/image.jpg'],
};

describe('ProductDetail - Loading and Error States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when product data is being fetched', async () => {
    // Return a promise that never resolves to simulate loading
    vi.mocked(productService.productService.getProduct).mockImplementation(
      () => new Promise(() => {})
    );

    renderProductPage('1');

    // Wait for the loading state to appear
    await waitFor(() => {
      expect(screen.getByText(/loading product/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    const errorMessage = 'Failed to fetch product';
    vi.mocked(productService.productService.getProduct).mockRejectedValue(
      new Error(errorMessage)
    );

    renderProductPage('1');

    // Wait for error to appear
    const errorElement = await screen.findByText(/error loading product/i);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('displays product when data is successfully loaded', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);

    renderProductPage('1');

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});

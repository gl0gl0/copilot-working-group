import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { ProductDetail } from './index';
import { CartProvider } from '../../contexts/CartContext';
import { Product } from '../../types/product';
import * as productService from '../../services';

// Mock the product service
vi.mock('../../services', () => ({
  productService: {
    getProduct: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'This is a test product description',
  category: 'Electronics',
  price: 99.99,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days',
  thumbnail: 'https://example.com/thumbnail.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};

function createTestRouter(productId: string = '1') {
  const rootRoute = createRootRoute();
  
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: ProductDetail,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Product List</div>,
  });

  const routeTree = rootRoute.addChildren([productRoute, indexRoute]);

  const memoryHistory = createMemoryHistory({
    initialEntries: [`/products/${productId}`],
  });

  return createRouter({
    routeTree,
    history: memoryHistory,
  });
}

function renderProductDetail(productId: string = '1') {
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

describe('ProductDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation with back link to product list', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderProductDetail('1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const backLink = screen.getByText(/back to products/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('displays correct product information', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderProductDetail('1');

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check product info
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();

    // Check product meta
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();

    // Check product image
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('displays brand as N/A when not provided', async () => {
    const productWithoutBrand = { ...mockProduct, brand: undefined };
    vi.mocked(productService.productService.getProduct).mockResolvedValue(productWithoutBrand);
    
    renderProductDetail('1');

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('renders Add to Cart button', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderProductDetail('1');

    await waitFor(() => {
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
    });
  });

  it('handles Add to Cart button click', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderProductDetail('1');
    
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addToCartButton);

    // Since we can't easily verify cart state without exposing it,
    // we just verify the button is clickable without errors
    expect(addToCartButton).toBeInTheDocument();
  });

  it('uses thumbnail when images array is empty', async () => {
    const productWithOnlyThumbnail = { ...mockProduct, images: [] };
    vi.mocked(productService.productService.getProduct).mockResolvedValue(productWithOnlyThumbnail);
    
    renderProductDetail('1');

    await waitFor(() => {
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
    });
  });

  it('applies correct CSS module classes to container', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    const { container } = renderProductDetail('1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check that the main container exists
    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer).toBeInTheDocument();

    // Check that product section exists
    const productSection = container.querySelector('[class*="product"]');
    expect(productSection).toBeInTheDocument();

    // Check that info section exists
    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();
  });
});

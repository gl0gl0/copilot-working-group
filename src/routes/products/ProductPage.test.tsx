import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { useProduct } from '../../hooks/useProduct';
import type { Product } from '../../types/product';
import * as productService from '../../services';
import { renderWithRouter } from '../../test/test-utils';

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

describe('Product Page - Loading and Error States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when product data is being fetched', async () => {
    // Return a promise that never resolves to simulate loading
    vi.mocked(productService.productService.getProduct).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithRouter(ProductPageTest, { productId: '1' });

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

    renderWithRouter(ProductPageTest, { productId: '1' });

    // Wait for error to appear
    const errorElement = await screen.findByText(/error loading product/i);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('displays product when data is successfully loaded', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);

    renderWithRouter(ProductPageTest, { productId: '1' });

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});

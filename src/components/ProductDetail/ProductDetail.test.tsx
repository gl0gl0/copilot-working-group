import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetail } from './index';
import type { Product } from '../../types/product';
import * as productService from '../../services';
import { renderWithRouter } from '../../test/test-utils';

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

describe('ProductDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation with back link to product list', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderWithRouter(ProductDetail, { productId: '1' });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const backLink = screen.getByText(/back to products/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('displays correct product information', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderWithRouter(ProductDetail, { productId: '1' });

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
    
    renderWithRouter(ProductDetail, { productId: '1' });

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('renders Add to Cart button', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderWithRouter(ProductDetail, { productId: '1' });

    await waitFor(() => {
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
    });
  });

  it('handles Add to Cart button click without errors', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    renderWithRouter(ProductDetail, { productId: '1' });
    
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Click the button and verify no errors are thrown
    await expect(user.click(addToCartButton)).resolves.not.toThrow();
    
    // Button should still be present after clicking
    expect(addToCartButton).toBeInTheDocument();
  });

  it('uses thumbnail when images array is empty', async () => {
    const productWithOnlyThumbnail = { ...mockProduct, images: [] };
    vi.mocked(productService.productService.getProduct).mockResolvedValue(productWithOnlyThumbnail);
    
    renderWithRouter(ProductDetail, { productId: '1' });

    await waitFor(() => {
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
    });
  });

  it('applies correct CSS module classes to container', async () => {
    vi.mocked(productService.productService.getProduct).mockResolvedValue(mockProduct);
    
    const { container } = renderWithRouter(ProductDetail, { productId: '1' });

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

import type { ReactElement } from 'react';
import { render, screen, waitFor, within, fireEvent, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { CartProvider } from '../contexts/CartContext';
import type React from 'react';

// Create a fresh QueryClient for each test
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

// Create a wrapper for tests
export function createWrapper(queryClient?: QueryClient) {
  const client = queryClient || createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}

// Custom render function with all providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) {
  const queryClient = options?.queryClient || createTestQueryClient();
  return render(ui, { wrapper: createWrapper(queryClient), ...options });
}

// Helper to create a test router for components that need routing context
export function createTestRouter(
  component: React.ComponentType,
  productId: string = '1'
) {
  const rootRoute = createRootRoute();
  
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: component,
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

// Helper to render with full router context
export function renderWithRouter(
  component: React.ComponentType,
  { productId = '1', queryClient: providedQueryClient, ...options }: RenderOptions & { productId?: string; queryClient?: QueryClient } = {}
) {
  const queryClient = providedQueryClient || createTestQueryClient();

  const router = createTestRouter(component, productId);

  const Wrapper = () => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>
  );

  return { ...render(<Wrapper />, options), queryClient };
}

// Re-export only testing utilities, not components
export { render, screen, waitFor, within, fireEvent };


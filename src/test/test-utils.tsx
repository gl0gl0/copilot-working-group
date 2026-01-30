import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { CartProvider } from '../contexts/CartContext';

// Create a wrapper for tests
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}

// Custom render function with all providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

// Helper to create a test router for components that need routing context
export function createTestRouter(productId: string = '1') {
  const rootRoute = createRootRoute();
  
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: () => null,
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

// Helper to render with full router context
export function renderWithRouter(
  ui: ReactElement,
  { productId = '1', ...options }: RenderOptions & { productId?: string } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createTestRouter(productId);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <CartProvider>{children}</CartProvider>
      </RouterProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';

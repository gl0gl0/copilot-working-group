# Copilot Prompt Guide: Migrating useQuery to useSuspenseQuery

## Context

This guide provides a comprehensive prompt template for migrating TanStack Query's `useQuery` hooks to `useSuspenseQuery` in this React application. The migration enables React Suspense boundaries for better loading state management.

## Current State

The application currently uses `useQuery` in two custom hooks:
- `src/hooks/useProducts.ts` - Fetches a list of products
- `src/hooks/useProduct.ts` - Fetches a single product by ID

These hooks are consumed by:
- Route components: `src/routes/index.tsx` and `src/routes/products/$productId.tsx`
- Child components: `ProductActions`, `ProductMeta`, `ProductImage`, `ProductInfo`

## Migration Benefits

- **Simplified loading states**: Suspense boundaries handle loading states declaratively
- **Better error boundaries**: Errors propagate to Error Boundaries automatically
- **Improved UX**: Coordinated loading states across components
- **Type safety**: TypeScript guarantees data is always defined (no undefined checks needed)

## The Copilot Prompt

Use this prompt with GitHub Copilot Chat or when creating an issue for Copilot to execute:

---

### Prompt Template

```
Migrate all TanStack Query useQuery hooks to useSuspenseQuery to enable React Suspense boundaries.

## Files to Update

### 1. Update Custom Hooks

**File: src/hooks/useProducts.ts**
- Change import from `useQuery` to `useSuspenseQuery`
- Update the hook to use `useSuspenseQuery` instead of `useQuery`
- Return type will change - data is no longer optional

**File: src/hooks/useProduct.ts**
- Change import from `useQuery` to `useSuspenseQuery`
- Update the hook to use `useSuspenseQuery` instead of `useQuery`
- Remove the `enabled` option (not supported in useSuspenseQuery)
- Return type will change - data is no longer optional

### 2. Update Route Components

**File: src/routes/index.tsx**
- Remove manual loading state handling (`isLoading` checks)
- Remove manual error handling (`error` checks)
- Wrap the component with a Suspense boundary in the route configuration
- Add an Error Boundary in the route configuration
- Update data destructuring (no need for optional chaining since data is guaranteed)

**File: src/routes/products/$productId.tsx**
- Remove manual loading state handling (`isLoading` checks)
- Remove manual error handling (`error` checks)
- Wrap the component with a Suspense boundary in the route configuration
- Add an Error Boundary in the route configuration
- Update data destructuring (no need for optional chaining since data is guaranteed)

### 3. Update Child Components

The following components consume useProduct hook and need updates to remove optional chaining:
- **src/components/ProductActions/index.tsx** - Remove `product &&` check in button onClick
- **src/components/ProductMeta/index.tsx** - Remove all `product?.` optional chaining (use `product.` instead)
- **src/components/ProductImage/index.tsx** - Remove `product?.` optional chaining
- **src/components/ProductInfo/index.tsx** - Remove `product?.` optional chaining

Since data is guaranteed to exist with useSuspenseQuery:
- Change `product?.brand` to `product.brand`
- Change `product?.category` to `product.category`
- Change `product && addToCart(product)` to `addToCart(product)`
- And so on for all optional chaining on the product object

### 4. Update Tests

**File: src/components/ProductDetail/ProductDetail.test.tsx**
- Wrap test components with Suspense boundaries
- Update test utilities if needed to support Suspense
- Ensure tests still validate component behavior correctly
- Tests should no longer check for loading states in the component itself

## Technical Requirements

1. **Import Changes**:
   ```typescript
   // Before
   import { useQuery } from '@tanstack/react-query';
   
   // After
   import { useSuspenseQuery } from '@tanstack/react-query';
   ```

2. **Hook Usage Changes**:
   ```typescript
   // Before
   const { data, isLoading, error } = useQuery({
     queryKey: ['products'],
     queryFn: () => productService.getProducts(),
   });
   
   // After
   const { data } = useSuspenseQuery({
     queryKey: ['products'],
     queryFn: () => productService.getProducts(),
   });
   ```

3. **Suspense Boundary in Routes** (TanStack Router v7+ syntax):
   ```typescript
   // Add to route configuration
   export const Route = createFileRoute('/')({
     component: IndexPage,
     pendingComponent: () => <div>Loading products...</div>,
     errorComponent: ({ error }) => <div>Error: {error.message}</div>,
   });
   ```

4. **Data Usage Changes**:
   ```typescript
   // Before - data might be undefined
   {data && data.products.map(...)}
   
   // After - data is guaranteed to exist
   {data.products.map(...)}
   ```

5. **Remove enabled option** from useProduct:
   ```typescript
   // Before
   return useQuery({
     queryKey: ['product', id],
     queryFn: () => productService.getProduct(id),
     enabled: !!id,  // Remove this
   });
   
   // After
   return useSuspenseQuery({
     queryKey: ['product', id],
     queryFn: () => productService.getProduct(id),
     // No enabled option
   });
   ```

## Validation Steps

After completing the migration, verify:

1. **Type Checking**: Run `npx tsc -b` - should have no errors
2. **Linting**: Run `npm run lint` - should pass
3. **Tests**: Run `npm test -- --run` - all tests should pass
4. **Build**: Run `npm run build` - should succeed
5. **Runtime Testing**: 
   - Start dev server with `npm run dev`
   - Navigate to the product list page - should show loading state then products
   - Click on a product - should show loading state then product details
   - Verify error boundaries work by simulating a network error

## Additional Context

- **TanStack Query Version**: 5.90.12
- **TanStack Router Version**: 1.140.0
- **React Version**: 19.2.0
- **Reference Documentation**: https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery

## Expected Behavior

After migration:
- Loading states are handled by Suspense boundaries (not component state)
- Errors are caught by Error Boundaries (not component error handling)
- Data is always defined in components (TypeScript enforces this)
- Better code splitting and progressive loading capabilities
- Cleaner component code without manual loading/error checks

Please ensure all changes maintain the existing functionality while improving the loading and error handling patterns.
```

---

## How to Use This Prompt

1. **For GitHub Copilot Chat**: 
   - Copy the prompt template above
   - Open Copilot Chat in your IDE or GitHub UI
   - Paste the prompt and let Copilot guide you through the changes

2. **For Copilot in GitHub Issues**:
   - Create a new issue
   - Paste the prompt template as the issue description
   - Assign to @copilot to have it automatically implement the changes

3. **For Manual Implementation**:
   - Use this as a checklist and reference guide
   - Follow each step methodically
   - Verify each validation step

## Key Success Factors

✅ **Complete Context**: The prompt includes file paths, current state, and desired outcome
✅ **Specific Instructions**: Each file has clear before/after examples
✅ **Technical Details**: Import changes, syntax updates, and API differences are documented
✅ **Validation Steps**: Clear checklist to verify the migration was successful
✅ **Error Prevention**: Addresses common pitfalls (like the `enabled` option)

## Common Pitfalls to Avoid

❌ **Don't forget to add Suspense boundaries** - Without them, React will error
❌ **Don't keep the `enabled` option** - It's not supported in useSuspenseQuery
❌ **Don't keep manual loading states** - They're now handled by Suspense
❌ **Don't forget to update tests** - They need to account for Suspense behavior
❌ **Don't use optional chaining** - Data is guaranteed to exist with useSuspenseQuery

## Example: Before and After

### Before (useQuery)

```typescript
// Hook
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });
};

// Component
const IndexPage = () => {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;
  
  return <ProductGrid>{data.products.map(...)}</ProductGrid>;
};
```

### After (useSuspenseQuery)

```typescript
// Hook
export const useProducts = () => {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });
};

// Component
const IndexPage = () => {
  const { data } = useProducts(); // data is guaranteed
  
  return <ProductGrid>{data.products.map(...)}</ProductGrid>;
};

// Route configuration
export const Route = createFileRoute('/')({
  component: IndexPage,
  pendingComponent: () => <p>Loading products...</p>,
  errorComponent: ({ error }) => <p>Error: {error.message}</p>,
});
```

Notice how the component is cleaner, type-safe, and the loading/error states are handled at the route level!

## Additional Resources

- [TanStack Query - useSuspenseQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery)
- [React Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
- [TanStack Router - Suspense & Error Boundaries](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [How to write better prompts for GitHub Copilot](https://github.blog/developer-skills/github/how-to-write-better-prompts-for-github-copilot/)

---

## Prompt Quality Checklist

When writing prompts for Copilot, ensure they have:

✅ **Clear objective**: What needs to be accomplished
✅ **Current state**: What exists now
✅ **Desired outcome**: What should exist after
✅ **File paths**: Specific locations to change
✅ **Code examples**: Before/after snippets
✅ **Constraints**: What NOT to do
✅ **Validation**: How to verify success
✅ **Context**: Tech stack, versions, patterns

This prompt template follows all these best practices to maximize Copilot's effectiveness!

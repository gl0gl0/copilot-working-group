# Quick Copilot Prompt: useQuery to useSuspenseQuery Migration

Copy and paste this prompt directly into Copilot Chat or GitHub Issues:

---

**Migrate all TanStack Query useQuery hooks to useSuspenseQuery to enable React Suspense boundaries.**

## Files to Update

### Custom Hooks (2 files)
1. **src/hooks/useProducts.ts**
   - Change `useQuery` to `useSuspenseQuery` 
   - Data is no longer optional

2. **src/hooks/useProduct.ts**
   - Change `useQuery` to `useSuspenseQuery`
   - Remove `enabled` option (not supported)
   - Data is no longer optional

### Route Components (2 files)
3. **src/routes/index.tsx**
   - Remove `isLoading` and `error` destructuring
   - Remove manual loading/error JSX (`{isLoading && ...}`, `{error && ...}`)
   - Remove optional chaining (`data &&`) since data is guaranteed
   - Add `pendingComponent` to Route config for loading state
   - Add `errorComponent` to Route config for error handling

4. **src/routes/products/$productId.tsx**
   - Same changes as index.tsx above

### Components (4 files - remove optional chaining)
- **src/components/ProductActions/index.tsx** - Change `product && addToCart(product)` to `addToCart(product)`
- **src/components/ProductMeta/index.tsx** - Change `product?.brand` to `product.brand`, etc.
- **src/components/ProductImage/index.tsx** - Remove `product?.` optional chaining
- **src/components/ProductInfo/index.tsx** - Remove `product?.` optional chaining

### Tests (1 file)
5. **src/components/ProductDetail/ProductDetail.test.tsx**
   - Wrap test components with Suspense boundaries
   - Update assertions as needed

## Key Implementation Details

**Import Change:**
```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
```

**Hook Change Example:**
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

**Route Config Change Example:**
```typescript
export const Route = createFileRoute('/')({
  component: IndexPage,
  pendingComponent: () => <p>Loading products...</p>,
  errorComponent: ({ error }) => <p>Error: {error.message}</p>,
});
```

**Component JSX Change Example:**
```typescript
// Before
{isLoading && <p>Loading...</p>}
{error && <p>Error: {error.message}</p>}
{data && <ProductGrid>{data.products.map(...)}</ProductGrid>}

// After
<ProductGrid>{data.products.map(...)}</ProductGrid>
```

## Validation Checklist

After migration, run:
- [ ] `npx tsc -b` (type check)
- [ ] `npm run lint` (lint check)
- [ ] `npm test -- --run` (tests pass)
- [ ] `npm run build` (build succeeds)
- [ ] `npm run dev` (manual testing)

## Important Notes
- useSuspenseQuery does NOT support the `enabled` option
- Data is ALWAYS defined (no need for `data &&` checks)
- Loading/error states move to route-level Suspense/Error boundaries
- Tests must wrap components in Suspense boundaries

## Reference
See full guide: docs/PROMPT_GUIDE_USEQUERY_TO_USESUSPENSEQUERY.md
TanStack Docs: https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery

---

**Ready to use!** Just copy everything above (excluding this line) and paste it into Copilot Chat or create an issue with this prompt.

import { createFileRoute } from '@tanstack/react-router';
import { useProduct } from '../../hooks/useProduct';
import { Layout } from '../../components/ui/Layout';
import { Header } from '../../components/Header';
import { ProductDetail } from '../../components/ProductDetail';

const ProductPage = () => {
  const { data: product, isLoading, error } = useProduct();

  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        {isLoading && <p>Loading product...</p>}

        {error && <p>Error loading product: {error.message}</p>}

        {product && <ProductDetail />}
      </Layout.Main>
    </Layout>
  );
};

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
});

import { useProduct } from '../../hooks/useProduct';
import styles from './ProductImage.module.css';

export const ProductImage = () => {
  const { data: product } = useProduct();

  return (
    <div className={styles.imageSection}>
      <img
        src={product?.images[0] || product?.thumbnail}
        alt={product?.title}
        className={styles.image}
      />
    </div>
  );
};

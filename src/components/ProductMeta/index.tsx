import { useProduct } from '../../hooks/useProduct';
import styles from './ProductMeta.module.css';

export const ProductMeta = () => {
  const { data: product } = useProduct();

  return (
    <div className={styles.meta}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Brand</span>
        <span className={styles.metaValue}>{product?.brand || 'N/A'}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Category</span>
        <span className={styles.metaValue}>{product?.category}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Stock</span>
        <span className={styles.metaValue}>{product?.stock}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Rating</span>
        <span className={styles.metaValue}>
          ⭐ {product?.rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

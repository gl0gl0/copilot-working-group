import { useProduct } from '../../hooks/useProduct';
import styles from './ProductInfo.module.css';

export const ProductInfo = () => {
  const { data: product } = useProduct();

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product?.title}</h1>
      <p className={styles.price}>${product?.price.toFixed(2)}</p>
      <p className={styles.description}>{product?.description}</p>
    </div>
  );
};

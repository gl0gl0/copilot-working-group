import { ProductNavigation } from '../ProductNavigation';
import { ProductImage } from '../ProductImage';
import { ProductInfo } from '../ProductInfo';
import { ProductMeta } from '../ProductMeta';
import { ProductActions } from '../ProductActions';
import styles from './ProductDetail.module.css';

export const ProductDetail = () => {
  return (
    <div className={styles.container}>
      <ProductNavigation />

      <div className={styles.product}>
        <ProductImage />
        <div className={styles.infoSection}>
          <ProductInfo />
          <ProductMeta />
          <ProductActions />
        </div>
      </div>
    </div>
  );
};

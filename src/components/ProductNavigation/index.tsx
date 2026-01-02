import { Link } from '@tanstack/react-router';
import styles from './ProductNavigation.module.css';

export const ProductNavigation = () => {
  return (
    <Link to="/" className={styles.backLink}>
      ← Back to Products
    </Link>
  );
};

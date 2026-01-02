import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
}

interface CardImageProps {
  src: string;
  alt: string;
}

interface CardTitleProps {
  children: ReactNode;
}

interface CardPriceProps {
  children: ReactNode;
}

interface CardActionsProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return <div className={styles.card}>{children}</div>;
};

Card.Image = ({ src, alt }: CardImageProps) => {
  return <img src={src} alt={alt} className={styles.image} />;
};

Card.Title = ({ children }: CardTitleProps) => {
  return <h3 className={styles.title}>{children}</h3>;
};

Card.Price = ({ children }: CardPriceProps) => {
  return <p className={styles.price}>{children}</p>;
};

Card.Actions = ({ children }: CardActionsProps) => {
  return <div className={styles.actions}>{children}</div>;
};

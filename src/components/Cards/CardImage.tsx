import React from 'react';
import styles from './Card.module.css';

interface CardImageProps {
  image?: string;
  directory: string;
  additionalClassName?: string;
  onClick?: () => void;
}

const CardImage = ({
  image = 'default.png',
  directory,
  additionalClassName = '',
  onClick,
}: CardImageProps) => {
  const handleOnClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className={`${styles.cardDefault} ${additionalClassName}`}
    >
      <img
        className={styles.cardImage}
        src={`/images/${directory}/${image}`}
        alt=''
      />
    </div>
  );
};

export default CardImage;

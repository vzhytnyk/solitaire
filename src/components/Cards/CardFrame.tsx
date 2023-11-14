import { ExplicitAny } from '@/global';
import { ReactNode, forwardRef, memo } from 'react';
import styles from './Card.module.css';

interface CardFrameProps {
  onDoubleClick?: () => void; // function called when card is double clicked
  cardContainerClassName?: string; // additional classname for the container
  cardContentClassName?: string; // additional classname for the content
  children?: ReactNode; // children
  shake?: boolean;
  increase?: boolean;
}

const CardFrame = (
  {
    onDoubleClick,
    cardContainerClassName = '',
    cardContentClassName = '',
    shake,
    increase,
    children,
  }: CardFrameProps,
  ref: ExplicitAny
) => {
  return (
    <div
      ref={ref}
      className={`${styles.cardContainer} ${cardContainerClassName} ${
        shake ? styles.shakeAnimation : ''
      } ${increase ? styles.increaseAnimation : ''}`}
      onDoubleClick={() => onDoubleClick !== undefined && onDoubleClick()}
    >
      {/* eslint-disable-next-line react/forbid-dom-props */}
      <div className={styles.cardAspectRatio}>
        <div className={`${styles.cardContent} ${cardContentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(forwardRef(CardFrame));

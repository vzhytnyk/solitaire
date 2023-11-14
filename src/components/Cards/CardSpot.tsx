import React, { ReactNode, forwardRef, memo } from 'react';
import CardFrame from './CardFrame';
import { Col } from 'antd';
import { ExplicitAny } from '@/global';
import styles from './Card.module.css';

interface CardSpotProps {
  cardContainerColumns?: string; // additional className to the CardFrame container
  offset?: number; // column offset
  className?: string; // className
  children?: ReactNode; // children components
}

/**
 * Component that simply adds an empty spot outline
 */
function CardSpot(
  { offset, className = '', cardContainerColumns, children }: CardSpotProps,
  ref: ExplicitAny
) {
  return (
    <Col span={3} offset={offset} className={styles.cardSpotCol}>
      <CardFrame
        ref={ref}
        cardContainerClassName={cardContainerColumns}
        cardContentClassName={`${styles.cardSpot} ${className}`}
      >
        {children}
      </CardFrame>
    </Col>
  );
}

export default memo(forwardRef(CardSpot));

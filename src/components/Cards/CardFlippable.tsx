/* eslint-disable no-console */
import React, { forwardRef, memo, useState } from 'react';
import CardFrame from './CardFrame';
import CardImage from './CardImage';
import { ExplicitAny } from '@/global';
import styles from './Card.module.css';

interface CardFlippableProps {
  className?: string; // additional classname for the cardframe
  translationX?: number; // flip with x translation
  translationY?: number; // flip with y translation
  removeCard?: () => void; // function called after the movement
  image: string; // image of the card
  disabled?: boolean; // if disabled, cannot flip
  shake?: boolean;
  increase?: boolean;
  redoAnimation?: boolean;
}

/**
 * Component that adds to the card the possibility to flip and/or translate
 */
function CardFlippable(
  {
    className = '',
    translationX = 0,
    translationY = 0,
    removeCard,
    image,
    disabled,
    shake,
    increase,
    redoAnimation,
  }: CardFlippableProps,
  ref: ExplicitAny
) {
  const [cardFlipped, setCardFlipped] = useState(false);
  const [animationStyle, setAnimationStyle] = useState({});
  const animationStyleUndo = {
    transform: `translate(${translationX}px, ${translationY}px) rotateY(180deg)`,
  };
  const handleFlip = () => {
    if (!cardFlipped && !disabled) {
      if (translationX && translationX !== 0) {
        setAnimationStyle({
          transform: `translate(${translationX}px, ${translationY}px) rotateY(180deg)`,
        });
      } else {
        setAnimationStyle({ transform: 'rotateY(180deg)' });
      }
    }

    setCardFlipped(true);
    if (removeCard) {
      removeCard();
    }
  };

  return (
    <CardFrame
      ref={ref}
      cardContainerClassName={className}
      shake={shake}
      increase={increase}
    >
      <div
        className={styles.cardFlipContainer}
        // eslint-disable-next-line react/forbid-dom-props
        style={
          cardFlipped ? animationStyle : redoAnimation ? animationStyleUndo : {}
        }
      >
        <CardImage
          image={image}
          directory='CardsFaces'
          additionalClassName={styles.cardFlipFront}
        />
        <CardImage
          image='bg-purple.png'
          directory='CardsBackPatterns'
          additionalClassName={styles.cardFlipBack}
          onClick={handleFlip}
        />
      </div>
    </CardFrame>
  );
}

export default memo(forwardRef(CardFlippable));

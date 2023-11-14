import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardType } from '@/redux/gameBoard/gameBoard.types';
import DeckDoubleClickHandler from '../CardMoveHandlers/DoubleClickHandlers/DeckDoubleClickHandler';
import DoubleClickHandler from '../CardMoveHandlers/DoubleClickHandlers/DoubleClickHandler.component';
import { RootReducerState } from '@/global';
import SimplePile from './SimplePile.component';
import styles from './Piles.module.css';
import cardStyles from '../Cards/Card.module.css';
import DraggableCard from '../CardMoveHandlers/DragHandlers/DraggableCard.component';
import CardImage from '../Cards/CardImage';

/**
 * Component that consists of a pile (3d) of flipped cards that can be dragged
 */
function FlippedPile() {
  const dispatch = useDispatch();
  // get piles from redux
  const {
    deckPile,
    flippedPile,
    lastHint,
    startUndoAnimation,
    translationX,
    translationY,
  } = useSelector(({ Deck, GameBoard }: RootReducerState) => {
    const gameHints = GameBoard.gameHints;
    const lastIndex = gameHints.length - 1;
    return {
      deckPile: Deck.deckPile,
      flippedPile: Deck.flippedPile,
      lastHint: lastIndex >= 0 ? gameHints[lastIndex] : undefined,
      startUndoAnimation: Deck.startUndoAnimation,
      translationX: -Deck.translationX,
      translationY: -Deck.translationY - 1,
    };
  });

  const animationStyle = {
    transform: `translate(${translationX}px, ${
      deckPile?.length === 0 ? 0 : translationY
    }px) rotateY(180deg)`,
  };

  const getCards = () => {
    return flippedPile?.map((card: CardType, index: number) => {
      const handler = new DeckDoubleClickHandler(dispatch, card);
      const shake = lastHint && lastHint.source === 'flippedPile';
      return (
        <DoubleClickHandler key={card.id} handler={handler} doubleClick>
          <DraggableCard card={card} nCards={1} shake={shake}>
            <div
              className={cardStyles.cardFlipContainer}
              // eslint-disable-next-line react/forbid-dom-props
              style={
                startUndoAnimation &&
                (index === flippedPile.length - 1 || deckPile.length === 0)
                  ? animationStyle
                  : {}
              }
            >
              <CardImage
                image='flowers.png'
                directory='CardsBackPatterns'
                additionalClassName={cardStyles.cardFlipFront}
              />
              <CardImage
                image={card.image}
                directory='CardsFaces'
                additionalClassName={cardStyles.cardFlipBack}
              />
            </div>
          </DraggableCard>
        </DoubleClickHandler>
      );
    });
  };

  // return a pile of flipped cards
  return (
    <SimplePile
      pileId='flippedPile'
      pileCards={getCards()}
      pileClassName={`${styles.deckPile} ${styles.flippedPile}`}
      insideClassName={`${styles.columnPile} deckPileMobile`}
    />
  );
}

export default memo(FlippedPile);

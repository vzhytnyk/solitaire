import React, { forwardRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardType } from '@/redux/gameBoard/gameBoard.types';
import { RootReducerState } from '@/global';
import SimplePile from './SimplePile.component';
import deckActions from '@/redux/deck/deck.actions';
import gameBoardActions from '@/redux/gameBoard/gameBoard.actions';
import CardFlippable from '../Cards/CardFlippable';
import styles from './Piles.module.css';

/**
 * Component that consists of a pile (3d) of unflipped cards that can be flipped one by one (with a translation)
 */
function DeckPile() {
  const dispatch = useDispatch();
  // get piles from redux
  const {
    deckPile,
    translationX,
    translationY,
    lastHint,
    startRedoAnimation,
    startRedoResetAnimation,
  } = useSelector(({ Deck, GameBoard }: RootReducerState) => {
    const gameHints = GameBoard.gameHints;
    const lastIndex = gameHints.length - 1;

    return {
      deckPile: Deck.deckPile,
      translationX: Deck.translationX,
      translationY: Deck.translationY,
      lastHint: lastIndex >= 0 ? gameHints[lastIndex] : undefined,
      startRedoAnimation: Deck.startRedoAnimation,
      startRedoResetAnimation: Deck.startRedoResetAnimation,
    };
  });

  // swap from deck to flipped pile
  const handleDeckSwap = async (cardId: number) => {
    // wait for the css animation to end
    setTimeout(() => {
      dispatch(deckActions.flipDeckPile());
      // add one movement of the game
      dispatch(
        gameBoardActions.addGameMove({
          source: 'deckPile',
          target: 'flippedPile',
          cards: [],
        })
      );
    }, 600);
  };

  // renders cards components that can be flipped (with translation)
  const getCards = () => {
    const increase =
      lastHint &&
      lastHint.source === 'deckPile' &&
      lastHint.target === undefined;

    const cardsArray = deckPile?.map((card: CardType, index: number) => (
      <CardFlippable
        key={`deck_${card.id}`}
        image={card.image}
        increase={increase}
        removeCard={() => handleDeckSwap(card.id)}
        translationX={translationX}
        translationY={startRedoResetAnimation ? 0 : translationY}
        redoAnimation={
          (startRedoAnimation && index === deckPile.length - 1) ||
          startRedoResetAnimation
        }
      />
    ));
    return cardsArray;
  };

  // return a pile of cards to be flipped
  return (
    <SimplePile
      pileId='deckPile'
      pileCards={getCards()}
      offset={2}
      pileClassName={`${styles.deckPileIndex} ${styles.flippedPile}`}
      insideClassName={`${styles.columnPile} deckPileMobile`}
    />
  );
}

export default memo(forwardRef(DeckPile));

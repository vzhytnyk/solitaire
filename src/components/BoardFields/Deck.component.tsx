import React, { memo } from 'react';
import DeckPile from '../Piles/DeckPile.component';
import FlippedPile from '../Piles/FlippedPile.component';

/**
 * Component that unites the Deck pile and the Flipped pile
 */
function Deck() {
  return (
    <>
      <DeckPile />
      <FlippedPile />
    </>
  );
}

export default memo(Deck);

'use client';
import { RootReducerState } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import HintHandler from '../CardMoveHandlers/DoubleClickHandlers/HintHandler';
import DoubleClickHandler from '../CardMoveHandlers/DoubleClickHandlers/DoubleClickHandler.component';

function HintButton() {
  const dispatch = useDispatch();

  const { columns, goals, deckPile, flippedPile, gameHints, nHints } =
    useSelector(({ Deck, Columns, Goal, GameBoard }: RootReducerState) => {
      return {
        columns: Columns.columns,
        goals: Goal.goals,
        deckPile: Deck.deckPile,
        flippedPile: Deck.flippedPile || [],
        gameHints: GameBoard.gameHints,
        nHints: GameBoard.nHints,
      };
    });

  // create copy of the flipped pile to then send it reversed to the handler
  const flippedCopy = [...flippedPile];

  // create the hint handler
  const handler = new HintHandler(
    dispatch,
    columns,
    goals,
    deckPile,
    flippedCopy.reverse(),
    gameHints
  );
  // return the button with the double click handler and wrapped in a badge with the current number of hints given
  return (
    <DoubleClickHandler handler={handler} doubleClick={false}>
      <button>Hint</button>
    </DoubleClickHandler>
  );
}

export default HintButton;

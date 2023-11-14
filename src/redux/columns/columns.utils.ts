/* eslint-disable max-lines */
import { ExplicitAny } from "@/global";
import { CardType } from "../gameBoard/gameBoard.types";

// ********************************************************
// HELPER FUNCTIONS

/**
 * Checks if the movement respects the game rules
 * @param firstCard first card of the pile to add to a column
 * @param finalCard final card of the column to add the first card
 */
export const isValidMovement = (firstCard: CardType, finalCard?: CardType) => {
  // if the column has no cards, then simply return true
  if (!finalCard) {
    return true;
  }
  // if the cards have the same color, then return false
  if (firstCard.cardColor === finalCard.cardColor) {
    return false;
  }
  // if the card being added has a number that is not one value higher, then return false
  if (finalCard.cardNumber - 1 !== firstCard.cardNumber) {
    return false;
  }

  // if both rules were respected, return true
  return true;
};

// ********************************************************
// INITIAL SETTINGS FUNCTIONS

/**
 * Sets additional info for the column cards
 * @param columns
 */
export const createColumns = (
  columns: Record<string, Array<CardType>> = {},
  keepFlipped: boolean
) => {
  // get the cards of each column
  const columnValues: Array<Array<CardType>> = Object.values(columns) || [];

  // add the flipped value to each card (the last one of each column will receive the value true)
  const cardsFlippedSet = columnValues?.map(
    (values: Array<CardType>, columnIndex: number) =>
      values.map((value: CardType, valueIndex: number) => {
        return {
          ...value,
          flipped: keepFlipped ? value.flipped : valueIndex === columnIndex
        };
      })
  );

  // create array with all the cards columns needed
  const columnKeys = Object.keys(columns);

  // add to each column the corresponding cards
  let finalResult = {};
  columnKeys.map(
    (pile: string, index: number) =>
      (finalResult = {
        ...finalResult,
        [pile]: cardsFlippedSet[index]
      })
  );

  return finalResult;
};

// ********************************************************
// SWAPPING FUNCTIONS

/**
 * Swap cards from one column to the other
 * @param columns
 * @param cardsDragging cards that were being dragged from another column
 * @param initialId id of the column the cards were being dragged from
 * @param finalId id of the target column
 */
export const swapColumns = (
  columns: Record<string, Array<CardType>>,
  cardsDragging: Array<CardType> = [],
  initialId = "column1Pile",
  finalId: string
) => {
  // set the initial value as false and only if the movement indeed caused a flip it will be set to true
  let movementWithFlip = false;

  // create copy of the column the cards come from
  const initialCol = [...columns[initialId]];
  // get the index of the column "break"
  const indexToDelete = initialCol.length - cardsDragging.length;
  // remove the cards from the initial column
  initialCol.splice(indexToDelete, cardsDragging.length);
  // get the number of cards left in the initial column
  const cardsLeft = initialCol.length;

  // create copy of the destination column
  const finalCol = [...columns[finalId]];
  // create copy of the cards that have to be swapped
  const cardsSwapping = [...cardsDragging];

  // check if the movement respects the rules of the game (compare the first card to add with the last card of the destination column)
  if (isValidMovement(cardsSwapping[0], finalCol[finalCol.length - 1])) {
    // add the swapped cards to the final column
    cardsSwapping.map((card: CardType) =>
      finalCol.push({ ...card, cardField: finalId })
    );

    // if the cardsLeft is bigger than 0, there are more cards in the initial column
    if (cardsLeft > 0) {
      // get the last card of the initial column
      const lastCard = cardsLeft - 1;

      // if the last card has flipped = false, then make it true
      if (!initialCol[lastCard].flipped) {
        initialCol[lastCard] = {
          ...initialCol[lastCard],
          flipped: true
        };
        // therefore, this movement caused a flip
        movementWithFlip = true;
      }
    }

    // return all the changes made in the initial and final columns
    // the movement was valid, so sendBack is false
    // return the final value of the movement with flip
    console.log('return', {
      columns: {
        ...columns,
        [initialId]: initialCol,
        [finalId]: finalCol
      },
      sendBack: false,
      movementWithFlip
    })
    return {
      columns: {
        ...columns,
        [initialId]: initialCol,
        [finalId]: finalCol
      },
      sendBack: false,
      movementWithFlip
    };
  }

  // if the movement was invalid, no changes were made
  // so simply return the send back flag signaling that the movement was not done and reset the cardDragging states
  return {
    sendBack: true
  };
};

/**
 * Undo the swap movement between 2 columns
 * @param columns
 * @param initialId id of the column the cards will be removed from
 * @param finalId id of the column the cards will be added to
 * @param nCards number of cards to swap
 * @param movementWithFlip the original swap caused a flip
 * @param flipInitialCol if true, then instead of flipping the cards from the final column, flip from the initial column
 */
export const undoSwapColumns = (
  columns: Record<string, Array<CardType>>,
  initialId: string,
  finalId: string,
  nCards: number,
  movementWithFlip: boolean,
  flipInitialCol?: boolean
) => {
  // create a copy of the initial column
  const initialCol = [...columns[initialId]];
  // create a copy of the final column
  const finalCol = [...columns[finalId]];

  // get the cards to swap
  const cardsToSwap = initialCol.splice(-nCards, nCards);

  // check if the movement caused a flip
  if (movementWithFlip) {
    // flip the cards from the initial column
    if (flipInitialCol) {
      // get the index of the last card from the initial column
      const lastInitialCol = initialCol.length - 1;
      // flip the last card back
      initialCol[lastInitialCol] = {
        ...initialCol[lastInitialCol],
        flipped: true
      };
    } else {
      // flip the cards from the final column
      // get the index of the last card from the final column
      const lastFinalCol = finalCol.length - 1;
      // flip the last card back
      finalCol[lastFinalCol] = { ...finalCol[lastFinalCol], flipped: false };
    }
  }

  // add the swapped cards to the final column (make sure that it is flipped)
  cardsToSwap.map((card: CardType) =>
    finalCol.push({ ...card, flipped: true, cardField: finalId })
  );

  // return the changes made in the initial and final column
  return {
    columns: {
      ...columns,
      [initialId]: initialCol,
      [finalId]: finalCol
    }
  };
};

// ********************************************************
// DRAGGING FUNCTIONS

/**
 * Sets the cards that are currently being dragged
 * @param columns
 * @param columnId id of the column the cards come from
 * @param nCards number of cards to add
 */
export const setCardDragging = (
  columns: Record<string, Array<CardType>>,
  columnId: string,
  nCards: number
) => {
  // create copy of the initial column
  const initialCol = [...columns[columnId]];
  // get from what index to slice
  const indexToDelete = initialCol.length - nCards;
  // get the cards to swap and also remove them from the initial column
  const cardsToSwap = initialCol.splice(indexToDelete, nCards);

  // check if the movement may cause a flip
  // if the column has more than one card (if it had only one, then it would be flipped)
  // and if the last card is not flipped, then the movement will cause a card flip
  const movementWithFlip =
    initialCol.length > 1 && !initialCol[indexToDelete - 1].flipped;

  return {
    cardDragging: cardsToSwap,
    cardDraggingCol: columnId,
    movementWithFlip
  };
};

/**
 * Adds the cards being dragged to the destination column
 * @param columns
 * @param finalId id of the column the cards will be added to
 * @param cardDragging cards that are being dragged
 */
export const addDragginCardsToColumn = (
  columns: Record<string, Array<CardType>>,
  finalId: string,
  cardDragging: Array<CardType>
) => {
  // create a copy of the destination column
  const finalCol = [...columns[finalId]];

  // check if the movement respects the game rules
  if (isValidMovement(cardDragging[0], finalCol[finalCol.length - 1])) {
    // add the swapped cards to the final column
    cardDragging.map((card: CardType) =>
      finalCol.push({ ...card, flipped: true, cardField: finalId })
    );

    // returns the changes in the destination column
    // since the movement was valid, there is no need to send them back
    // reset the cardDragging and cardDraggingCol
    return {
      columns: { ...columns, [finalId]: finalCol },
      sendBack: false
    };
  }

  // since the movement was invalid, it is necessary to send the card back to the correct place
  return {
    sendBack: true
  };
};

export const removeDraggedCard = (
  columns: Record<string, Array<CardType>>,
  columnId: string
) => {
  // create copy of the column
  const tempCol = [...columns[columnId]];
  // remove the last card
  tempCol.splice(-1, 1);

  // get index of last card
  const lastCard = tempCol.length - 1;

  // if the last card has flipped = false, then make it true
  if (lastCard > -1 && !tempCol[lastCard].flipped) {
    tempCol[lastCard] = {
      ...tempCol[lastCard],
      flipped: true
    };
  }

  return {
    columns: {
      ...columns,
      [columnId]: tempCol
    }
  };
};

// ********************************************************
// REMOVE/ADD CARDS FUNCTIONS

/**
 * Adds back to a column, a card from a undo/redo movement
 * @param columns
 * @param columnId id of the column to add the card to
 * @param card card to be added
 * @param movementWithFlip true if the move caused a card flip
 */
export const addCardToColumn = (
  columns: Record<string, Array<CardType>>,
  columnId: string,
  card: CardType,
  movementWithFlip?: boolean
) => {
  // create a copy of the column
  const column = [...columns[columnId]];
  // get the number of cards in the column
  const nCards = column.length;

  // check if the column has cards and if the movement caused a card flip
  if (nCards > 0 && movementWithFlip) {
    // flip back the column last card
    column[nCards - 1] = { ...column[nCards - 1], flipped: false };
  }

  // add the cards to the final column
  column.push({ ...card, flipped: true, cardField: columnId });

  // return the changes in the column
  return {
    columns: {
      ...columns,
      [columnId]: column
    },
    doubleClickTarget: undefined
  };
};

/**
 * Removes back N cards from a column (the cards are from a undo-redo movement)
 * @param columns
 * @param columnId id of the column the cards will be removed from
 * @param nCards number of cards to remove
 * @param movementWithFlip true if the move caused a card flip
 */
export const removeNCardsFromColumn = (
  columns: Record<string, Array<CardType>>,
  columnId: string,
  nCards: number,
  movementWithFlip: boolean
) => {
  // create copy of the column
  const tempCol = [...columns[columnId]];
  // remove the last card
  tempCol.splice(-nCards, 1);

  // get index of last card
  const lastCard = tempCol.length - 1;

  let finalMovementWithFlip = movementWithFlip;
  // if the last card has flipped = false, then make it true
  if (lastCard >= 0 && movementWithFlip) {
    finalMovementWithFlip = tempCol[lastCard].flipped === false;
    tempCol[lastCard] = {
      ...tempCol[lastCard],
      flipped: true
    };
  }

  return {
    columns: {
      ...columns,
      [columnId]: tempCol
    },
    movementWithFlip: finalMovementWithFlip
  };
};

// ********************************************************
// DOUBLE CLICK FUNCTIONS

/**
 * Get the first valid target column, give preference to a not empty column
 * @param columns
 * @param firstCard first card of the cards to move
 */
export const getValidTarget = (
  columns: Record<string, Array<CardType>>,
  firstCard: CardType,
  previousHints: Array<Record<string, string>> = []
) => {
  // get all the valid spots
  const validSpots = Object.keys(columns).filter((column: string) => {
    const targetLastIndex = columns[column].length - 1;
    return (
      isValidMovement(
        firstCard,
        targetLastIndex < 0 ? undefined : columns[column][targetLastIndex]
      ) &&
      !previousHints.some(
        (hint: ExplicitAny) =>
          hint.source === firstCard.cardField &&
          (targetLastIndex >= 0 ? hint.target === column : true)
      )
    );
  });

  // if there is none or only one, return it
  if (validSpots.length <= 1) {
    return validSpots[0];
  } else {
    // if there are more, find the first not empty column
    const validNotEmptySpot = validSpots.find((spot: string) => {
      return columns[spot].length > 0;
    });

    // if a valid not empty column was found, return it
    // if not, return the first valid empty column
    return validNotEmptySpot || validSpots[0];
  }
};

/**
 * Checks if there is a valid move to a column
 * @param columns
 * @param cardMoving card to be moved
 * @param doubleClickTarget current value store at the doubleClickTarget state
 */
export const checkDoubleClickValid = (
  columns: Record<string, Array<CardType>>,
  cardMoving: CardType,
  doubleClickTarget?: boolean | string
) => {
  // get the first possible target column id
  const targetId = getValidTarget(columns, cardMoving);

  // if there is no valid target column, toggle the doubleClickTarget
  // if there is a valid target column, save its id
  return {
    doubleClickTarget: targetId === undefined ? !doubleClickTarget : targetId
  };
};

/**
 * Checks if there is a valid move to another column, if so swap the cards
 * @param columns
 * @param sourceId id of the source column
 * @param nCards number of cards to swap
 * @param doubleClickTarget current value store at the doubleClickTarget state
 */
export const checkColumnSwapDoubleClickValid = (
  columns: Record<string, Array<CardType>>,
  sourceId: string,
  nCards: number,
  doubleClickTarget?: boolean | string
) => {
  // create copy of the source column
  const copy = [...columns[sourceId]];
  // get the index of the last card
  const sourceLastIndex = copy.length;
  const topRemaningIndex = sourceLastIndex - nCards - 1;
  const topRemaningCard =
    topRemaningIndex >= 0 ? copy[topRemaningIndex] : undefined;
  const movementWithFlip = topRemaningCard
    ? topRemaningCard.flipped === false
    : false;

  // get the cards that are moving
  const cardsMoving = copy.splice(sourceLastIndex - nCards, nCards);
  // get the first possible target column id
  const targetId = getValidTarget(columns, cardsMoving[0]);

  // if there is a valid target column, then save it, the cards that were swapped and the respective columns final result
  if (targetId) {
    return {
      doubleClickTarget: targetId,
      movingCards: cardsMoving,
      movementWithFlip: movementWithFlip
    };
  }
  // if there is no valid target column, toggle the doubleClickTarget and reset the moving cards (the swap result holds nothing)
  return {
    doubleClickTarget: !doubleClickTarget,
    movingCards: undefined
  };
};

export const checkMoveFromAnyColumn = (
  columns: Record<string, Array<CardType>>,
  flippedPile: Array<CardType>,
  previousHints: Array<Record<string, string>>,
  doubleClickTarget?: boolean | string
) => {
  let validTargetResult;
  const finalObject: Record<string, Array<CardType>> = {
    ...columns,
    flippedPile
  };
  // for each column
  const firstValidMoveAvailable = Object.keys(finalObject).find(
    (columnId: string) => {
      // get the first flipped card
      const firstFlippedCard = finalObject[columnId].find(
        (card: CardType) => card.flipped
      );
      // if it is not undefined
      if (firstFlippedCard) {
        validTargetResult = getValidTarget(
          columns,
          firstFlippedCard,
          previousHints
        );
        return validTargetResult !== undefined;
      }
      return false;
    }
  );

  return {
    doubleClickTarget:
      firstValidMoveAvailable === undefined
        ? !doubleClickTarget
        : validTargetResult,
    hintSource:
      firstValidMoveAvailable === undefined
        ? undefined
        : firstValidMoveAvailable
  };
};

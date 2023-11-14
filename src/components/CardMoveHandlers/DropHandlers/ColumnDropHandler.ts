import { Dispatch } from "redux";
import { GameMove } from "@/redux/gameBoard/gameBoard.types";
import columnsActions from "@/redux/columns/columns.actions";
import deckActions from "@/redux/deck/deck.actions";
import gameBoardActions from "@/redux/gameBoard/gameBoard.actions";
import goalActions from "@/redux/goal/goal.actions";

class ColumnDrop {
  dispatch: Dispatch;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  /**
   * Handles the drop of a card
   * @param move the card move that was initiated
   * @param fieldDropedTo field the card was dropped to (should be a goal field)
   */
  onDrop(move: GameMove, fieldDropedToTemp: string) {
    if (move.cards[0]?.cardField.includes("column")) {
      // if it was a column swap, then swap the cards from one column to the other
      this.dispatch(columnsActions.swapColumns(fieldDropedToTemp));
      // then reset
      this.dispatch(columnsActions.resetCardDragging());
    }
    // if the card came from the deck or from a goal
    else {
      // deck -> column | goal -> column
      // call the goal action that adds the dragging cards to the goal
      this.dispatch(
        columnsActions.addDraggingCardsToColumn(fieldDropedToTemp, move.cards)
      );

      // then reset the values at the deck redux
      this.dispatch(deckActions.resetCardDragging());
      // then reset the values at the deck redux
      this.dispatch(goalActions.resetCardDragging());
    }
  }

  /**
   * When the sendBackColumn changes, it means that a move to a column has finished
      - if it is true, then the move should not happen (do nothing)
      - if it is false, then the move should happen:
        - send the cardsDragging to the corresponding target (goal or column);
        - remove the card from the column it came from
  */
  handleRemoveCard(finalMove: GameMove) {
    // if the card came from the deck pile
    if (finalMove.cards[0]?.cardField === "deckPile") {
      // then remove the card that still is in the flipped pile and clear cardDragging state
      this.dispatch(deckActions.removeCardFromFlipped());
    } else {
      // if the card came from a goal
      if (finalMove.cards[0]?.cardField.includes("goal")) {
        // then remove the card that still is in the goal pile and clear cardDragging state
        this.dispatch(
          goalActions.removeCardFromGoal(finalMove.cards[0]?.cardField)
        );
      }
      // the column -> column move is handled at the goal redux
    }
    // clear columns's send back state
    this.dispatch(columnsActions.resetCardDragging());
    // add game move
    this.dispatch(gameBoardActions.addGameMove(finalMove));
  }
}

export default ColumnDrop;

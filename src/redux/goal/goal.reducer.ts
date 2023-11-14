/* eslint-disable indent */
import {
  addCardToGoal,
  addDragginCardsToGoal,
  checkDoubleClickValid,
  checkGoalSwapDoubleClickValid,
  checkMoveFromAnyColumns,
  removeCardFromGoal,
  setCardDragging,
  swapGoals,
  undoSwapGoals
} from "./goal.utils";
import { ActionsCreators } from "./goal.actions";
import { CardType } from "../gameBoard/gameBoard.types";
import GoalActionTypes from "./goal.types";

export interface InitialGoal {
  goals: {
    // cards array of each goal
    goal1Pile: Array<CardType>;
    goal2Pile: Array<CardType>;
    goal3Pile: Array<CardType>;
    goal4Pile: Array<CardType>;
  };
  cardDragging?: Array<CardType>; // cards original from the goals that are being dragged
  cardDraggingGoal?: string; // id of the cards dragging's goal
  sendBack?: boolean; // flag that announces if the movement to the goal, was invalid
  doubleClickTarget?: boolean | string;
  hintSource?: boolean | string;
  gameOver: boolean; // flag to announce when the game has ended
}

const INITIAL_GOAL: InitialGoal = {
  goals: {
    goal1Pile: [],
    goal2Pile: [],
    goal3Pile: [],
    goal4Pile: []
  },
  cardDragging: undefined,
  cardDraggingGoal: undefined,
  sendBack: undefined,
  doubleClickTarget: undefined,
  hintSource: undefined,
  gameOver: false
};

const goalReducer = (state = INITIAL_GOAL, action: ActionsCreators) => {
  switch (action.type) {
    // ********************************************************
    // INITIAL SETTINGS ACTIONS

    /**
     * Stores the initial goals in the Redux State:
     *    - stores the goal object created at createGoals function
     *    - resets cardDragging, cardDraggingCol and sendBack;
     */
    case GoalActionTypes.SET_INITIAL_GOALS:
      return {
        goals: action.goals,
        cardDragging: undefined,
        cardDraggingCol: undefined,
        sendBack: undefined,
        doubleClickTarget: undefined,
        hintSource: undefined,
        gameOver: false
      };

    // ********************************************************
    // SWAPPING ACTIONS

    /**
     * Swap 1 card from one goal to the other
     *    - saves the changes in the initialGoal and finalGoal;
     *    - if the movement is not valid, then sendBack is set to true, if not, to false;
     */
    case GoalActionTypes.SWAP_GOALS:
      const swapResult = swapGoals(
        state.goals,
        state.cardDragging,
        state.cardDraggingGoal,
        action.finalId
      );
      return { ...state, ...swapResult };

    /**
     * Undo swap of goals, sends back 1 from the target goal to the source goal
     *    - save the changes done at the source and target goals
     */
    case GoalActionTypes.UNSWAP_GOALS:
      const unswapResult = undoSwapGoals(
        state.goals,
        action.target,
        action.source
      );
      return { ...state, ...unswapResult };

    // ********************************************************
    // DRAGGING ACTIONS

    /**
     * Starts dragging 1 card and saves its initial goal id
     *    - gets the cards that are being dragged from the goal and save it in the cardsDragging state;
     *    - save the id of the goal in the cardsDraggingGoal state;
     */
    case GoalActionTypes.DRAG_GOAL_CARDS:
      const draggingResult = setCardDragging(state.goals, action.goalId);
      return {
        ...state,
        ...draggingResult
      };

    /**
     * Adds the cards that were being dragged to the selected goal
     *    - if the movement was valid, then:
     *        - add the cards to the corresponding goal pile;
     *        - sets sendBack to false;
     *        - resets cardsDragging;
     *    - if the movement was invalid, then simply set the sendBack value to true;
     */
    case GoalActionTypes.ADD_DRAGGING_CARDS_TO_GOAL:
      const addResult = addDragginCardsToGoal(
        state.goals,
        action.finalId,
        action.cardDragging
      );
      return {
        ...state,
        ...addResult
      };

    /**
     * Resets the currently saved card that was being dragged and its initial goal id
     */
    case GoalActionTypes.RESET_GOAL_CARD_DRAGGING:
      return {
        ...state,
        sendBack: undefined,
        cardsDragging: undefined,
        cardDraggingGoal: undefined,
        doubleClickTarget: !state.doubleClickTarget,
        gameOver: false
      };

    // ********************************************************
    // REMOVE/ADD CARDS ACTIONS

    /**
     * Sends a card to a goal pile
     *    - adds the card to the correspoding goal
     */
    case GoalActionTypes.ADD_CARD_TO_GOAL:
      const sendUndoResult = addCardToGoal(
        state.goals,
        action.goalId,
        action.card
      );
      return {
        ...state,
        ...sendUndoResult
      };

    /**
     * Removes 1 card from a goal pile
     */
    case GoalActionTypes.REMOVE_CARD_FROM_GOAL:
      const removeCardResult = removeCardFromGoal(state.goals, action.goalId);
      return {
        ...state,
        ...removeCardResult
      };

    // ********************************************************
    // DOUBLE CLICK ACTIONS

    /**
     * Checks if there is a goal pile a card from another type of pile can be moved to
     *    - check if there is any valid spot
     *    - save the target goal id result
     *    - if there were no possible moves, the target result works as a flag
     */
    case GoalActionTypes.CHECK_DOUBLE_CLICK_VALID:
      const checkDoubleClickResult = checkDoubleClickValid(
        state.goals,
        action.card,
        state.doubleClickTarget
      );
      return { ...state, ...checkDoubleClickResult };

    /**
     * Checks if there is a goal pile a goal pile card can be moved to:
     *    - check if there is any valid spot
     *    - if there is a possible move, then swap the cards
     *    - save the target goal id result, the cards that were swapped and the swapping result
     *    - if there were no possible moves, the target result works as a flag
     */
    case GoalActionTypes.CHECK_GOAL_SWAP_DOUBLE_CLICK_VALID:
      const checkGoalSwapDoubleClickResult = checkGoalSwapDoubleClickValid(
        state.goals,
        action.goalId,
        action.card,
        state.doubleClickTarget
      );

      return { ...state, ...checkGoalSwapDoubleClickResult };

    case GoalActionTypes.CHECK_MOVE_FROM_ANY_COLUMN:
      const checkMoveFromColumnsResult = checkMoveFromAnyColumns(
        state.goals,
        action.columns,
        action.previousHints,
        state.doubleClickTarget
      );
      return { ...state, ...checkMoveFromColumnsResult };

    // ********************************************************

    default:
      return state;
  }
};

export default goalReducer;

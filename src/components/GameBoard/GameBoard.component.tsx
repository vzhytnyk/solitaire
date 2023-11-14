'use client';
import { ExplicitAny, RootReducerState } from '@/global';
import columnsActions from '@/redux/columns/columns.actions';
import deckActions from '@/redux/deck/deck.actions';
import gameBoardActions from '@/redux/gameBoard/gameBoard.actions';
import goalActions from '@/redux/goal/goal.actions';
import { memo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropHandler from '@/components/CardMoveHandlers/DropHandlers/DropHandler.component';
import BoardEmptySpots from '@/components/BoardFields/BaseEmptySpots';
import GameColumnWrapper from '../BoardFields/GameColumnWrapper.component';
import CustomDragLayer from '../CardMoveHandlers/DragHandlers/CustomDragLayer.component';
import styles from './GameBoard.module.css';
import GameTopRow from '../BoardFields/GameTopRow.component';

function GameBoard() {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const history = useHistory();

  // create refs for the deck and flipped piles
  const deckRef: ExplicitAny = useRef();
  const flippedRef: ExplicitAny = useRef();

  // get all necessary elements from redux
  const {
    deckPile,
    flippedPile,
    column1Pile,
    column2Pile,
    column3Pile,
    column4Pile,
    column5Pile,
    column6Pile,
    column7Pile,
    goal1Pile,
    goal2Pile,
    goal3Pile,
    goal4Pile,
    gameMoves,
  } = useSelector(({ GameBoard, Goal, User, Pages }: RootReducerState) => ({
    gameMoves: GameBoard.gameMoves,
    gameOver: Goal.gameOver,
    deckPile: GameBoard.deckPile,
    flippedPile: GameBoard.flippedPile,
    column1Pile: GameBoard.column1Pile,
    column2Pile: GameBoard.column2Pile,
    column3Pile: GameBoard.column3Pile,
    column4Pile: GameBoard.column4Pile,
    column5Pile: GameBoard.column5Pile,
    column6Pile: GameBoard.column6Pile,
    column7Pile: GameBoard.column7Pile,
    goal1Pile: GameBoard.goal1Pile,
    goal2Pile: GameBoard.goal2Pile,
    goal3Pile: GameBoard.goal3Pile,
    goal4Pile: GameBoard.goal4Pile,
    // savedGame: User.user.savedGame || {},
  }));

  // ---------------------------------------------------------
  // Create Game

  /**
   * Triggered when the component is mounted
   * Stores the deck and flipped ref at the redux
   * Starts the page joyride
   * And either creates a new random game or resumes a previously saved game
   */
  const mountGameBoard = () => {
    // set this refs at the redux
    dispatch(deckActions.setRefs(deckRef, flippedRef));

    // create new deck
    dispatch(gameBoardActions.createGame());
  };

  useEffect(mountGameBoard, []);

  /**
   * Triggered when the deck pile changes (and therefore, all the other columns and goals as well)
   * Distributes the decks *created* to the right redux
   */
  const setNewGamePiles = () => {
    // this is only done when a new game is created!

    // set the initial deck
    dispatch(deckActions.setInitialDeck(deckPile, flippedPile));
    // set the initial columns
    dispatch(
      columnsActions.setInitialColumns({
        column1Pile,
        column2Pile,
        column3Pile,
        column4Pile,
        column5Pile,
        column6Pile,
        column7Pile,
      })
    );
    // set the initial goals
    dispatch(
      goalActions.setInitialGoals({
        goal1Pile,
        goal2Pile,
        goal3Pile,
        goal4Pile,
      })
    );
  };
  useEffect(setNewGamePiles, [deckPile]);

  /**
   * Triggered by the game moves
   * When a *new* game starts, it is only added to the users count when at least a move is done
   */
  //   const addGameToUser = () => {
  //     if (gameMoves === 1) {
  //       dispatch(userActions.addGame());
  //     }
  //   };
  //   useEffect(addGameToUser, [gameMoves]);

  // ---------------------------------------------------------
  console.log('gameMoves', gameMoves);
  return (
    <DropHandler className={styles.mainPage}>
      {/* current game status display (time and moves) */}
      {/* <GamePlayInfo /> */}
      <div style={{ height: '103.5px', width: '100%' }}></div>

      {/* empty spots */}
      <BoardEmptySpots />
      {/* top row of the game, includes the deck and the 4 goal spots */}
      <GameTopRow />
      {/* bottom row of the game, includes all the 7 columns */}
      <GameColumnWrapper />
      {/* game options buttons */}
      {/* <GameOptions /> */}
      {/* preview of the card being dragged */}
      <CustomDragLayer />
    </DropHandler>
  );
}

export default memo(GameBoard);

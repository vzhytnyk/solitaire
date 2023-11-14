'use client';

import UndoButton from '@/components/Buttons/UndoButton';
import GameBoard from '@/components/GameBoard/GameBoard.component';
import styles from './page.module.css';
import HintButton from '@/components/Buttons/HintButton';

export default function Home() {
  return (
    <main
      style={{
        background: 'linear-gradient(0deg, #784AA3 0%, #784AA3 100%), #FFF',
        height: '100%',
      }}
    >
      <GameBoard />
      <div className={styles.buttons}>
        <UndoButton />
        <HintButton />
      </div>
    </main>
  );
}

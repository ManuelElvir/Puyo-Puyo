import { useCallback, useEffect, useId, useMemo, useState } from "react";

import styles from "./Board.module.scss";
import Puyo from "../Puyo";
import PuyoBlock from "../PuyoBlock";
import { PUYO } from "../../types/puyo";
import { randomPosition, randomPosition2, calculateScore, randomColor, canContinuePlaying } from "../../functions/puyo";


interface BoardProps {
  speed: number;
  difficulty: 'easy' | 'medium' | 'hard'
}

const Board = ({ speed = 1, difficulty = 'medium' }: BoardProps) => {
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0);
  const [puyos, setPuyos] = useState<PUYO[]>([]);
  const [currentPuyos, setCurrentPuyos] = useState<PUYO[]>([]);
  const boardId = useId()


  const addNewPuyos = useCallback(() => {

    const {nextScore, nextPuyos} =  calculateScore([...puyos, ...currentPuyos])
    
    setScore(prev => prev+nextScore)
    setPuyos(nextPuyos)

    // setPuyos((prevPuyos) => {
    //   return [...prevPuyos, ...currentPuyos];
    // });
    
    const pos1 = randomPosition()
    const pos2 = randomPosition2(pos1)

    if(canContinuePlaying(nextPuyos, pos1, pos2)){
      setCurrentPuyos(prev => {
        let lastId = 0
        if (prev.length > 1) {
          lastId = parseInt(prev[1].id.replace(`${boardId}_`, ''));
          console.log('lastId', lastId);
        }
        return [
          { id: `${boardId}_${lastId + 1}`, type: randomColor(), pos: pos1 },
          { id: `${boardId}_${lastId + 2}`, type: randomColor(), pos: pos2 },
        ]
      })
    }
    else {
      setGameOver(true)
      alert("Jeux terminé! score : " + nextScore)
    }
    
  }, [boardId, currentPuyos, puyos]);


  useEffect(() => {
    addNewPuyos()
  }, [])
  

  const getDeepestAvailablePosition = useCallback((x: number) => {
    const posY = puyos.filter(item => item.pos.x === x).reduce(function (lastDeepestPosition, currentItem) {
      if (currentItem.pos.y < lastDeepestPosition) return currentItem.pos.y
      else return lastDeepestPosition
    }, 12)
    return posY - 1
  }, [puyos])

  const isVertical = useMemo(() => {
    if (currentPuyos.length > 1 && currentPuyos[0].pos.x === currentPuyos[1].pos.x) return true;
    else return false;
  }, [currentPuyos])

  const CanContinueFalling = useCallback((duoPuyos: PUYO[]) => {
    if (duoPuyos[0].pos.x === duoPuyos[1].pos.x) {
      if (duoPuyos[0].pos.y < getDeepestAvailablePosition(duoPuyos[0].pos.x) &&
        duoPuyos[1].pos.y < getDeepestAvailablePosition(duoPuyos[1].pos.x)) {
        return true
      }
      else {
        return false;
      }
    }
    else {
      if (
        duoPuyos[0].pos.y < getDeepestAvailablePosition(duoPuyos[0].pos.x) ||
        duoPuyos[1].pos.y < getDeepestAvailablePosition(duoPuyos[1].pos.x)
      ) {
        return true;
      }
      else {
        return false;
      }
    }
  }, [getDeepestAvailablePosition])

  const fallSlowly = useCallback(() => {
    if(gameOver) return
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      nexCurrentPuyos[0].pos.y += 1
      nexCurrentPuyos[1].pos.y += 1
    }
    else {
      if (nexCurrentPuyos[0].pos.y < getDeepestAvailablePosition(nexCurrentPuyos[0].pos.x)) {
        nexCurrentPuyos[0].pos.y += 1
      }
      if (nexCurrentPuyos[1].pos.y < getDeepestAvailablePosition(nexCurrentPuyos[1].pos.x)) {
        nexCurrentPuyos[1].pos.y += 1
      }
    }
    setCurrentPuyos([...nexCurrentPuyos])
    if (!CanContinueFalling(nexCurrentPuyos)) {
      console.log('gameOver', gameOver);
      if(!gameOver) {
        addNewPuyos()
      }
    }
  }, [currentPuyos, CanContinueFalling, addNewPuyos, isVertical, getDeepestAvailablePosition, gameOver])

  const fallFast = useCallback(() => {
    if(gameOver) return
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      if (nexCurrentPuyos[0].pos.y > nexCurrentPuyos[1].pos.y) {
        nexCurrentPuyos[0].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[0].pos.x)
        nexCurrentPuyos[1].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[0].pos.x) - 1
      }
      else {
        nexCurrentPuyos[1].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[1].pos.x)
        nexCurrentPuyos[0].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[1].pos.x) - 1
      }
    }
    else {
      if (nexCurrentPuyos[0].pos.y < getDeepestAvailablePosition(nexCurrentPuyos[0].pos.x)) {

        nexCurrentPuyos[0].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[0].pos.x)
      }
      if (nexCurrentPuyos[1].pos.y < getDeepestAvailablePosition(nexCurrentPuyos[1].pos.x)) {
        nexCurrentPuyos[1].pos.y = getDeepestAvailablePosition(nexCurrentPuyos[1].pos.x)
      }
    }
    setCurrentPuyos(nexCurrentPuyos)
    if (!CanContinueFalling(nexCurrentPuyos)) {
      console.log('gameOver', gameOver);
      
      if(!gameOver) {
        addNewPuyos()
      }
    }
  }, [getDeepestAvailablePosition, CanContinueFalling, addNewPuyos, isVertical, currentPuyos, gameOver])

  const mouseWheelListener = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      rotateLeft();
    } else if (e.deltaY > 0) {
      rotateRight();
    }
  };

  const rotateLeft = () => {
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      if (nexCurrentPuyos[0].pos.y > nexCurrentPuyos[1].pos.y) {
        if (currentPuyos[1].pos.x - 1 >= 0) {
          nexCurrentPuyos[1].pos.x = currentPuyos[1].pos.x - 1
          nexCurrentPuyos[1].pos.y = currentPuyos[1].pos.y + 1
        }
      }
      else {
        if (currentPuyos[0].pos.x - 1 >= 0) {
          nexCurrentPuyos[0].pos.x = currentPuyos[0].pos.x - 1
          nexCurrentPuyos[0].pos.y = currentPuyos[0].pos.y + 1
        }
      }
    }
    else {
      if (nexCurrentPuyos[0].pos.x > nexCurrentPuyos[1].pos.x) {
        if (currentPuyos[0].pos.x - 1 >= 0) {
          nexCurrentPuyos[0].pos.y = currentPuyos[0].pos.y - 1
          nexCurrentPuyos[0].pos.x = currentPuyos[0].pos.x - 1
        }
      }
      else {
        if (currentPuyos[1].pos.x - 1 >= 0) {
          nexCurrentPuyos[1].pos.y = currentPuyos[1].pos.y - 1
          nexCurrentPuyos[1].pos.x = currentPuyos[1].pos.x - 1
        }
      }
    }
    setCurrentPuyos([...nexCurrentPuyos])
  };

  const rotateRight = () => {
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      if (nexCurrentPuyos[0].pos.y > nexCurrentPuyos[1].pos.y) {
        if (currentPuyos[1].pos.x + 1 < 6) {
          nexCurrentPuyos[1].pos.x = currentPuyos[1].pos.x + 1
          nexCurrentPuyos[1].pos.y = currentPuyos[1].pos.y + 1
        }
      }
      else {
        if (currentPuyos[0].pos.x + 1 < 6) {
          nexCurrentPuyos[0].pos.x = currentPuyos[0].pos.x + 1
          nexCurrentPuyos[0].pos.y = currentPuyos[0].pos.y + 1
        }

      }
    }
    else {
      if (nexCurrentPuyos[0].pos.x > nexCurrentPuyos[1].pos.x) {
        if (currentPuyos[1].pos.x + 1 < 6) {
          nexCurrentPuyos[1].pos.y = currentPuyos[1].pos.y - 1
          nexCurrentPuyos[1].pos.x = currentPuyos[1].pos.x + 1
        }
      }
      else {
        if (currentPuyos[0].pos.x + 1 < 6) {
          nexCurrentPuyos[0].pos.y = currentPuyos[0].pos.y - 1
          nexCurrentPuyos[0].pos.x = currentPuyos[0].pos.x + 1
        }
      }
    }
    setCurrentPuyos([...nexCurrentPuyos])
  };

  const goToBottom = useCallback(() => fallFast(), [fallFast]);

  const goToLeft = useCallback(() => {
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      if (currentPuyos[0].pos.x > 0) {
        nexCurrentPuyos[0].pos.x -= 1;
        nexCurrentPuyos[1].pos.x -= 1;
      }
    }
    else if (currentPuyos[0].pos.x > 0 && currentPuyos[1].pos.x > 0) {
      nexCurrentPuyos[0].pos.x -= 1;
      nexCurrentPuyos[1].pos.x -= 1;
    }

    if (nexCurrentPuyos[0].pos.x !== currentPuyos[0].pos.x) {
      setCurrentPuyos(nexCurrentPuyos)
    }
  }, [isVertical, currentPuyos]);

  const goToRight = useCallback(() => {
    const nexCurrentPuyos = [...currentPuyos]
    if (isVertical) {
      if (currentPuyos[0].pos.x < 5) {
        nexCurrentPuyos[0].pos.x += 1;
        nexCurrentPuyos[1].pos.x += 1;
      }
    }
    else if (currentPuyos[0].pos.x < 5 && currentPuyos[1].pos.x < 5) {
      nexCurrentPuyos[0].pos.x += 1;
      nexCurrentPuyos[1].pos.x += 1;
    }

    if (nexCurrentPuyos[0].pos.x !== currentPuyos[0].pos.x) {
      setCurrentPuyos(nexCurrentPuyos)
    }
  }, [isVertical, currentPuyos]);

  const keydownListener = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        goToLeft();
        break;
      case "ArrowRight":
        goToRight();
        break;
      case "ArrowDown":
        goToBottom();
        break;
    }
  }, [goToLeft, goToRight, goToBottom]);

  useEffect(() => {
    document.addEventListener("keydown", keydownListener);
    return () => {
      document.removeEventListener("keydown", keydownListener);
    };
  }, [keydownListener]);


  // faire tomber le groupe actuelle d'une case par seconde
  useEffect(() => {
    const intervalId = setInterval(fallSlowly, 1000 / speed);
    return () => {
      clearInterval(intervalId);
    }
  }, [fallSlowly, speed])

  return (
    <div
      className={styles.boardContainer}
      onWheel={mouseWheelListener}
      onClick={fallFast}
    >
      <div className={styles.scoreBox}>Score : {score}</div>
      <div className={styles.board}>
        {
          currentPuyos.length > 1 && <PuyoBlock puyo1={currentPuyos[0]} puyo2={currentPuyos[1]} />
        }
        {puyos.map((puyo) => (
          <Puyo key={puyo.id} type={puyo.type} x={`${puyo.pos.x * 50}px`} y={`${puyo.pos.y * 50}px`} />
        ))}
      </div>
    </div>
  );
};

export default Board;

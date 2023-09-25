import { POS, PUYO } from "../types/puyo";

export const calculateScore = (puyos: PUYO[]) => {
    let score = 0;

    const ROWS = 12;
    const COLS = 6;

    let combo: PUYO[] = [];
    let currentType = null;

    // on parcour horizontalement
    for (let i = ROWS - 1; i >= 0; i--) {
        for (let j = 0; j < COLS; j++) {
            const currentPuyo = puyos.find(puyo => puyo.pos.x === j && puyo.pos.y === i)
            if (!currentPuyo) {
                if (combo.length >= 3) {
                    puyos = puyos.filter(puyo => combo.findIndex(puyoItem => puyo.id === puyoItem.id) === -1)
                    score = 50 * combo.length
                }
                combo = []
                continue;
            }

            if (!currentType) {
                combo.push(currentPuyo)

                // now check around this position
                currentType = currentPuyo.type
            }
            else {
                if (currentPuyo.type === currentType) {
                    combo.push(currentPuyo)
                }
                else {
                    if (combo.length >= 3) {
                        puyos = puyos.filter(puyo => combo.findIndex(puyoItem => puyo.id === puyoItem.id) === -1)
                        score = 50 * combo.length
                    }
                    combo = []
                    currentType = currentPuyo.type
                    combo.push(currentPuyo)
                }
            }
        }
    }

    // On parcour verticalement
    for (let j = 0; j < COLS; j++) {
        for (let i = ROWS - 1; i >= 0; i--) {
            const currentPuyo = puyos.find(puyo => puyo.pos.x === j && puyo.pos.y === i)
            if (!currentPuyo) {
                if (combo.length >= 3) {
                    puyos = puyos.filter(puyo => combo.findIndex(puyoItem => puyo.id === puyoItem.id) === -1)
                    score = 50 * combo.length
                }
                combo = []
                continue;
            }

            if (!currentType) {
                combo.push(currentPuyo)

                // now check around this position
                currentType = currentPuyo.type
            }
            else {
                if (currentPuyo.type === currentType) {
                    combo.push(currentPuyo)
                }
                else {
                    if (combo.length >= 3) {
                        
                        puyos = puyos.filter(puyo => combo.findIndex(puyoItem => puyo.id === puyoItem.id) === -1)
                        score = 50 * combo.length
                    }
                    combo = []
                    currentType = currentPuyo.type
                    combo.push(currentPuyo)
                }
            }
        }
    }

    return {nextPuyos: puyos, nextScore: score};
};

export const canContinuePlaying = (puyos: PUYO[], pos1: POS, pos2: POS) => {
    console.log('nextPuyos', puyos)
    const puyosAtIndex0 = puyos.findIndex(puyo => 
        (puyo.pos.y === 0 && pos1.x === puyo.pos.x) ||
        (puyo.pos.y === 0 && pos2.x === puyo.pos.x) ||
        (puyo.pos.y < 0)
    )
    console.log('puyosAtIndex0', puyosAtIndex0)

    if(puyosAtIndex0==-1) return true;
    return false
}

export const randomColor = () => {
    // you can add more colors depending on the current difficulty
    const value = Math.random()
    if (value < 0.25) return 'a'
    else if (value < 0.5) return 'b'
    else if (value < 0.75) return 'c'
    return 'd'
}

export const randomPosition = () => {
    return {
        x: Math.floor(Math.random() * 6),
        y: 0
    }
}

export const randomPosition2 = (pos: POS) => {
    const isVertical = Math.random() > 0.5
    if (isVertical) {
        return { x: pos.x, y: pos.y - 1 }
    }
    else if (pos.x === 5) {
        return { x: pos.x - 1, y: pos.y }
    }
    return { x: pos.x + 1, y: pos.y }
}

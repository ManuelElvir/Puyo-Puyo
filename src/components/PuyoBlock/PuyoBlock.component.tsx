import Puyo from "../Puyo";
import { PUYO } from "../../types/puyo";

interface PuyoBlockProps {
    puyo1: PUYO;
    puyo2: PUYO;
}

const PuyoBlock = ({puyo1, puyo2}: PuyoBlockProps) => {

    return <>
        <Puyo type={puyo1.type} x={`${puyo1.pos.x*50}px`} y={`${puyo1.pos.y*50}px`} />
        <Puyo type={puyo2.type} x={`${puyo2.pos.x*50}px`} y={`${puyo2.pos.y*50}px`} />
    </>
}

export default PuyoBlock
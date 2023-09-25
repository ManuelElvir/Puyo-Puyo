import styles from './Puyo.module.scss'

interface PuyoProps {
    type: "a" | "b" | "c" | "d";
    x: string;
    y: string;
}

const Puyo = ({ type, x, y}: PuyoProps) => {

    return <div style={{top: y, left: x}} className={`${styles.puyo} ${styles[type]}`}>{type}</div>
}

export default Puyo
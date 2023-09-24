export type PUYO_TYPE = "a" | "b" | "c" | "d"

export type POS = {
  x: number,
  y: number
}

export type PUYO = {
  id: string;
  type: PUYO_TYPE,
  pos: POS
}


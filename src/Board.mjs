import { Tetromino } from "./Tetromino.mjs";

const EVENT_NAME = "lineCleared";

export class Board {
  #state = [];
  #falling = null;
  #evTarget = new EventTarget();

  constructor(width, height) {
    for (let row = 0; row < height; row++) {
      const row = [];
      for (let col = 0; col < width; col++) {
        row.push(".");
      }
      this.#state.push(row);
    }
  }

  get height() {
    return this.#state.length;
  }

  get width() {
    return this.#state[0].length;
  }

  set state(str) {
    this.#state = str.split("\n").map((row) => row.trim().split(""));
  }

  rmFalling() {
    this.#falling = null;
  }

  pxAt(r, c) {
    return this.#state[r][c];
  }

  cellAt(row, col) {
    let px;

    if (this.#falling) px = this.#falling.pxAt(row, col);
    if (!px) px = this.#state[row][col];

    return px;
  }

  addAt(r, c, char = "x") {
    this.#state[r][c] = char;
  }

  toString() {
    return this.#state.map((row, ri) => row.map((_, ci) => this.cellAt(ri, ci)).join("") + "\n").join("");
  }

  drop(block) {
    if (this.hasFalling()) throw new Error("already falling");
    if (typeof block === "string" && block.length === 1) block = Tetromino._1x1(block);
    block.centerSelf(this.width);
    this.#falling = block;
  }

  hasFalling() {
    return this.#falling !== null;
  }

  #clearLines() {
    outer: for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (this.#state[r][c] === ".") continue outer;
      }

      const [line] = this.#state.splice(r, 1);
      this.#state.splice(
        0,
        0,
        line.map((_) => ".")
      );
      this.#evTarget.dispatchEvent(
        new CustomEvent(EVENT_NAME, { detail: { line, rowIndex: r, boardHeight: this.height } })
      );
    }
  }

  subscribe(callback) {
    this.#evTarget.addEventListener(EVENT_NAME, callback);
  }

  tick() {
    if (this.#falling) this.#falling.moveDown(this);
    this.#clearLines();
  }

  moveDown() {
    if (this.#falling) this.#falling.moveDown(this);
  }

  moveLeft() {
    if (this.#falling) this.#falling.moveLeft(this);
  }

  moveRight() {
    if (this.#falling) this.#falling.moveRight(this);
  }

  rotateLeft() {
    if (this.#falling) this.#falling.rotateLeft(this);
  }

  rotateRight() {
    if (this.#falling) this.#falling.rotateRight(this);
  }
}

import { Tetromino } from "./Tetromino.mjs";

export class Board {
  width;
  height;
  #state = [];
  falling = null;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    for (let row = 0; row < height; row++) {
      const row = [];
      for (let col = 0; col < width; col++) {
        row.push(".");
      }
      this.#state.push(row);
    }
  }

  set state(str) {
    this.#state = str.split("\n").map((row) => row.trim().split(""));
    // this.width = this.state[0][0].length;
    // this.height = this.state[0].length;
  }

  pxAt(r, c) {
    return this.#state[r][c];
  }

  addAt(r, c, char = "x") {
    this.#state[r][c] = char;
  }

  toString() {
    return this.#state
      .map(
        (row, ri) =>
          row
            .map((cell, ci) => {
              let px;

              if (this.falling) px = this.falling.pxAt(ri, ci);
              if (!px) px = cell;

              return px;
            })
            .join("") + "\n"
      )
      .join("");
  }

  drop(block) {
    if (this.hasFalling()) throw new Error("already falling");
    if (typeof block === "string" && block.length === 1) block = Tetromino._1x1(block);
    block.centerSelf(this.width);
    this.falling = block;
  }

  hasFalling() {
    return this.falling !== null;
  }

  #clearLines() {
    outer: for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (this.#state[r][c] === ".") continue outer;
      }
      const emptyLine = this.#state.splice(r, 1)[0].map((_) => ".");
      this.state.splice(0, 0, emptyLine);
    }
  }

  tick() {
    if (this.falling) this.falling.moveDown(this);
    this.#clearLines();
  }

  moveDown() {
    if (this.falling) this.falling.moveDown(this);
  }

  moveLeft() {
    if (this.falling) this.falling.moveLeft(this);
  }

  moveRight() {
    if (this.falling) this.falling.moveRight(this);
  }

  rotateLeft() {
    if (this.falling) this.falling.rotateLeft(this);
  }

  rotateRight() {
    if (this.falling) this.falling.rotateRight(this);
  }
}

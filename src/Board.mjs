import { Tetromino } from "./Tetromino.mjs";

export class Board {
  width;
  height;
  state;
  falling = null;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.state = [];
    for (let row = 0; row < height; row++) {
      const row = [];
      for (let col = 0; col < width; col++) {
        row.push(".");
      }
      this.state.push(row);
    }
  }

  toString2() {
    return this.state
      .map((row, ri) => row.map((c, ci) => (this.falling ? this.falling.pxAt(ri, ci) ?? c : c)).join("") + "\n")
      .join("");
  }

  toString() {
    return this.state.map((row) => row.join("") + "\n").join("");
  }

  drop2(block) {
    if (typeof block === "string" && block.length === 1) block = Tetromino._1x1(block);
    block.centerSelf(this.width);
    this.falling = block;
  }

  drop(char) {
    if (this.hasFalling()) throw new Error("already falling");

    const col = Math.floor(this.width / 2);
    if (this.state[0][col] === ".") {
      this.state[0][col] = char;
    }
    this.falling = char;
  }

  hasFalling() {
    return this.falling !== null;
  }

  tick2() {
    this.falling.lower(this);
  }

  tick() {
    let movedAnything = false;
    for (let r = this.height - 2; r >= 0; r--) {
      for (let c = 0; c < this.width; c++) {
        if (this.state[r + 1][c] === "." && this.state[r][c] !== ".") {
          this.state[r + 1][c] = this.state[r][c];
          this.state[r][c] = ".";
          movedAnything = true;
        }
      }
    }
    if (!movedAnything) this.falling = null;
  }
}

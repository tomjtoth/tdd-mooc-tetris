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

  toString() {
    return this.state
      .map((row, ri) => row.map((c, ci) => (this.falling ? this.falling.pxAt(ri, ci) ?? c : c)).join("") + "\n")
      .join("");
  }

  drop2(block) {
    if (this.hasFalling()) throw new Error("already falling");
    if (typeof block === "string" && block.length === 1) block = Tetromino._1x1(block);
    block.centerSelf(this.width);
    this.falling = block;
  }

  drop(char) {
    return this.drop2(char);

    if (this.state[0][col] === ".") {
    }
  }

  hasFalling() {
    return this.falling !== null;
  }

  tick2() {
    this.falling.lower(this);
  }

  tick() {
    return this.tick2();
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

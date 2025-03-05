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

  drop(block) {
    if (this.hasFalling()) throw new Error("already falling");
    if (typeof block === "string" && block.length === 1) block = Tetromino._1x1(block);
    block.centerSelf(this.width);
    this.falling = block;
  }

  hasFalling() {
    return this.falling !== null;
  }

  tick() {
    if (this.falling) this.falling.lower(this);
  }
}

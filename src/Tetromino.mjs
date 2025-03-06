import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino extends RotatingShape {
  static get T_SHAPE() {
    return this.fromString(
      `.T.
       TTT
       ...`
    );
  }

  static get I_SHAPE() {
    return this.fromString(
      `.....
       .....
       IIII.
       .....
       .....`,
      2
    );
  }

  static get O_SHAPE() {
    return this.fromString(
      `.OO
       .OO
       ...`,
      1
    );
  }

  static _1x1(str = "1") {
    return this.fromString(str, 1);
  }

  static fromString(str, validO) {
    const res = super.fromString(str);
    if (validO) res.validOrientations = validO;
    return res;
  }

  validOrientations;
  currentOrientation;
  left = 0;
  top = 0;

  constructor(shape, currO = 0, validO = 4) {
    super(shape);
    this.currentOrientation = currO;
    this.validOrientations = validO;
  }

  get #width() {
    return this.shape[0].length;
  }

  get #height() {
    return this.shape.length;
  }

  rotateLeft() {
    return this.validOrientations === 4 ? super.rotateLeft() : this.validOrientations === 2 ? this.#rotate2() : this;
  }

  #rotate2() {
    if (this.currentOrientation === 0) {
      this.currentOrientation++;
      return super.rotateRight();
    } else {
      this.currentOrientation--;
      return super.rotateLeft();
    }
  }

  rotateRight() {
    return this.validOrientations === 4 ? super.rotateRight() : this.validOrientations === 2 ? this.#rotate2() : this;
  }

  /**
   * used only during tests
   *
   * @returns a new instance with the same shape and orientation
   */
  clone() {
    return new Tetromino(this.shape, this.currentOrientation, this.validOrientations);
  }

  moveDown(board, forced = true) {
    while (true) {
      const mustBeFree = new Map();

      for (let r = this.#height - 1; r >= 0; r--) {
        for (let c = 0; c < this.#width; c++) {
          if (mustBeFree.has(this.left + c)) continue;

          if (this.shape[r][c] !== ".") {
            mustBeFree.set(this.left + c, this.top + r + 1);
          }
        }
      }

      mustBeFree.forEach((row, col) => {
        if (row > board.height - 1 || board.state[row][col] !== ".") {
          for (let row = 0; row < this.#height; row++) {
            for (let col = 0; col < this.#width; col++) {
              const cell = this.shape[row][col];
              if (cell !== ".") board.state[this.top + row][this.left + col] = cell;
            }
          }
          board.falling = null;
          forced = false;
        }
      });

      this.top++;
      if (!forced) break;
    }
  }

  moveLeft(board) {
    const mustBeFree = new Map();

    for (let r = 0; r < this.#height; r++) {
      for (let c = 0; c < this.#width; c++) {
        if (this.shape[r][c] !== ".") {
          mustBeFree.set(this.left + c - 1, this.top + r);
          break;
        }
      }
    }

    mustBeFree.forEach((r, c) => {
      if (c < 0 || board.state[r][c] !== ".") {
        return;
      }
    });

    this.left--;
  }

  centerSelf(boardWidth) {
    this.left = Math.floor(boardWidth / 2 - this.#width / 2);
  }

  pxAt(ri, ci) {
    const row = this.shape[ri - this.top];
    if (!row) return;

    const px = row[ci - this.left];
    if (px && px !== ".") return px;
  }
}

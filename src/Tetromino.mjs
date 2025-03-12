import { RotatingShape } from "./RotatingShape.mjs";

export class Arika {
  #left = 0;
  #top = -1;
  #orientations;
  #orIndex = 0;
  #checkpoint;

  constructor(orientations, { state, cloning = false } = {}) {
    this.#orientations = cloning
      ? orientations
      : orientations.map((str) => str.split("\n").map((row) => row.trim().split("")));

    if (cloning) this.#state = state;
  }

  get #shape() {
    return this.#orientations[this.#orIndex];
  }

  get #height() {
    return this.#shape.length;
  }

  get #width() {
    return this.#shape[0].length;
  }

  get #ownCoords() {
    const coords = [];

    for (let r = 0; r < this.#height; r++) {
      for (let c = 0; c < this.#width; c++) {
        if (this.#shape[r][c] !== ".") coords.push({ row: this.#top + r, col: this.#left + c });
      }
    }

    return coords;
  }

  get #state() {
    return { orIndex: this.#orIndex, left: this.#left, top: this.#top };
  }

  set #state(saved) {
    this.#orIndex = saved.orIndex;
    this.#left = saved.left;
    this.#top = saved.top;

    console.debug("state set to", saved);
  }

  #saveState() {
    this.#checkpoint = this.#state;
  }

  #loadState() {
    this.#state = this.#checkpoint;
  }

  toString() {
    return this.#shape.map((row) => row.join("") + "\n").join("");
  }

  clone() {
    return new this.constructor(this.#orientations, { cloning: true, state: this.#state });
  }

  centerSelf(boardWidth) {
    this.#left = Math.floor(boardWidth / 2 - this.#width / 2);
  }

  pxAt(r, c) {
    const row = this.#shape[r - this.#top];
    if (!row) return;

    const px = row[c - this.#left];
    if (px && px !== ".") return px;
  }

  #overlaps(board) {
    let left = 0;
    let right = 0;

    this.#ownCoords.forEach(({ row, col }) => {
      if (board.state[row][col] !== ".") {
        if (col < 2) left++;
        else right++;
      }
    });

    return left > 0 || right > 0 ? { moveLeft: left - right < 0 } : null;
  }

  #postRotate(board) {
    if (this.#ownCoords.find(({ row }) => row < 0)) {
      this.#top++;
    }

    let prevLeft = this.#checkpoint.left;
    while (this.#ownCoords.find(({ col }) => col < 0)) {
      this.moveRight(board);
      if (this.#left === prevLeft) return this.#loadState();
      prevLeft = this.#left;
    }

    while (this.#ownCoords.find(({ col }) => col >= board.width)) {
      this.moveLeft(board);
      if (this.#left === prevLeft) return this.#loadState();
      prevLeft = this.#left;
    }

    let overlaps;
    while ((overlaps = this.#overlaps(board))) {
      if (overlaps.moveLeft) this.moveLeft(board);
      else this.moveLeft(board);
      if (this.#left === prevLeft) return this.#loadState();

      prevLeft = this.#left;
    }
  }

  #rotate(board, CW = true) {
    if (board) this.#saveState();

    if (CW) {
      if (++this.#orIndex == this.#orientations.length) this.#orIndex = 0;
    } else {
      if (--this.#orIndex < 0) this.#orIndex += this.#orientations.length;
    }

    return this;
  }

  rotateLeft(board) {
    return this.#rotate(board, false);
  }

  rotateRight(board) {
    return this.#rotate(board, true);
  }

  #finalize(board) {
    this.#ownCoords.forEach(({ row, col }) => {
      if (row >= 0 && row < board.height && col >= 0 && col < board.width) board.state[row][col] = this.pxAt(row, col);
    });
    board.falling = null;
    return this;
  }

  moveDown(board) {
    const mustBeFree = new Map();

    for (let r = this.#height - 1; r >= 0; r--) {
      for (let c = 0; c < this.#width; c++) {
        if (mustBeFree.has(this.#left + c)) continue;

        if (this.#shape[r][c] !== ".") mustBeFree.set(this.#left + c, this.#top + r + 1);
      }
    }

    for (const [c, r] of mustBeFree) {
      if (r >= board.height || board.state[r][c] !== ".") return this.#finalize(board);
    }

    this.#top++;
  }

  moveLeft(board) {
    const mustBeFree = new Map();

    for (let r = 0; r < this.#height; r++) {
      for (let c = 0; c < this.#width; c++) {
        if (this.#shape[r][c] !== ".") {
          mustBeFree.set(this.#left + c - 1, this.#top + r);
          break;
        }
      }
    }

    for (const [c, r] of mustBeFree) {
      if (c < 0 || board.state[r][c] !== ".") {
        return;
      }
    }

    this.#left--;
  }

  moveRight(board) {
    const mustBeFree = new Map();

    for (let r = 0; r < this.#height; r++) {
      for (let c = this.#width - 1; c >= 0; c--) {
        if (this.#shape[r][c] !== ".") {
          mustBeFree.set(this.#left + c + 1, this.#top + r);
          break;
        }
      }
    }

    for (const [c, r] of mustBeFree) {
      if (c >= board.width || board.state[r][c] !== ".") {
        return;
      }
    }

    this.#left++;
  }
}

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

  get #ownCoords() {
    const coords = [];

    for (let r = 0; r < this.#height; r++) {
      for (let c = 0; c < this.#width; c++) {
        if (this.shape[r][c] !== ".") coords.push([this.top + r, this.left + c]);
      }
    }

    return coords;
  }

  get #width() {
    return this.shape[0].length;
  }

  get #height() {
    return this.shape.length;
  }

  #overlaps(board) {
    for (let r = 0; r < board.height; r++) {
      for (let c = 0; c < board.width; c++) {
        if (board.state[r][c] !== "." && this.pxAt(r, c)) {
          return true;
        }
      }
    }
    return false;
  }

  rotateLeft(board) {
    const checkpoint = { shape: this.shape, left: this.left };

    if (this.validOrientations === 4) {
      super.rotateLeft();
    } else if (this.validOrientations === 2) {
      this.#rotate2();
    }

    if (board) {
      let prevLeft = checkpoint.left;
      while (this.#ownCoords.find(([, c]) => c < 0)) {
        this.moveRight(board);
        if (this.left === prevLeft) {
          this.shape = checkpoint.shape;
          return this;
        }
        prevLeft = this.left;
      }

      while (this.#ownCoords.find(([, c]) => c >= board.width)) {
        this.moveLeft(board);
        if (this.left === prevLeft) {
          this.shape = checkpoint.shape;
          return this;
        }
        prevLeft = this.left;
      }

      while (this.#overlaps(board)) {
        this.moveRight(board);
        if (this.left === prevLeft) {
          this.moveLeft(board);
        }

        if (this.left === prevLeft) {
          this.shape = checkpoint.shape;
          break;
        }
        prevLeft = this.left;
      }
    }

    return this;
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

  moveDown(board, forced = false) {
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

    for (const [c, r] of mustBeFree) {
      if (c < 0 || board.state[r][c] !== ".") {
        return;
      }
    }

    this.left--;
  }

  moveRight(board) {
    const mustBeFree = new Map();

    for (let r = 0; r < this.#height; r++) {
      for (let c = this.#width - 1; c >= 0; c--) {
        if (this.shape[r][c] !== ".") {
          mustBeFree.set(this.left + c + 1, this.top + r);
          break;
        }
      }
    }

    for (const [c, r] of mustBeFree) {
      if (c >= board.width || board.state[r][c] !== ".") {
        return;
      }
    }

    this.left++;
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

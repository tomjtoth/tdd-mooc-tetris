export class Tetromino {
  static get T_SHAPE() {
    return new this([
      `....
       TTT.
       .T..
       ....`,

      `.T..
       TT..
       .T..
       ....`,

      `....
       .T..
       TTT.
       ....`,

      `.T..
       .TT.
       .T..
       ....`,
    ]);
  }

  static get I_SHAPE() {
    return new this([
      `....
       IIII
       ....
       ....`,

      `..I.
       ..I.
       ..I.
       ..I.`,
    ]);
  }

  static get L_SHAPE() {
    return new this([
      `....
       LLL.
       L...
       ....`,

      `LL..
       .L..
       .L..
       ....`,

      `....
       ..L.
       LLL.
       ....`,

      `.L..
       .L..
       .LL.
       ....`,
    ]);
  }

  static get J_SHAPE() {
    return new this([
      `....
       JJJ.
       ..J.
       ....`,

      `.J..
       .J..
       JJ..
       ....`,

      `....
       J...
       JJJ.
       ....`,

      `.JJ.
       .J..
       .J..
       ....`,
    ]);
  }

  static get S_SHAPE() {
    return new this([
      `....
       .SS.
       SS..
       ....`,

      `S...
       SS..
       .S..
       ....`,
    ]);
  }

  static get Z_SHAPE() {
    return new this([
      `....
       ZZ..
       .ZZ.
       ....`,

      `..Z.
       .ZZ.
       .Z..
       ....`,
    ]);
  }

  static get O_SHAPE() {
    return new this([
      `....
       .OO.
       .OO.
       ....`,
    ]);
  }

  static _1x1(x) {
    return new this([`.\n${x}`]);
  }

  #left = 0;
  #top = -1;
  #orientations;
  #orIndex = 0;
  #checkpoint;
  shapeSymbol;

  constructor(orientations, { state, cloning = false } = {}) {
    this.#orientations = cloning
      ? orientations
      : orientations.map((str) =>
          str.split("\n").map((row) => {
            const chars = row.trim().split("");
            if (!this.shapeSymbol) this.shapeSymbol = chars.find((chr) => chr !== ".");
            return chars;
          })
        );

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
    return { orIndex: this.#orIndex, left: this.#left, top: this.#top, symbol: this.shapeSymbol };
  }

  set #state(saved) {
    this.#orIndex = saved.orIndex;
    this.#left = saved.left;
    this.#top = saved.top;
    this.shapeSymbol = saved.symbol;

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
      if (board.pxAt(row, col) !== ".") {
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

    if (board) this.#postRotate(board);
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
      if (row >= 0 && row < board.height && col >= 0 && col < board.width) board.addAt(row, col, this.pxAt(row, col));
    });
    board.rmFalling();
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
      if (r >= board.height || board.pxAt(r, c) !== ".") return this.#finalize(board);
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
      if (c < 0 || board.pxAt(r, c) !== ".") {
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
      if (c >= board.width || board.pxAt(r, c) !== ".") {
        return;
      }
    }

    this.#left++;
  }
}

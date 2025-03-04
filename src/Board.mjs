export class Board {
  width;
  height;
  state;

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
    return this.state.map((row) => row.join("") + "\n").join("");
  }

  drop(char) {
    const col = Math.floor(this.width / 2);
    if (this.state[0][col] === ".") {
      this.state[0][col] = char;
    }
  }
  tick() {
    for (let r = this.height - 2; r >= 0; r--) {
      for (let c = 0; c < this.width; c++) {
        if (this.state[r + 1][c] === "." && this.state[r][c] !== ".") {
          this.state[r + 1][c] = this.state[r][c];
          this.state[r][c] = ".";
        }
      }
    }
  }
}

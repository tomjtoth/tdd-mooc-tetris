export class Board {
  width;
  height;
  rows;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.rows = [];
    for (let row = 0; row < height; row++) {
      const row = [];
      for (let col = 0; col < width; col++) {
        row.push(".");
      }
      this.rows.push(row);
    }
  }

  toString() {
    return this.rows.map((row) => row.join("") + "\n").join("");
  }
}

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
    let res = "";

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        res += ".";
      }
      res += "\n";
    }

    return res;
  }
}

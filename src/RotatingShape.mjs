export class RotatingShape {
  static fromString(str) {
    return new this(str);
  }

  shape;

  constructor(str) {
    this.shape = str.split("\n").map((row) => row.trim().split(""));
  }

  toString() {
    return this.shape.map((row) => row.join("") + "\n").join("");
  }

  rotateRight() {
    const transposed = this.shape[0].map((_, colIndex) => this.shape.map((row) => row[colIndex]));

    this.shape = transposed.map((row) => row.reverse());
    return this;
  }
}

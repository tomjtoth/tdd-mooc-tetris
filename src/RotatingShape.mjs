export class RotatingShape {
  static fromString(str) {
    return new this(str.split("\n").map((row) => row.trim().split("")));
  }

  shape;

  constructor(shape) {
    this.shape = shape;
  }

  toString() {
    return this.shape.map((row) => row.join("") + "\n").join("");
  }

  #rotate(clockwise = true) {
    const transposed = this.shape[0].map((_, colIndex) => this.shape.map((row) => row[colIndex]));

    this.shape = clockwise ? transposed.map((row) => row.reverse()) : transposed.reverse();
    return this;
  }

  rotateLeft() {
    return this.#rotate(false);
  }

  rotateRight() {
    return this.#rotate(true);
  }
}

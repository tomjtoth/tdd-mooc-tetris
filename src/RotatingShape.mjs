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
}

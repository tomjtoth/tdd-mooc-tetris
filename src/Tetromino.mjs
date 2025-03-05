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
    const shape = this.fromString(
      `.....
       .....
       IIII.
       .....
       .....`
    );
    shape.validOrientations = 2;
    return shape;
  }

  static get O_SHAPE() {
    const shape = this.fromString(
      `.OO
       .OO
       ...`
    );
    shape.validOrientations = 1;
    return shape;
  }

  static get ONE_BY_ONE() {
    const block = this.fromString("1");
    block.validOrientations = 1;
    return block;
  }

  validOrientations;
  currentOrientation;

  constructor(shape, currO = 0, validO = 4) {
    super(shape);
    this.currentOrientation = currO;
    this.validOrientations = validO;
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
}

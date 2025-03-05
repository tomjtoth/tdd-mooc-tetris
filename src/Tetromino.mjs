import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino extends RotatingShape {
  static get T_SHAPE() {
    const shape = this.fromString(
      `.T.
       TTT
       ...`
    );
    shape.validOrientations = [0, 1, 2, 3];
    return shape;
  }

  static get I_SHAPE() {
    const shape = this.fromString(
      `.....
       .....
       IIII.
       .....
       .....`
    );
    shape.validOrientations = [0, 1];
    return shape;
  }

  validOrientations;
  currentOrientation;

  constructor(shape, currO = 0, validO = [0, 1, 2, 3]) {
    super(shape);
    this.currentOrientation = currO;
    this.validOrientations = validO;
  }

  rotateLeft() {
    return super.rotateLeft();
  }

  rotateRight() {
    return super.rotateRight();
  }

  clone() {
    return new Tetromino(this.shape, this.currentOrientation, this.validOrientations);
  }
}

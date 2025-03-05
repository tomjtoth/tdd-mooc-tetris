import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino extends RotatingShape {
  static get T_SHAPE() {
    return this.fromString(
      `.T.
       TTT
       ...`
    );
  }

  clone() {
    return this.constructor.fromString(this.toString());
  }
}

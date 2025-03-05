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
    return this.fromString(
      `.....
       .....
       IIII.
       .....
       .....`
    );
  }

  clone() {
    return this.constructor.fromString(this.toString());
  }
}

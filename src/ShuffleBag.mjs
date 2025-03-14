import { Tetromino } from "./Tetromino.mjs";

export class ShuffleBag {
  #order;
  #index = 0;

  constructor(preset = "TOSZJILT") {
    this.#order = preset.split("");
    this.__shuffle();
  }

  __shuffle() {}

  next() {
    const X = this.#order[this.#index];

    if (++this.#index == this.#order.length) {
      this.#index = 0;
      this.__shuffle();
    }

    return Tetromino[`${X}_SHAPE`];
  }
}

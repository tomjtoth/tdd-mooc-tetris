import { Tetromino } from "./Tetromino.mjs";

export class ShuffleBag {
  #order;
  #index = 0;

  constructor(preset = "TOSZJILT") {
    this.#order = preset.split("");
    this.__shuffle();
  }

  __shuffle() {
    const shuffled = [];
    const old = this.#order;
    while (old.length > 0) {
      const [transferred] = old.splice(old.length === 1 ? 0 : Math.floor(Math.random(old.length)), 1);

      shuffled.push(transferred);
    }
    this.#order = shuffled;
  }

  next() {
    const X = this.#order[this.#index];

    if (++this.#index == this.#order.length) {
      this.#index = 0;
      this.__shuffle();
    }

    return Tetromino[`${X}_SHAPE`];
  }
}

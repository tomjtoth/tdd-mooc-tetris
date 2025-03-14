export class ShuffleBag {
  #order;
  #index = 0;

  constructor(preset = "TOSZJILT") {
    this.#order = preset.split("");
    this.__shuffle();
  }

  __shuffle() {}

  next() {}
}

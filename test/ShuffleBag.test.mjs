import { describe, test } from "vitest";
import { expect } from "chai";

import { ShuffleBag } from "../src/ShuffleBag.mjs";
import { spy } from "sinon";

describe("Shuffle bag", () => {
  test("spawns 4 I_SHAPEs from a set of 'IIII'", () => {
    const bag = new ShuffleBag("IIII");

    expect(bag.next().shapeSymbol).to.equal("I");
    expect(bag.next().shapeSymbol).to.equal("I");
    expect(bag.next().shapeSymbol).to.equal("I");
    expect(bag.next().shapeSymbol).to.equal("I");
  });

  test.skip("calls __shuffle() only upon depletion", () => {
    const bag = new ShuffleBag("IOT");
    const shuffle = spy(bag, "__shuffle");

    for (let i = 1; i < 4; i++) {
      bag.next();
      bag.next();
      expect(shuffle.callCount).to.equal(i - 1);

      bag.next();
      expect(shuffle.callCount).to.equal(i);
    }
  });

  test.skip("returns the same amount of shapes as defined in the preset", () => {
    for (const preset of [
      "TIZJOLSTIZJOLSTIZJOLS",
      "JOSZILTJOSZILTJOSZILT",
      "LITZJOSLITZJOSLITZJOS",
      "ZOLJITSZOLJITSZOLJITS",
      "STIJOLZSTIJOLZSTIJOLZ",
      "OZJILTSOZJILTSOZJILTS",
      "JZOLISTJZOLISTJZOLIST",
      "TLSJIOZTLSJIOZTLSJIOZ",
      "ILZJOTSILZJOTSILZJOTS",
      "SOJTILZSOJTILZSOJTILZ",
    ]) {
      const bag = new ShuffleBag(preset);
      const shuffle = spy(bag, "__shuffle");

      const occurrences = {};
      for (const char of preset) {
        if (occurrences[char] === undefined) occurrences[char] = 0;
        occurrences[char]++;
      }

      for (let i = 0; i < preset.length; i++) {
        occurrences[bag.next().shapeSymbol]--;
      }

      expect(shuffle.callCount).to.equal(1);

      for (const count of Object.values(occurrences)) {
        expect(count).to.equal(0);
      }
    }
  });
});

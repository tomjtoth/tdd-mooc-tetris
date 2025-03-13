import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

describe("Clearing lines", () => {
  let board;
  beforeEach(() => {
    board = new Board(10, 6);
  });

  test("happens with each tick, *ONLY* on full lines", () => {
    const initial = `..........
                     ..........
                     ..........
                     ..........
                     ..........
                     xxxxxxxxx.`;

    board.state = initial;

    board.tick();

    expect(board.toString()).to.equalShape(initial);

    board.addAt(5, 9);
    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ..........
       ..........`
    );
  });

  test("new empty line gets inserted on top", () => {
    board.state = `0.........
                   1.........
                   2.........
                   3.........
                   4.........
                   5xxxxxxxxx`;

    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       0.........
       1.........
       2.........
       3.........
       4.........`
    );
  });

  test("keeps partial lines unaffected", () => {
    board.state = `x...x.....
                   .x...x....
                   xxxxxxxxxx
                   ...x...x..
                   xxxxxxxxxx
                   .....x...x`;

    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       x...x.....
       .x...x....
       ...x...x..
       .....x...x`
    );
  });

  test("does not get triggered until a block is only falling", () => {
    board.state = `.........0
                   .........1
                   .........2
                   .........3
                   .........4
                   ....xxxxxx`;

    board.drop(Tetromino.I_SHAPE);
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();

    board.tick();
    board.tick();
    board.tick();
    board.tick();
    board.tick();

    expect(board.hasFalling()).to.be.true;
    expect(board.toString()).to.equalShape(
      `.........0
       .........1
       .........2
       .........3
       .........4
       IIIIxxxxxx`
    );

    board.tick();

    expect(board.hasFalling()).to.be.false;
    expect(board.toString()).to.equalShape(
      `..........
       .........0
       .........1
       .........2
       .........3
       .........4`
    );
  });
});

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
    for (let i = 0; i < 9; i++) {
      board.state[5][i] = "x";
    }

    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ..........
       xxxxxxxxx.`
    );

    board.state[5][9] = "x";
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

  test.skip("new empty line gets inserted on top", () => {
    for (let i = 0; i < 6; i++) {
      board.state[i][0] = i;
    }

    expect(board.toString()).to.equalShape(
      `0.........
       1.........
       2.........
       3.........
       4.........
       5.........`
    );

    for (let i = 1; i < 10; i++) {
      board.state[5][i] = "x";
    }

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

  test.skip("keeps partial lines unaffected", () => {
    for (let i = 0; i < 6; i++) {
      board.state[i][i] = "x";
      board.state[i][i + 4] = "x";
    }

    board.tick();

    expect(board.toString()).to.equalShape(
      `x...x.....
       .x...x....
       ..x...x...
       ...x...x..
       ....x...x.
       .....x...x`
    );

    for (let i = 0; i < 10; i++) {
      board.state[2][i] = "x";
      board.state[4][i] = "x";
    }

    expect(board.toString()).to.equalShape(
      `x...x.....
       .x...x....
       xxxxxxxxxx
       ...x...x..
       xxxxxxxxxx
       .....x...x`
    );

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

  test.skip("does not get triggered until a block is only falling", () => {
    for (let i = 4; i < 10; i++) {
      board.state[5][i] = "x";
    }

    for (let i = 0; i < 5; i++) {
      board.state[i][9] = i;
    }

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

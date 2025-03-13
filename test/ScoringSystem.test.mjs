import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { spy } from "sinon";

import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";
import { HighScore } from "../src/HighScore.mjs";

describe("Keeping score", () => {
  let board;
  let score;
  let monitoredMethod;

  beforeEach(() => {
    score = new HighScore();
    board = new Board(10, 6);

    monitoredMethod = spy(score, "onLineCleared");

    board.subscribe(score.onLineCleared);
  });

  test("the callback gets called as many times as many rows were cleared", () => {
    board.state = `..........
                   ..........
                   ..........
                   ..........
                   ..OOOOOOOO
                   ..OOOOOOOO`;

    board.drop(Tetromino.O_SHAPE);
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();

    board.tick();
    board.tick();
    board.tick();
    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       OOOOOOOOOO
       OOOOOOOOOO`
    );

    expect(monitoredMethod.callCount).to.equal(0);

    board.tick();

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ..........
       ..........`
    );

    expect(monitoredMethod.callCount).to.equal(2);
  });

  test.skip("bottom 2 rows of Tetromino.O_SHAPE equals (1+2)*{n}*1 points", () => {
    board.state = `..........
                   ..........
                   ..........
                   ..........
                   ..OOOOOOOO
                   ..OOOOOOOO`;

    board.drop(Tetromino.O_SHAPE);
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();

    board.tick();
    board.tick();
    board.tick();
    board.tick();
    board.tick();

    expect(score.score).to.equal((1 + 2) * board.width * 1);
  });

  test.skip("3rd & 4th rows of Tetromino.I_SHAPE equals (3+4)*{n}*7 points", () => {
    board.state = `..........
                   ..........
                   ..IIIIIIII
                   ..IIIIIIII
                   .x.x.x.x.x
                   .x.x.x.x.x`;

    board.drop(Tetromino.O_SHAPE);
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();

    board.tick();
    board.tick();
    board.tick();

    expect(monitoredMethod.callCount).to.equal(2);
    expect(score.score).to.equal(4 * (2 * 1 + 8 * 7) + 3 * (2 * 1 + 8 * 7));
  });
});

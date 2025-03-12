import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

function fallToBottom(board) {
  for (let i = 0; i < 10; i++) {
    board.tick();
  }
}

describe("Falling tetrominoes", () => {
  let board;
  beforeEach(() => {
    board = new Board(10, 6);
  });

  test("start from the top middle", () => {
    board.drop(Tetromino.T_SHAPE);

    expect(board.toString()).to.equalShape(
      `...TTT....
       ....T.....
       ..........
       ..........
       ..........
       ..........`
    );
  });

  test("stop when they hit the bottom", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ...TTT....
       ....T.....`
    );
  });

  test("stop when they land on another block", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ...TTT....
       ....T.....
       ...TTT....
       ....T.....`
    );
  });

  describe("can be moved leftwards", () => {
    test("1 block if no obstacle", () => {
      board.drop(Tetromino.T_SHAPE);
      board.moveLeft();

      expect(board.toString()).to.equalShape(
        `..TTT.....
         ...T......
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("but not through blocks", () => {
      board.state[0][0] = "x";
      board.state[1][0] = "x";
      board.state[1][1] = "x";

      board.drop(Tetromino.T_SHAPE);

      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();

      expect(board.toString()).to.equalShape(
        `xTTT......
         xxT.......
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("but not off the board", () => {
      board.drop(Tetromino.T_SHAPE);

      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();

      expect(board.toString()).to.equalShape(
        `TTT.......
         .T........
         ..........
         ..........
         ..........
         ..........`
      );
    });
  });

  describe("can be moved rightwards", () => {
    test("1 block if not obstacle", () => {
      board.drop(Tetromino.T_SHAPE);
      board.moveRight();

      expect(board.toString()).to.equalShape(
        `....TTT...
         .....T....
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("but not through blocks", () => {
      board.state[0][9] = "x";
      board.state[1][8] = "x";
      board.state[1][9] = "x";

      board.drop(Tetromino.T_SHAPE);

      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();

      expect(board.toString()).to.equalShape(
        `......TTTx
         .......Txx
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("but not off the board", () => {
      board.drop(Tetromino.T_SHAPE);

      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();

      expect(board.toString()).to.equalShape(
        `.......TTT
         ........T.
         ..........
         ..........
         ..........
         ..........`
      );
    });
  });

  describe("can be moved downwards", () => {
    test("1 block if no obstacles", () => {
      board.drop(Tetromino.T_SHAPE);
      board.moveDown();

      expect(board.toString()).to.equalShape(
        `..........
         ...TTT....
         ....T.....
         ..........
         ..........
         ..........`
      );
    });

    test("but not through blocks", () => {
      board.state[4][4] = "x";
      board.state[5][4] = "x";
      board.state[5][5] = "x";

      board.drop(Tetromino.T_SHAPE);

      board.moveDown();
      board.moveDown();
      board.moveDown();
      board.moveDown();
      expect(board.hasFalling()).to.be.false;
      board.moveDown();
      board.moveDown();
      board.moveDown();

      expect(board.toString()).to.equalShape(
        `..........
         ..........
         ...TTT....
         ....T.....
         ....x.....
         ....xx....`
      );
    });

    test("but not off the board", () => {
      board.drop(Tetromino.T_SHAPE);

      board.moveDown();
      board.moveDown();
      board.moveDown();
      board.moveDown();
      board.moveDown();
      board.moveDown();
      board.moveDown();

      expect(board.toString()).to.equalShape(
        `..........
         ..........
         ..........
         ..........
         ...TTT....
         ....T.....`
      );
    });
  });
});

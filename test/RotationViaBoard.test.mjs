import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Tetromino } from "../src/Tetromino.mjs";
import { Board } from "../src/Board.mjs";

describe("rotating Tetrominoes in context of board", () => {
  let board;
  beforeEach(() => {
    board = new Board(10, 6);
  });

  describe("to the left/counter-clockwise", () => {
    test("succeeds mid-field with enough space", () => {
      board.drop(Tetromino.T_SHAPE);
      board.state[2][3] = "x";
      board.state[2][5] = "x";

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `....T.....
         ...TT.....
         ...xTx....
         ..........
         ..........
         ..........`
      );

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `..........
         ...TTT....
         ...xTx....
         ..........
         ..........
         ..........`
      );

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `....T.....
         ....TT....
         ...xTx....
         ..........
         ..........
         ..........`
      );
    });

    test("is a no-op mid-field without enough space", () => {
      board.drop(Tetromino.T_SHAPE);
      board.state[2][3] = "x";
      board.state[2][4] = "x";
      board.state[2][5] = "x";

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `....T.....
         ...TTT....
         ...xxx....
         ..........
         ..........
         ..........`
      );
      expect(board.hasFalling()).to.be.true;
    });

    test("succeeds by moving 1 block to the left mid-field without enough space", () => {
      board.drop(Tetromino.T_SHAPE);
      board.state[2][4] = "x";
      board.state[2][5] = "x";

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `...T......
         ..TT......
         ...Txx....
         ..........
         ..........
         ..........`
      );
      expect(board.hasFalling()).to.be.true;
    });

    test("T_SHAPE succeeds with wall-kick", () => {
      board.drop(Tetromino.T_SHAPE);

      board.rotateLeft();
      board.rotateLeft();
      board.rotateLeft();

      board.falling.left = -1;

      expect(board.toString()).to.equalShape(
        `T.........
         TT........
         T.........
         ..........
         ..........
         ..........`
      );

      board.rotateLeft();

      expect(board.toString()).to.equalShape(
        `.T........
         TTT.......
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with the wall on the left", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateLeft();

      board.falling.left = -2;

      expect(board.toString()).to.equalShape(
        `I.........
         I.........
         I.........
         I.........
         ..........
         ..........`
      );

      board.rotateLeft();

      expect(board.toString()).to.equalShape(
        `..........
         ..........
         IIII......
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with wall on the right", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateLeft();

      board.falling.left = board.width - 3;

      expect(board.toString()).to.equalShape(
        `.........I
         .........I
         .........I
         .........I
         ..........
         ..........`
      );

      board.rotateLeft();

      expect(board.toString()).to.equalShape(
        `..........
         ..........
         ......IIII
         ..........
         ..........
         ..........`
      );
    });

  });
});

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
  });
});

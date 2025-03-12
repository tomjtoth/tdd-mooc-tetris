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
      board.state[2][1] = "x";
      board.state[2][2] = "x";
      board.state[2][3] = "x";
      board.state[2][5] = "x";

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `....T.....
         ....TT....
         .xxxTx....
         ..........
         ..........
         ..........`
      );

      board.rotateLeft();
      expect(board.toString()).to.equalShape(
        `....T.....
         ....TT....
         .xxxTx....
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
        `...TTT....
         ....T.....
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
         ...TT.....
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

      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();

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
        `..........
         .T........
         TTT.......
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with the wall on the left", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();

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
         IIII......
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with wall on the right", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateLeft();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();

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
         ......IIII
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with blocks on the right", () => {
      board.drop(Tetromino.I_SHAPE);
      board.rotateLeft();
      board.moveLeft();
      board.state[1][5] = "x";
      board.state[2][5] = "x";

      expect(board.toString()).to.equalShape(
        `....I.....
         ....Ix....
         ....Ix....
         ....I.....
         ..........
         ..........`
      );

      board.rotateLeft();

      expect(board.toString()).to.equalShape(
        `..........
         .IIIIx....
         .....x....
         ..........
         ..........
         ..........`
      );
    });
  });

  describe("to the right/clockwise", () => {
    test("succeeds mid-field with enough space", () => {
      board.drop(Tetromino.T_SHAPE);
      board.state[2][1] = "x";
      board.state[2][2] = "x";
      board.state[2][3] = "x";
      board.state[2][5] = "x";

      board.rotateRight();
      expect(board.toString()).to.equalShape(
        `....T.....
         ...TT.....
         .xxxTx....
         ..........
         ..........
         ..........`
      );

      board.rotateRight();
      expect(board.toString()).to.equalShape(
        `....T.....
         ...TT.....
         .xxxTx....
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

      board.rotateRight();
      expect(board.toString()).to.equalShape(
        `...TTT....
         ....T.....
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

      board.rotateRight();
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

      board.rotateRight();

      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();

      expect(board.toString()).to.equalShape(
        `.........T
         ........TT
         .........T
         ..........
         ..........
         ..........`
      );

      board.rotateRight();

      expect(board.toString()).to.equalShape(
        `..........
         ........T.
         .......TTT
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with the wall on the left", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateRight();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();
      board.moveLeft();

      expect(board.toString()).to.equalShape(
        `I.........
         I.........
         I.........
         I.........
         ..........
         ..........`
      );

      board.rotateRight();

      expect(board.toString()).to.equalShape(
        `..........
         IIII......
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with wall on the right", () => {
      board.drop(Tetromino.I_SHAPE);

      board.rotateRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();
      board.moveRight();

      expect(board.toString()).to.equalShape(
        `.........I
         .........I
         .........I
         .........I
         ..........
         ..........`
      );

      board.rotateRight();

      expect(board.toString()).to.equalShape(
        `..........
         ......IIII
         ..........
         ..........
         ..........
         ..........`
      );
    });

    test("I_SHAPE succeeds with blocks on the right", () => {
      board.drop(Tetromino.I_SHAPE);
      board.rotateRight();
      board.state[1][4] = "x";
      board.state[2][4] = "x";

      expect(board.toString()).to.equalShape(
        `.....I....
         ....xI....
         ....xI....
         .....I....
         ..........
         ..........`
      );

      board.rotateRight();

      expect(board.toString()).to.equalShape(
        `..........
         IIIIx.....
         ....x.....
         ..........
         ..........
         ..........`
      );
    });
  });
});

const RELEVANCE = "OSZLJTI";

export class HighScore {
  score = 0;

  constructor() {
    this.onLineCleared = this.onLineCleared.bind(this);
  }

  onLineCleared({ detail: det }) {
    const rowMultiplier = det.boardHeight - det.rowIndex;

    det.line.forEach((char) => {
      this.score += (RELEVANCE.indexOf(char) + 1) * rowMultiplier;
    });
  }
}

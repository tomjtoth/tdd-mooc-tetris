const RELEVANCE = "OSZLJTI";

export class ScoringSystem {
  score = 0;
  level = 1;

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

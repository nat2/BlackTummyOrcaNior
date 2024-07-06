export default class Score {
  textToRender = "";  

  constructor(highScoreKey, scoreIncRate, scoreFontSize, scorePosition) {
    this.highScoreKey = highScoreKey;
    this.scoreIncRate = scoreIncRate;

    this.fontSize = scoreFontSize;

    this.x = scorePosition.x;
    this.y = scorePosition.y;

    this.score = 0.0;
    this.highScore = 0.0;  // Just in case the line below has error.
    this.highScore = Number(localStorage.getItem(this.highScoreKey));
  }

  setTextToRender() {
    const scoreStr = Math.floor(this.score).toString().padStart(7, 0);
    const highScoreStr = Math.floor(this.highScore).toString().padStart(7, 0);
    this.textToRender = "Hi Score: " + highScoreStr + "   " + "Current Score: " + scoreStr;
  }

  update() {
    this.score += this.scoreIncRate;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    
    this.setTextToRender();
  }
  
  mayWriteHighScore() {
    if (Math.floor(this.score) > Number(localStorage.getItem(this.highScoreKey))) {
      localStorage.setItem(this.highScoreKey, Math.floor(this.score));
    }
  }

  reset() {
    this.score = 0.0;
    this.setTextToRender();
  }
}

import SimpleSprite from "./simplesprite.js";

export default class GameOverAnimation {  
  picArray = [null, null];
  gameOverText = null;

  constructor(gameSize,
              playerPicSize, octopusPicSize,
              playerPicSpeed, octopusPicSpeed, 
              gameOverTextFontSize,
              endTime) {
    this.gameSize = gameSize;
    
    this.playerPicSize = playerPicSize;
    this.octopusPicSize = octopusPicSize;

    this.playerPicSpeed = playerPicSpeed;
    this.octopusPicSpeed = octopusPicSpeed;

    this.gameOverTextFontSize = gameOverTextFontSize;

    this.endTime = endTime;

    this.reset();
  }

  update() {
    // Expect the caller to check isAnimationOver()
    // before calling update()
    // but add if check at the beginning in case
    // the caller still calls even after
    // isAnimationOver() is true.
    if (this.currentTime >= this.endTime) {
      return;
    }

    this.picArray.forEach((pic) => {
      pic.update(/*gameSpeed=*/1.0);
    });
    
    this.currentTime += 1.0;
    if (this.currentTime >= this.endTime) {
      // Move this.gameOverText into the canvas.
      this.gameOverText.y = this.gameSize.height / 2.0;  
    }
  }

  isAnimationOver() {
    return this.currentTime >= this.endTime;
  }

  reset() {
    this.currentTime = 0.0;
    this.picArray[0] = new SimpleSprite(
      this.playerPicSize,
      this.playerPicSpeed,
      -this.playerPicSize.width,
      this.gameSize.height / 10.0,
      'images/nior_big.png'
    );
    this.picArray[1] = new SimpleSprite(
      this.octopusPicSize,
      this.octopusPicSpeed,
      this.gameSize.width,
      this.gameSize.height / 3.5,
      'images/octopus_vertical.png'
    );
    this.gameOverText = {
      textToRender: "Game Over",
      fontSize: this.gameOverTextFontSize,
      x: this.gameSize.width / 4.5,
      y: this.gameSize.height * 2.0  // Initially hide this below the canvas.
    };
  }
}

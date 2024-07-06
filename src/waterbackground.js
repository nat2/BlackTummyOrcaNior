import SimpleSprite from "./simplesprite.js";

export default class WaterBackground {
  waterArray = [];  

  constructor(gameSize, waterSize, waterSpeed, waterMinRepeatedPicsToBuffer) {
    this.gameSize = gameSize;
    this.waterSize = waterSize;

    this.width = waterSize.width;
    this.height = waterSize.height;
    this.waterSpeed = waterSpeed;

    this.waterMinRepeatedPicsToBuffer = waterMinRepeatedPicsToBuffer;

    this.backgroundEndX = 0.0;

    for (let i = 0; i < this.waterMinRepeatedPicsToBuffer; i++) {
      this.createWater();
    }
  }

  createWater() {
    const x = this.backgroundEndX;
    const y = this.gameSize.height - this.waterSize.height;
    const water = new SimpleSprite(
      this.waterSize,
      this.waterSpeed,
      x,
      y,
      'images/water.png'
    );
    
    this.waterArray.push(water);

    this.backgroundEndX += this.waterSize.width;
  } 

  update(gameSpeed) {
    // console.log("waterbackground--endX: " + this.backgroundEndX);

    // Filter out the first water in the array
    // if it disappears into the left side.
    // x < -this.this.waterSize should be good but do
    // x < -this.this.waterSize * 1.5 just to add some buffer. 
    if (this.waterArray.length >= 1) {
      if (this.waterArray[0].x < -this.waterSize.width * 1.5) { 
        this.waterArray.shift();
      }
    }    

    while (this.waterArray.length < this.waterMinRepeatedPicsToBuffer) {
      this.createWater();
    }

    this.waterArray.forEach((water) => {
      water.update(gameSpeed);
    });

    this.backgroundEndX = this.waterArray[this.waterArray.length - 1].x + this.waterSize.width;
  }
}

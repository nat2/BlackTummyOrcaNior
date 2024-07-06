import SimpleSprite from "./simplesprite.js"; 

export default class Octopi {
  nextOctopusInterval = null;
  octopusArray = [];  

  constructor(gameSize, octopusSize, octopusSpeed,
              nextOctopusIntervalMin, nextOctopusIntervalMax) {
    this.gameSize = gameSize;

    this.octopusSize = octopusSize;
    this.octopusSpeed = octopusSpeed;

    this.nextOctopusIntervalMin = nextOctopusIntervalMin;
    this.nextOctopusIntervalMax = nextOctopusIntervalMax;

    //this.setNextOctopusTime();
    this.nextOctopusInterval = -0.01;
  }

  getRandomIntegerInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setNextOctopusTime() {
    const rand_num = this.getRandomIntegerInclusive(
      this.nextOctopusIntervalMin,
      this.nextOctopusIntervalMax
    );
    this.nextOctopusInterval = rand_num;
  }

  createOctopus() {
    const x = this.gameSize.width * 1.1;
    const y = this.gameSize.height - this.octopusSize.height;
    const octopus = new SimpleSprite(
      this.octopusSize,
      this.octopusSpeed,
      x,
      y,
      'images/octopus.png'
    );
    
    this.octopusArray.push(octopus);
  }

  update(gameSpeed) {
    if (this.nextOctopusInterval <= 0) {
      this.createOctopus();
      this.setNextOctopusTime();
    }
    this.nextOctopusInterval -= 1;
    // this.nextOctopusInterval -= gameSpeed;

    // Filter out the first octopus in the array
    // if it disappears into the left side.
    // x < -this.octopusSize.width should be good but do
    // x < -this.octopusSize.width * 2 just to add some buffer. 
    if (this.octopusArray.length >= 1) {
      if (this.octopusArray[0].x < -this.octopusSize.width * 2) { 
        this.octopusArray.shift();
      }
    }

    this.octopusArray.forEach((octopus) => {
      octopus.update(gameSpeed);
    });

    // console.log("octopusArray's length:" + this.octopusArray.length)
  }

  collideWith(anotherSprite) {
    return this.octopusArray.some(
      (octopus) => octopus.collideWith(anotherSprite)
    );  
  }

  reset() { 
    //this.setNextOctopusTime();
    this.nextOctopusInterval = -0.01;
    this.octopusArray = [];
  }
}

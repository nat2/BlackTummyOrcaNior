const PlayerStateEnum = Object.freeze({
  Invalid: 0,
  OnWater: 1,
  JumpingUp: 2,
  FallingDown: 3
});


export default class Player {
  state = PlayerStateEnum.OnWater;

  constructor(gameSize, playerSize, minJumpHeight, maxJumpHeight,
              jumpSpeed, fallSpeed) {
    this.gameSize = gameSize;

    this.width = playerSize.width;
    this.height = playerSize.height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.jumpSpeed = jumpSpeed;
    this.fallSpeed = fallSpeed;

    this.x = this.gameSize.width * 0.0125; 
    this.y = this.gameSize.height * 0.9925 - this.height;
    this.yOnWaterPosition = this.y;

    this.image = new Image();
    this.image.src = 'images/nior.png'
  }

  update(gameSpeed, controllerPressed) {
    // console.log("Player update");
    switch (this.state) {
      case PlayerStateEnum.OnWater:
        if (!controllerPressed) {
          // Do nothing.
          return;
        }
        // controllerPressed === true
        this.state = PlayerStateEnum.JumpingUp;
        // Fall through to the State.JumpingUp case.
      case PlayerStateEnum.JumpingUp:
        if ((this.y > this.gameSize.height - this.minJumpHeight) ||
            (this.y > this.gameSize.height - this.maxJumpHeight && controllerPressed)) {
          this.y -= this.jumpSpeed * gameSpeed;
          return;
        }
        this.state = PlayerStateEnum.FallingDown;
        break;
      case PlayerStateEnum.FallingDown:
        this.y += this.fallSpeed * gameSpeed;
        if (this.y >= this.yOnWaterPosition) {
          this.y = this.yOnWaterPosition;
          this.state = PlayerStateEnum.OnWater;
        }
        break;
      default:
        console.log("Player error in update() function.");
    }
  }

  reset() {
    this.state = PlayerStateEnum.OnWater;
    this.x = this.gameSize.width * 0.0125; 
    this.y = this.gameSize.height * 0.9925 - this.height;
  }
}


export default class SimpleSprite {
  constructor(size, speed, x, y, img_src) {
    this.width = size.width;
    this.height = size.height;
    this.speed = speed;
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = img_src;
  }

  update(gameSpeed) {
    this.x -= this.speed * gameSpeed;    
  }

  collideWith(anotherSprite) { 
    const adjustBy = 1.5;
    if (
      (this.x          + (this.width  / adjustBy)           > anotherSprite.x) &&
      (anotherSprite.x + (anotherSprite.width  / adjustBy)  > this.x         ) &&
      (this.y          + (this.height / adjustBy)           > anotherSprite.y) &&
      (anotherSprite.y + (anotherSprite.height / adjustBy)  > this.y         )
    ) {
      return true;
    } else { 
      return false;
    }
  }
}

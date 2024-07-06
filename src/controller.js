export default class Controller {
  isPressed = false;
  
  constructor() {
    // touch events
    //window.removeEventListener('touchstart', this.touchstart);
    //window.removeEventListener('touchend', this.touchend);
    window.addEventListener('touchstart', this.touchstart);
    window.addEventListener('touchend', this.touchend);

    // keyboard events
    //window.removeEventListener('keydown', this.keydown);
    //window.removeEventListener('keyup', this.keyup);
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
  }

  touchstart = ()=>{
    this.isPressed = true;
  }
  touchend = ()=>{
    this.isPressed = false;
  }
  keydown = ()=>{
    this.isPressed = true;
  }
  keyup = ()=>{
    this.isPressed = false;
  }
}

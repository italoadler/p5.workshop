class Background {
    constructor(img, speed) {
      this.x = 0;
      this.y = 0;
      this.img = img;
      this.speed = speed;
    }
  
    show() {
      image(this.img, this.x, this.y, width, height);
      image(this.img, this.x + width, this.y, width, height);
    }
  
    move() {
      this.x -= this.speed;
      if (this.x < -width) {
        this.x = 0;
      }
    }
  }
  
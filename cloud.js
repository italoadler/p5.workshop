class Cloud {
    constructor(img) {
      this.x = random(width);
      this.y = random(100, 300);
      this.img = img;
      this.speed = random(0.5, 1.5);
    }
  
    show() {
      image(this.img, this.x, this.y);
    }
  
    move() {
      this.x -= this.speed;
      if (this.x < -this.img.width) {
        this.x = width;
        this.y = random(100, 300);
        this.speed = random(0.5, 1.5);
      }
    }
  }
  
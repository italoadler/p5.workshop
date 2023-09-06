class Ground {
    constructor(img) {
      this.x = 0;
      this.y = height - img.height;
      this.img = img;
    }
  
    show() {
      image(this.img, this.x, this.y);
    }
  
    move(speed) {
      this.x -= speed;
      if (this.x <= -this.img.width) {
        this.x = 0;
      }
    }
  }
  
class Horse {
    constructor(animation, x, y, speed) {
      this.x = x;
      this.y = y;
      this.yBase = y;  // Keep track of the ground level
      this.animation = animation;
      this.len = this.animation.length;
      this.speed = speed;
      this.index = 0;
  
      // For jumping
      this.velocity = 0;
      this.gravity = 0.7;
      this.lift = -30;  // This will decide the strength of the jump
      this.jumping = false;  // To know if horse is in air
    }
  
    show() {
      let index = floor(this.index) % this.len;
      image(this.animation[index], this.x, this.y);
    }
  
    animate() {
      this.index += this.speed;
      this.x += this.speed * 15;
      
      if (this.x > width) {
        this.x = -this.animation[0].width;
      }
  
      // Apply gravity
      if (this.jumping) {
        this.velocity += this.gravity;
        this.y += this.velocity;
  
        // Stop the horse when it reaches the ground
        if (this.y > this.yBase) {
          this.y = this.yBase;
          this.jumping = false;
          this.velocity = 0;  // Reset velocity
        }
      }
    }
  
    jump() {
      if (!this.jumping) {  // Prevent double jump when already in air
        this.velocity += this.lift;
        this.jumping = true;
      }
    }
  }
  
  function keyPressed() {
    if (key == ' ' || keyCode == UP_ARROW) {  // Jump when spacebar or up arrow is pressed
      for (let horse of horses) {  // If you have multiple horses and want all of them to jump
        horse.jump();
      }
    }
    return false;  // prevent any default behavior
  }
  


//v1
// class Horse extends Sprite {
//     constructor(animation, x, y, speed) {
//       super(animation, x, y, speed);
  
//       this.vy = 0; // Vertical velocity
//       this.gravity = 0.5; // Gravity force, adjust as needed
//       this.lift = -15; // Jumping force, adjust as needed
//       this.grounded = true; // Check if the sprite is on the ground
//     }
  
//     jump() {
//       if (this.grounded) {
//         this.vy += this.lift;
//         this.grounded = false;
//       }
//     }
  
//     animate() {
//       super.animate(); // Call the parent animate method if it exists
      
//       // Apply physics for the horse
//       this.y += this.vy;
//       this.vy += this.gravity;
  
//       // Prevent the horse from falling below the ground
//       if (this.y > someGroundLevel) {
//         this.y = someGroundLevel;
//         this.vy = 0;
//         this.grounded = true;
//       }
//     }
//   }
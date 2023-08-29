let spritesheet;
let spritedata;
let ground = [];
let runAnimation = [];
let jumpAnimation = [];
let horse;
let mountains;
let hills;
let tileWidth = 100;

let galop;
let blossom;
let mountainX = 0;
let hillX = 0;
let parallaxSpeedMountain = 0.5;
let parallaxSpeedHill = 1;

let groundX = 0;
let parallaxSpeedGround = 8;
let speedFlowers = parallaxSpeedGround;
let flowers = [];
let flowerClosedImg;
let flowerOpenImg;

function preload() {
  mountains = loadImage("assets/background/scroll_bg_far.png");
  hills = loadImage("assets/background/hills-scroll.png");

  for (let i = 1; i <= 3; i++) {
    const tileImg = loadImage(`assets/tile/grasses/tile_grass_0${i}.png`);
    ground.push(tileImg);
  }

  galop = loadSound("assets/sound/galop.wav");
  blossom = loadSound("assets/sound/tone.wav");
  spritedata = loadJSON("horse.json");
  spritesheet = loadImage("horse.png");


  // Preload the jump animations for the horse
  for (let i = 0; i < 7; i++) {
    let filename = `assets/sprite/horse/horse-jump-0${i}.png`;
    jumpAnimation.push(loadImage(filename));
  }

  flowerClosedImg = loadImage("assets/tile/flowers/flower.png");
  flowerOpenImg = loadImage("assets/tile/flowers/flower-open.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  galop.loop();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    runAnimation.push(img);
  }

  horse = new Horse(runAnimation, jumpAnimation, 0, 0, 0.3);

  for (let i = 0; i < 10; i++) {
    flowers.push(new Flower(flowerClosedImg));
  }
}

function draw() {
  background(mountains);

  mountainX -= horse.speed * parallaxSpeedMountain;
  hillX -= horse.speed * parallaxSpeedHill;

  image(mountains, mountainX, 0, width, height);
  image(mountains, mountainX + width, 0, width, height);

  image(hills, hillX, height - hills.height - 71, width, hills.height);
  image(hills, hillX + width, height - hills.height - 71, width, hills.height);

  groundX -= horse.speed * parallaxSpeedGround;

  let numberOfTiles = ceil(width / tileWidth);
  for (let i = 0; i <= numberOfTiles; i++) {
    let tile = ground[2];
    if (tile) {
      let x = i * tileWidth + groundX;
      let y = height - tile.height;
      image(tile, x, y + 27);
    }
  }
  if (groundX < -tileWidth) groundX += tileWidth;
  if (mountainX < -width) mountainX = 0;
  if (hillX < -width) hillX = 0;

  horse.show();
  horse.animate();
  horse.applyGravity();

  for (let flower of flowers) {
    flower.show();
    flower.move();

    if (horse.collides(flower) && !flower.opened) {
      flower.opened = true;
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    horse.jump();
  }
}

function mousePressed() {
  if (galop.isPlaying()) {
    galop.stop();
  } else {
    galop.loop();
  }
}

class Horse {
    constructor(runAnimation, jumpAnimation, x, y, speed) {
      this.runAnimation = runAnimation;
      this.jumpAnimation = jumpAnimation;
      this.speed = speed;
      this.index = 0;
      this.x = x;
      this.y = y;
      this.gravity = 0.5;
      this.lift = -15;
      this.velocity = 0;
      this.jumping = false; // Added to check if horse is currently jumping
    }
  
    show() {
      let index = floor(this.index) % this.runAnimation.length;
      if(this.jumping) {
        index = floor(this.index) % this.jumpAnimation.length;
        image(this.jumpAnimation[index], this.x, this.y);
    } else {
        console.log("Current index:", index);
        console.log("Current image:", this.runAnimation[index])
        image(this.runAnimation[index], this.x, this.y);
      }
    }
  
    animate() {
      this.index += this.speed;
      
    }
  
    jump() {
      if (this.y == height - 200) {
        this.velocity += this.lift;
        this.jumping = true; // Set jumping to true when the horse jumps
      }
    }
  
    applyGravity() {
      this.velocity += this.gravity;
      this.y += this.velocity;
      if (this.y > height - 200) {
        this.y = height - 200;
        this.velocity = 0;
        this.jumping = false; // Reset jumping to false when the horse lands
      }
    }
  
    collides(flower) {
      let horseWidth = this.runAnimation[0].width; // Use runAnimation here since it will have the horse's dimensions.
      let horseHeight = this.runAnimation[0].height;
      let flowerWidth = flower.image.width;
      let flowerHeight = flower.image.height;
  
      return !(this.x + horseWidth < flower.x ||
               this.x > flower.x + flowerWidth ||
               this.y + horseHeight < flower.y ||
               this.y > flower.y + flowerHeight);
    }
  }
  

class Flower {
  constructor(img) {
    this.x = random(width, width * 2);
    this.y = height - img.height - 65;
    this.image = img;
    this.speed = parallaxSpeedGround; // Speed synced with the ground
    this.opened = false;
  }

  show() {
    if (this.opened) {
      image(flowerOpenImg, this.x, this.y);
    } else {
      image(this.image, this.x, this.y);
    }
  }

  move() {
    this.x -= this.speed;
    if (this.x < -this.image.width) {
      this.x = random(width, width * 2);
      this.opened = false; // Reset the flower's state when it goes out of view
    }
  }
}

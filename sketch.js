let spritesheet;
let spritedata;
let ground = [];
let animation = [];
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
let flowers = [];
let flowerClosedImg;
let flowerOpenImg;

function preload() {
  mountains = loadImage('assets/background/scroll_bg_far.png');
  hills = loadImage('assets/background/hills-scroll.png');
  
  for (let i = 1; i <= 3; i++) {
    const tileImg = loadImage(`assets/tile/grasses/tile_grass_0${i}.png`);
    ground.push(tileImg);
  }

  galop = loadSound('assets/sound/galop.wav');
  blossom = loadSound('assets/sound/tone.wav');
  spritedata = loadJSON('horse.json');
  spritesheet = loadImage('horse.png');

  flowerClosedImg = loadImage('assets/tile/flowers/flower.png');
  flowerOpenImg = loadImage('assets/tile/flowers/flower-open.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  galop.loop();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  horse = new Horse(animation, 0, 0, random(0.5, 0.4));

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

    if (horse.collides(flower) && flower.state === 'closed') {
      blossom.play();
      flower.state = 'shattered';
      flower.shatter();
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
  constructor(animation, x, y, speed) {
    this.animation = animation;
    this.speed = speed;
    this.index = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.8;
    this.lift = -15;
    this.velocity = 0;
  }

  show() {
    let index = floor(this.index) % this.animation.length;
    image(this.animation[index], this.x, this.y);
  }

  animate() {
    this.index += this.speed;
  }

  jump() {
    if (this.y == height - 200) {
      this.velocity += this.lift;
    }
  }

  applyGravity() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y > height - 200) {
      this.y = height - 200;
      this.velocity = 0;
    }
  }

  collides(flower) {
    let horseWidth = this.animation[0].width;
    let horseHeight = this.animation[0].height;
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
    this.speed = parallaxSpeedGround;
    this.state = 'closed';
    this.particles = [];
  }

  show() {
    if (this.state === 'closed') {
      image(this.image, this.x, this.y);
    } else if (this.state === 'opened') {
      image(flowerOpenImg, this.x, this.y);
    } else if (this.state === 'shattered') {
      for (let p of this.particles) {
        p.show();
      }
    }
  }

  shatter() {
    for (let i = 0; i < 5; i++) {
      const p = new Particle(this.x, this.y, this.image);
      this.particles.push(p);
    }
  }

  move() {
    this.x -= this.speed;
    if (this.x < -this.image.width) {
      this.x = random(width, width * 2);
      this.state = 'closed';
      this.particles = [];
    }

    for (let p of this.particles) {
      p.update();
    }
  }
}

class Particle {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.speedX = random(-2, 2);
    this.speedY = random(-5, -1);
    this.alpha = 255;
    this.img = img;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 5;
  }

  show() {
    tint(255, this.alpha);
    image(this.img, this.x, this.y, this.size, this.size);
  }
}

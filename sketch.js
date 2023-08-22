// v0.2.0

let spritesheet;
let spritedata;

let ground = [];
let animation = [];
let horse;  // Single horse
let mountains;
let hills;
let galop; 
let tileWidth = 100;

// Parallax variables
let mountainX = 0;
let hillX = 0;
let parallaxSpeedMountain = 0.5;
let parallaxSpeedHill = 1;
let groundX = 0;
let parallaxSpeedGround = 10 ;  // This should be faster than the hills and mountains
let parallaxSpeedFlower = parallaxSpeedGround;
// Flower variables
let flowers = [];
let flowerImg;

function preload() {
    mountains = loadImage('assets/background/scroll_bg_far.png');
    hills = loadImage('assets/background/hills-scroll.png');
    flowerImg = loadImage('assets/tile/flowers/flower.png');
  
    for (let i = 1; i <= 3; i++) {
        const tileImg = loadImage(`assets/tile/grasses/tile_grass_0${i}.png`);
        ground.push(tileImg);
    }
  
    galop = loadSound('assets/sound/galop.wav');
    spritedata = loadJSON('horse.json');
    spritesheet = loadImage('horse.png');
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
  
    for (let i = 0; i < 5; i++) {  // Initialize with 5 random flowers
        flowers.push(new Flower(flowerImg));
    }
}

function draw() {
    background(mountains);
  
    // Parallax for the mountains, hills, and ground
    handleParallax();
  
    horse.show();
    horse.animate();
    horse.applyGravity();
  
    for (let flower of flowers) {
        flower.show();
        flower.move();
    }
}

function handleParallax() {
    mountainX -= horse.speed * parallaxSpeedMountain;
    hillX -= horse.speed * parallaxSpeedHill;
    groundX -= horse.speed * parallaxSpeedGround;
  
    image(mountains, mountainX, 0, width, height);
    image(mountains, mountainX + width, 0, width, height);
  
    image(hills, hillX, height - hills.height - 71, width, hills.height);
    image(hills, hillX + width, height - hills.height - 71, width, hills.height);
  
    let numberOfTiles = ceil(width / tileWidth);
    for (let i = 0; i <= numberOfTiles; i++) {
        let tile = ground[2];
        if (tile) {
            let x = i * tileWidth + groundX;
            let y = height - tile.height;
            image(tile, x, y+27);
        }
    }
    if (groundX < -tileWidth) groundX += tileWidth;
  
    if (mountainX < -width) mountainX = 0;
    if (hillX < -width) hillX = 0;
}

function keyPressed() {
    if (keyCode === 32) {  // 32 is the keycode for the spacebar
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
        this.gravity = 1.8;
        this.lift = -40;
        this.velocity = 0.5;
    }

    show() {
        let index = floor(this.index) % this.animation.length;
        image(this.animation[index], this.x, this.y);
    }

    animate() {
        this.index += this.speed;
    }

    jump() {
        if (this.y == height - 200) {  // Only jump if horse is on the ground
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
}

class Flower {
    constructor(img) {
        this.x = random(width, width * 2);
        this.y = height - img.height - 70;
        this.image = img;
        this.speed = parallaxSpeedFlower
    }

    show() {
        image(this.image, this.x, this.y);
    }

    move() {
        this.x -= horse.speed * this.speed;
        if (this.x < -this.image.width) {
            this.x = random(width, width * 2);
            this.speed = random(2, 4);  // Get a new random speed
        }
    }
}

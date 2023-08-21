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

// Parallax variables
let groundX = 0;
let parallaxSpeedGround = 2;  // Adjust as needed; this should be faster than the hills and mountains


function preload() {
  mountains = loadImage('assets/background/scroll_bg_far.png');
  hills = loadImage('assets/background/hills-scroll.png');

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
  //frameRate(120);
  
  galop.loop();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  horse = new Horse(animation, 0, 0, random(0.5, 0.4));
}

function draw() {
  background(mountains);
  
  // Parallax for the mountains and hills
  mountainX -= horse.speed * parallaxSpeedMountain*2;
  hillX -= horse.speed * parallaxSpeedHill*6;
  
  image(mountains, mountainX, 0, width, height);
  image(mountains, mountainX + width, 0, width, height);
  
  image(hills, hillX, height - hills.height - 71, width, hills.height);
  image(hills, hillX + width, height - hills.height - 71, width, hills.height);

  // Parallax for the ground tiles
  groundX -= horse.speed * parallaxSpeedGround*6;

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

  // Reset positions when images go off screen
  if (mountainX < -width) mountainX = 0;
  if (hillX < -width) hillX = 0;

  horse.show();
  horse.animate();
  horse.applyGravity();
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


// let spritesheet;
// let spritedata;
// let ground = [];
// let animation = [];
// let horses = [];
// let trees = [];
// let roses = [];
// let clouds = [];
// let mountains;
// let hills;
// let galop; 
// let treeImg, roseImg;

// function preload() {
//   mountains = loadImage('assets/background/scroll_bg_far.png');
//   hills = loadImage('assets/background/hills-scroll.png');
  
//   for (let i = 1; i <= 3; i++) {
//     const tileImg = loadImage(`assets/tile/grasses/tile_grass_0${i}.png`);
//     ground.push(tileImg);
//   }

//   galop = loadSound('assets/sound/galop.wav');
//   spritedata = loadJSON('horse.json');
//   spritesheet = loadImage('horse.png');
  
//   treeImg = loadImage('assets/tile/flowers/flower-open.png');
//   roseImg = loadImage('assets/tile/flowers/flower.png');
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   frameRate(120);
//   galop.loop();

//   setupAnimations();
//   setupHorses();
// }

// function setupAnimations() {
//   let frames = spritedata.frames;
//   for (let i = 0; i < frames.length; i++) {
//     let pos = frames[i].position;
//     let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
//     animation.push(img);
//   }
// }

// function setupHorses() {
//   for (let i = 0; i < 5; i++) {
//     horses.push(new Horse(animation, 0, i+height-215, random(0.2  , 0.3)));
//   }
// }

// function draw() {
//   background(mountains);
//   drawBackground();
//   let horse = horses[0];
//   horse.show();
//   horse.animate();
//   // for (let horse of horses) {
//   //   horse.show();
//   //   horse.animate();
//   // }

//   // Uncomment these lines if you want trees and roses in the future
//   // for (let tree of trees) {
//   //   tree.show();
//   //   tree.move();
//   // }

//   // for (let rose of roses) {
//   //   rose.show();
//   //   rose.move();
//   // }
// }

// function drawBackground() {
//   image(hills, 0, height - hills.height - 97, width, hills.height);
  
//   const tileWidth = 100;
//   let numberOfTiles = ceil(displayWidth / tileWidth);

//   for (let i = 0; i < numberOfTiles; i++) {
//     let tile = ground[2];
//     if (tile) {
//       let x = i * tileWidth;
//       let y = height - tile.height;
//       image(tile, x, y);
//     }
//   }
// }

// function mousePressed() {
//   if (galop.isPlaying()) {
//     galop.stop();
//   } else {
//     galop.loop();
//   }
// }

// class Horse {
//   constructor(animation, x, y, speed) {
//     this.x = x;
//     this.y = y;
//     this.animation = animation;
//     this.len = this.animation.length;
//     this.speed = speed;
//     this.index = 0;
//   }

//   show() {
//     let index = floor(this.index) % this.len;
//     image(this.animation[index], this.x, this.y);
//   }

//   animate() {
//     this.index += this.speed;
//     this.x += this.speed * 15;
    
//     if (this.x > width) {
//       this.x = -this.animation[0].width;
//     }
//   }

//   // You can add jump function and other functions for the Horse here
// }


// /* 

// @autor: Italo Adler 
// @data: 21/08/2023
// @descrição: Cena em que cavalo corre em loop infinito ao som da galopada


// // referencia de codigo para vocês! 

// Thanks to Daniel Shiffman for the tutorial on spritesheets
// // Inpiration and help 

// // Daniel Shiffman
// // http://youtube.com/thecodingtrain
// // https://thecodingtrain.com/CodingChallenges/111-animated-sprite.html

// // Horse Spritesheet from
// // https://opengameart.org/content/2d-platformer-art-assets-from-horse-of-spring

// // Animated Sprite
// // https://youtu.be/3noMeuufLZY
// */


// let spritesheet;
// let spritedata;

// let ground = [];
// let animation = [];
// let horses = [];
// let trees = [];
// let roses = [];
// let clouds = [];
// let mountains;
// let hills;
// let galop; 
// let treeImg, roseImg;

// function preload() {
  
  
//   // 
//   // fundo
//   mountains = loadImage('assets/background/scroll_bg_far.png');
//   hills = loadImage('assets/background/hills-scroll.png');
  
  
//   // chão
//   // Preloading the tiles
//   for (let i = 1; i <= 3; i++) {
//     const tileImg = loadImage(`assets/tile/grasses/tile_grass_0${i}.png`);
//     ground.push(tileImg);
//   }
  
//   // galope 
//   galop = loadSound('assets/sound/galop.wav');
  
//   // animação do cavalo
//   spritedata = loadJSON('horse.json');
//   spritesheet = loadImage('horse.png');
  
  
  
//    treeImg = loadImage('assets/tile/flowers/flower-open.png');
//    roseImg = loadImage('assets/tile/flowers/flower.png');
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
  
//   frameRate(120)
  
//   galop.loop();

//   // Preparação de animações do cavalo
//   let frames = spritedata.frames;
//   for (let i = 0; i < frames.length; i++) {
//     let pos = frames[i].position;
//     let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
//     animation.push(img);
//   }
  

//   for (let i = 0; i < 5; i++) {
//     horses[0] = new Sprite(animation, 0, i * 215, random(0.1, 0.4));
//   }

//   // // Criação de árvores e rosas
//   // for (let i = 0; i < 5; i++) {
//   //   trees.push(new Tree(treeImg));
//   //   roses.push(new Rose(roseImg));
//   // }
// }

// function draw() {
//   background(mountains);
//   image(hills, 0,height  - hills.height -97, width, hills.height)

// // Desenhando os tiles do chão
// const tileWidth = 100;  // Ajuste conforme a largura real dos seus tiles

// let numberOfTiles = ceil(displayWidth / tileWidth);  // Calcula quantos tiles são necessários para preencher a largura da tela

// for (let i = 0; i < numberOfTiles ; i++) {
//   let tile = ground[2];  // Usamos o operador de módulo para repetir os tiles quando chegarmos ao final da array
//   if (tile) {  // Verificando se o tile foi carregado corretamente
//     let x = i * tileWidth;
//     let y = height - tile.height;
//     image(tile, x, y);
//   }
// }
//   for (let horse of horses) {
//     horse.show();
//     horse.animate();
//   }

//   for (let tree of trees) {
//     tree.show();
//     tree.move();
//   }

//   for (let rose of roses) {
//     rose.show();
//     rose.move();
//   }
// }


// function mousePressed() {
//   if (galop.isPlaying()) {
//     galop.stop();
//   } else {
//     galop.loop();
//   }
// }

let spritesheet;
let spritedata;
let ground = [];
let runAnimation = [];
let jumpAnimation = [];
let platforms = [];
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
let wildFlowers = [];
let flowerClosedImg;
let flowerOpenImg;
let wildFlowerImage1;
let wildFlowerImage2;

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

  wildFlowerImage1 = loadImage("assets/tile/flowers/flower-wild-00.png");
  wildFlowerImage2 = loadImage("assets/tile/flowers/flower-wild-01.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //   galop.loop();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    runAnimation.push(img);
  }

  horse = new Horse(runAnimation, jumpAnimation, 200, height - 200, 0.3);

  for (let i = 0; i < 10; i++) {
    flowers.push(new Flower(flowerClosedImg));
  }
  wildFlowers.push(new WildFlower(300, height - 100, wildFlowerImage1));
  wildFlowers.push(new WildFlower(500, height - 100, wildFlowerImage2));
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
  for(let flower of wildFlowers) { 
    flower.display();
    flower.move();
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
    this.jumpSpeed = this.speed / 3; // Reduzindo a velocidade da animação de pulo
    this.index = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.4;
    this.lift = -15;
    this.velocity = 0;
    this.jumping = false;
  }

  show() {
    // Determinando qual animação exibir
    let currentAnimation = this.jumping
      ? this.jumpAnimation
      : this.runAnimation;
    let index = floor(this.index) % currentAnimation.length;
    let currentFrame = currentAnimation[index];

    image(currentFrame, this.x, this.y);
  }

  animate() {
    if (this.jumping) {
      this.index += this.jumpSpeed; // Usando a velocidade de pulo se o cavalo estiver pulando
    } else {
      this.index += this.speed;
    }
  }

  jump() {
    if (this.y == height - 200) {
      this.velocity += this.lift;
      this.jumping = true;
      this.index = 0; // Resetamos o índice para o início da animação de pulo
    }
  }

  applyGravity() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y > height - 200) {
      this.y = height - 200;
      this.velocity = 0;
      this.jumping = false;
    }
  }

  collides(flower) {
    let horseWidth = this.runAnimation[0].width;
    let horseHeight = this.runAnimation[0].height;
    let flowerWidth = flower.image.width;
    let flowerHeight = flower.image.height;

    return !(
      this.x + horseWidth < flower.x ||
      this.x > flower.x + flowerWidth ||
      this.y + horseHeight < flower.y ||
      this.y > flower.y + flowerHeight
    );
  }

  transformToIceHorse() {
    this.img = loadImage("assets/sprite/horse-ice/ice-horse.png"); // ou outro frame que você desejar
    this.lives -= 1;
    setTimeout(() => this.transformBack(), 5000); // Transforma de volta depois de 5 segundos, ajuste conforme necessário
  }

  transformBack() {
    this.img = loadImage("assets/sprite/horse/horse.png"); // ou seu frame padrão
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

class WildFlower {
  constructor(x, y, img) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.width = this.img.width;
      this.height = this.img.height;

      // Defina uma velocidade para a flor se mover da direita para a esquerda
      this.speed = 2;  // ajuste conforme necessário
  }

  // Método para desenhar a WildFlower na tela
  display() {
      image(this.img, this.x, this.y);
  }

  // Método para atualizar a posição da WildFlower
  move() {
      this.x -= this.speed;

      // Se a flor estiver fora da tela à esquerda, podemos remover ou reciclar
      if (this.x + this.width < 0) {
          this.reset();
      }
  }

  // Método para redefinir a posição da flor para o lado direito da tela
  // Isso pode ser usado para "reciclar" a flor, criando uma sensação de loop
  reset() {
      this.x = width;
  }

  // Método que pode ser usado para alterar a velocidade (para efeitos de parallax)
  setSpeed(newSpeed) {
      this.speed = newSpeed;
  }
}


let spritesheet;
let spritedata;
let ground = [];
let groundHeight;
let runAnimation = [];
let jumpAnimation = [];
let platforms = [];
let horse;
let mountains;
let hills;
let tileWidth = 100;

// clouds
let cloudImage;
let cloudImage2;
let cloudImage3;
let clouds = [];
let numClouds = 10;
let difficulty = 1; 

let galop;
let blossom;
let mountainX = 0;
let hillX = 0;
let parallaxSpeedMountain = 0.5;
let parallaxSpeedHill = 1;

let groundX = 0;
let parallaxSpeedGround = 18;
let speedFlowers = parallaxSpeedGround;
let flowers = [];
let wildFlowers = [];
let flowerClosedImg;
let flowerOpenImg;
let wildFlowerImage1;
let wildFlowerImage2;
let particles = [];

function handleCollision() {
  // Supondo que `cloudX` e `cloudY` são as coordenadas da nuvem
  for (let i = 0; i < 800; i++) {
    // Criar 100 partículas
    particles.push(new Particle(cloudX, cloudY));
  }
}
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

  cloudImage = loadImage("assets/background/cloud-0.png");
  cloudImage2 = loadImage("assets/background/cloud-1.png");
  cloudImage3 = loadImage("assets/background/cloud-2.png");

  // let tileConfig = {
  //   tile_grass_01: { image: "assets/tile/grasses/tile_grass_01.png" },
  //   tile_grass_02: { image: "assets/tile/grasses/tile_grass_02.png" },
  //   tile_grass_03: { image: "assets/tile/grasses/tile_grass_03.png" },
  //   tile_jump_through_01: {
  //     image: "assets/tile/jump/tile_jump_through_01.png",
  //   },
  // };
}
function handleCollision(x, y) {
  for (let i = 0; i < 100; i++) {
    // Criar 100 partículas
    particles.push(new Particle(x, y));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //   galop.loop();
  groundHeight = flowerClosedImg.height;
  console.log(cloudImage, cloudImage2, cloudImage3);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    runAnimation.push(img);
  }

  horse = new Horse(runAnimation, jumpAnimation, 200, height - 200, 0.3);

  for (let i = 0; i < numClouds; i++) {
    clouds.push(new Cloud(random([cloudImage, cloudImage2, cloudImage3]))); // escolhe uma imagem de nuvem aleatoriamente
  }

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
  for (let flower of wildFlowers) {
    flower.display();
    flower.move();
  }
  for (let i = clouds.length - 1; i >= 0; i--) {
    let cloud = clouds[i];
    cloud.show();
    cloud.move();

    if (cloud.isHit(horse)) {
      handleCollision(cloud.x, cloud.y);
      clouds.splice(i, 1); // Remove a nuvem do array clouds
    }

    // Verifica se a nuvem saiu da tela pela esquerda
    if (cloud.x + cloud.image.width < 0) {
      // Reposiciona a nuvem no lado direito da tela
      cloud.x = width + random(50, 200);
      cloud.y = random(50, height / 2);
    }
  }

  // Atualizar e mostrar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    // Remover partículas que são muito pequenas (otimização)
    if (particles[i].size < 0.5) {
      particles.splice(i, 1);
    }
  }
}

//
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
    this.jumpSpeed = this.speed / 2; // Reduzindo a velocidade da animação de pulo
    this.index = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.5;
    this.lift = -15;
    this.velocity = 12;
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
      this.index = 0; // Resetamos o índice para o início da animação do pulo
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
    this.y = height - img.height-groundHeight;
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
    this.height = this.img.height - groundHeight;

    // Defina uma velocidade para a flor se mover da direita para a esquerda
    this.speed = 2; // ajuste conforme necessário
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

// class Tile {
//   constructor(x, y, imgPath, type) {
//     this.x = x;
//     this.y = y;
//     this.img = loadImage(imgPath);
//     this.type = type;
//     this.width = this.img.width;
//     this.height = this.img.height;
//   }

//   display() {
//     image(this.img, this.x, this.y, this.width, this.height);
//   }
// }

// class TileMap {
//   constructor(tileData, tileConfig) {
//     this.tiles = [];
//     this.loadMap(tileData, tileConfig);
//   }

//   loadMap(tileData, tileConfig) {
//     let yOffset = 0;

//     for (let y = 0; y < tileData.length; y++) {
//       let row = tileData[y];
//       let xOffset = 0;

//       for (let x = 0; x < row.length; x++) {
//         let tileType = row[x];
//         if (tileConfig[tileType]) {
//           let tileInfo = tileConfig[tileType];
//           let tileX = xOffset;
//           let tileY = yOffset;

//           // Decidir qual tipo de Tile instanciar com base no tipo
//           let tile;
//           if (tileType.startsWith("jump")) {
//             tile = new JumpTile(tileX, tileY, tileInfo.image, tileType);
//           } else {
//             tile = new Tile(tileX, tileY, tileInfo.image, tileType);
//           }

//           this.tiles.push(tile);
//           xOffset += tile.width;
//         }
//       }

//       yOffset +=
//         tileConfig[row[0]] && tileConfig[row[0]].image
//           ? loadImage(tileConfig[row[0]].image).height
//           : 0;
//     }
//   }
// }
class Cloud {
  // constructor(img) {
  //   this.x = width / 2; // Está começando mais para a direita para permitir uma variação
  //   this.y = height - 120; // Definido para aparecer na metade superior da tela
  //   this.image = img;
  //   this.speed = 4; // velocidade parallax como as montanhas
  // }
  constructor(img) {
    this.x = random(width); // Randomiza a posição inicial
    this.y = random(height-200, height / 3);
    this.image = img;
    this.speed = random(1, 3); // Você pode ajustar os valores conforme necessário
  }

  show() {
    image(this.image, this.x, this.y);
  }

  move() {
    this.x -= this.speed;
    if (this.x < -this.image.width) {
      this.x = random(width, width * 3);
      this.y = random(50, height / 2);
    }
  }
  remove() {
    clouds.splice(clouds.indexOf(this), 1);
  }

  // isHit(horse) {
  //   let cloudWidth = this.image.width;
  //   let cloudHeight = this.image.height;
  //   let horseWidth = horse.runAnimation[0].width;
  //   let horseHeight = horse.runAnimation[0].height;

  //   return !(
  //     this.x + cloudWidth < horse.x ||
  //     this.x > horse.x + horseWidth ||
  //     this.y + cloudHeight < horse.y ||
  //     this.y > horse.y + horseHeight
  //   );
  // }
  isHit(horse) {
    let cloudWidth = this.image.width;
    let cloudHeight = this.image.height;
    let horseWidth = horse.runAnimation[0].width;
    let horseHeight = horse.runAnimation[0].height;

    // Verifica colisão retangular
    if (
      this.x + cloudWidth > horse.x &&
      this.x < horse.x + horseWidth &&
      this.y + cloudHeight > horse.y &&
      this.y < horse.y + horseHeight
    ) {
      return true;
    }
    return false;
  }
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 10); // Definir tamanho aleatório para as partículas
    this.vx = random(-1, 1); // Velocidade em x
    this.vy = random(-1, 1); // Velocidade em y
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Diminuir gradualmente o tamanho da partícula
    this.size *= 0.98;
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.size);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



let gravity = 0.2;
let jumpStrength = -7;

let playerX;
let playerY;
let playerSize;
let playerVelocityY = 0;
let isJumping = false;

function setup() {
  createCanvas(400, 400);
  playerX = 50;
  playerY = height - 50;
  playerSize = 40;
}

function draw() {
  background(220);
  
  // Gravidade
  playerVelocityY += gravity;
  playerY += playerVelocityY;

  // Chão
  if (playerY > height - playerSize) {
    playerY = height - playerSize;
    playerVelocityY = 0;
    isJumping = false;
  }

  // Verifica se a tecla de espaço foi pressionada
  if (keyIsDown(32) && !isJumping) {
    playerVelocityY = jumpStrength;
    isJumping = true;
  }

  // Verifica se a tecla da seta direita está pressionada
  if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5; // Movimento para a direita
  }

  // Verifica se a tecla da seta esquerda está pressionada
  if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5; // Movimento para a esquerda
  }

  // Desenha o jogador
  rect(playerX, playerY, playerSize, playerSize);
}
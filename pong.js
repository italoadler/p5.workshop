let x, y, speedX, speedY;
let value = 0;
let paddleX, paddleY;
let score = 0; // Para manter a contagem de pontos

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  speedX = 5;
  speedY = 2;
  paddleX = 20;
  paddleY = height / 2;
  respawnBall(); // Posiciona a bola no meio inicialmente
}

function draw() {
  background(value);
  noStroke();
  fill(255);
  paddle();
  square(x, y, 20);

  displayScore(); // Mostra o placar

  x += speedX;
  y += speedY;

  // Se a bola sair para a esquerda, o jogador perde
  if (x < 0) {
    console.log("Você perdeu!");
    displayGameOver();
    respawnBall(); // Respawn da bola
    noLoop(); // Para o loop de desenho
  }

  // Se a bola bate na parede direita, o jogador ganha um ponto
  if (x > width - 20) {
    score++;
    speedX *= -1;
  }

  if (y > height - 20 || y < 0) {
    speedY *= -1;
  }

  // Colisão com a raquete
  if (
    x + 20 > paddleX &&
    x < paddleX + 10 &&
    y + 20 > paddleY &&
    y < paddleY + 60
  ) {
    speedX *= -1;

    // Determine o ângulo de reflexão com base na posição relativa da bola ao centro da raquete
    let relativeIntersectY = paddleY + 60 / 2 - y;
    let normalizedRelativeIntersectionY = relativeIntersectY / (60 / 2);
    speedY = normalizedRelativeIntersectionY * 5; // 5 é um multiplicador para controlar a velocidade máxima no eixo Y
  }
}
function mousePressed() {
  loop();
}
function displayScore() {
  fill(255);
  textSize(32);
  text(score, width - 50, 50); // Posiciona o placar no canto superior direito
}
function displayGameOver() {
  fill(255);
  textSize(64);
  text("Game Over", width / 2 - 150, height / 2 - 50); // Posiciona o placar no canto superior direito
}
function paddle() {
  fill(255);
  paddleY = mouseY;
  rect(20, paddleY, 10, 60);
}

function respawnBall() {
  x = width / 2;
  y = height / 2;
  speedX = 5;
  speedY = Math.random() * 4 - 2; // Para adicionar alguma variabilidade ao ângulo de respawn
}

function keyPressed() {
  console.log("ok");
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    paddleY += 1;
  }
}

//         paddleY += 1;
//     }
// }

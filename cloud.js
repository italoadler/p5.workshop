// class Cloud {
//   constructor(img) {
//     this.x = random(width, width * 3); // Está começando mais para a direita para permitir uma variação
//     this.y = random(50, height / 2);  // Definido para aparecer na metade superior da tela
//     this.image = img;
//     this.speed = parallaxSpeedMountain; // velocidade parallax como as montanhas
//   }

//   show() {
//     image(this.image, this.x, this.y);
//   }

//   move() {
//     this.x -= this.speed;
//     if (this.x < -this.image.width) {
//       this.x = random(width, width * 3);
//       this.y = random(50, height / 2);
//     }
//   }
  
//   isHit(horse) {
//     let cloudWidth = this.image.width;
//     let cloudHeight = this.image.height;
//     let horseWidth = horse.runAnimation[0].width;
//     let horseHeight = horse.runAnimation[0].height;

//     return !(
//       this.x + cloudWidth < horse.x ||
//       this.x > horse.x + horseWidth ||
//       this.y + cloudHeight < horse.y ||
//       this.y > horse.y + horseHeight
//     );
//   }
// }

// // class Cloud {
// //     constructor(img) {
// //       this.x = random(width);
// //       this.y = random(100, 300);
// //       this.img = img;
// //       this.speed = random(0.5, 1.5);
// //     }
  
// //     show() {
// //       image(this.img, this.x, this.y);
// //     }
  
// //     move() {
// //       this.x -= this.speed;
// //       if (this.x < -this.img.width) {
// //         this.x = width;
// //         this.y = random(100, 300);
// //         this.speed = random(0.5, 1.5);
// //       }
// //     }
// //   }
  
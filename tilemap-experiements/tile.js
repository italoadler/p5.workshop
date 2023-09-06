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
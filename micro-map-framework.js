const tileDimensions = {
    left: { width: 100, height: 50 },    // ajuste os valores conforme necessário
    middle: { width: 150, height: 50 },
    right: { width: 100, height: 50 }
};

// Constants for better readability
const LEFT_GRASS = 1;
const MID_GRASS = 2;
const RIGHT_GRASS = 3;
// ... add other constants as needed

const TILE_SIZE = 150; // Adjust according to your needs

let tiles = [];
let level1 = [
    [1, 2, 3, 0, 0, 0, 0, 3, 2, 1],
    [3, 2, 2, 0, 0, 0, 0, 4, 5, 6],
    [4, 0, 6, 0, 5, 0, 7, 1, 5, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 2, 1, 2, 3, 1, 1, 2, 3, 0],
    [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [2, 2, 2, 0, 0, 0, 2, 2, 2, 2],
    [3, 2, 1, 2, 3, 1, 1, 2, 3, 0],
    [3, 2, 1, 2, 3, 1, 1, 2, 3, 0],
    [3, 2, 1, 2, 3, 1, 1, 2, 3, 0],
    //[LEFT_GRASS, MID_GRASS, MID_GRASS, 0, 0, 0, LEFT_GRASS, MID_GRASS, RIGHT_GRASS, 0]
    // ... additional rows as needed
];

function preload() {
    for (let i = 1; i <= 6; i++) {
        tiles.push(loadImage(`assets/tile/grasses/tile_grass_0${i}.png`));
    }
}

function setup() {
    createCanvas(displayWidth, displayHeight); // adjust as necessary
    frameRate(60); // adjust based on performance needs
}

function draw() {
    background(220); // for visibility
    displayDebugGrid()
    // Render the level
    for (let y = 0; y < level1.length; y++) {
        for (let x = 0; x < level1[y].length; x++) {
            let tileType = level1[y][x];
            if (tileType !== 0) {
                displayTile(tiles[tileType - 1], x * TILE_SIZE, y * TILE_SIZE);
            }
        }
    }
}

function displayTile(img, x, y) {
    // Error checking: Ensure the image is valid before drawing
    if (img && img instanceof p5.Image) {
        image(img, x, y);
    } else {
        console.error("Invalid tile image provided.");
    }
}

// Optional: A debug function to visualize tile positions
function displayDebugGrid() {
    for (let y = 0; y < height; y += TILE_SIZE) {
        for (let x = 0; x < width; x += TILE_SIZE) {
            noFill();
            stroke(255, 0, 0);
            rect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }
}
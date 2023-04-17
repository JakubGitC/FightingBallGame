const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = windows.innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = y;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
}

const Player = new Player(100, 100);

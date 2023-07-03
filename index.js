const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const x = canvas.width / 2; //to position element
const y = canvas.height / 2;

const scoreEl = document.querySelector("#scoreEl");
const btn = document.querySelector("button");
const panelToStartGame = document.querySelector(".endGame");
const scoreCounter = document.querySelector(".scoreMain");
class Gamer {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Bullet {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
  }
}

class Particle {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
  }
}
let gamer = new Gamer(x, y, 20, `hsl(${Math.random() * 360},50%,50%)`);
let bullets = [];
let enemies = [];
let particles = [];

function init() {
  gamer = new Gamer(x, y, 20, `hsl(${Math.random() * 360},50%,50%)`);
  bullets = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.textContent = 0;
  scoreCounter.textContent = 0;
}

function spawnOpponents() {
  setInterval(() => {
    const radius = Math.random() * 25 + 15;
    let x;
    let y;
    if (true) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 700);
}

let animationId;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(330,330,250,0.5)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  gamer.draw();
  particles.forEach((particle) => {
    particle.update();
  });
  bullets.forEach((bullet) => {
    bullet.update();
  });

  //detecting collision
  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(gamer.x - enemy.x, gamer.y - enemy.y);
    //end game
    if (dist - enemy.radius - gamer.radius < 1) {
      cancelAnimationFrame(animationId);
      scoreCounter.textContent = score;
      panelToStartGame.style.display = "flex";
    }

    bullets.forEach((bullet, projectileIndex) => {
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
      // when bullets hit enemy
      if (dist - enemy.radius - bullet.radius < 1) {
        score += 50;
        scoreEl.innerHTML = score;
        if (enemy.radius - bullet.radius < 15) {
          score += 400;
          scoreEl.innerHTML = score;
        }

        // explosions
        for (let i = 0; i < 15; i++) {
          particles.push(
            new Particle(
              bullet.x,
              bullet.y,
              (Math.random() + 0.2) * 2,
              enemy.color,
              {
                x:
                  Math.random() < 0.5
                    ? Math.random() - 1 * Math.floor(Math.random() * 2 + 1)
                    : Math.random() + 1 * Math.floor(Math.random() * 2 + 1),
                y:
                  Math.random() < 0.5
                    ? Math.random() - 1 * Math.floor(Math.random() * 2 + 1)
                    : Math.random() + 1 * Math.floor(Math.random() * 2 + 1),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          enemy.radius -= 7;
          setTimeout(() => {
            bullets.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            bullets.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 9,
    y: Math.sin(angle) * 9,
  };

  bullets.push(
    new Bullet(
      canvas.width / 2,
      canvas.height / 2,
      5,
      `hsl(${Math.random() * 360},50%,50%)`,
      velocity
    )
  );
});

btn.addEventListener("click", () => {
  panelToStartGame.style.display = "none";

  init();
  animate();
});

spawnOpponents();

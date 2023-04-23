const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const x = canvas.width / 2; //to position element
const y = canvas.height / 2;

const scoreEl = document.querySelector("#scoreEl");
const btn = document.querySelector("button");
const panelToStartGame = document.querySelector(".endGame");
class Player {
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

class Projectile {
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
const player = new Player(x, y, 20, `hsl(${Math.random() * 360},50%,50%)`);
const projectiles = [];
const enemies = [];
const particles = [];
function spawnEnemies() {
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
  c.fillStyle = "rgba(330,330,250,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle) => {
    particle.update();
  });
  projectiles.forEach((projectile) => {
    projectile.update();
  });

  //detecting collision
  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    //end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      panelToStartGame.style.display = "flex";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // when projectiles hit enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        score += 100;
        scoreEl.innerHTML = score;
        // explosions
        for (let i = 0; i < 10; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              (Math.random() + 0.4) * 2,
              enemy.color,
              {
                x:
                  (Math.random() < 0.5 ? 1 : -1) *
                  Math.floor(Math.random() * 2 + 1),
                y:
                  (Math.random() < 0.5 ? 1 : -1) *
                  Math.floor(Math.random() * 2 + 1),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          enemy.radius -= 7;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
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

  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      5,
      `hsl(${Math.random() * 360},50%,50%)`,
      velocity
    )
  );
});

btn.addEventListener("click", () => {
  animate();
  spawnEnemies();
  panelToStartGame.style.display = "none";
});

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const x = canvas.width / 2; //to position element
const y = canvas.height / 2;

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
    const radius = (Math.random() + 15) * 2;
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
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(330,330,250,0.1)";
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
      console.log("cze");
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // when projectiles hit enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // explosions
        for (let i = 0; i < 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              (Math.random() + 0.4) * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          enemy.radius -= 5;
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
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
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

animate();
spawnEnemies();

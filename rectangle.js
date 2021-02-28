// this is the original boids 2d file, with bird shapes.
// with an attempt to have a moving visual 3D
// THE DEFAULT

// Size of canvas. These get updated to fill the whole browser.
let width = 150;
let height = 150;
let printed = 0;

//number of boids, visual range
const numBoids = 500;
const visualRange = 75;

var boids = [];

function initBoids() {
  for (var i = 0; i < numBoids; i += 1) {
    boids[boids.length] = {
      x: Math.random() * width,
      y: Math.random() * height,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      history: [],
      boidsize: Math.random() * (1.5 - 0.5) + 0.5,
    };
  }
}

function distance(boid1, boid2) {
  return Math.sqrt(
    (boid1.x - boid2.x) * (boid1.x - boid2.x) +
      (boid1.y - boid2.y) * (boid1.y - boid2.y),
  );
}

// TODO: This is naive and inefficient.
function nClosestBoids(boid, n) {
  // Make a copy
  const sorted = boids.slice();
  // Sort the copy by distance from `boid`
  sorted.sort((a, b) => distance(boid, a) - distance(boid, b));
  // Return the `n` closest
  return sorted.slice(1, n + 1);
}

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  const canvas = document.getElementById("boids");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width - 200;
  canvas.height = height;
}

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {
  const margin = 200;
  const turnFactor = 0.75;

  if (boid.x < 200) {
    boid.dx += turnFactor;
  }
  if (boid.x > width - 450) {
    boid.dx -= turnFactor
  }
  if (boid.y < 100) {
    boid.dy += turnFactor;
  }
  if (boid.y > height - 100) {
    boid.dy -= turnFactor;
  }
}

// Find the center of mass of the other boids and adjust velocity slightly to
// point towards the center of mass.
function flyTowardsCenter(boid) {
  const centeringFactor = 0.005; // adjust velocity by this %

  let centerX = 0;
  let centerY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      centerX += otherBoid.x;
      centerY += otherBoid.y;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    centerX = centerX / numNeighbors;
    centerY = centerY / numNeighbors;

    boid.dx += (centerX - boid.x) * centeringFactor;
    boid.dy += (centerY - boid.y) * centeringFactor;
  }
}

// Move away from other boids that are too close to avoid colliding
// separation slider
function avoidOthers(boid) {
  const minDistance = 20; // The distance to stay away from other boids
  const avoidFactor = 0.05; // Adjust velocity by this %
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boids) {
    if (otherBoid !== boid) {
      if (distance(boid, otherBoid) < minDistance) {
        moveX += boid.x - otherBoid.x;
        moveY += boid.y - otherBoid.y;
      }
    }
  }

  boid.dx += moveX * avoidFactor;
  boid.dy += moveY * avoidFactor;
}

// Find the average velocity (speed and direction) of the other boids and
// adjust velocity slightly to match.
// coherence or alignment
function matchVelocity(boid) {
  const matchingFactor = 0.05; // Adjust by this % of average velocity

  let avgDX = 0;
  let avgDY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      avgDX += otherBoid.dx;
      avgDY += otherBoid.dy;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    avgDX = avgDX / numNeighbors;
    avgDY = avgDY / numNeighbors;

    boid.dx += (avgDX - boid.dx) * matchingFactor;
    boid.dy += (avgDY - boid.dy) * matchingFactor;
  }
}

function findSize(boid) { // size function that I added

    let boidsize = boid.boidsize;

    const matchSize = 0.02;
    let avgsize = 0;
    let numNeighbors = 0;

    for (let otherBoid of boids) {
        if (distance(boid, otherBoid) < visualRange) {
            avgsize +=otherBoid.boidsize;
            numNeighbors += 1;
        }
    }
    if (numNeighbors) {
      avg_size = avgsize / numNeighbors;

      for (let boid of boids) {
        if (boidsize >= avg_size - 0.5 && boidsize <= avg_size + 0.5) {
          goalsize = (0.5 - Math.random()) * (3 - 1) + 1;
          boidsize += (goalsize - boid.boidsize) * matchSize;
        }
        else {
          boidsize += (avg_size - boidsize) * matchSize;
        }
      }

    }
    return boidsize
} 

// Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(boid) {
  const speedLimit = 15;

  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

const DRAW_TRAIL = false;

function drawBoid(ctx, boid) {

  boidsize = findSize(boid);
  boid.boidsize = boidsize;
  const angle = Math.atan2(boid.dy, boid.dx);
  ctx.translate(boid.x, boid.y);
  ctx.rotate(angle);
  ctx.translate(-boid.x, -boid.y);


  ctx.strokeStyle = "#1d3254";
  ctx.beginPath();
  ctx.moveTo(boid.x, boid.y);
  ctx.lineTo(boid.x - 6 * boidsize, boid.y + 2 * boidsize);
  ctx.lineTo(boid.x - 5 * boidsize, boid.y + 6 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y + 12 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y + 2 * boidsize);
  ctx.lineTo(boid.x - 12 * boidsize, boid.y + 1 * boidsize);
  ctx.lineTo(boid.x - 15 * boidsize, boid.y + 3 * boidsize);
  ctx.lineTo(boid.x - 15 * boidsize, boid.y - 3 * boidsize);
  ctx.lineTo(boid.x - 12 * boidsize, boid.y - 1 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y - 2 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y - 12 * boidsize);
  ctx.lineTo(boid.x - 5 * boidsize, boid.y - 6 * boidsize);
  ctx.lineTo(boid.x - 6 * boidsize, boid.y - 2 * boidsize);
  ctx.lineTo(boid.x, boid.y);
  ctx.stroke();
 

  ctx.fillStyle = "#558cf4";
  ctx.beginPath();
  ctx.moveTo(boid.x, boid.y);
  ctx.lineTo(boid.x - 6 * boidsize, boid.y + 2 * boidsize);
  ctx.lineTo(boid.x - 5 * boidsize, boid.y + 6 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y + 12 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y + 2 * boidsize);
  ctx.lineTo(boid.x - 12 * boidsize, boid.y + 1 * boidsize);
  ctx.lineTo(boid.x - 15 * boidsize, boid.y + 3 * boidsize);
  ctx.lineTo(boid.x - 15 * boidsize, boid.y - 3 * boidsize);
  ctx.lineTo(boid.x - 12 * boidsize, boid.y - 1 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y - 2 * boidsize);
  ctx.lineTo(boid.x - 8 * boidsize, boid.y - 12 * boidsize);
  ctx.lineTo(boid.x - 5 * boidsize, boid.y - 6 * boidsize);
  ctx.lineTo(boid.x - 6 * boidsize, boid.y - 2 * boidsize);
  ctx.lineTo(boid.x, boid.y);
  ctx.fill();

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (DRAW_TRAIL) {
    ctx.strokeStyle = "#558cf466";
    ctx.beginPath();
    ctx.moveTo(boid.history[0][0], boid.history[0][1]);
    for (const point of boid.history) {
      ctx.lineTo(point[0], point[1]);
    }
    ctx.stroke();
  }
}

function round(num) {
    let rounded = Math.round(num * 1000) / 1000
    return rounded
}

// Main animation loop
function animationLoop() {
  // Update each boid
  for (let boid of boids) {
    // Update the velocities according to each rule
    flyTowardsCenter(boid);
    avoidOthers(boid);
    matchVelocity(boid);
    limitSpeed(boid);
    keepWithinBounds(boid);

    // Update the position based on the current velocity
    boid.x += boid.dx;
    boid.y += boid.dy;
    boid.history.push([boid.x, boid.y])
    boid.history = boid.history.slice(-50);

  }

  // Clear the canvas and redraw all the boids in their current positions
  const ctx = document.getElementById("boids").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    drawBoid(ctx, boid);
  }

  // Schedule the next frame
  window.requestAnimationFrame(animationLoop);
}

window.onload = () => {
  // Make sure the canvas always fills the whole window
  window.addEventListener("resize", sizeCanvas, false);
  sizeCanvas();

  // Randomly distribute the boids to start
  initBoids();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};

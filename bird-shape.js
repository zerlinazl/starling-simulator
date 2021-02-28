// this is the original boids 2d file, with bird shapes.
// with an attempt to have a moving visual 3D
// drawn equations of bird boundary
//translated to upper right
// ext tail
// tried to make less birds in flare

// Size of canvas. These get updated to fill the whole browser.
let width = 150;
let height = 150;

//number of boids, visual range
const numBoids = 2000;
const visualRange = 20;

var boids = [];

function initBoids() {
  for (var i = 0; i < numBoids; i += 1) {
    boids[boids.length] = {
      x: Math.random() * width,
      y: Math.random() * height,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      history: [],
      boidsize: Math.random() * (1 - 0.2) + 0.2,
      lawless: Math.random(),

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
  canvas.width = width;
  canvas.height = height;
}

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {
  const margin = 200;
  const turnFactor = 0.75 * 6;
  const scaleFactor = 20;
  
  boid.x = boid.x / scaleFactor;
  boid.y = (boid.y) / scaleFactor;
 
  let lawless = boid.lawless;
/*
  let lawless = 0.2 - boid.lawless;
  let lltail = 0.4 - boid.lawless;
  let llt2 = 0.6 - boid.lawless;
  let llt3 = 0.8 - boid.lawless;
*/
  //beak bottom
  if (boid.x > 23.12 && boid.x < 25.58) {
    if (boid.y < -0.2*(boid.x) + 13  ){
        boid.dy += turnFactor;
    }
  }
  //head top
  if (boid.x > 17.21 && boid.x < 25.58) {
      if (boid.y >-0.13*boid.x*boid.x + 5.6*boid.x - 50.3  ) {
          boid.dy -= turnFactor;
      }
  }
  // no eating!!
  if (boid.x > 25.58) {
    boid.dx -= turnFactor * 4
  }  

  //wing top
  if (boid.x <= 17.21 && boid.x > 5.818 && boid.y > 7.58) {
      if (boid.y > -0.036*(boid.x)*(boid.x) - 0.0093*(boid.x) + 18.4  ){
          boid.dx -= turnFactor;
          boid.dy -= turnFactor;
      }
  }
  //wing bottom*
  if (lawless > 0.2) {
    if (boid.x <= 14 && boid.y > -0.49*boid.x + 12.4) {
      if (boid.y < -1.8* boid.x + 27.6  ){
          boid.dy += turnFactor;
          boid.dx += turnFactor;
      }
    }
  }
  
  //tail top*
  if (lawless > 0.2) {
    if (boid.x >= 0 && boid.x <= 14 && boid.y <= -0.49*boid.x + 12.4) {
      if (boid.y > 0.067*boid.x + 4.67  ) {
          boid.dy -= turnFactor;
      }
  }
  }

  //tail bottom*
  if (lawless > 0.2) {
    if (boid.x >= 0 && boid.x <= 15) {
      if (boid.y < 0.009*boid.x*boid.x - 0.275*boid.x + 5) {
          boid.dy += turnFactor / 2;
      }
    }
    if (boid.y > 17.13) {
      boid.dy -= turnFactor * 2;
    }
  }

  //belly
  if (boid.x > 15 && boid.x < 18 && boid.y < 5) {
      if (boid.y < 0.0697*boid.x*boid.x - 1.98*boid.x + 16.9  ) {
          boid.dy += turnFactor;
          (boid.dx) -= turnFactor/4;
      }
  }
  if (boid.x < 23.12 && boid.x >= 18) {
    if (boid.y < 0.0697*boid.x*boid.x - 1.98*boid.x + 16.9  ) {
        boid.dy += turnFactor;
        (boid.dx) -= turnFactor/4;
        }
    }
  // flare tail 
  if (lawless > 0.3) {
    if (boid.x < 0) {
      if (boid.y > 0.009*boid.x*boid.x - 0.275*boid.x + 5) {
          boid.dy -= turnFactor / 4;
      }
    }
      if (boid.x < 0) {
        if (boid.y < 0.067*boid.x + 4.67  ) {
            boid.dy += turnFactor/4;
        }
    }
  }
  
    boid.x = (boid.x * scaleFactor);
    boid.y = (boid.y * scaleFactor);

  // general bounding box
  //if (lawless > 0.4) { 
    //if (boid.x < -200){ 
      //  boid.dx += turnFactor;
   // }
  //}
  if (lawless > 0.5) {
    if (boid.x < -100){
      boid.dx += turnFactor;
    }
  }
  else if (lawless > 0.6) {
    if (boid.x < 0){
      boid.dx += turnFactor;
    }
  }
  else if (lawless > 0.7) {
    if (boid.x < 100){
      boid.dx += turnFactor;
    }
  }
  if (boid.x > width) {
      boid.dx -= turnFactor
  }
  if (boid.y < -100) {
      boid.dy += turnFactor;
  }
  if (boid.y > 600) {
      boid.dy -= turnFactor * 2;
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
  const minDistance = 10; // The distance to stay away from other boids
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
          goalsize = (0.5 - Math.random()) * (1 - 0.5) + 0.5;
          boidsize += (goalsize - boid.boidsize) * matchSize;
        if (boidsize > 2) {
          boidsize -= boidsize * matchSize;
        }
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
  ctx.scale(1, -1);
  ctx.translate(700, -400);
  ctx.translate(boid.x, boid.y);
  ctx.rotate(angle);
  ctx.translate(-boid.x, -boid.y);

  /*ctx.strokeStyle = "#1d3254";
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
 */

  ctx.fillStyle = "#000000";
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
    ctx.strokeStyle = "#558cf4";
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

//drawing the equations!!
/*
  ctx.scale(1, -1);
  ctx.translate(0, -600);
  
//beak bottom
  let x = 23.1;
  let y = -0.2*x + 13;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 25.6; x += 0.05) {
    y = -0.2*x + 13;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
  //head top
  x = 17.2;
  y = -0.13*x*x + 5.6*x - 50.3;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 25.6; x += 0.05) {
    y = -0.13*x*x + 5.6*x - 50.3;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
  //wing top
  x = 5.8;
  y = -0.036*x*x - 0.0093*x + 18.4;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 17.2; x += 0.05) {
    y = -0.036*x*x - 0.0093*x + 18.4;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
  //wing bot
  x = 5.8;
  y = 25.4 - 1.42*x;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 14; x += 0.05) {
    y = 25.4 - 1.42*x;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
  //tail top
  x = 0;
  y = 0.067*x + 4.67;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 14; x += 0.05) {
    y = 0.067*x + 4.67;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();

  //tail bot
  x = 0;
  y = 0.009*x*x - 0.275*x + 5;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 15; x += 0.05) {
    y = 0.009*x*x - 0.275*x + 5;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
  //belly
  x = 15;
  y = 0.0697*x*x - 1.98*x + 16.9;
  ctx.strokeStyle = "#ff3254";
  ctx.beginPath();
  ctx.moveTo(x * 30, y * 30);
  for (; x < 23.1; x += 0.05) {
    y = 0.0697*x*x - 1.98*x + 16.9;
    ctx.lineTo(x * 30, y * 30); 
  }
  ctx.stroke();
    //fix leaks
    x = 0;
    y = -0.49*x + 12.4;
    ctx.strokeStyle = "#ff3254";
    ctx.beginPath();
    ctx.moveTo(x * 30, y * 30);
    for (; x < 23.1; x += 0.05) {
        y = -0.49*x + 12.4;
        ctx.lineTo(x * 30, y * 30); 
    }
    ctx.stroke(); 
    
  ctx.setTransform(1, 0, 0, 1, 0, 0);
*/


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

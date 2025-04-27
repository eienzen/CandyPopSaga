let candies = [];
let board = [];
let score = 0;
let moves = 20;
let level = 1;
let targetScore = 1000;
let selectedCandy = null;
let referralCode = generateReferralCode();
let particles = [];

function initializeGame() {
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = floor(random(4));
      candies.push({ x: i, y: j, type: board[i][j], scale: 1, matched: false });
    }
  }
}

function drawBoard() {
  for (let candy of candies) {
    if (candy.matched) continue;
    push();
    translate((candy.x - 4) * 50 + 25, (candy.y - 4) * 50 + 25, 0);
    scale(candy.scale);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    texture(candyTextures[candy.type]);
    sphere(20, 16, 16);
    pop();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    push();
    translate((p.x - 4) * 50 + 25, (p.y - 4) * 50 + 25, 0);
    fill(255, 255, 0, p.alpha);
    sphere(5);
    pop();
    p.y += p.vy;
    p.alpha -= 5;
    if (p.alpha <= 0) particles.splice(i, 1);
  }
}

function displayStats() {
  push();
  translate(-200, -200, 0);
  fill(255);
  textSize(20);
  text(`स्कोर: ${score}`, 10, 30);
  text(`चालें: ${moves}`, 10, 60);
  text(`लेवल: ${level}`, 10, 90);
  text(`लक्ष्य: ${targetScore}`, 10, 120);
  pop();
}

function handleGameState() {
  if (score >= targetScore) {
    level++;
    targetScore += 500;
    moves = 20;
    score = 0;
    victorySound.play();
    alert('लेवल पूरा! अगला लेवल शुरू!');
  }
  if (moves <= 0 && score < targetScore) {
    gameOverSound.play();
    alert('गेम ओवर! फिर से शुरू करें।');
    resetGame();
  }
}

function handleMousePress(mx, my) {
  let x = floor((mx - width / 2) / 50 + 4);
  let y = floor((my - height / 2) / 50 + 4);
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (!selectedCandy) {
      selectedCandy = { x, y };
      candies.find(c => c.x === x && c.y === y).scale = 1.2;
    } else {
      if (abs(selectedCandy.x - x) + abs(selectedCandy.y - y) === 1) {
        swapCandies(selectedCandy.x, selectedCandy.y, x, y);
        if (checkMatches()) {
          moves--;
        } else {
          swapCandies(selectedCandy.x, selectedCandy.y, x, y);
        }
      }
      candies.find(c => c.x === selectedCandy.x && c.y === selectedCandy.y).scale = 1;
      selectedCandy = null;
    }
  }
}

function swapCandies(x1, y1, x2, y2) {
  let temp = board[x1][y1];
  board[x1][y1] = board[x2][y2];
  board[x2][y2] = temp;
  updateCandies();
}

function checkMatches() {
  let matches = false;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 6; j++) {
      if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
        matches = true;
        score += 100;
        board[i][j] = board[i][j + 1] = board[i][j + 2] = -1;
        createParticles(i, j);
        createParticles(i, j + 1);
        createParticles(i, j + 2);
      }
    }
  }
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 6; i++) {
      if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
        matches = true;
        score += 100;
        board[i][j] = board[i + 1][j] = board[i + 2][j] = -1;
        createParticles(i, j);
        createParticles(i + 1, j);
        createParticles(i + 2, j);
      }
    }
  }
  if (matches) {
    clearMatches();
  }
  return matches;
}

function createParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x,
      y: y,
      vy: random(-2, -1),
      alpha: 255
    });
  }
}

function clearMatches() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === -1) {
        for (let k = j; k > 0; k--) {
          board[i][k] = board[i][k - 1];
        }
        board[i][0] = floor(random(4));
      }
    }
  }
  updateCandies();
}

function updateCandies() {
  candies = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      candies.push({ x: i, y: j, type: board[i][j], scale: 1, matched: board[i][j] === -1 });
    }
  }
}

function resetGame() {
  score = 0;
  moves = 20;
  level = 1;
  targetScore = 1000;
  particles = [];
  initializeGame();
  startSound.play();
}

function generateReferralCode() {
  return 'CANDY' + Math.floor(Math.random() * 10000);
}

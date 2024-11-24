const DISPLAY = {
  HAZARD: "🐍",
  POTION: "🧪",
  TREASURE: "🏆",
  PLAYER: "🧙‍♂️",
  OBSTACTLE: "🌲",
  INVISIBLE_HAZARD: " ",
  INVISIBLE_HAZARD_UNCOVERED: "🔥",
};
const canvas = document.getElementById("canvas");
const healthStat = document.getElementById("health");

const mapToMatrix = (map) => {
  const lines = map.split("\n");
  const matrix = lines.filter((line) => line.length > 0).map((line) => line.split(""));
  return matrix;
};

const state = createTimeMachine(
  {
    health: 100,
    positionX: 1,
    positionY: 9,
    matrix: mapToMatrix(map),
  },
  printGame
);

function printGame() {
  canvas.textContent = "";
  state.matrix.forEach((line, lineIndex) => {
    const lineDiv = document.createElement("div");
    line.forEach((cell, cellIndex) => {
      const div = document.createElement("div");
      div.classList.add(`cell-${cellIndex}-${lineIndex}`);
      if (cell === "#") div.textContent = DISPLAY.OBSTACTLE;
      else if (cell === "B") div.textContent = DISPLAY.HAZARD;
      else if (cell === "H") div.textContent = DISPLAY.POTION;
      else if (cell === "W") div.textContent = DISPLAY.TREASURE;
      else if (cell === "I") div.textContent = DISPLAY.INVISIBLE_HAZARD;
      else if (cell === "U") div.textContent = DISPLAY.INVISIBLE_HAZARD_UNCOVERED;

      div.style.display = "inline-block";
      div.style.width = "20px";
      div.style.height = "20px";
      lineDiv.appendChild(div);
    });
    canvas.appendChild(lineDiv);
  });
  drawPlayer(state.positionX, state.positionY);
  printStats();
}

const drawPlayer = () => {
  const playerCell = document.querySelector(".player");
  if (playerCell) {
    playerCell.classList.remove("player");
    playerCell.textContent = "";
  }
  const cell = document.querySelector(`.cell-${state.positionX}-${state.positionY}`);
  if (!cell) return;
  cell.classList.add("player");
  cell.textContent = DISPLAY.PLAYER;
};

const printStats = () => {
  healthStat.textContent = state.health;
  document.getElementById("health").value = state.health;
  document.getElementById("healthNumber").textContent = `${state.health}%`;
  document.getElementById("timeline").textContent = `TIMELINE-${state.$currentTimeline}`;
};

const movePlayer = (x, y) => {
  if (state.health <= 0) return;
  const newPositionX = state.positionX + x;
  const newPositionY = state.positionY + y;
  const cell = document.querySelector(`.cell-${newPositionX}-${newPositionY}`);
  if (!cell) return;

  if (cell.textContent === DISPLAY.HAZARD) {
    console.log(DISPLAY.HAZARD, "Health decreased!");
    state.health = state.health - 30;
    // printStats();
  } else if (
    cell.textContent === DISPLAY.INVISIBLE_HAZARD ||
    cell.textContent === DISPLAY.INVISIBLE_HAZARD_UNCOVERED
  ) {
    console.log(DISPLAY.INVISIBLE_HAZARD_UNCOVERED, "INVISIBLE HAZARD! Health decreased!");
    state.health = state.health - 50;
    state.matrix[newPositionY][newPositionX] = "U";
    // printStats();
  } else if (cell.textContent === DISPLAY.POTION) {
    console.log(DISPLAY.POTION, "You found the health potion!");
    state.health = 100;
    state.matrix[newPositionY][newPositionX] = " ";
    // printStats();
  } else if (cell.textContent === DISPLAY.TREASURE) {
    console.log(DISPLAY.TREASURE, "You found the treasure 🎉🎉🎉");
  }
  if (cell.textContent !== DISPLAY.OBSTACTLE) {
    state.positionX = newPositionX;
    state.positionY = newPositionY;
    // drawPlayer();
    // printGame(state.matrix);
  }
};

function addEventListeners() {
  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "ArrowUp") movePlayer(0, -1);
    else if (key === "ArrowDown") movePlayer(0, 1);
    else if (key === "ArrowLeft") movePlayer(-1, 0);
    else if (key === "ArrowRight") movePlayer(1, 0);
  });
}

function backInTime(seconds) {
  state.backInTime(seconds);
  // printGame();
}

function backward() {
  state.backward();
  // printGame();
}

function previousTimeline() {
  state.changeTimeline(-1);
  // printGame();
}
function nextTimeline() {
  state.changeTimeline(+1);
  // printGame();
}
addEventListeners();
printGame();

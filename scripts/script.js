"use strict";

const boardEl = document.querySelector(".gameBoard");
const gameInfoEl = document.querySelector(".gameInfo");
const gameStatsEl = document.querySelector(".gameStats");
const gameControlsEl = document.querySelector(".gameControls");

const bot = {
  display: {
    sensors: { level: 1 },
    digTools: { level: 1 },
    carry: {
      level: 1,
      currLoad: 0,
      maxLoad: 100,
    },
  },
  currLoc: {
    x: 0,
    y: 0,
  },
  baseLoc: {
    x: 0,
    y: 0,
  },
  displayStats: function () {
    for (let stat in this.display) {
      for (let data in this.display[stat]) {
        document.querySelector(`.${stat} .${data}`).textContent = this.display[
          stat
        ][data];
      }
    }
  },
  findBase: function (map) {
    map.forEach((row, y) => {
      if (row.includes("base")) {
        this.baseLoc.y = y;
        this.baseLoc.x = row.indexOf("base");
      }
    });
  },
  move: function (destination = [this.baseLoc.x, this.baseLoc.y]) {
    let prevLoc = document.querySelector(".bot");
    if (prevLoc) prevLoc.parentNode.removeChild(prevLoc);
    let loc = boardEl.rows[destination[1]].cells[destination[0]];
    loc.insertAdjacentHTML("beforeend", `<div class='bot'><div>`);
  },
};

function createGrid(grid, size) {
  for (let i = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      grid[i][j] = "";
    }
  }
  return grid;
}

function populateBoard(grid) {
  for (let row in grid) {
    for (let cell in grid[row]) {
      grid[row][cell] = "land";
    }
  }
  //set up base
  const baseCoords = setBaseLoc(grid.length);
  grid[baseCoords[1]][baseCoords[0]] = "base";
  return grid;
}

function setBaseLoc(size) {
  const x = Math.floor(Math.random() * size);
  let y;
  if (x === 0 || x === size - 1) {
    y = Math.floor(Math.random() * size);
  } else {
    y = Math.round(Math.random());
    if (y === 1) y = size - 1;
  }
  return [x, y];
}

function displayGrid(grid) {
  grid.forEach((row) => {
    let newRowEl = document.createElement("tr");
    boardEl.insertAdjacentElement("beforeend", newRowEl);
    row.forEach((cell) => {
      let newCellEl = document.createElement("td");
      newCellEl.classList.add(cell);
      newRowEl.insertAdjacentElement("beforeend", newCellEl);
    });
  });
}

boardEl.addEventListener("click", (e) => {
  bot.move([e.target.cellIndex, e.target.parentNode.rowIndex]);
});

function gameInit() {
  const boardSize = 8;
  const gameStatus = [];

  createGrid(gameStatus, boardSize);
  populateBoard(gameStatus);
  displayGrid(gameStatus);

  bot.displayStats();
  bot.findBase(gameStatus);
  bot.move();
}
gameInit();

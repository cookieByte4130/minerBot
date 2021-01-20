"use strict";

const boardEl = document.querySelector(".gameBoard");
const gameInfoEl = document.querySelector(".gameInfo");
const gameStatsEl = document.querySelector(".gameStats");
const gameControlsEl = document.querySelector(".gameControls");

let boardSize = 8;

const game = {
  display: {
    sensors: { level: 1 },
    digTools: { level: 1 },
    carry: {
      level: 1,
      currLoad: 0,
      maxLoad: 100,
    },
  },
};

function createGrid(size) {
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      //randomize the 'land' here
      grid[i][j] = "land";
    }
  }
  //set up base
  const baseCoords = setupBase(boardSize);
  grid[baseCoords[1]][baseCoords[0]] = "base";
  return grid;
}

function setupBase(size) {
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
      boardEl.insertAdjacentElement("beforeend", newCellEl);
    });
  });
}

function displayGameStats(game) {
  for (let stat in game) {
    for (let deet in game[stat]) {
      document.querySelector(`.${stat} .${deet}`).textContent =
        game[stat][deet];
    }
  }
}

displayGrid(createGrid(boardSize));

displayGameStats(game.display);

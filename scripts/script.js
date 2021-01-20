"use strict";

// //MinerBot
// Main menu: top label “MinerBot \n a HZRD Minigame”. Menu buttons: New account, Load account, Save Progress, About (explains very basics of game and how © and rep can tie into HZRD acct).

// New game creates a random 8x8 tile World Map with 1 Base square and spawns your Bot there. Random dirt, cliff, and water tiles.
//Tap Bot to select it, then click adjacent square to move. Or click Move button at bottom right of screen.

const boardEl = document.querySelector(".gameBoard");
const gameInfoEl = document.querySelector(".gameInfo");
const gameStatsEl = document.querySelector(".gameStats");
const gameControlsEl = document.querySelector(".gameControls");

const game = {
  sensors: 1,
  "dig tools": 1,
  carry: {
    currLoad: 0,
    maxLoad: 100,
  },
};

function createGrid(size) {
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      grid[i][j] = "";
    }
  }
  return grid;
}
function displayGrid(grid) {
  grid.forEach((row) => {
    let newRowEl = document.createElement("tr");
    boardEl.insertAdjacentElement("beforeend", newRowEl);
    row.forEach((cell) => {
      let newCellEl = document.createElement("td");
      newCellEl.classList.add("land");
      boardEl.insertAdjacentElement("beforeend", newCellEl);
    });
  });
}

function displayGameStats(game) {
  console.log(game);
}

displayGrid(createGrid(8));
gameInfoEl.getBoundingClientRect().width = boardEl.getBoundingClientRect().width;

displayGameStats(game);

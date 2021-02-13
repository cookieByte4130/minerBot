"use strict";

const boardEl = document.querySelector(".gameBoard");
const gameInfoEl = document.querySelector(".gameInfo");
const gameStatsEl = document.querySelector(".gameStats");
const gameControlsEl = document.querySelector(".gameControls");

const dialogEl = document.querySelector(".dialogScreen");
const dialogContentEl = document.querySelector(".dialogContent");
const closeBtnEl = document.querySelector(".closeBtn");

function notify(msg, el = "p") {
  const contentEl = document.createElement(el);
  dialogContentEl.textContent = "";
  dialogContentEl.insertAdjacentElement("beforeend", contentEl);
  contentEl.textContent = msg;
  dialogEl.classList.toggle("hidden");
}

closeBtnEl.addEventListener("click", () => {
  dialogEl.classList.toggle("hidden");
});

const bot = {
  stats: {
    currency: { amount: 0 },
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
    for (let stat in this.stats) {
      for (let data in this.stats[stat]) {
        document.querySelector(`.${stat} .${data}`).textContent = this.stats[
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
    bot.currLoc.x = destination[0];
    bot.currLoc.y = destination[1];
  },
  //WIP
  dig: function () {
    if (
      document.querySelector(".bot").parentElement.classList.contains("base")
    ) {
      notify(`Security bot yells "You can't dig on base!"`);
      return;
    }
    const currCell = boardEl.rows[this.currLoc.y].cells[this.currLoc.x];
    //Get resource
    if (currCell.classList.contains("fe")) {
      let msg, minedOre;
      const cLoad = this.stats.carry.currLoad;
      const mLoad = this.stats.carry.maxLoad;
      const availOre = 100;

      if (mLoad === cLoad) {
        msg = `minerBot cannot carry anymore. Return to base to free up space`;
      } else {
        if (availOre + cLoad < mLoad) {
          minedOre = availOre;
        } else {
          minedOre = mLoad - cLoad;
        }

        msg = `You mined ${minedOre} of Fe`;
        //increase currLoad
        this.stats.carry.currLoad += minedOre;
        //switch fe to land class
        currCell.classList.remove("fe");
        currCell.classList.add("land");
        //WIP update grid
        //display changes
        this.displayStats();
      }
      notify(msg);
    } else {
      notify(`There is no ore here`);
    }
  },
  rtnToBase: function () {
    const amtEarned = this.stats.carry.currLoad / 10;
    this.stats.carry.currLoad = 0;
    this.stats.currency.amount += amtEarned;
    this.displayStats();
    notify(`Ore-well: Great job! You earned ${amtEarned}(c)`);
  },
  //WIP
  upgrade: function (equipment, lvl) {
    let n;
    switch (equipment) {
      case "sensor":
        n = 30;
        break;
      case "digTools":
      case "carry":
        n = 5;
        break;
    }
    const cost = n * lvl ** 2;
    console.log(cost);
    //deduct cost from currency
    //update sensor level in bot obj
    //update display
    // Carry Capacity cost 3x(Lvl^2) in ©, so L2 costs 12©, L3 costs 27©, etc. Each Carry level increases carry capacity by 100kg.
  },
};

function roll(dSides) {
  return Math.floor(Math.random() * dSides) + 1;
}

function createGrid(grid, size) {
  for (let i = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      grid[i][j] = "";
    }
  }
  return grid;
}

function setCellType(waterChance, cliffChance) {
  if (roll(100) <= waterChance) {
    return "water";
  } else if (roll(100) <= cliffChance) {
    return "cliff";
  } else {
    return "fe";
  }
}

function populateBoard(grid) {
  for (let row in grid) {
    for (let cell in grid[row]) {
      //the h20&cliff chances may bc vars later in dev
      grid[row][cell] = setCellType(25, 20);
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
  const moveTo = e.target.classList;
  if (moveTo.contains("cliff") || moveTo.contains("water")) {
    notify(`you cant go there`);
    return;
  }
  bot.move([e.target.cellIndex, e.target.parentNode.rowIndex]);
  if (moveTo.contains("base")) {
    bot.rtnToBase();
  }
});

gameControlsEl.addEventListener("click", (e) => {
  if (e.target.value !== "dig") return;
  // const action = e.target.value;
  // bot[action]();
  bot.dig();
});

function gameOn() {
  const boardSize = 8;
  const gameStatus = [];

  createGrid(gameStatus, boardSize);
  populateBoard(gameStatus);
  displayGrid(gameStatus);

  bot.displayStats();
  bot.findBase(gameStatus);
  bot.move();
}
gameOn();

//fix bug where bot disappears if u click on it

//return to base:
//automatically unload ore
//ore to currency coversion?
//show dialog box
//upgrade menu

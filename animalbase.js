"use strict";

window.addEventListener("DOMContentLoaded", start);

const HTML = {};
let allAnimals = [],
  filteredList;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: false,
  winner: false,
};

const settings = {
  filter: "*",
  sortBy: "name",
  sortDir: "asc",
  direction: 1,
};

function start() {
  console.log("ready");

  HTML.allFilterBtn = document.querySelectorAll("[data-action=filter]");
  HTML.allSortBtn = document.querySelectorAll("[data-action=sort]");
  // Add event-listeners to btn and run the filter animal list
  HTML.allFilterBtn.forEach((btn) => {
    btn.addEventListener("click", createAnimalList);
  });
  HTML.allSortBtn.forEach((btn) => {
    btn.addEventListener("click", sortList);
  });
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);
  filteredList = allAnimals;
  // This function is only runing one time, and then the filter button chance the data.
  // buildList();
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

// ----- View -----
function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // TODO: Display winner
  if (animal.winner) {
    clone.querySelector("[data-field=winner]").textContent = "🏆";
  } else {
    clone.querySelector("[data-field=winner]").style.filter = "grayscale(100%)";
  }

  // Display star

  // Show star ⭐ or ☆
  if (animal.star) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    // clone.querySelector("[data-field=star]").textContent = "☆";
    clone.querySelector("[data-field=star]").textContent = "⭐";
    clone.querySelector("td[data-field=star]").style.filter = "grayscale(100%)";
  }

  // TODO: Add event listeners for star and winner

  clone.querySelector("[data-field=star]").addEventListener("click", starToggle);

  function starToggle() {
    // console.log("starToggle");
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    // console.log(animal);
    displayList(filteredList);
  }

  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);

  function clickWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeaWinner(animal);
      // animal.winner = true;
    }
    displayList(filteredList);
  }
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeaWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);

  const numberOfWinners = winners.length;
  const other = winners.filter((animal) => animal.type === selectedAnimal.type).shift();

  // if there is another of the same type
  if (other !== undefined) {
    console.log("There can be only one winner of each type!");
    removeOther(other);
  } else if (numberOfWinners >= 2) {
    console.log("There can only be two winners!");
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  // console.log(`There are ${numberOfWinners} winners`);
  // console.log(`The other winner of this is ${other.name}`);
  // console.log(other);
  // makeWinner(selectedAnimal);

  function removeOther(other) {
    // ask the user to ignore, or remove "other"
    document.querySelector("#onlyonekind").classList.remove("dialog");
    document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
    document
      .querySelector("#onlyonekind [data-action=remove1]")
      .addEventListener("click", clickRemoveOther);

    // show names on buttons
    document.querySelector("#onlyonekind .animal1").textContent = other.name;

    // if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#onlyonekind").classList.add("dialog");
      document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
      document
        .querySelector("#onlyonekind [data-action=remove1]")
        .removeEventListener("click", clickRemoveOther);
    }

    // if remove other:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    // ask the user to ignnore, or remove A or B
    document.querySelector("#onlytwowinners").classList.remove("dialog");
    document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
    document
      .querySelector("#onlytwowinners [data-action=remove1]")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#onlytwowinners [data-action=remove2]")
      .addEventListener("click", clickRemoveB);

    // show names on buttons
    document.querySelector("#onlytwowinners .animal1").textContent = winnerA.name;
    document.querySelector("#onlytwowinners .animal2").textContent = winnerB.name;

    // if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#onlytwowinners").classList.add("dialog");
      document
        .querySelector("#onlytwowinners .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#onlytwowinners [data-action=remove1]")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#onlytwowinners [data-action=remove2]")
        .removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      // if remove other:
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }

    function clickRemoveB() {
      // else - if removeB
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      displayList(filteredList);
      closeDialog();
    }
  }

  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(animal) {
    animal.winner = true;
  }
}

// ----- Model -----
function createAnimalList(btnClickedElm) {
  // console.log(btnClickedElm);
  let type = btnClickedElm.target.dataset.filter;
  // get filter depending on data-filter attribue
  settings.filter = this.dataset.filter;
  // filter allAnimals with correct filter function and put info filterAnmimals
  filteredList = filterList(type);
  displayList(filteredList);
}

// // ----- Controller -----
// Filtering function which takes a filtering function as an argument
function filterList(filteredList) {
  // console.log(type);
  filteredList = allAnimals;

  if (settings.filter !== "*") {
    filteredList = allAnimals.filter(isAnimalsType);
  } else {
    filteredList = allAnimals;
  }

  function isAnimalsType(animal) {
    if (animal.type === settings.filter) {
      return true;
    } else {
      return false;
    }
  }
  return filteredList;
}

function sortList(event) {
  // console.log("-", event);
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  // console.log(sortDir, "-", sortBy, "-", event);

  // find "old" sortBy element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  // console.log(oldElement);
  // indicate active sort
  event.target.classList.add("sortby");
  settings.sortBy = sortBy;

  // console.log(event);

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  if (sortDir === "desc") {
    settings.direction = -1;
  } else {
    settings.direction = 1;
  }

  filteredList.sort(sortByValue);

  // Campare values
  // a is the object and b is the index in the array
  function sortByValue(a, b) {
    // console.log(sortBy);
    if (a[sortBy] < b[sortBy]) {
      return -1 * settings.direction;
    } else {
      return 1 * settings.direction;
    }
  }

  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  displayList(filteredList);
}

function buildList() {
  const currentList = filterList(allAnimals);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

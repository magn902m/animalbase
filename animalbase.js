"use strict";

window.addEventListener("DOMContentLoaded", start);

const HTML = {};
let allAnimals = [],
  filter = "*",
  filteredList;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
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

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

// ----- Model -----
function createAnimalList(btnClickedElm) {
  // console.log(btnClickedElm);
  let type = btnClickedElm.target.dataset.filter;
  // get filter depending on data-filter attribue
  filter = this.dataset.filter;
  // filter allAnimals with correct filter function and put info filterAnmimals
  filteredList = filterList(type);
  displayList(filteredList);
}

// // ----- Controller -----
// Filtering function which takes a filtering function as an argument
function filterList(type) {
  // console.log(type);
  // filteredList = allAnimals.filter(filterFunction);
  // filteredList = allAnimals.filter(isAnimalsType);
  filteredList = allAnimals;

  if (filter !== "*") {
    filteredList = allAnimals.filter(isAnimalsType);
  } else {
    filteredList = allAnimals;
  }

  function isAnimalsType(animal) {
    if (animal.type === filter) {
      return true;
    } else {
      return false;
    }
  }
  return filteredList;
}

function sortList(sortBy) {
  // console.log("filteredList", filteredList);
  // let type = sortBy.target.dataset.filter;
  let sortFilter = this.dataset.sort;
  let directionWay = this.dataset.sortDirection;

  // let directionControl = () => {
  //   if (directionWay === "asc") {
  //     return "decs";
  //   } else {
  //     return "asc";
  //   }
  // };

  // directionWay = directionControl;

  // console.log(directionControl());

  // if (sortFilter === "name") {
  //   filteredList.sort(sortByName);
  // } else if (sortFilter === "type") {
  //   filteredList.sort(sortByType);
  // } else if (sortFilter === "desc") {
  //   filteredList.sort(sortByDesc);
  // } else if (sortFilter === "age") {
  //   filteredList.sort(sortByAge);
  // }

  filteredList.sort(sortByValue);

  // Campare values
  // a is the object and b is the index in the array
  function sortByValue(a, b) {
    // console.log(sortFilter);
    if (a[sortFilter] < b[sortFilter]) {
      return -1;
    } else {
      return 1;
    }
  }

  displayList(filteredList);
}

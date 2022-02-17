"use strict";

window.addEventListener("DOMContentLoaded", start);

const HTML = {};
let allAnimals = [],
  filter = "*";

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
  // Add event-listeners to btn and run the filter animal list
  HTML.allFilterBtn.forEach((btn) => {
    btn.addEventListener("click", createAnimalList);
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
function createAnimalList() {
  let filteredAnimals;
  // get filter depending on data-filter attribue
  filter = this.dataset.filter;
  // filter allAnimals with correct filter function and put info filterAnmimals
  if (filter === "*") {
    filteredAnimals = getFilteredData(all);
  } else if (filter === "cat") {
    filteredAnimals = getFilteredData(isCat);
  } else if (filter === "dog") {
    filteredAnimals = getFilteredData(isDog);
  }
  displayList(filteredAnimals);
}

// Filtering function which takes a filtering function as an argument
function getFilteredData(filterFunction) {
  let filteredAnimals = allAnimals.filter(filterFunction);
  return filteredAnimals;
}

// ----- Controller -----
// isCat function
function isCat(animal, i, arr) {
  if (animal.type === "cat") {
    return true;
  } else {
    return false;
  }
}

// isDog function
function isDog(animal, i, arr) {
  if (animal.type === "dog") {
    return true;
  } else {
    return false;
  }
}

// all function
function all() {
  return true;
}

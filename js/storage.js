// storage.js - keeps listings made on the Sell page so Browse can show them
// There is no backend, so we use localStorage (it only stores text, so we use JSON)

var STORAGE_KEY = "userListings";

// the Sell form has no photo upload, so each category gets a sample photo
var categoryImages = {
  "Board games": "images/board-games.jpg",
  "Card games": "images/board-games.jpg",
  "Miniatures": "images/chess.jpg",
  "RPG books": "images/dice.jpg",
  "Dice and accessories": "images/dice.jpg",
  "Strategy": "images/chess.jpg"
};


// returns the array of saved listings (empty array if nothing is saved)
function getSavedListings() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return saved;
    }
  } catch (e) {
    // broken or blocked storage: act like nothing is saved
  }
  return [];
}


// reads the Sell form, saves the listing, returns true if it worked
function saveListingFromForm() {
  var category = document.getElementById("category").value;
  var id = Date.now();   // unique number, bigger than the ids in data.js

  var listing = {
    id: id,
    slug: "user-" + id,
    title: document.getElementById("game-title").value.trim(),
    category: category,
    condition: document.getElementById("condition").value,
    price: Math.round(Number(document.getElementById("price").value) * 100) / 100,
    city: document.getElementById("city").value.trim(),
    trade: document.getElementById("trade").checked,
    image: categoryImages[category] || "images/board-games.jpg",
    alt: "Sample photo for the " + category + " category",
    info: document.getElementById("description").value.trim()
  };
  // the seller name and email are not saved on purpose

  try {
    var list = getSavedListings();
    list.push(listing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

// Person B: shared storage for Sell and Browse. Requires listing.js loaded first.
var STORAGE_KEY = "userListings";
var FAVORITES_KEY = "favoriteListings";
var listingStore = new ListingStore(STORAGE_KEY);

// The demo does not upload photos; choose a matching sample picture.
var categoryImages = {
  "Board games": "images/board-games.jpg",
  "Card games": "images/board-games.jpg",
  "Miniatures": "images/chess.jpg",
  "RPG books": "images/dice.jpg",
  "Dice and accessories": "images/dice.jpg",
  "Strategy": "images/chess.jpg",
  "Accessories": "images/dice.jpg"
};

function getSavedListings() { return listingStore.getAll(); }

function loadFavorites() {
  try {
    var values = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    if (!Array.isArray(values)) return [];
    return Array.from(new Set(values.filter(function (id) {
      return Number.isSafeInteger(id) && id > 0;
    })));
  } catch (error) { return []; }
}

function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    return true;
  } catch (error) { return false; }
}

function readListingForm() {
  var category = document.getElementById("category").value;
  return {
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
}

// Returns the saved Listing or false. Seller identity/email are deliberately not persisted.
function saveListingFromForm(editId) {
  try {
    var data = readListingForm();
    if (editId != null) return listingStore.update(editId, data);
    // Avoid collisions between rapid submissions and existing listings.
    var id = Date.now();
    while (listingStore.getById(id)) id++;
    data.id = id;
    data.slug = "user-" + id;
    return listingStore.add(data);
  } catch (error) { return false; }
}

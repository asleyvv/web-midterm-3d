// browse page: listings, search, filter, sort and favorites

window.sampleListings = listings.map(function (item) { return new Listing(item); });
window.sampleCategories = categories.slice();
var favorites = loadFavorites();   // persisted IDs, safely restored on reload

var grid = document.getElementById("product-grid");
var searchBox = document.getElementById("search");
var catSelect = document.getElementById("filter-category");
var sortSelect = document.getElementById("sort-by");
var tradeBox = document.getElementById("trade-only");
var resetBtn = document.getElementById("reset-filters");
var countText = document.getElementById("result-count");
var noResults = document.getElementById("no-results");
var favList = document.getElementById("fav-list");
var favEmpty = document.getElementById("fav-empty");
var favCount = document.getElementById("fav-count");
var compareBody = document.getElementById("compare-body");
var myListingsList = document.getElementById("my-listings-list");
var myListingsEmpty = document.getElementById("my-listings-empty");
var clearAllBtn = document.getElementById("clear-all-listings");


// makes text safe to put inside html (listings from the Sell form are typed by users)
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


// whole prices stay as they are (35), others get 2 decimals (25.50)
function formatPrice(price) {
  if (price % 1 === 0) {
    return String(price);
  }
  return price.toFixed(2);
}


// returns the html for one card
function makeCard(item) {
  var badge = item.trade ? "Trade welcome" : "For sale";
  var saved = favorites.indexOf(item.id) !== -1;
  var btnText = saved ? "♥ Saved" : "♡ Save";

  return `
    <article class="product-card" id="${escapeHtml(item.slug)}">
      <div class="product-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" width="900" height="600" loading="lazy">
        <span class="product-badge">${badge}</span>
      </div>
      <div class="product-body">
        <p class="eyebrow">${escapeHtml(item.category)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="product-meta">Condition: <strong>${escapeHtml(item.condition)}</strong></p>
        <div class="product-bottom"><span class="price">${item.priceLabel()}</span><span class="location">${escapeHtml(item.city)}</span></div>
        <button type="button" class="fav-btn ${saved ? "is-saved" : ""}" data-id="${item.id}" aria-pressed="${saved}">${btnText}</button>
        <details>
          <summary>View details</summary>
          <p>${escapeHtml(item.info)}</p>
          <p class="small">${listingStore.getById(item.id) ? "User listing" : "Sample listing"} · illustrative photo. Buying and messaging are not available in this prototype.</p>
        </details>
      </div>
    </article>`;
}


// takes a list and returns only the listings that match
function filterListings(list, category, text, tradeOnly) {
  var result = [];
  text = text.trim().toLowerCase();

  for (var i = 0; i < list.length; i++) {
    var item = list[i];

    if (category !== "all" && item.category !== category) {
      continue;
    }
    if (tradeOnly && !item.trade) {
      continue;
    }
    if (!item.matches(text)) {
      continue;
    }
    result.push(item);
  }
  return result;
}


// returns a sorted copy (the original array stays the same)
function sortListings(list, how) {
  var copy = list.slice();

  if (how === "low") {
    copy.sort(function (a, b) { return a.price - b.price; });
  } else if (how === "high") {
    copy.sort(function (a, b) { return b.price - a.price; });
  } else if (how === "name") {
    copy.sort(function (a, b) { return a.title.localeCompare(b.title); });
  }
  return copy;
}


// draws the cards on the page
function showListings(list) {
  var html = "";
  list.forEach(function (item) {
    html += makeCard(item);
  });
  grid.innerHTML = html;

  noResults.hidden = list.length !== 0;
  countText.textContent = "Showing " + list.length + " of " + listings.length + " listings";
}


// reads the controls and redraws
function applyFilters() {
  var list = filterListings(listings, catSelect.value, searchBox.value, tradeBox.checked);
  list = sortListings(list, sortSelect.value);
  showListings(list);
}


// fills the category dropdown from the categories array
function fillCategories() {
  // Clear old dynamic options, but preserve the user's current filter when possible.
  var selected = catSelect.value;
  while (catSelect.options.length > 1) catSelect.remove(1);
  for (var i = 0; i < categories.length; i++) {
    var opt = document.createElement("option");
    opt.value = categories[i];
    opt.textContent = categories[i];
    catSelect.appendChild(opt);
  }
  catSelect.value = categories.indexOf(selected) !== -1 ? selected : "all";
}


// the comparison table also comes from the array now
function fillCompareTable() {
  var rows = "";
  for (var i = 0; i < listings.length; i++) {
    var item = listings[i];
    rows += "<tr><th scope=\"row\">" + escapeHtml(item.title) + "</th><td>" + escapeHtml(item.category) + "</td><td>" +
      escapeHtml(item.condition) + "</td><td>" + item.priceLabel() + "</td><td>" + (item.trade ? "Welcome" : "No") + "</td></tr>";
  }
  compareBody.innerHTML = rows;
}


// adds the listings saved from the Sell page to the main array (newest first)
function addUserListings() {
  // Keep sample listings and their category order intact on reload and after CRUD.
  listings = getSavedListings().concat(window.sampleListings);
  categories = window.sampleCategories.slice();
  getSavedListings().forEach(function (item) {
    if (categories.indexOf(item.category) === -1) categories.push(item.category);
  });
}


function findListing(id) {
  for (var i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return listings[i];
    }
  }
  return null;
}


// add a saved item to the list (creates a new element)
function addFavItem(item) {
  var li = document.createElement("li");
  li.className = "fav-item";
  li.id = "fav-" + item.id;

  var span = document.createElement("span");
  span.textContent = item.title + " - " + item.priceLabel();

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fav-remove";
  btn.dataset.id = item.id;
  btn.textContent = "Remove";
  btn.setAttribute("aria-label", "Remove " + item.title + " from saved games");

  li.appendChild(span);
  li.appendChild(btn);
  favList.appendChild(li);
}


// remove an item from the saved list (removes the element)
function removeFavItem(id) {
  var li = document.getElementById("fav-" + id);
  if (li) {
    li.remove();
  }
}


function updateFavInfo() {
  favCount.textContent = favorites.length;
  favEmpty.hidden = favorites.length !== 0;
}


function toggleFavorite(id) {
  var pos = favorites.indexOf(id);

  if (pos === -1) {
    favorites.push(id);
    addFavItem(findListing(id));
  } else {
    favorites.splice(pos, 1);
    removeFavItem(id);
  }
  if (!saveFavorites(favorites)) {
    alert("Could not save favorites in this browser.");
  }
  updateFavInfo();
  applyFilters();   // redraw so the card buttons match
}


// ----- events -----

document.addEventListener("DOMContentLoaded", function () {
  addUserListings();
  // Discard favorites pointing at deleted/nonexistent listings.
  favorites = favorites.filter(function (id) { return findListing(id) !== null; });
  saveFavorites(favorites);
  favorites.forEach(function (id) { addFavItem(findListing(id)); });
  fillCategories();
  fillCompareTable();
  renderMyListings();
  applyFilters();
  updateFavInfo();
});

searchBox.addEventListener("input", applyFilters);
catSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
tradeBox.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", function () {
  searchBox.value = "";
  catSelect.value = "all";
  sortSelect.value = "default";
  tradeBox.checked = false;
  applyFilters();
  searchBox.focus();
});

// one listener on the grid, works for cards that were added later
grid.addEventListener("click", function (e) {
  var btn = e.target.closest(".fav-btn");
  if (btn) {
    toggleFavorite(Number(btn.dataset.id));
  }
});

favList.addEventListener("click", function (e) {
  var btn = e.target.closest(".fav-remove");
  if (btn) {
    toggleFavorite(Number(btn.dataset.id));
  }
});

// Only user-published listings are editable/deletable (sample records are read-only).
function renderMyListings() {
  var own = listingStore.getAll();
  myListingsEmpty.hidden = own.length > 0;
  clearAllBtn.disabled = own.length === 0;
  myListingsList.innerHTML = own.map(function (item) {
    return '<li class="my-listing-item"><div><strong>' + escapeHtml(item.title) +
      '</strong><span class="catalog-note"> ' + item.priceLabel() + ' · ' + escapeHtml(item.city) +
      '</span></div><div class="my-listing-actions"><a class="btn btn-tavern btn-sm" href="sell.html?edit=' +
      encodeURIComponent(item.id) + '">Edit</a><button type="button" class="btn btn-outline-danger btn-sm delete-listing" data-id="' +
      item.id + '">Delete</button></div></li>';
  }).join("");
}

function refreshAfterChange() {
  // Rebuild listing collection so filtering, comparison and favorite buttons stay in sync.
  addUserListings();
  fillCategories();
  favorites = favorites.filter(function (id) { return findListing(id) !== null; });
  saveFavorites(favorites);
  favList.innerHTML = "";
  favorites.forEach(function (id) { addFavItem(findListing(id)); });
  updateFavInfo();
  renderMyListings();
  fillCompareTable();
  applyFilters();
}

myListingsList.addEventListener("click", function (event) {
  var button = event.target.closest(".delete-listing");
  if (!button) return;
  if (!confirm("Delete this listing?")) return;
  if (!listingStore.remove(Number(button.dataset.id))) {
    alert("Could not delete the listing. Check browser storage.");
    return;
  }
  refreshAfterChange();
});

clearAllBtn.addEventListener("click", function () {
  if (!confirm("Delete ALL your listings? This cannot be undone.")) return;
  if (!listingStore.clear()) {
    alert("Could not clear listings. Check browser storage.");
    return;
  }
  refreshAfterChange();
});

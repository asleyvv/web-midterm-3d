// browse page: listings, search, filter, sort and favorites

var favorites = [];   // array 3: ids of saved listings

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


// returns the html for one card
function makeCard(item) {
  var badge = item.trade ? "Trade welcome" : "For sale";
  var saved = favorites.indexOf(item.id) !== -1;
  var btnText = saved ? "♥ Saved" : "♡ Save";

  return `
    <article class="product-card" id="${item.slug}">
      <div class="product-image">
        <img src="${item.image}" alt="${item.alt}" width="900" height="600" loading="lazy">
        <span class="product-badge">${badge}</span>
      </div>
      <div class="product-body">
        <p class="eyebrow">${item.category}</p>
        <h3>${item.title}</h3>
        <p class="product-meta">Condition: <strong>${item.condition}</strong></p>
        <div class="product-bottom"><span class="price">$${item.price}</span><span class="location">${item.city}</span></div>
        <button type="button" class="fav-btn ${saved ? "is-saved" : ""}" data-id="${item.id}" aria-pressed="${saved}">${btnText}</button>
        <details>
          <summary>View details</summary>
          <p>${item.info}</p>
          <p class="small">Sample listing · illustrative photo. Buying and messaging are not available in this prototype.</p>
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
    var words = (item.title + " " + item.category + " " + item.info).toLowerCase();
    if (text !== "" && words.indexOf(text) === -1) {
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
  for (var i = 0; i < categories.length; i++) {
    var opt = document.createElement("option");
    opt.value = categories[i];
    opt.textContent = categories[i];
    catSelect.appendChild(opt);
  }
}


// the comparison table also comes from the array now
function fillCompareTable() {
  var rows = "";
  for (var i = 0; i < listings.length; i++) {
    var item = listings[i];
    rows += "<tr><th scope=\"row\">" + item.title + "</th><td>" + item.category + "</td><td>" +
      item.condition + "</td><td>$" + item.price + "</td><td>" + (item.trade ? "Welcome" : "No") + "</td></tr>";
  }
  compareBody.innerHTML = rows;
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
  span.textContent = item.title + " - $" + item.price;

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
  updateFavInfo();
  applyFilters();   // redraw so the card buttons match
}


// ----- events -----

document.addEventListener("DOMContentLoaded", function () {
  fillCategories();
  fillCompareTable();
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

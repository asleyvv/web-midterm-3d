$(document).ready(function () {
  "use strict";

  const API_HOST = "https://www.dnd5eapi.co";
  const LIST_URL = API_HOST + "/api/monsters";
  const SHOW_LIMIT = 12;        // cards shown at once
  const TIMEOUT_MS = 8000;      // give up after 8 seconds

  const $grid = $("#monster-list");
  if (!$grid.length) return;    // this page has no Game library

  const $states = {
    loading: $("#api-loading"),
    empty: $("#api-empty"),
    error: $("#api-error"),
    success: $grid
  };
  const $search = $("#monster-search");
  const $count = $("#monster-count");
  const $details = $("#monster-details");

  let allMonsters = [];         // the full list from the API
  let lastRequest = 0;          // used to ignore old answers (see showMonster)

  async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("The server answered with status " + response.status + ".");
      }
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The server took too long to answer.");
      }
      if (error.name === "TypeError") {
        throw new Error("Could not reach the API. Check your internet connection.");
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }


  function showState(name, message) {
    $.each($states, function (key, $el) {
      $el.prop("hidden", key !== name);
    });
    if (name === "empty" && message) { $("#api-empty-text").text(message); }
    if (name === "error") { $("#api-error-text").text(message || "Something went wrong."); }
    if (name === "success") { $grid.hide().fadeIn(250); }      // jQuery effect
  }

  function filterMonsters(query) {
    const text = query.trim().toLowerCase();
    return allMonsters.filter(function (monster) {
      return monster.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  function armorValue(monster) {
    const armor = monster.armor_class;
    if (Array.isArray(armor) && armor.length > 0) { return armor[0].value; }
    return typeof armor === "number" ? armor : "n/a";
  }

  function formatChallenge(rating) {
    if (rating === 0.125) { return "1/8"; }
    if (rating === 0.25) { return "1/4"; }
    if (rating === 0.5) { return "1/2"; }
    return rating === undefined ? "n/a" : String(rating);
  }

  function renderList(list, query) {
    if (list.length === 0) {
      showState("empty", query ? "No monsters match \"" + query + "\"." : "The API returned no monsters.");
      $count.text("");
      return;
    }
    $grid.empty();
    list.slice(0, SHOW_LIMIT).forEach(function (monster) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "monster-card";
      card.dataset.index = monster.index;

      const name = document.createElement("span");
      name.className = "monster-name";
      name.textContent = monster.name;

      const hint = document.createElement("span");
      hint.className = "monster-hint";
      hint.textContent = "View stats";

      card.appendChild(name);
      card.appendChild(hint);
      $grid.append(card);
    });
    $count.text("Showing " + Math.min(SHOW_LIMIT, list.length) + " of " + list.length);
    showState("success");
  }

  function renderDetails(monster) {
    const rows = [
      ["Type", monster.size + " " + monster.type],
      ["Armor class", armorValue(monster)],
      ["Hit points", monster.hit_points],
      ["Challenge rating", formatChallenge(monster.challenge_rating)],
      ["XP", monster.xp === undefined ? "n/a" : monster.xp]
    ];

    const title = document.createElement("h3");
    title.textContent = monster.name;

    const list = document.createElement("dl");
    rows.forEach(function (row) {
      const dt = document.createElement("dt");
      dt.textContent = row[0];
      const dd = document.createElement("dd");
      dd.textContent = row[1];
      list.appendChild(dt);
      list.appendChild(dd);
    });

    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn btn-outline-dark btn-sm details-close";
    close.textContent = "Close";

    $details.empty().append(title, list, close);
  }

  async function loadMonsters() {
    showState("loading");
    $search.prop("disabled", true);
    try {
      const data = await fetchJson(LIST_URL);
      if (!data || !Array.isArray(data.results)) {
        throw new Error("The API sent data in an unexpected format.");
      }
      allMonsters = data.results;
      $search.prop("disabled", false);
      renderList(allMonsters, "");
    } catch (error) {
      showState("error", error.message);
    }
  }


  async function showMonster(index) {
    const requestId = ++lastRequest;
    $details.html("<p class=\"api-inline\" role=\"status\">Loading...</p>").slideDown(200);
    try {
      const monster = await fetchJson(LIST_URL + "/" + encodeURIComponent(index));
      if (requestId !== lastRequest) { return; }
      renderDetails(monster);
    } catch (error) {
      if (requestId !== lastRequest) { return; }
      $details.empty().append($("<p class=\"api-inline\" role=\"alert\"></p>").text(error.message));
    }
  }

  // ---------- 6. events ----------
  $grid.on("click", ".monster-card", function () {
    $(".monster-card").removeClass("selected");
    $(this).addClass("selected");
    showMonster(this.dataset.index);
  });

  $details.on("click", ".details-close", function () {
    lastRequest++;                    // ignore any answer still on its way
    $details.slideUp(200);
    $(".monster-card").removeClass("selected");
  });

  $search.on("input", function () {
    const query = $(this).val();
    renderList(filterMonsters(query), query.trim());
  });

  $("#api-retry").on("click", loadMonsters);

  loadMonsters();
});

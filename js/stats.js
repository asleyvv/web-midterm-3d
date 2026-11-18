$(document).ready(function () {
  "use strict";

  const $chart = $("#stats-chart");
  if (!$chart.length) return;     // this page has no dashboard

  function getAllListings() {
    const base = typeof listings !== "undefined" ? listings : [];
    const saved = typeof getSavedListings === "function" ? getSavedListings() : [];
    return base.concat(saved).filter(function (item) {
      return item && Number.isFinite(Number(item.price));
    });
  }

  function calculateStats(items) {
    const prices = items.map(function (item) { return Number(item.price); });
    const total = prices.reduce(function (sum, price) { return sum + price; }, 0);
    const categories = {};
    items.forEach(function (item) { categories[item.category] = true; });
    return {
      count: items.length,
      categories: Object.keys(categories).length,
      average: items.length ? total / items.length : 0,
      min: items.length ? Math.min.apply(null, prices) : 0,
      max: items.length ? Math.max.apply(null, prices) : 0
    };
  }

  function groupByCategory(items, metric) {
    const groups = {};
    items.forEach(function (item) {
      const key = item.category || "Other";
      if (!groups[key]) { groups[key] = { name: key, count: 0, total: 0 }; }
      groups[key].count++;
      groups[key].total += Number(item.price);
    });
    return Object.keys(groups).map(function (key) {
      const group = groups[key];
      return { name: group.name, count: group.count, average: group.total / group.count };
    }).sort(function (a, b) { return b[metric] - a[metric]; });
  }

  function formatMoney(value) { return "$" + value.toFixed(2); }
  function formatWhole(value) { return String(Math.round(value)); }

  function countUp($el, target, format) {
    $({ value: 0 }).animate({ value: target }, {
      duration: 800,
      step: function (now) { $el.text(format(now)); },
      complete: function () { $el.text(format(target)); }
    });
  }

  function drawTiles(stats) {
    countUp($("#stat-count"), stats.count, formatWhole);
    countUp($("#stat-categories"), stats.categories, formatWhole);
    countUp($("#stat-average"), stats.average, formatMoney);
    $("#stat-range").text(formatMoney(stats.min) + " - " + formatMoney(stats.max));
  }

  function drawChart(items, metric) {
    const groups = groupByCategory(items, metric);
    const format = metric === "count" ? formatWhole : formatMoney;
    const biggest = groups.length ? groups[0][metric] : 0;

    $chart.empty();
    groups.forEach(function (group) {
      const row = document.createElement("div");
      row.className = "chart-row";

      const label = document.createElement("span");
      label.className = "chart-label";
      label.textContent = group.name;

      const track = document.createElement("div");
      track.className = "chart-track";
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      track.appendChild(bar);

      const value = document.createElement("span");
      value.className = "chart-value";
      value.textContent = format(group[metric]);

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      $chart.append(row);

      const percent = biggest > 0 ? (group[metric] / biggest) * 100 : 0;
      $(bar).css("width", 0).animate({ width: percent + "%" }, 600);
    });
  }

  const items = getAllListings();

  if (items.length === 0) {
    $chart.text("There are no listings yet.");
    return;
  }

  drawTiles(calculateStats(items));
  drawChart(items, "count");

  $(".metric-btn").on("click", function () {
    const $btn = $(this);
    $btn.addClass("active").attr("aria-pressed", "true")
      .siblings().removeClass("active").attr("aria-pressed", "false");
    drawChart(items, $btn.data("metric"));
  });
});

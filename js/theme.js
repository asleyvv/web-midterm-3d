// theme.js - light/dark theme toggle

var root = document.documentElement;

// use the theme saved last time
if (localStorage.getItem("theme") === "dark") {
  root.setAttribute("data-bs-theme", "dark");
}

// true if dark theme is on
function isDark() {
  return root.getAttribute("data-bs-theme") === "dark";
}

// create the button and put it in the navbar
function addThemeButton() {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";

  // change the button text depending on the theme
  function updateText() {
    button.textContent = isDark() ? "Light mode" : "Dark mode";
  }
  updateText();

  // switch the theme on click and save the choice
  button.addEventListener("click", function () {
    var newTheme = isDark() ? "light" : "dark";
    root.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateText();
  });

  var menu = document.querySelector(".navbar-nav");
  if (menu) {
    var item = document.createElement("li");
    item.className = "nav-item theme-item";
    item.appendChild(button);
    menu.appendChild(item);
  } else {
    document.body.appendChild(button);
  }
}

document.addEventListener("DOMContentLoaded", addThemeButton);
// theme.js - light/dark theme toggle

var root = document.documentElement;

// use the theme saved last time
try {
  if (localStorage.getItem("theme") === "dark") {
    root.setAttribute("data-bs-theme", "dark");
  }
} catch (error) {
  // Some privacy settings block localStorage; the toggle should still work for this page.
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
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      // The page's theme still changes even when preferences cannot be saved.
    }
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
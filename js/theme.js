// theme.js - light/dark theme toggle

// create the toggle button
var themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.className = "theme-toggle";

// change the button text depending on the theme
function updateButtonText() {
  if (document.body.classList.contains("dark-theme")) {
    themeButton.textContent = "Light mode";
  } else {
    themeButton.textContent = "Dark mode";
  }
}

// use the theme saved last time
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}
updateButtonText();

// switch the theme on click and save the choice
themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateButtonText();
});

// put the button in the navigation bar
var navigation = document.querySelector("nav");
if (navigation) {
  navigation.appendChild(themeButton);
} else {
  document.body.appendChild(themeButton);
}
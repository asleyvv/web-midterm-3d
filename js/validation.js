// validation.js - form validation for sell.html and contact.html

var form = document.querySelector("form");

// show an error message under a field
function showError(field, message) {
  clearError(field);
  field.classList.add("field-invalid");

  var error = document.createElement("p");
  error.className = "error-message";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
}

// remove the error message of a field
function clearError(field) {
  field.classList.remove("field-invalid");

  var next = field.nextElementSibling;
  if (next && next.classList.contains("error-message")) {
    next.remove();
  }
}

// check one field, returns true if it is ok
function checkField(field) {
  var type = field.type;
  var value = field.value.trim();

  // buttons and file inputs do not need checking
  if (type === "submit" || type === "reset" || type === "button" || type === "file") {
    return true;
  }

  // checkbox
  if (type === "checkbox") {
    if (field.required && !field.checked) {
      showError(field, "Please tick this box");
      return false;
    }
    clearError(field);
    return true;
  }

  // empty required field
  if (field.required && value === "") {
    if (field.tagName === "SELECT") {
      showError(field, "Please choose an option");
    } else {
      showError(field, "This field is required");
    }
    return false;
  }

  // email
  if (type === "email" && value !== "") {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(field, "Please enter a valid email");
      return false;
    }
  }

  // price (number must be more than 0)
  if (type === "number" && value !== "") {
    if (Number(value) <= 0) {
      showError(field, "Please enter a number greater than 0");
      return false;
    }
  }

  // textarea (description or message)
  if (field.tagName === "TEXTAREA" && field.required && value.length < 10) {
    showError(field, "Please write at least 10 characters");
    return false;
  }

  // short text (name, city, title)
  if (type === "text" && field.required && value.length < 2) {
    showError(field, "Please write at least 2 characters");
    return false;
  }

  clearError(field);
  return true;
}

// show a success message above the form
function showSuccess() {
  var old = document.querySelector(".success-message");
  if (old) {
    old.remove();
  }

  var message = document.createElement("p");
  message.className = "success-message";
  message.textContent = "Thank you! Your form was sent successfully.";
  form.insertAdjacentElement("beforebegin", message);

  // hide it after 5 seconds
  setTimeout(function () {
    message.remove();
  }, 5000);
}

if (form) {
  // use our own messages instead of the browser ones
  form.setAttribute("novalidate", "");

  var fields = form.querySelectorAll("input, select, textarea");

  // check a field when the user leaves it
  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      checkField(field);
    });
  });

  // check everything when the form is sent
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var allOk = true;
    fields.forEach(function (field) {
      if (!checkField(field)) {
        allOk = false;
      }
    });

    if (allOk) {
      showSuccess();
      form.reset();
    } else {
      // go to the first field with a mistake
      form.querySelector(".field-invalid").focus();
    }
  });

  // clear the errors when the form is reset
  form.addEventListener("reset", function () {
    fields.forEach(clearError);
  });
}
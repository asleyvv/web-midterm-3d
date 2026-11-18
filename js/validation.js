// validation.js - form validation for sell.html and contact.html

var form = document.querySelector("form");
var isSellForm = !!document.getElementById("game-title");
var editId = null;

// Populate the Sell form only for ads created in this browser.
if (isSellForm) {
  var editParam = new URLSearchParams(window.location.search).get("edit");
  if (editParam !== null) {
    var id = Number(editParam);
    var existing = /^\d+$/.test(editParam) && listingStore.getById(id);
    if (existing) {
      editId = existing.id;
      document.getElementById("game-title").value = existing.title;
      document.getElementById("category").value = existing.category;
      // Legacy categories may not be present in the new-listing dropdown.
      if (document.getElementById("category").value !== existing.category) {
        var option = new Option(existing.category, existing.category);
        document.getElementById("category").appendChild(option);
        document.getElementById("category").value = existing.category;
      }
      document.getElementById("condition").value = existing.condition;
      document.getElementById("price").value = existing.price;
      document.getElementById("city").value = existing.city;
      document.getElementById("description").value = existing.info;
      document.getElementById("trade").checked = existing.trade;
      document.getElementById("sell-form-title").textContent = "Edit your listing";
      document.getElementById("sell-submit").textContent = "Save changes";
      document.getElementById("listing-note").textContent = "Update your listing details. Seller contact fields are not saved for privacy, so they are optional while editing.";
      document.getElementById("seller-name").required = false;
      document.getElementById("seller-email").required = false;
    } else {
      var warning = document.createElement("p");
      warning.className = "error-message";
      warning.textContent = "Listing not found. You can create a new listing below.";
      form.parentNode.insertBefore(warning, form);
    }
  }
}


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
// published is true when a listing was saved on the Sell page
function showSuccess(published, updated) {
  var old = document.querySelector(".success-message");
  if (old) {
    old.remove();
  }

  var message = document.createElement("p");
  message.className = "success-message";
  if (published) {
    message.textContent = updated ? "Your listing was updated! " : "Your listing was published! ";
    var link = document.createElement("a");
    link.href = "browse.html";
    link.textContent = "See it on the Browse page";
    message.appendChild(link);
  } else {
    message.textContent = "Thank you! Your form was sent successfully.";
  }
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
      // on the Sell page (storage.js is loaded) the listing is also saved for Browse
      if (isSellForm) {
        var saved = typeof saveListingFromForm === "function" && saveListingFromForm(editId);
        if (!saved) {
          var prior = document.querySelector(".success-message");
          if (prior) prior.remove();
          var error = document.createElement("p");
          error.className = "error-message success-message";
          error.textContent = "Could not save your listing. Check browser storage and try again.";
          form.insertAdjacentElement("beforebegin", error);
          return;
        }
        showSuccess(true, editId !== null);
        // Keep the edited values on screen; reset only after creating a new post.
        if (editId === null) form.reset();
      } else {
        showSuccess(false, false);
        form.reset();
      }
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
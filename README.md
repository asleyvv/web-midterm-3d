# TTG Marketplace

A responsive website about buying, selling and trading tabletop games (board games, chess, dice and accessories).
The **midterm** version was built with HTML5, CSS and Bootstrap. The **endterm** version adds JavaScript and jQuery
interactivity to the same project.

- **Live site:** https://asleyvv.github.io/web-midterm-3d/Index.html
- **Repository:** https://github.com/asleyvv/web-midterm-3d

## Team

| Member | Endterm part |
| --- | --- |
| Duman Zhanybekov | Browse page and JavaScript fundamentals |
| SAILAU DINMUKHAMMED | Forms, validation and theme switcher |
| Daniyal Akylbek | jQuery, FAQ, Community page, README and deployment |
## Pages

- `Index.html`: home page, categories, featured listings, how it works.
- `browse.html`: listings built from an array, search, category filter, price sort, favorites list.
- `sell.html`: listing form; a valid listing is saved in the browser and appears on Browse.
- `community.html`: player groups, filterable game-night schedule, house rules.
- `About.html`: mission, team, story, searchable FAQ accordion.
- `contact.html`: contact form.

All pages share the navigation bar, footer, colors and fonts.

## New endterm features

### Person A: Browse page (`js/data.js`, `js/browse.js`, `js/storage.js`)
- Two arrays: `listings` (project data) and `categories`.
- Cards are created from the array with loops (`forEach`) instead of being written in HTML.
- Search (`input`), category filter and sort (`change`), "Save" button and favorites list (`click`) where items can be added and removed.
- Reusable functions such as `filterListings()` and `sortListings()` return new arrays.
- **Sell to Browse:** when the Sell form is valid, `saveListingFromForm()` (`js/storage.js`) stores the listing as JSON in `localStorage`. On Browse, `addUserListings()` reads it with `getSavedListings()` and adds it to the `listings` array (newest first), so search, filter, sort and favorites work on it too. Text typed by users is passed through `escapeHtml()` before it is shown, and a sample photo is chosen from the category. The seller name and email are not saved.

### Person B: Forms and theme (`js/validation.js`, `js/theme.js`)
- The Sell and Contact forms are checked with JavaScript instead of the browser's default messages (the script adds `novalidate` to the form).
- Validated fields: required fields, minimum text length (2 characters for names, city and game title, 10 characters for the description and message), valid email format, price greater than 0, and a chosen option in every drop-down list.
- Each field is checked when the user leaves it (`blur`), and all fields are checked again on `submit`. Error messages appear under the field, the field gets a red border, and the first wrong field receives focus.
- `preventDefault()` stops the page from reloading. If all fields are valid, a success message appears above the form and the form is cleared. The "Clear form" button (`reset`) also removes the error messages.
- Theme switcher: `theme.js` adds a "Dark mode / Light mode" button to the navbar (`click`). It sets `data-bs-theme` on `<html>` (Bootstrap 5.3 dark mode), and our tavern colors in `css/pages.css` change with it. The choice is saved in `localStorage`, so it stays when the user moves to another page.

### Person C: jQuery (`js/jquery-effects.js`)
jQuery 3.7.1 is loaded on every page (CDN with a local fallback in `js/jquery-3.7.1.min.js`).

| Feature | Page | What it does |
| --- | --- | --- |
| FAQ accordion | About | Click or press Enter/Space on a question to slide its answer open; other answers close. |
| FAQ search | About | Typing hides questions that do not match. |
| Event filter | Community | Buttons filter the schedule by experience level with fade effects and a result counter. |
| Group cards | Community | Hover lifts the card; its link scrolls to the event and highlights the row. |
| Back to top | All pages | Button fades in after scrolling and scrolls smoothly to the top. |

jQuery concepts used: ID, class, element, attribute and descendant selectors; traversal with `closest()`, `find()`,
`siblings()` and `children()`; events `click`, `input`, `keydown`, `mouseenter`, `mouseleave` and page start; effects `slideUp`, `slideDown`, `fadeIn`, `fadeOut`, `toggle` and `animate`.

## How to test

1. Open the live site or `Index.html` locally.
2. **Browse:** type "chess" in the search box, change category and sort, press "Save" on a card, remove it from the saved list.
   **Sell then Browse:** fill the Sell form with valid data and press "Publish listing", then open Browse: the new listing is the first card and its category is in the filter.
3. **Sell / Contact:** submit empty and invalid data to see messages under the fields, then valid data for the success message; switch the light/dark theme.
4. **About:** open and close FAQ questions; type "trade" in the FAQ search.
5. **Community:** press the filter buttons; click "Find a beginner night" on a group card.
6. **Any page:** scroll down and use the "Top" button.
7. Open the browser console (F12): there should be no errors.

## Run locally

Download or clone the repository and open `Index.html`. No build step is needed. Keep the folders together so CSS, JS and image paths work.

## Deployment

The site is published with GitHub Pages from the `main` branch (Settings, Pages, Deploy from branch).

## Limitations

Listings, prices and events are examples. Listings published on the Sell page are stored with `localStorage`, so they are visible only in the same browser and are not shared with other users (that would need a real backend and database); clearing the browser data removes them. Photos are illustrative (sources in `images/SOURCES.txt`). There are no accounts, purchases, messaging or event registration, and form data is not sent anywhere.


## Person B: OOP, CRUD, persistent favorites (extension)

- `js/listing.js`: `Listing` has `matches(text)` / `priceLabel()`; `ListingStore` has `load()`, `save()`, `getAll()`, `getById()`, `add()`, `update()`, `remove()`, `clear()`. Each saved record becomes a `Listing` instance. Invalid JSON and malformed records are ignored.
- `js/storage.js`: saves listings under the existing `userListings` key (compatible with earlier published ads), and favorites under `favoriteListings` using JSON and guarded localStorage access. No seller name/email is stored.
- `browse.html`: **My listings** only manages user-created ads. Click **Edit** to prefill `sell.html?edit=ID`, **Delete** to remove one ad, or **Clear all** to remove all user ads (with confirmation). Built-in sample ads remain unchanged.
- Favorites survive navigation/reload and favorites referring to deleted ads are cleaned up. Comparison and search update after CRUD operations.
- `sell.html`: existing user ads can be edited; contact fields are optional while editing because contact details are intentionally not persisted. `contact.html` keeps its original validation flow.

### Manual test checklist

1. Publish a new listing in Sell; confirm it appears in Browse and My listings.
2. Edit it from Browse, update title/price, save changes; confirm one updated listing (no duplicates).
3. Favorite the listing and a sample listing; reload Browse; both remain in Saved games.
4. Delete the edited listing; verify it disappears from search, comparison and favorites, while the sample remains.
5. Add two listings; choose Clear all; verify only user listings are deleted.
6. In browser console set `localStorage.setItem("userListings", "{bad")`, then reload Browse; sample listings still render (restore/remove the key afterwards).
7. Try Sell and Contact with invalid inputs and confirm validation messages continue to work.

The application uses browser localStorage and has no backend or shared accounts.

### Regression review (Person B)

- The existing theme and other team features remain available on every page. `js/theme.js` now also tolerates disabled `localStorage`.
- The **My listings** cards now follow the same dark tavern colors as saved favorites and product cards.
- Category filters retain the built-in category order and refresh after Delete / Clear all.
- `browse.js` keeps all original helper functions and event handlers, and the existing static listings remain intact.

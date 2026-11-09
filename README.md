# TTG Marketplace

A responsive website about buying, selling and trading tabletop games (board games, chess, dice and accessories).
The **midterm** version was built with HTML5, CSS and Bootstrap. The **endterm** version adds JavaScript and jQuery
interactivity to the same project.

- **Live site:** https://asleyvv.github.io/web-midterm-3d/Index.html
- **Repository:** https://github.com/asleyvv/web-midterm-3d

## Team

| Member | Endterm part |
| --- | --- |
| Person A | Browse page and JavaScript fundamentals |
| Person B | Forms, validation and theme switcher |
| Person C | jQuery, FAQ, Community page, README and deployment |

Team members: SAILAU DINMUKHAMMED, Duman Zhanybekov, Daniyal Akylbek.
*(Replace "Person A/B/C" with the real names before submitting.)*

## Pages

- `Index.html`: home page, categories, featured listings, how it works.
- `browse.html`: listings built from an array, search, category filter, price sort, favorites list.
- `sell.html`: listing form.
- `community.html`: player groups, filterable game-night schedule, house rules.
- `About.html`: mission, team, story, searchable FAQ accordion.
- `contact.html`: contact form.

All pages share the navigation bar, footer, colors and fonts.

## New endterm features

### Person A: Browse page (`js/data.js`, `js/browse.js`)
- Two arrays: `listings` (project data) and `categories`.
- Cards are created from the array with loops (`forEach`) instead of being written in HTML.
- Search (`input`), category filter and sort (`change`), "Save" button and favorites list (`click`) where items can be added and removed.
- Reusable functions such as `filterListings()` and `sortListings()` return new arrays.

### Person B: Forms and theme (`js/validation.js`, `js/theme.js`)
*(Person B: describe your work here: validated fields, error messages, success message, theme toggle.)*

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
`siblings()` and `children()`; events `click`, `input`, `keydown`, `mouseenter`, `mouseleave` and page start
(`DOMContentLoaded` through `$(function(){})`); effects `slideUp`, `slideDown`, `fadeIn`, `fadeOut`, `toggle` and `animate`.

## How to test

1. Open the live site or `Index.html` locally.
2. **Browse:** type "chess" in the search box, change category and sort, press "Save" on a card, remove it from the saved list.
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

Listings, prices and events are examples. Photos are illustrative (sources in `images/SOURCES.txt`). There are no accounts, purchases, messaging or event registration, and form data is not sent anywhere.

# TTG Marketplace

A responsive frontend midterm project about buying, selling and trading tabletop games. Built with simple HTML5, CSS and bundled Bootstrap CSS.
https://asleyvv.github.io/web-midterm-3d/Index.html
## Team

- SAILAU DINMUKHAMMED
- Duman Zhanybekov
- Daniyal Akylbek

## Pages

- `Index.html`: home page, game categories, featured listings and how it works.
- `browse.html`: six sample listings, expandable descriptions, a comparison table and a condition guide.
- `sell.html`: listing form with category, condition, price, city, description, photo selection and trade preferences.
- `community.html`: player groups, an example weekly events table and community rules.
- `About.html`: project mission, the three team members, project story and FAQ.
- `contact.html`: contact form and useful links.

All six pages share a navigation bar, footer, colors and fonts.

## Implemented features

- Semantic HTML5: header, nav, main, section, article and footer.
- Headings, paragraphs, ordered/unordered lists, links, images and tables.
- Labeled forms with HTML input types, required fields, submit and reset buttons.
- CSS Grid for product and community cards; Flexbox for navigation, steps and footer.
- Relative/absolute positioning for image badges, a sticky header and a fixed back-to-top link.
- Tablet and mobile media queries at 992px and 576px.
- Bootstrap responsive columns and utility classes for spacing, alignment, containers and buttons.
- Native details/summary for listing descriptions, without JavaScript.

## Run locally

Download or clone the repository and open `Index.html` in a browser. No build or package installation is needed. Keep the folders together so CSS and image paths work.

Pages load `css/bootstrap.min.css`, `css/style.css`, `css/pages.css` and `css/responsive.css`. Google Fonts are optional; local system fonts are used when they are unavailable. `Template.html` is the starter template. Root-level `Style.css` and `Resposive.css` are older copies and are not loaded by the pages.

## Prototype limitations

Listings, prices and events are examples. Photos are illustrative; sources are recorded in `images/SOURCES.txt`. There are no accounts, purchases, messaging or event registration.

Sell and Contact submit buttons use native browser validation. After valid submission, the current page reloads; no listing or message is saved or delivered. The form fields have no name attributes, so their values are not included in the submission. Selected photos are not uploaded. Clear form resets the fields.


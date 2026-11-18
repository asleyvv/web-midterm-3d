// Person B: OOP model and localStorage CRUD. Plain browser JavaScript (no build step).
class Listing {
  constructor(data) {
    if (!data || typeof data !== "object") throw new TypeError("Invalid listing");
    this.id = Number(data.id);
    this.title = String(data.title || "").trim();
    this.category = String(data.category || "").trim();
    this.condition = String(data.condition || "").trim();
    this.price = Number(data.price);
    this.city = String(data.city || "").trim();
    this.trade = data.trade === true;
    this.info = String(data.info || "").trim();
    this.slug = String(data.slug || "user-" + this.id);
    this.image = String(data.image || "images/board-games.jpg");
    this.alt = String(data.alt || "Sample tabletop game image");
    if (!Number.isSafeInteger(this.id) || this.id < 1 || !this.title || !this.category ||
        !this.condition || !this.city || !Number.isFinite(this.price) || this.price <= 0 ||
        this.info.length < 10) throw new TypeError("Invalid listing fields");
  }

  matches(text) {
    var query = String(text || "").trim().toLowerCase();
    return (this.title + " " + this.category + " " + this.info).toLowerCase().includes(query);
  }

  priceLabel() {
    return "$" + (Number.isInteger(this.price) ? this.price : this.price.toFixed(2));
  }
}

class ListingStore {
  constructor(key) {
    this.key = key || "userListings"; // retain old key: previously published ads still appear
    this.items = this.load();
  }

  load() {
    try {
      var raw = localStorage.getItem(this.key);
      if (raw === null) return [];
      var values = JSON.parse(raw);
      if (!Array.isArray(values)) return [];
      var seen = new Set();
      return values.reduce(function (valid, value) {
        try {
          var listing = new Listing(value);
          if (!seen.has(listing.id)) {
            seen.add(listing.id);
            valid.push(listing);
          }
        } catch (error) { /* ignore only malformed records */ }
        return valid;
      }, []);
    } catch (error) { // localStorage may be blocked or contain invalid JSON
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.items));
      return true;
    } catch (error) {
      return false;
    }
  }

  getAll() { return this.items.slice(); }
  getById(id) { return this.items.find(function (item) { return item.id === Number(id); }) || null; }

  add(data) {
    var item = new Listing(data);
    if (this.getById(item.id)) return false;
    this.items.unshift(item);
    if (!this.save()) { this.items.shift(); return false; }
    return item;
  }

  update(id, changes) {
    var index = this.items.findIndex(function (item) { return item.id === Number(id); });
    if (index === -1) return false;
    var original = this.items[index];
    var updated = new Listing(Object.assign({}, original, changes, { id: original.id, slug: original.slug }));
    this.items[index] = updated;
    if (!this.save()) { this.items[index] = original; return false; }
    return updated;
  }

  remove(id) {
    var index = this.items.findIndex(function (item) { return item.id === Number(id); });
    if (index === -1) return false;
    var removed = this.items.splice(index, 1)[0];
    if (!this.save()) { this.items.splice(index, 0, removed); return false; }
    return true;
  }

  clear() {
    var previous = this.items;
    this.items = [];
    if (!this.save()) { this.items = previous; return false; }
    return true;
  }
}

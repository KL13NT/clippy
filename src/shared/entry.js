const TYPES = ["image", "text"];
const EXCLUDED = ["pinned", "_id", "selected"]; // excluded from comparison

module.exports = class Entry {
  value = "";
  _id = "";
  type = ""; // Interpretted type
  _type = ""; // This is original MIME type
  pinned = false;
  selected = false;

  constructor({
    type,
    _type,
    value,
    _id = null,
    pinned = false,
    selected = false,
  }) {
    if (!TYPES.includes(type)) throw new Error(`Type must be one of ${TYPES}`);

    this.value = value;
    this.type = type;
    this.pinned = pinned;
    this.selected = selected;
    this._type = _type;
    this._id = _id;
  }

  toString() {
    return this.value;
  }

  compareTo(obj2) {
    return !Object.keys(this).some(
      (key) => this[key] !== obj2[key] && !EXCLUDED.some((k) => key === k),
    );
  }
};

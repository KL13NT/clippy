const TYPES = ["image", "text"];
const EXCLUDED = ["pinned", "_id"]; // excluded from comparison

module.exports = class Entry {
  value = "";
  _id = "";
  type = ""; // Interpretted type
  _type = ""; // This is original MIME type
  pinned = false;

  constructor({ type, _type, value, _id = null, pinned = false }) {
    if (!TYPES.includes(type)) throw new Error(`Type must be one of ${TYPES}`);

    this.value = value;
    this.type = type;
    this.pinned = pinned;
    this._type = _type;
    this._id = _id;
  }

  compareTo(obj2) {
    return !Object.keys(this).some(
      (key) => this[key] !== obj2[key] && !EXCLUDED.some((k) => key === k)
    );
  }
};

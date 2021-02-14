const TYPES = ["image", "text"];
const EXCLUDED = ["pinned", "_id", "selected", "code"]; // excluded from comparison

module.exports = class Entry {
  value = "";
  _id = "";
  type = ""; // Interpretted type
  _type = ""; // This is original MIME type
  pinned = false;
  selected = false;
  code = false;
  _canBeCode = false;

  constructor({
    type,
    _type,
    value,
    _id = null,
    pinned = false,
    selected = false,
    code = false,
  }) {
    if (!TYPES.includes(type)) throw new Error(`Type must be one of ${TYPES}`);
    if (type !== "text" && code) throw new Error(`Only text can be code`);

    if (type === "text") this._canBeCode = true;

    this.value = value;
    this.type = type;
    this.pinned = pinned;
    this.selected = selected;
    this._type = _type;
    this._id = _id;
    this.code = code;
  }

  set code(value = true) {
    if (this.type !== "text" && value) throw new Error(`Entry is not text`);
    else this.code = value;
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

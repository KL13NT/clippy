import _defineProperty from "@babel/runtime/helpers/defineProperty";

/* eslint-disable react/react-in-jsx-scope */
import { ipcRenderer } from "electron";

const Preact = require("preact");

const linkifyHTML = require("linkifyjs/html");

import * as Entry from "./types/entry.js";
import { MESSAGE_CLEAR_BACKEND, MESSAGE_CONFIRM_REMOVE, CLIPBOARD_CLEAR, CLIPBOARD_EVENT, CLIPBOARD_BULK_COPY } from "./constants";

function linkify(text, click) {
  return linkifyHTML(text, {
    events: {
      click
    },
    defaultProtocol: "https",
    target: {
      url: "_blank"
    }
  });
}
/**
 *
 * @param {Object} param0
 * @param {Entry} param0.entry
 * @param {Function} param0.pin
 * @param {Function} param0.copy
 * @param {Function} param0.remove
 * @param {Function} param0.select
 */


const ListEntry = ({
  entry,
  pin,
  copy,
  remove,
  select
}) => {
  return h("li", {
    "data-_id": entry._id,
    "data-selected": entry.selected,
    "data-pinned": entry.pinned,
    style: {
      position: "relative",
      listStyle: "none"
    },
    title: "Click to copy",
    onClickCapture: copy,
    onKeyDown: e => e.code === "Enter" && copy(e),
    tabIndex: 0,
    role: "menuitem"
  }, entry.type === "image" ? h("img", {
    src: entry.value,
    alt: "Copied from clipboard"
  }) : linkify(entry.value, copy), h("div", {
    className: "entry-actions",
    role: "menubar"
  }, h("button", {
    onClickCapture: remove,
    "aria-label": "Delete this entry",
    title: "Delete this entry"
  }, h("img", {
    src: "../../assets/trash-outline.svg",
    alt: "delete icon"
  })), h("button", {
    onClickCapture: pin,
    "aria-label": "Pin this entry",
    title: "Pin this entry",
    "data-active": entry.pinned
  }, h("img", {
    src: "../../assets/bookmark-outline.svg",
    alt: "pin icon"
  })), h("button", {
    onClickCapture: copy,
    "aria-label": "Copy this entry",
    title: "Copy this entry"
  }, h("img", {
    src: "../../assets/clipboard-outline.svg",
    alt: "copy icon"
  })), h("button", {
    onClickCapture: select,
    "aria-label": "Select this entry",
    title: "Select this entry",
    "data-active": entry.selected
  }, h("img", {
    src: "../../assets/checkmark-square-outline.svg",
    alt: "select icon"
  }))));
};

class App extends Preact.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleKeyDown", ({
      code,
      ctrlKey,
      shiftKey
    }) => {
      if (/Shift/gi.test(code) && !this.state.selecting) this.setState({ ...this.state,
        selecting: true
      }); // Delete pressed

      if (code === "Delete") if (ctrlKey) {
        if (shiftKey) // Ctrl pressed
          // Combination of CTRL + SHIFT + DELETE
          this.clearHistory(); // Combination of CTRL + DELETE
        else this.clearClipboard(); // Delete

      } else if (this.isSelecting()) this.deleteSelection();
      if (code === "KeyC" && ctrlKey) if (this.isSelecting()) this.copySelectionButtonRef.current.click();
    });

    _defineProperty(this, "handleKeyUp", ({
      code
    }) => {
      if (/Shift/gi.test(code) && !this.state.history.some(e => e.selected)) this.setState({ ...this.state,
        selecting: false
      });
    });

    _defineProperty(this, "handleKeyUpClick", () => {
      if (this.state.selecting) this.setState({ ...this.state,
        history: this.state.history.map(entry => new Entry({ ...entry,
          selected: false
        })),
        selecting: false
      });
    });

    _defineProperty(this, "handleClipboardEvent", (ev, entry) => {
      const {
        history
      } = this.state; // if you really want a performance boost out of this you could
      // switch `history` to an object instead, O(1) search by id

      if (!history.some(e => e.compareTo(entry))) this.setState({ ...this.state,
        history: [...history, new Entry(entry)] // Convert serialized entry object into Entry again

      });
    });

    _defineProperty(this, "clearHistory", async () => {
      if (confirm(MESSAGE_CLEAR_BACKEND)) await this.clearClipboard();
      this.setState({ ...this.state,
        history: this.state.history.filter(e => e.pinned)
      });
    });

    _defineProperty(this, "clearClipboard", () => {
      return ipcRenderer.invoke(CLIPBOARD_CLEAR).then(() => {
        alert("Cleared your clipboard!");
      });
    });

    _defineProperty(this, "remove", ev => {
      const {
        _id
      } = ev.currentTarget.parentNode.parentNode.dataset; // The pinging on the backend will always signal to display what's currently stored on the clipboard.
      // Leaving the user confused is not part of the deal.

      if (confirm(MESSAGE_CONFIRM_REMOVE)) {
        console.log("confirmed");
        this.setState({ ...this.state,
          history: this.state.history.filter(entry => entry._id !== _id)
        });
      }
    });

    _defineProperty(this, "copy", ev => {
      const {
        target,
        currentTarget
      } = ev; // Make sure to not copy links and leave their handling to the backend

      if (target.tagName.toLowerCase() !== "a") {
        ev.preventDefault();
        const {
          _id
        } = this.getEntryListItem(currentTarget).dataset;
        const index = this.state.history.findIndex(e => e._id === _id);
        if (!this.isSelecting()) ipcRenderer.send(CLIPBOARD_EVENT, this.state.history[index]);else {
          const history = Array.from(this.state.history);
          if (history[index].type !== "text") alert("Fatal: Can only bulk copy text entries");else {
            history[index].selected = !history[index].selected;
            this.setState({ ...this.state,
              history
            });
          }
        }
        ev.stopPropagation();
      }
    });

    _defineProperty(this, "getEntryListItem", el => {
      let parent = el;

      while (parent.tagName !== "LI") parent = parent.parentNode;

      return parent;
    });

    _defineProperty(this, "pin", ev => {
      const {
        _id
      } = this.getEntryListItem(ev.currentTarget).dataset;
      const indexOfEntry = this.state.history.findIndex(e => e._id === _id);
      const history = Array.from(this.state.history);
      history[indexOfEntry].pinned = !history[indexOfEntry].pinned;
      this.setState({ ...this.history,
        history
      });
    });

    _defineProperty(this, "copySelection", () => {
      const merged = this.state.history.filter(e => e.selected).join("\r\n");
      ipcRenderer.send(CLIPBOARD_BULK_COPY, merged);
    });

    _defineProperty(this, "deleteSelection", ev => {
      if (ev) ev.preventDefault();
      const {
        length
      } = this.state.history.filter(e => e.selected);
      this.setState({ ...this.state,
        history: this.state.history.filter(e => !e.selected)
      }, () => {
        alert(`Deleted ${length} entries.`);
      });
    });

    _defineProperty(this, "isSelecting", () => {
      return this.isSelectingShift() || this.isAnyEntrySelected();
    });

    _defineProperty(this, "isSelectingShift", () => {
      return this.state.selecting;
    });

    _defineProperty(this, "isAnyEntrySelected", () => {
      return this.state.history.some(e => e.selected);
    });

    _defineProperty(this, "select", ev => {
      const {
        _id
      } = ev.currentTarget.parentNode.parentNode.dataset;
      const index = this.state.history.findIndex(e => e._id === _id);
      const history = Array.from(this.state.history);
      history[index].selected = !history[index].selected;
      this.setState({ ...this.state,
        selecting: true,
        history
      }, () => console.log(this.state.history[0].selected));
    });

    this.state = {
      /** @type {import('./types/entry')[]} */
      history: [],
      selectingToggle: false,
      selecting: false
    };
    this.copySelectionButtonRef = Preact.createRef();
  }
  /**
   * @param {KeyboardEvent} param0
   */


  componentDidMount() {
    document.addEventListener("click", this.handleKeyUpClick);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);
    ipcRenderer.on(CLIPBOARD_EVENT, this.handleClipboardEvent);
  }

  render() {
    return h(Fragment, null, h("div", {
      style: {
        display: "flex"
      }
    }, h("button", {
      onClick: this.clearHistory
    }, "Clear log"), h("button", {
      onClick: this.clearClipboard
    }, "Clear clipboard only"), h("button", {
      onClick: this.copySelection,
      disabled: !this.isAnyEntrySelected()
    }, "Copy selection"), h("button", {
      onClick: this.deleteSelection,
      disabled: !this.isAnyEntrySelected()
    }, "Delete selection")), h("div", {
      style: {
        margin: "8px 0"
      }
    }, this.state.history.length === 0 && "Free as the wind~", this.state.history.length === 1 && "There is 1 entry in the clipboard.", this.state.history.length > 1 && `There are ${this.state.history.length} entries in the clipboard.`), h("ul", {
      "data-selecting": this.state.selecting,
      role: "menu"
    }, Array.from(this.state.history).filter(e => e.pinned).reverse().map(entry => h(ListEntry, {
      key: entry._id,
      entry: entry,
      pin: this.pin,
      copy: this.copy,
      remove: this.remove,
      select: this.select
    })), Array.from(this.state.history).filter(e => !e.pinned).reverse().map(entry => h(ListEntry, {
      key: entry._id,
      entry: entry,
      pin: this.pin,
      copy: this.copy,
      remove: this.remove,
      select: this.select
    }))));
  }

}

const container = document.querySelector("#container");
Preact.render(h(App, null), container);
/* eslint-disable react/react-in-jsx-scope */
/** @import * from "./shared/typedefs.js" */

const { ipcRenderer } = require("electron");

const Preact = require("preact");
const ReactMarkdown = require("react-markdown");
const SelectionArea = require("@simonwep/selection-js/lib/selection.min");
const Linkify = require("linkifyjs/react");
const SyntaxHighlighter = require("react-syntax-highlighter").default;
const {
  atomOneDark,
} = require("react-syntax-highlighter/dist/esm/styles/hljs");

const { useState, useEffect } = require("preact/hooks");

const Entry = require("./shared/entry");

const {
  MESSAGE_CLEAR_BACKEND,
  MESSAGE_CONFIRM_REMOVE,
  CLIPBOARD_CLEAR,
  CLIPBOARD_EVENT,
  CLIPBOARD_BULK_COPY,
  OPEN_ABOUT_PAGE,
  UPDATE_AVAILABLE,
  UPDATE_APPLY,
} = require("./shared/constants");

const linkifyOptions = (copy) => ({
  events: {
    click: copy,
  },
  defaultProtocol: "https",
  target: {
    url: "_blank",
  },
});

/**
 *
 * @param {Object} param0
 * @param {Entry} param0.entry
 * @param {Function} param0.pin
 * @param {Function} param0.copy
 * @param {Function} param0.remove
 * @param {Function} param0.select
 */
const ListEntry = ({ entry, pin, copy, remove, select, setAsCode }) => {
  const content = entry.code ? (
    <SyntaxHighlighter style={atomOneDark} wrapLines wrapLongLines>
      {entry.value.trim()}
    </SyntaxHighlighter>
  ) : entry.type === "text" ? (
    <Linkify options={linkifyOptions(copy)}>{entry.value.trim()}</Linkify>
  ) : (
    <img src={entry.value.trim()} alt="Copied from clipboard" />
  );

  return (
    <li
      data-_id={entry._id}
      data-selected={entry.selected}
      data-pinned={entry.pinned}
      data-code={entry.code}
      style={{ position: "relative", listStyle: "none" }}
      title="Click to copy"
      onClick={copy}
      onKeyDown={(e) => e.code === "Enter" && copy(e)}
      tabIndex={0}
      role="menuitem"
    >
      {content}
      <div className="entry-actions" role="menubar">
        <button
          onClick={setAsCode}
          aria-label="Display this entry as code"
          title="Display this entry as code"
          data-active={entry.code}
          disabled={!entry._canBeCode}
        >
          <img src="../assets/code-outline.svg" alt="code icon" />
        </button>
        <button
          onClick={remove}
          aria-label="Delete this entry"
          title="Delete this entry"
        >
          <img src="../assets/trash-outline.svg" alt="delete icon" />
        </button>
        <button
          onClick={pin}
          aria-label="Pin this entry"
          title="Pin this entry"
          data-active={entry.pinned}
        >
          <img src="../assets/bookmark-outline.svg" alt="pin icon" />
        </button>
        <button
          onClick={copy}
          aria-label="Copy this entry"
          title="Copy this entry"
        >
          <img src="../assets/clipboard-outline.svg" alt="copy icon" />
        </button>
        <button
          onClick={select}
          aria-label="Select this entry"
          title="Select this entry"
          data-active={entry.selected}
        >
          <img src="../assets/checkmark-square-outline.svg" alt="select icon" />
        </button>
      </div>
    </li>
  );
};

const Updater = () => {
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    ipcRenderer.on(UPDATE_AVAILABLE, () => {
      setUpdateAvailable(true);
    });
  }, []);

  const update = () => {
    ipcRenderer.send(UPDATE_APPLY);
  };

  if (!isUpdateAvailable) return null;
  return (
    <button
      aria-label="Download update"
      title="An update is available!"
      className="update"
      onClick={update}
    >
      <img src="../assets/cloud-download-outline.svg" alt="Download update" />
    </button>
  );
};

const searchTutorial = `
\`image: png\` to search for PNG images

\`image: webp\` to search for WEBP images

\`image: jpeg\` to search for JPEG images

\`image: <any valid image MIME subtype>\` to search for other formats

\`text: some text\` to search for text

Or just type text directly!`;

// eslint-disable-next-line react/no-children-prop
const SearchTutorial = () => <ReactMarkdown children={searchTutorial} />;

class App extends Preact.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** @type {import('./types/entry')[]} */
      history: [],
      selectingToggle: false,
      selecting: false,
      search: "",
    };

    this.copySelectionButtonRef = Preact.createRef();

    const selection = new SelectionArea({
      document: window.document,
      class: "selection-area",
      container: "ul[role='menu']",
      selectables: ["ul[role='menu'] > li[role='menuitem']"],
      startareas: ["html"],
      boundaries: ["html"],
      startThreshold: 0,
      allowTouch: true,
      intersect: "touch",
      overlap: "invert",
      singleTap: {
        allow: true,
        intersect: "native",
      },
      scrolling: {
        speedDivider: 10,
        manualSpeed: 750,
      },
    })
      .on("beforestart", ({ event: { shiftKey: withShiftKey } }) => {
        const entries = this.state.history.filter(this.getSearchFilter());

        /* There are no entries in history
         no need for allowing selection, return false */
        if (entries.length === 0) return false;
        if (withShiftKey) return false;

        document.body.style.userSelect = "none";
      })
      .on("start", () => {
        // Clear all previously selected items
        selection.clearSelection();
        this.setState({
          ...this.state,
          history: this.state.history.map(
            (entry) =>
              new Entry({
                ...entry,
                selected: false,
              }),
          ),
          // Selection starts
          selecting: true,
        });
      })
      .on(
        "move",
        ({
          store: {
            changed: { added: selectedEntries, removed: unselectedEntries },
          },
        }) => {
          if (selectedEntries.length === 0 && unselectedEntries.length === 0)
            return;

          for (const entry of [selectedEntries, unselectedEntries].flat()) {
            const { _id } = entry.dataset;

            const index = this.state.history.findIndex((e) => e._id === _id);

            const history = Array.from(this.state.history);
            history[index].selected = !history[index].selected;

            this.setState({ ...this.state, history });
          }
        },
      )
      .on("stop", () => {
        this.setState({ ...this.state, selecting: false });

        document.body.style.userSelect = "unset";
      });
  }

  /**
   * @param {KeyboardEvent} param0
   */
  handleKeyDown = ({ code, ctrlKey, shiftKey }) => {
    if (/Shift/gi.test(code) && !this.state.selecting)
      this.setState({
        ...this.state,
        selecting: true,
      });

    // Delete pressed
    if (code === "Delete")
      if (ctrlKey)
        if (shiftKey)
          // Ctrl pressed
          // Combination of CTRL + SHIFT + DELETE
          this.clearHistory();
        // Combination of CTRL + DELETE
        else this.clearClipboard();
      // Delete
      else if (this.isSelecting()) this.deleteSelection();

    if (code === "KeyC" && ctrlKey)
      if (this.isSelecting()) this.copySelection();
  };

  /**
   * @param {KeyboardEvent} param0
   */
  handleKeyUp = ({ code }) => {
    if (/Shift/gi.test(code) && !this.state.history.some((e) => e.selected))
      this.setState({
        ...this.state,
        selecting: false,
      });
  };

  /**
   * Handles clicks outside entries list when selecting
   */
  handleKeyUpClick = () => {
    if (this.state.selecting)
      this.setState({
        ...this.state,
        history: this.state.history.map(
          (entry) =>
            new Entry({
              ...entry,
              selected: false,
            }),
        ),
        selecting: false,
      });
  };

  /**
   * Handles keyboard polling
   * @param {Electron.IpcMessageEvent} ev
   * @param {Object} entry
   */
  handleClipboardEvent = (ev, entry) => {
    const { history } = this.state;

    // if you really want a performance boost out of this you could
    // switch `history` to an object instead, O(1) search by id
    if (!history.some((e) => e.compareTo(entry)))
      this.setState({
        ...this.state,
        history: [...history, new Entry(entry)], // Convert serialized entry object into Entry again
      });
  };

  componentDidMount() {
    document.addEventListener("click", this.handleKeyUpClick);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);

    ipcRenderer.on(CLIPBOARD_EVENT, this.handleClipboardEvent);
  }

  clearHistory = async () => {
    if (confirm(MESSAGE_CLEAR_BACKEND)) await this.clearClipboard();

    this.setState({
      ...this.state,
      history: this.state.history.filter((e) => e.pinned),
    });
  };

  clearClipboard = () => {
    return ipcRenderer.invoke(CLIPBOARD_CLEAR).then(() => {
      alert("Cleared your clipboard!");
    });
  };

  /**
   * @param {UIEvent} ev
   */
  remove = (ev) => {
    ev.stopPropagation();

    const { _id } = ev.currentTarget.parentNode.parentNode.dataset;

    // The pinging on the backend will always signal to display what's currently stored on the clipboard.
    // Leaving the user confused is not part of the deal.
    if (confirm(MESSAGE_CONFIRM_REMOVE))
      this.setState({
        ...this.state,
        history: this.state.history.filter((entry) => entry._id !== _id),
      });
  };

  /**
   * @param {UIEvent} ev
   */
  copy = (ev) => {
    const { target, currentTarget } = ev;

    // Make sure to not copy links and leave their handling to the backend
    if (target.tagName.toLowerCase() !== "a") {
      ev.preventDefault();
      const { _id } = this.getEntryListItem(currentTarget).dataset;
      const index = this.state.history.findIndex((e) => e._id === _id);

      if (!this.isSelecting())
        ipcRenderer.send(CLIPBOARD_EVENT, this.state.history[index]);
      else {
        const history = Array.from(this.state.history);

        if (history[index].type !== "text")
          alert("Fatal: Can only bulk copy text entries");
        else {
          history[index].selected = !history[index].selected;

          this.setState({
            ...this.state,
            history,
          });
        }
      }

      ev.stopPropagation();
    }
  };

  /**
   *
   * @param {Element} el
   */
  getEntryListItem = (el) => {
    let parent = el;

    while (parent.tagName !== "LI") parent = parent.parentNode;

    return parent;
  };

  /**
   * @param {UIEvent} ev
   */
  pin = (ev) => {
    ev.stopPropagation();
    const { _id } = this.getEntryListItem(ev.currentTarget).dataset;
    const indexOfEntry = this.state.history.findIndex((e) => e._id === _id);

    const history = Array.from(this.state.history);
    history[indexOfEntry].pinned = !history[indexOfEntry].pinned;

    this.setState({
      ...this.history,
      history,
    });
  };

  /**
   * @param {UIEvent} ev
   */
  copySelection = () => {
    const merged = this.state.history.filter((e) => e.selected).join("\r\n");

    ipcRenderer.send(CLIPBOARD_BULK_COPY, merged);
  };

  /**
   * @param {UIEvent} ev
   */
  deleteSelection = (ev) => {
    if (ev) ev.preventDefault();

    const { length } = this.state.history.filter((e) => e.selected);
    this.setState(
      {
        ...this.state,
        history: this.state.history.filter((e) => !e.selected),
      },
      () => {
        alert(`Deleted ${length} entries.`);
      },
    );
  };

  isSelecting = () => {
    return this.isSelectingShift() || this.isAnyEntrySelected();
  };

  isSelectingShift = () => {
    return this.state.selecting;
  };

  isAnyEntrySelected = () => {
    return this.state.history.some((e) => e.selected);
  };

  /**
   * @param {UIEvent} ev
   */
  select = (ev) => {
    ev.stopPropagation();
    const { _id } = ev.currentTarget.parentNode.parentNode.dataset;

    const index = this.state.history.findIndex((e) => e._id === _id);

    const history = Array.from(this.state.history);
    history[index].selected = !history[index].selected;

    this.setState({ ...this.state, selecting: true, history });
  };

  /**
   * @param {UIEvent} ev
   */
  setAsCode = (ev) => {
    ev.stopPropagation();
    const { _id } = ev.currentTarget.parentNode.parentNode.dataset;

    const index = this.state.history.findIndex((e) => e._id === _id);

    const history = Array.from(this.state.history);
    history[index].code = !history[index].code;

    this.setState({ ...this.state, history });
  };

  openAboutPage = () => ipcRenderer.send(OPEN_ABOUT_PAGE);

  getSearchFilter = () => {
    const { search } = this.state;

    // Helpers
    const unfiltered = () => true;
    /** @type {string} */
    const isOfType = (type) => (entry) => entry.type === type;
    /** @type {string} */
    const isOfMimeType = (type) => (entry) => entry._type === type;

    // No input - return everything
    if (!search) return unfiltered;

    // No label - search by text (default)
    if (!search.includes(":"))
      return (entry) => isOfType("text")(entry) && entry.value.includes(search);
    else {
      // Splitting the string on ":" to get label and value (search = label: value)
      const [label, value] = search
        ?.split(":")
        ?.map((element) => element.trim());

      if (label === "text")
        //TODO improve searching
        return (entry) =>
          isOfType("text")(entry) && entry.value.includes(value);

      if (label === "image")
        return (entry) =>
          isOfType("image")(entry) &&
          (isOfMimeType(value)(entry) || isOfMimeType(`image/${value}`)(entry));

      // Provided label did't match any case - return everything
      return unfiltered;
    }
  };

  render() {
    const { selecting, history } = this.state;

    /** @type Entry[]*/
    const copy = history.filter(this.getSearchFilter());
    const pinned = copy.filter((e) => e.pinned).reverse();
    const nonpinned = copy.filter((e) => !e.pinned).reverse();

    return (
      <Preact.Fragment>
        <nav className="navbar">
          <button onClick={this.openAboutPage}>About</button>
          <div id="search">
            <input
              type="text"
              placeholder="Search for an element with text:lorem or image:png"
              value={this.state.search}
              onChange={(e) =>
                this.setState({ ...this.state, search: e.target.value })
              }
            />
            <div id="search-tutorial">
              <SearchTutorial />
            </div>
          </div>
          <div>
            <Updater />
            <span>
              {history.length === 0 && "Free as the wind"}
              {history.length === 1 && "1 Entry"}
              {history.length > 1 && `${history.length} Entries`}
            </span>
          </div>
        </nav>
        <div style={{ display: "flex" }}>
          <button onClick={this.clearHistory}>Clear log</button>
          <button onClick={this.clearClipboard}>Clear clipboard only</button>
          <button
            onClick={this.copySelection}
            disabled={!this.isAnyEntrySelected()}
          >
            Copy selection
          </button>
          <button
            onClick={this.deleteSelection}
            disabled={!this.isAnyEntrySelected()}
          >
            Delete selection
          </button>
        </div>
        <ul data-selecting={selecting} role="menu">
          {pinned.map((entry) => (
            <ListEntry
              key={entry._id}
              entry={entry}
              pin={this.pin}
              copy={this.copy}
              remove={this.remove}
              select={this.select}
              setAsCode={this.setAsCode}
            />
          ))}

          {nonpinned.map((entry) => (
            <ListEntry
              key={entry._id}
              entry={entry}
              pin={this.pin}
              copy={this.copy}
              remove={this.remove}
              select={this.select}
              setAsCode={this.setAsCode}
            />
          ))}
        </ul>
      </Preact.Fragment>
    );
  }
}

const container = document.querySelector("#container");
Preact.render(<App />, container);

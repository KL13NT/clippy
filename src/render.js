const { ipcRenderer } = require("electron");

const Preact = require("preact");
const htm = require("htm");
const linkifyHTML = require("linkifyjs/html");

const Entry = require("./types/Entry");

const {
  MESSAGE_CLEAR_BACKEND,
  MESSAGE_CONFIRM_REMOVE,
  CLIPBOARD_CLEAR,
  CLIPBOARD_EVENT,
  CLIPBOARD_BULK_COPY,
} = require("./constants");

const html = htm.bind(Preact.h);
const container = document.querySelector("#container");

function linkify(text, click) {
  return linkifyHTML(text, {
    events: {
      click,
    },
    defaultProtocol: "https",
    target: {
      url: "_blank",
    },
  });
}

/**
 *
 * @param {Object} param0
 * @param {Entry} param0.entry
 * @param {Function} param0.pin
 * @param {Function} param0.copy
 * @param {Function} param0.remove
 */
const ListEntry = ({ entry, pin, copy, remove }) => html`<li
  data-_id=${entry._id}
  data-selected=${entry.selected}
  style="position: relative; list-style: none;"
  title="Click to copy"
  onClick=${copy}
  key=${entry._id}
  onContextMenu=${remove}
>
  ${entry.type === "image"
    ? html`<img src=${entry.value} />`
    : html([linkify(entry.value, copy)])}

  <button
    onClick=${pin}
    aria-label="Pin this entry"
    class="pin"
    title="Pin this entry"
  >
    ${entry.pinned
      ? html`<img src="./push-pinned.svg" alt="pin icon" />`
      : html`<img src="./push-pin.svg" alt="pin icon" />`}
  </button>
</li>`;

class App extends Preact.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** @type {Entry[]} */
      history: [],
      selecting: false,
    };
  }

  handleKeyDownShift = ({ code }) => {
    document.addEventListener("keyup", this.handleKeyUpShift);

    if (/Shift/gi.test(code)) {
      this.setState({
        ...this.state,
        selecting: true,
      });
    }
  };

  handleKeyUpShift = ({ code }) => {
    document.removeEventListener("keyup", this.handleKeyUpShift);
    document.addEventListener("click", this.handleKeyUpClick);

    if (/Shift/gi.test(code) && !this.state.history.some((e) => e.selected)) {
      this.setState({
        ...this.state,
        selecting: false,
      });
    }
  };

  handleKeyUpClick = () => {
    this.setState({
      ...this.state,
      history: this.state.history.map(
        (entry) =>
          new Entry({
            ...entry,
            selected: false,
          })
      ),
      selecting: false,
    });

    document.removeEventListener("click", this.handleKeyUpClick);
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDownShift);

    ipcRenderer.on(CLIPBOARD_EVENT, (ev, entry) => {
      // Entry here is gonna be a simple javascript object because electron
      // serialises IPC messages, so I convert it back
      const { history } = this.state;

      // TODO: if you really want a performance boost out of this you could
      // switch `history` to an object instead, O(1) search by id
      if (!history.some((e) => e.compareTo(entry)))
        this.setState({
          ...this.state,
          history: [...history, new Entry(entry)],
        });
    });
  }

  clearHistory = () => {
    this.setState({
      ...this.state,
      history: this.state.history.filter((e) => !e.pinned),
    });

    if (confirm(MESSAGE_CLEAR_BACKEND)) this.clearClipboard();
  };

  clearClipboard = () => {
    ipcRenderer.invoke(CLIPBOARD_CLEAR).then(() => {
      alert("Cleared your clipboard!");
    });
  };

  /**
   * @param {UIEvent} param0
   */
  remove = ({ currentTarget }) => {
    const { _id } = currentTarget.dataset;

    // The pinging on the backend will always signal to display what's currently stored on the clipboard.
    // Leaving the user confused is not part of the deal.
    if (confirm(MESSAGE_CONFIRM_REMOVE)) {
      this.setState({
        ...this.state,
        history: this.state.history.filter((entry) => entry._id !== _id),
      });
    }
  };

  /**
   * @param {UIEvent} e
   */
  copy = (e) => {
    e.preventDefault();
    const { target, currentTarget } = e;

    // Make sure to not copy links and leave their handling to the backend
    if (target.tagName.toLowerCase() !== "a") {
      const { _id } = currentTarget.dataset;
      const indexOfEntry = this.state.history.findIndex((e) => e._id === _id);

      if (!this.state.selecting)
        ipcRenderer.send(CLIPBOARD_EVENT, this.state.history[indexOfEntry]);
      else {
        const history = Array.from(this.state.history);

        if (history[indexOfEntry].type !== "text") {
          alert("Fatal: Can only bulk copy text entries");
          return;
        }

        history[indexOfEntry].selected = !history[indexOfEntry].selected;

        this.setState({
          ...this.state,
          history,
        });
      }
    }

    e.stopPropagation();
  };

  /**
   * @param {UIEvent} e
   */
  pin = (e) => {
    const { currentTarget } = e;
    const { _id } = currentTarget.parentNode.dataset;
    const indexOfEntry = this.state.history.findIndex((e) => e._id === _id);
    const history = Array.from(this.state.history);

    history[indexOfEntry].pinned = !history[indexOfEntry].pinned;

    this.setState({
      ...this.history,
      history,
    });

    e.stopPropagation();
  };

  copySelection = (e) => {
    e.preventDefault();
    const merged = this.state.history.filter((e) => e.selected).join("\r\n");

    ipcRenderer.send(CLIPBOARD_BULK_COPY, merged);
  };

  render(props, state) {
    const enableCopySelection =
      this.state.selecting && this.state.history.some((e) => e.selected);

    return html`
      <div style="display: flex">
        <button onClick=${this.clearHistory}>Clear log</button>
        <button onClick=${this.clearClipboard}>Clear clipboard only</button>
        <button onClick=${this.copySelection} disabled=${!enableCopySelection}>
          Copy selection
        </button>
      </div>
      ${state.history.length == 0 && "Free as the wind~"}
      <ul data-selecting=${this.state.selecting}>
        ${Array.from(state.history)
          .filter((e) => e.pinned)
          .reverse()
          .map(
            (entry) =>
              html`<${ListEntry}
                entry=${entry}
                pin=${this.pin}
                copy=${this.copy}
                remove=${this.remove}
              />`
          )}
        ${Array.from(state.history)
          .filter((e) => !e.pinned)
          .reverse()
          .map(
            (entry) =>
              html`<${ListEntry}
                entry=${entry}
                pin=${this.pin}
                copy=${this.copy}
                remove=${this.remove}
              />`
          )}
      </ul>
    `;
  }
}

Preact.render(html`<${App} />`, container);

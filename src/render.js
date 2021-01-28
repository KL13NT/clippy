const { ipcRenderer } = require("electron");

const Preact = require("preact");
const htm = require("htm");
const linkifyHTML = require("linkifyjs/html");

const {
  MESSAGE_CLEAR_BACKEND,
  MESSAGE_CONFIRM_REMOVE,
  CLIPBOARD_CLEAR,
  CLIPBOARD_EVENT,
} = require("./constants");
const Entry = require("./types/Entry");

const html = htm.bind(Preact.h);

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
 * @typedef {Object} State
 * @property {Entry[]} State.history
 */

class App extends Preact.Component {
  constructor(props) {
    super(props);
    /** @type {State} */
    this.state = { history: [] };
  }

  componentDidMount() {
    ipcRenderer.on(CLIPBOARD_EVENT, (ev, entry) => {
      // Entry here is gonna be a simple javascript object because electron
      // serialises IPC messages, so I convert it back
      const { history } = this.state;

      // TODO: if you really want a performance boost out of this you could
      // switch `history` to an object instead, O(1) search by id
      if (!history.some((e) => e.compareTo(entry)))
        this.setState({
          history: [...history, new Entry(entry)],
        });
    });
  }

  clearHistory = () => {
    if (confirm(MESSAGE_CLEAR_BACKEND))
      ipcRenderer.invoke(CLIPBOARD_CLEAR).then(() => {
        this.setState({ history: [] });
      });
    else this.setState({ history: [] });
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
        history: this.state.history.filter((entry) => entry._id !== _id),
      });
    }
  };

  /**
   * @param {UIEvent} e
   */
  copy = (e) => {
    const { target, currentTarget } = e;

    // Make sure to not copy links and leave their handling to the backend
    if (target.tagName.toLowerCase() !== "a") {
      const { _id } = currentTarget.dataset;
      const entry = this.state.history.find((e) => e._id === _id);

      ipcRenderer.send(CLIPBOARD_EVENT, entry);
    }

    e.stopPropagation();
  };

  render(props, state) {
    return html`
      <div style="display: flex">
        <button onClick=${this.clearHistory}>Clear log</button>
        <button onClick=${this.clearClipboard}>Clear clipboard only</button>
      </div>
      ${state.history.length == 0 && "Free as the wind~"}
      <ul>
        ${Array.from(state.history)
          .reverse()
          .map(
            (entry) =>
              html`<li
                data-_id=${entry._id}
                style="position: relative; list-style: none;"
                title="Click to copy"
                onClick=${this.copy}
                onContextMenu=${this.remove}
              >
                ${entry.type === "image"
                  ? html`<img src=${entry.value} />`
                  : html([linkify(entry.value, this.copy)])}
              </li>`
          )}
      </ul>
    `;
  }
}

const container = document.querySelector("#container");
Preact.render(html`<${App} />`, container);

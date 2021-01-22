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

function isEqual(obj1 = {}, obj2 = {}) {
  return !Object.keys(obj1).some((key) => obj1[key] !== obj2[key]);
}

class App extends Preact.Component {
  constructor(props) {
    super(props);
    this.state = { history: [] };
  }

  componentDidMount() {
    ipcRenderer.on(CLIPBOARD_EVENT, (ev, entry) => {
      const { history } = this.state;

      if (!history.some((e) => isEqual(e, entry)))
        this.setState({
          history: [...history, entry],
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
    const { value, type } = currentTarget.dataset;

    // The pinging on the backend will always signal to display what's currently stored on the clipboard.
    // Leaving the user confused is not part of the deal.
    if (confirm(MESSAGE_CONFIRM_REMOVE)) {
      this.setState({
        history: this.state.history.filter(
          (entry) => !(entry.type === type && entry.value === value)
        ),
      });
    }
  };

  /**
   * @param {UIEvent} e
   */
  copy = (e) => {
    const { target, currentTarget } = e;

    if (target.tagName.toLowerCase() === "a") {
      // Handles embedded links inside copied text
      ipcRenderer.send(CLIPBOARD_EVENT, {
        type: "text",
        value: target.getAttribute("href"),
      });
    } else {
      const { value, type } = currentTarget.dataset;

      ipcRenderer.send(CLIPBOARD_EVENT, { value, type });
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
                data-value=${entry.value}
                data-type=${entry.type}
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

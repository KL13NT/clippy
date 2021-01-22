const { ipcRenderer } = require("electron");

const Preact = require("preact");
const htm = require("htm");

const {
  MESSAGE_CLEAR_BACKEND,
  MESSAGE_CONFIRM_REMOVE,
  CLIPBOARD_CLEAR,
  CLIPBOARD_EVENT,
} = require("./constants");

const h = htm.bind(Preact.h);

class App extends Preact.Component {
  constructor(props) {
    super(props);
    this.state = { history: [] };
  }

  componentDidMount() {
    ipcRenderer.on(CLIPBOARD_EVENT, (ev, type, value) => {
      if (
        !this.state.history.some(
          (entry) => entry.type === type && entry.value === value
        )
      )
        this.setState({
          history: [
            ...this.state.history,
            {
              type,
              value,
            },
          ],
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
   * @param {UIEvent} param0
   */
  copy = ({ currentTarget }) => {
    const { value, type } = currentTarget.dataset;
    ipcRenderer.send(CLIPBOARD_EVENT, type, value);

    alert("Copied!");
  };

  render(props, state) {
    return h`
      <div style="display: flex">
        <button onClick=${this.clearHistory}>Clear log</button>
        <button onClick=${this.clearClipboard}>Clear clipboard only</button>
      </div>
      <ul>
        ${state.history.length == 0 && "Free as the wind~"}
        ${Array.from(state.history)
          .reverse()
          .map((entry) => {
            return h`
              <li
                data-value=${entry.value}
                data-type=${entry.type}
                style="position: relative; listStyle: none;"
                title="Click to copy"
                onClick=${this.copy}
                onContextMenu=${this.remove}
              >
                ${
                  entry.type === "image"
                    ? h`<img src=${entry.value} />`
                    : h`${entry.value}`
                }
              </li>
            `;
          })}
      </ul>
    `;
  }
}

const container = document.querySelector("#container");
Preact.render(h`<${App} />`, container);

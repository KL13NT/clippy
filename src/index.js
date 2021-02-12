const isDev = require("electron-is-dev");
const path = require("path");
const {
  app,
  BrowserWindow,
  clipboard,
  Tray,
  dialog,
  shell,
  ipcMain,
  nativeImage,
  Menu,
} = require("electron");
const { nanoid } = require("nanoid");
const { pathToFileURL } = require("url");

const Entry = require("./shared/entry");
const {
  CLIPBOARD_EVENT,
  CLIPBOARD_CLEAR,
  CLIPBOARD_BULK_COPY,
} = require("./shared/constants");

app.setLoginItemSettings({
  openAtLogin: true,
});

if (require("electron-squirrel-startup")) app.quit();

/**
 * defining tray globally to avoid GC bug
 * https://www.electronjs.org/docs/faq#my-apps-windowtray-disappeared-after-a-few-minutes
 * @type {Tray} */
let tray = null;

/** @type {Electron.BrowserWindowConstructorOptions} */
const DEFAULT_WINDOW_OPTIONS = {
  enableLargerThanScreen: false,
  center: true,
  icon: path.resolve(__dirname, "./structure.png"),
  webPreferences: {
    nodeIntegration: true, // Enables require syntax
    backgroundThrottling: true, // Throttles background animations and intervals to save power
  },
};

/** @type {Electron.BrowserWindowConstructorOptions} */
const DEFAULT_PAGE_OPTIONS = {
  ...DEFAULT_WINDOW_OPTIONS,
  width: 600,
  height: 600,
  modal: true,
  resizable: true,
  skipTaskbar: true,
  autoHideMenuBar: true,
  titleBarStyle: "hidden",
};

/** @type {BrowserWindow} */
let mainWindow = null;
/** @type {BrowserWindow} */
let aboutWindow = null;

const minimize = () => {
  mainWindow.hide();
  tray.displayBalloon({
    iconType: "info",
    largeIcon: false,
    title: "Clippy",
    content: "Clippy has been minimized to tray!",
  });
};

/**
 * @param {Event} e
 */
const handleMinimize = (e) => {
  e.preventDefault();
  minimize();
};

/**
 * Shows and gives focus to the window on tray click
 */
const maximize = () => {
  mainWindow.maximize();
};

/**
 * Clears the system's clipboard
 */
const clear = () => {
  clipboard.clear();
};

const confirmExit = () => {
  const choice = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    buttons: ["Yes", "No", "Minimize Instead"],
    title: "Confirm",
    message: "Are you sure you want to quit?",
    noLink: true,
    cancelId: 1,
  });

  if (choice === 0) app.exit(0);
  else if (choice === 2) minimize();
};

/**
 * @param {Event} e
 */
const handleExit = (e) => {
  e.preventDefault();
  confirmExit();
};

/**
 * Pings the system's clipboard to check whether a value is present, and if so,
 * sends it to the render process either as DataURL in the case of images, or
 * simple text otherwise
 */
const pingClipboardChanges = () => {
  const getVal = (type, clip) =>
    type === "image" ? clip.readImage().toDataURL() : clip.readText();

  const pinging = setInterval(() => {
    if (mainWindow.isDestroyed()) return clearInterval(pinging);

    const formats = clipboard.availableFormats();
    const joined = formats.join(",");
    const imageMatch = joined.match(/image\/\S+/);
    const _type = imageMatch ? imageMatch[0] : "text";
    const type = imageMatch ? "image" : "text";
    const value = getVal(type, clipboard);

    if (value) {
      const _id = nanoid(12);

      mainWindow.webContents.send(
        CLIPBOARD_EVENT,
        new Entry({ type, _type, value, _id }),
      );
    }
  }, 1000);
};

/**
 * Handles
 * @param {Electron.IpcMainEvent} ev
 * @param {string} type
 * @param {string} val
 */
const handleIPCCopy = (ev, { type, value }) => {
  if (type === "image")
    clipboard.writeImage(nativeImage.createFromDataURL(value));
  else clipboard.writeText(value);
};

const handleIPCBulk = (ev, value) => {
  clipboard.writeText(value);
};

/**
 *
 * @param {Event} e
 * @param {String} url
 */
const externalLinkHandler = (e, url) => {
  e.preventDefault();

  const choice = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    buttons: ["Copy", "Open", "Copy and Open"],
    title: "Link Action",
    message: "What do you wish to do with this link?",
    noLink: true,
    cancelId: 3,
  });

  if (choice === 0) clipboard.writeText(url);
  else if (choice === 1) shell.openExternal(url);
  else if (choice === 2) {
    clipboard.writeText(url);
    shell.openExternal(url);
  }
};

/**
 *
 * @param {Event} e
 * @param {String} url
 */
const aboutLinkHandler = (e, url) => {
  e.preventDefault();
  shell.openExternal(url);
};

/**
 * @param {Event} e
 */
const preventNavigation = (e) => {
  e.preventDefault();
};

ipcMain.handle(CLIPBOARD_CLEAR, clear);
ipcMain.on(CLIPBOARD_EVENT, handleIPCCopy);
ipcMain.on(CLIPBOARD_BULK_COPY, handleIPCBulk);

/**
 * @param {Object} config
 * @param {string} config.title
 * @param {Object} config.options
 * @param {string} config.fileUrl
 */
const createPage = ({ title, options, url }) => {
  const window = new BrowserWindow({
    ...options,
    title,
  });

  window.loadURL(pathToFileURL(url).href);

  return window;
};

const createWindow = () => {
  try {
    mainWindow = createPage({
      title: "Clippy",
      options: DEFAULT_WINDOW_OPTIONS,
      url: path.resolve(__dirname, "./index.html"),
    });

    mainWindow.maximize();
    mainWindow.on("close", handleExit);
    mainWindow.on("minimize", handleMinimize);
    mainWindow.webContents.on("will-navigate", preventNavigation);
    mainWindow.webContents.on("new-window", externalLinkHandler);

    if (isDev) mainWindow.webContents.toggleDevTools();

    tray = new Tray(DEFAULT_WINDOW_OPTIONS.icon);
    tray.setToolTip("Clippy!");
    tray.on("click", maximize);

    const trayMenu = Menu.buildFromTemplate([
      {
        label: "Exit",
        click: () => confirmExit(),
      },
    ]);

    tray.setContextMenu(trayMenu);

    const mainMenu = Menu.buildFromTemplate([
      {
        label: "About",
        click: () => {
          aboutWindow = createPage({
            title: "About",
            url: path.resolve(__dirname, "./about.html"),
            options: {
              ...DEFAULT_PAGE_OPTIONS,
              parent: mainWindow,
            },
          });

          aboutWindow.removeMenu();
          aboutWindow.webContents.on("will-navigate", preventNavigation);
          aboutWindow.webContents.on("new-window", aboutLinkHandler);
        },
      },
    ]);

    app.applicationMenu = mainMenu;

    pingClipboardChanges();
  } catch (error) {
    process.exit(1);
  }
};

app.whenReady().then(createWindow).catch(console.log);

app.on("window-all-closed", () => {
  // Quit when all windows are closed.
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

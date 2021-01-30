// DISCLAIMER: I wrote this code in a couple hours and this was my first time
// using Electron, don't @ me 😂

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

const Entry = require("./types/Entry");
const {
  CLIPBOARD_EVENT,
  CLIPBOARD_CLEAR,
  CLIPBOARD_BULK_COPY,
} = require("./constants");

app.setLoginItemSettings({
  openAtLogin: true,
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

/**
 * defining tray globally to avoid GC bug
 * https://www.electronjs.org/docs/faq#my-apps-windowtray-disappeared-after-a-few-minutes
 * @type {Tray} */
let tray = null;

/** @type {Electron.BrowserWindowConstructorOptions} */
const WINDOW_OPTIONS = {
  enableLargerThanScreen: false,
  title: "Clippy",
  center: true,
  icon: path.resolve(__dirname, "./structure.png"),
  webPreferences: {
    nodeIntegration: true, // Enables require syntax
    backgroundThrottling: true, // Throttles background animations and intervals to save power
  },
};

const ABOUT_OPTIONS = {
  center: true,
  icon: WINDOW_OPTIONS.icon,
  width: 600,
  height: 600,
  modal: true,
  resizable: true,
  skipTaskbar: true,
  autoHideMenuBar: true,
  titleBarStyle: "hidden",
  title: "About",
  webPreferences: {
    nodeIntegration: true, // Enables require syntax
    backgroundThrottling: true, // Throttles background animations and intervals to save power
  },
};

/** @type {BrowserWindow} */
let mainWindow = null;
/** @type {BrowserWindow} */
let aboutWindow = null;

const confirmExit = (e) => {
  const choice = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    buttons: ["Yes", "No", "Minimize Instead"],
    title: "Confirm",
    message: "Are you sure you want to quit?",
  });

  if (choice == 1 || choice == 2) e.preventDefault();
  if (choice == 2) mainWindow.minimize();
};

const minimize = (e) => {
  e.preventDefault();
  mainWindow.hide();
  tray.displayBalloon({
    iconType: "info",
    largeIcon: false,
    title: "Clippy",
    content: "Clippy has been minimized to tray!",
  });
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

/**
 * Pings the system's clipboard to check whether a value is present, and if so,
 * sends it to the render process either as DataURL in the case of images, or
 * simple text otherwise
 */
const pingClipboardChanges = () => {
  const getVal = (type, clip) =>
    type === "image" ? clip.readImage().toDataURL() : clip.readText();

  const pinging = setInterval(() => {
    if (mainWindow.isDestroyed()) {
      return clearInterval(pinging);
    }

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
        new Entry({ type, _type, value, _id })
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
  });

  if (choice === 0) clipboard.writeText(url);
  else if (choice === 1) shell.openExternal(url);
  else {
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

const createWindow = () => {
  try {
    mainWindow = new BrowserWindow(WINDOW_OPTIONS);

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.maximize();
    mainWindow.on("close", confirmExit);
    mainWindow.on("minimize", minimize);
    mainWindow.webContents.on("will-navigate", preventNavigation);
    mainWindow.webContents.on("new-window", externalLinkHandler);

    tray = new Tray(WINDOW_OPTIONS.icon);
    tray.setToolTip("Clippy!");

    tray.on("click", maximize);

    const menu = Menu.buildFromTemplate([
      {
        label: "About",
        click: () => {
          aboutWindow = new BrowserWindow({
            ...ABOUT_OPTIONS,
            parent: mainWindow,
          });

          aboutWindow.loadURL(path.join(__dirname, "about.html"));
          aboutWindow.removeMenu();
          aboutWindow.webContents.on("will-navigate", preventNavigation);
          aboutWindow.webContents.on("new-window", aboutLinkHandler);
        },
      },
    ]);

    app.applicationMenu = menu;

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
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

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
} = require("electron");

const { CLIPBOARD_EVENT, CLIPBOARD_CLEAR } = require("./constants");

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

/** @type {BrowserWindow} */
let mainWindow = null;

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

const maximize = (e) => {
  mainWindow.maximize();
};

const clear = () => {
  clipboard.clear();
};

const pingClipboardChanges = () => {
  const getVal = (type, clip) =>
    type === "image" ? clip.readImage().toDataURL() : clip.readText();

  setInterval(() => {
    const formats = clipboard.availableFormats();
    const joined = formats.join(",");
    const isImage = /image/.test(joined);
    const type = isImage ? "image" : "text";
    const val = getVal(type, clipboard);

    if (val) mainWindow.webContents.send(CLIPBOARD_EVENT, type, val);

    prev = val;
  }, 1000);
};

const handleIPCClipboardEvent = (ev, type, val) => {
  if (type === "image")
    clipboard.writeImage(nativeImage.createFromDataURL(val));
  else clipboard.writeText(val);
};

const externalLinkHandler = (e, url) => {
  e.preventDefault();
  shell.openExternal(url);
};

const preventNavigation = (e) => {
  e.preventDefault();
};

ipcMain.handle(CLIPBOARD_CLEAR, clear);
ipcMain.on(CLIPBOARD_EVENT, handleIPCClipboardEvent);

const createWindow = () => {
  try {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: "Clippy",
      center: true,
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false,
      },
    });

    mainWindow.removeMenu();

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    tray = new Tray(path.resolve(__dirname, "./structure.png"));
    tray.setToolTip("Clippy!");

    tray.on("click", maximize);
    mainWindow.on("close", confirmExit);
    mainWindow.on("minimize", minimize);

    mainWindow.webContents.on("will-navigate", preventNavigation);
    mainWindow.webContents.on("new-window", externalLinkHandler);

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

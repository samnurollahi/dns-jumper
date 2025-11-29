const path = require("path");

const electron = require("electron");

const pathLogo = path.join(__dirname, "logo.png");
const icon = electron.nativeImage.createFromPath(pathLogo);

const mainMenu = new electron.Menu.buildFromTemplate([]);

const main = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 350,
    icon,
    title: "dns jumper",
  });
  mainWindow.setMenu(mainMenu);

  const tray = new electron.Tray(icon);
  tray.on("click", (e) => {
    if (e.shiftKey) {
      electron.app.quit();
    } else {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
};

electron.app
  .whenReady()
  .then(() => {
    main();
  })
  .catch((err) => {
    console.error(err);
  });

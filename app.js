const path = require("path");
const { exec } = require("child_process");

const electron = require("electron");

const pathLogo = path.join(__dirname, "logo.png");
const icon = electron.nativeImage.createFromPath(pathLogo);

const mainMenu = new electron.Menu.buildFromTemplate([]);

const main = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 350,
    icon,
    title: "dns jumper",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  mainWindow.setMenu(mainMenu);
  mainWindow.loadFile("./views/index.html");

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

// handl
electron.ipcMain.handle("setDns", (e, dns) => {
  exec(
    `powershell -Command "Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object -ExpandProperty Name"`,
    (err, result) => {
      a = result.trim();

      exec(
        `netsh interface ipv4 set dns  name="${a}" static ${dns.primary}`,
        (e) => {
          if (e) console.log(e);
          else {
            exec(
              `netsh interface ipv4 add dns name="${a}" ${dns.secondary} index=2`,
              (e2) => {
                if (e2) console.log(e2);
                else console.log("dns seted✅");
              }
            );
          }
        }
      );
    }
  );
});

require('update-electron-app')();


const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, ipcRenderer } = require('electron')
const path = require('path')

let win;
let tray = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 650,
        frame: false,
        alwaysOnTop: false,
        minimizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.removeMenu();
    win.loadFile('./app/index.html');
    if (!app.isPackaged) {
        win.webContents.openDevTools();
    }

    ipcMain.on("close", () => {
        win.close();
    });

    ipcMain.on("max", () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    });
    
    ipcMain.on("min", () => {
        win.minimize();
    });

    // ctr+shift+i to open dev tools
    win.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.shift && input.key.toLowerCase() === 'i') {
            win.webContents.openDevTools();
        }
    });

}


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus();

          let focusedWindow = BrowserWindow.getFocusedWindow();

        var data = null;
        if (process.platform == 'win32' && commandLine.length >= 2) {
            // var openFilePath = commandLine[2];
            // data = openFilePath;
            // focusedWindow.webContents.send('second-file-open', data);
        }

    
    }
  })

}

app.whenReady().then(() => {
    createWindow();

    // tray = new Tray('./app/icon.png');
    // const contextMenu = Menu.buildFromTemplate([
    //     { label: 'Item1', type: 'radio' },
    //     { label: 'Item2', type: 'radio' },
    //     { label: 'Item3', type: 'radio', checked: true },
    //     { label: 'Item4', type: 'radio' }
    // ])
    // tray.setToolTip('This is my application.')
    // tray.setContextMenu(contextMenu);

    // tray.popUpContextMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})


// ipcMain.on('get-file-data', function (event) {
//     var data = null;
//     if (process.platform == 'win32' && process.argv.length >= 2) {
//         var openFilePath = process.argv[1];
//         data = openFilePath;
//     }
//     event.returnValue = data;
// });



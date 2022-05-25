const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');

const grouping = require('./grouping.js');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const selectWorkingDirectory = () => {
  return dialog.showOpenDialog(null, {
    properties: ['openDirectory']
  }).then(result => {
    console.log('Working directories selected', result.filePaths);
    return result.filePaths[0];
  });
}

const preProcessing = (workingDir) => {
  console.log('start processing');
  return grouping(workingDir);
}

const createWindow = () => {
  //selectWorkingDirectory()
    //.then(preProcessing)
    Promise.resolve()
    .then(workingDir => {
      const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        }
      });

      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

      // mainWindow.webContents.openDevTools();
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const electron = require('electron');
const path = require('path');
const url = require('url');

// SET ENV
process.env.NODE_ENV = 'development';
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;
let mainWindow;
let readyClose = false;
app.on('ready', function () {
  mainWindow = new BrowserWindow({ frame: true, titleBarStyle: 'show', });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  mainWindow.on('close',function (e) {
    if (!readyClose) {
      e.preventDefault();
      mainWindow.webContents.send('Exit');
    }

  })
});
ipcMain.on('SendMessage', async function (e,data) {
  dialog.showMessageBox(mainWindow,{
    type:'info',
    message:data
  });
});
ipcMain.on('Ready:Close', async function (e) {
  readyClose = true;
  app.quit();
});







const electron = require('electron')
const express = require("express")
const websocket = express()
const DiscordRPC = require("discord-rpc");

const { menubar } = require('menubar');

const { app, BrowserWindow , Tray , Menu} = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(() => {
    tray = new Tray('./icon.ico')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'AdvancedRPC', click: () => { createWindow; } },
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
    { label: 'Quit', click: () => { app.quit(); } }
  ])
  tray.setToolTip('BetterRPC')
  tray.setContextMenu(contextMenu)
})

//app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})
  
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
})


websocket.post("/update", async function (req, res) {

    const rpc = new DiscordRPC.Client({ transport: 'ipc' });

    const clientId = req.body.clientid;
    const largeIMG = req.body.largeimg;
    const largeTEXT = req.body.largetext;
    const smallIMG = req.body.smallimg;
    const smallTEXT = req.body.smalltext;
    const state = req.body.state;
    const details = req.body.details;

    rpc.setActivity({
        details: details,
        state: state,
        largeImageKey: largeIMG,
        largeImageText: largeTEXT,
        smallImageKey: smallIMG,
        smallImageText: smallTEXT,
        instance: false,
      });

    rpc.login({ clientId }).catch(console.error);


    res.redirect("file://index.html")
})



websocket.listen(4423, console.log("Running"))
const electron = require('electron')
const express = require("express")
const websocket = express()
const DiscordRPC = require("discord-rpc");
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
var onState = false;
var offState = true;
var win;

var presenceData = {
  clientId: "623182972895494164",
  largeIMG: "lptp1",
  largeTEXT: "LPTP1",
  smallIMG: "discord",
  smallTEXT: "AdvancedRPC",
  details: "AdvancedRPC",
  state: "Programmiert am Backend"
};

const { menubar } = require('menubar');

const { app, BrowserWindow , Tray , Menu} = require('electron')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
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
    { label: 'AdvancedRPC', click: () => { createWindow(); } },
    { label: 'On', type: 'radio' , checked: onState, click: () => { onState=true; offState=false; startPresence(); }},
    { label: 'Off', type: 'radio' , checked: offState, click: () => { onState=false; offState=true; stopPresence(); }},
    { label: 'Quit', click: () => { app.quit(); } }
  ])
  tray.setToolTip('AdvancedRPC')
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
    const clientId = req.body.clientid;
    const largeIMG = req.body.largeimg;
    const largeTEXT = req.body.largetext;
    const smallIMG = req.body.smallimg;
    const smallTEXT = req.body.smalltext;
    const state = req.body.state;
    const details = req.body.details;


    presenceData.clientId = clientId;
    presenceData.largeIMG = largeIMG;
    presenceData.largeTEXT = largeTEXT;
    presenceData.smallIMG = smallIMG;
    presenceData.smallTEXT = smallTEXT;
    presenceData.state = state;
    presenceData.details = details;

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

async function stopPresence() {

}

async function startPresence() {
  if (!win) {
    createWindow();
    setTimeout(() => {
      const { clientId, largeIMG, largeTEXT, smallIMG, smallTEXT, state, details } = presenceData;

  rpc.setActivity({
    details: details,
    state: state,
    largeImageKey: largeIMG,
    largeImageText: largeTEXT,
    smallImageKey: smallIMG,
    smallImageText: smallTEXT,
    instance: false,
  });
  try {
    rpc.login({ clientId })
  } catch(e) {
      offState=true;
      onState=false;
      console.log(e)
  }
    }, 9000)
  } else {
    const { clientId, largeIMG, largeTEXT, smallIMG, smallTEXT, state, details } = presenceData;

  rpc.setActivity({
    details: details,
    state: state,
    largeImageKey: largeIMG,
    largeImageText: largeTEXT,
    smallImageKey: smallIMG,
    smallImageText: smallTEXT,
    instance: false,
  });
  try {
    rpc.login({ clientId })
  } catch(e) {
      offState=true;
      onState=false;
      console.log(e)
  }
}
}

websocket.listen(4423, console.log("Running"))
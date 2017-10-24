const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');

class Wait {
  constructor(count, callback){
      this.count = count;
      this.callback = callback;
  }

  done(){
      this.count--;
      if (this.count == 0){
          this.callback()
      }
  }
}

let win

function createWindow () {
  let publishCheckList = new Wait(2, publish)
  let bounds
  let page

  fs.readFile(path.join(__dirname, '/db/bounds.json'), 'utf8', (err, res) =>{
    if (!err){
      bounds = res
    }
    publishCheckList.done();
  })

  fs.readFile(path.join(__dirname, '/db/keys.json'), (err, res) =>{
    if (err){
      page = 'initalize'
    } else {
      global.keys = res
      page = 'messages'
    }
    publishCheckList.done();
  })

  // fs.readFile(path.join(__dirname, '/db/bounds.json'), 'utf8', (err, data) => {
  //   if (err){
  //     bounds = {width: 1800, height: 600}
  //     fs.writeFile(path.join(__dirname, '/db/bounds.json'), JSON.stringify(bounds))
  //   } else {
  //     console.log('reading')
  //     console.log(data)
  //     bounds = data;
  //   }
  // })
  
  // console.log(bounds)
  // win = new BrowserWindow(bounds)
  // let page

  // try {
  //   let keys = fs.readFileSync(path.join(__dirname, '/db/keys.json'))
  //   global.keys = keys
  //   page = 'messages.html'
  // } catch (e) {
  //   page = 'initialize.html'
  // }

  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, page),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  function publish(){
    console.log(typeof bounds)
    win = new BrowserWindow(JSON.parse(bounds))
    win.loadURL(`file://${__dirname}/${page}.html`)
    
    win.webContents.openDevTools()
    win.on('closed', () => {
      win = null
    })

    var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    win.on('resize', () => {
      console.log('resizing')
      fs.writeFile(path.join(__dirname, 'db/bounds.json'), JSON.stringify(win.getBounds()))
    })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
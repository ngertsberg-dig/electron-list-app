const electron = require('electron');
const url = require('url');
const path = require('path');

const{app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow;   // CREATES THE MAIN WINDOW
let addWindow;

app.on('ready',function(){
  //Create new window
  mainWindow = new BrowserWindow({}); //INIT MAIN WINDOW
  //load HTML file into the window

  //pass in MAIN WINDOW HTML INTO THE LOAD URL
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname,'mainWindow.html'),
    protocol:'file:',
    slashes:true
   }));
  //Quit entire app when closed
  mainWindow.on('closed',function(){
    app.quit();
  });

  //build the menu from the template below !
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  //insert Menu
  Menu.setApplicationMenu(mainMenu);
});


//handle add window click under File
function createAddWindow(){
  //Create addWindow window
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add Shopping List Item'
  }); //INIT addWindow WINDOW
  //load HTML file into the window

  //pass in addWindow WINDOW HTML INTO THE LOAD URL
  addWindow.loadURL(url.format({
    pathname:path.join(__dirname,'addWindow.html'),
    protocol:'file:',
    slashes:true
  }));

  //Garbage collection handle
  addWindow.on('close',function(){
    addWindow = null;
  });

}

//catch item:add
ipcMain.on('item:add',function(e,item){

  mainWindow.webContents.send('item:add',item);
  addWindow.close();
});
//create menu template
const mainMenuTemplate = [

{
label:'File',
submenu:[
  {
    label:'Add Item',
    accelerator:process.platform =='darwin' ? 'Command+D' : 'Ctrl+D',
    click(){
      createAddWindow();
    }
  },
  {
    label:'Clear Items',
    accelerator:process.platform == 'darwin' ? 'Command+C' : 'Ctrl+C',
    click(){
      mainWindow.webContents.send('item:clear'); //senc clear order to main window when clear items label is clicked
    }
  },
  {
    label:'Quit',
    //short key code for all platforms
    accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', //IF MAC THEN COMMAND Q ELSE CTRL Q !
    click(){
      app.quit();
    }
  }
]
}
];

//if MAC, add empty object ot menu so its the second item getting rid of the menu bug...

if(process.platform =='darwin'){
  mainMenuTemplate.unshift({}); //add to the beggining of the array just like .push();
}

//add developer tool item if not in production !!!

if(process.env.NODE_ENV !='production'){      //IF THE APP IS NOT IN PRODUCTION MODE
  mainMenuTemplate.push({
    label:'Developer Tools',
    accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
    submenu:[{
        label:'Toggle DevTools',
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
    },
    {
      role:'reload'
    }
  ]
  })
}

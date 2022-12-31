const { app, BrowserWindow } = require('electron')
const { exec } = require("child_process")

const createWindow = () => {
	const win = new BrowserWindow({
		width: 500,
		height: 600,
		autoHideMenuBar: true,
		resizable: false,
		webPreferences: {
		}
	})

	win.loadFile('public/settings.html')
}

app.whenReady().then(() => {
	createWindow()
})
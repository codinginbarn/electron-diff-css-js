const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Function to read and inject a local CSS file
function readAndInjectCSS(window, filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading CSS file: ${filePath}`, err);
            return;
        }
        window.webContents.insertCSS(data);
    });
}

// Function to read and inject a local JS file
function readAndInjectJS(window, filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading JS file: ${filePath}`, err);
            return;
        }
        window.webContents.executeJavaScript(data);
    });
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load the external website
    mainWindow.loadURL('https://example.com');

    // Listen for the 'did-finish-load' event
    mainWindow.webContents.on('did-finish-load', () => {
        // Define paths to your local CSS and JS files
        const cssFiles = [
            path.join(__dirname, 'styles', 'style1.css'),
            path.join(__dirname, 'styles', 'style2.css')
        ];
        const jsFiles = [
            path.join(__dirname, 'scripts', 'script1.js'),
            path.join(__dirname, 'scripts', 'script2.js')
        ];

        // Inject all local CSS files
        cssFiles.forEach(cssFile => readAndInjectCSS(mainWindow, cssFile));

        // Inject all local JS files
        jsFiles.forEach(jsFile => readAndInjectJS(mainWindow, jsFile));
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed.
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

// src/main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/renderer.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle save and load operations
const notesFilePath = path.join(__dirname, 'notes.json');

ipcMain.handle('load-notes', async () => {
  try {
    const notes = await fs.readJson(notesFilePath);
    return notes;
  } catch (error) {
    return [];
  }
});

ipcMain.handle('save-note', async (event, note) => {
  let notes = [];
  try {
    notes = await fs.readJson(notesFilePath);
  } catch (error) {}

  notes.push(note);
  await fs.writeJson(notesFilePath, notes);
  return notes;
});

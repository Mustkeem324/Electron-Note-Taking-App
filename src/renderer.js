// src/renderer.js

const { ipcRenderer } = require('electron');

const notesList = document.getElementById('notes-list');
const noteText = document.getElementById('note-text');
const saveBtn = document.getElementById('save-btn');

let notes = [];
let selectedNoteIndex = null;

const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

function displayNotes() {
  notesList.innerHTML = '';
  notes.forEach((note, index) => {
    const noteItem = document.createElement('div');
    noteItem.textContent = note;
    noteItem.className = 'note-item';
    noteItem.onclick = () => loadNoteInTextArea(index);
    notesList.appendChild(noteItem);
  });
}

function loadNoteInTextArea(index) {
  selectedNoteIndex = index;
  noteText.value = notes[index];
}

async function loadNotes() {
  notes = await ipcRenderer.invoke('load-notes');
  displayNotes();
}

saveBtn.addEventListener('click', async () => {
  const newNote = noteText.value;
  if (newNote.trim()) {
    notes = await ipcRenderer.invoke('save-note', newNote);
    displayNotes();
    noteText.value = '';
  }
});

loadNotes();

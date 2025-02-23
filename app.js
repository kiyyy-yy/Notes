const API_URL = 'http://localhost:3000/notes';

    //dsiplaying notes
async function fetchNotes() {
    const response = await fetch(API_URL);
    const notes = await response.json();
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    notes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `${note.text} 
            <button class="delete-btn" onclick="deleteNote('${note.id}')">X</button>`;
        list.appendChild(li);
    });

    saveNotesToLocalStorage(notes);
}

    //add notes
async function addNote() {
    const text = document.getElementById('noteText').value.trim();
    if (!text) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    document.getElementById('noteText').value = '';
    fetchNotes();
}

    //delete notes
async function deleteNote(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    fetchNotes();
}


function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

    //load save notes
function loadNotesFromLocalStorage() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    savedNotes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `${note.text} 
            <button class="delete-btn" onclick="deleteNote('${note.id}')">X</button>`;
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
});

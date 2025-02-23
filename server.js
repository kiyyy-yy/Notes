const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notesdb'
});

    //connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

    //create notes
app.post('/notes', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const sql = 'INSERT INTO notes (text) VALUES (?)';
    db.query(sql, [text], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        res.status(201).json({ id: result.insertId, text });
    });
});

    //get notes
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        res.json(results);
    });
});

    //get note by id
app.get('/notes/:id', (req, res) => {
    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length === 0) return res.status(404).json({ message: 'Note not found' });

        res.json(results[0]);
    });
});

    //upd note
app.put('/notes/:id', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const sql = 'UPDATE notes SET text = ? WHERE id = ?';
    db.query(sql, [text, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });

        res.json({ id: req.params.id, text });
    });
});

    //del note
app.delete('/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });

        res.json({ message: 'Note deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

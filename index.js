const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

const db = new sqlite3.Database('./timetable.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS timetable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time TEXT,
                teacher TEXT,
                branch TEXT
            )
        `);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'root.html'));
});

app.post('/add-lecture', (req, res) => {
    const { time, teacher, branch } = req.body;

    if (!time || !teacher || !branch) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    
    const query = `INSERT INTO timetable (time, teacher, branch) VALUES (?, ?, ?)`;
    
    db.run(query, [time, teacher, branch], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Lecture added successfully', id: this.lastID });
        console.log("new lecture added")
    });
});

// Clear Timetable API
app.delete('/clear-timetable', (req, res) => {
    db.run(`DELETE FROM timetable`, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Timetable cleared successfully' });
    });
});

app.get('/get-timetable', (req, res) => {
    db.all(`SELECT * FROM timetable`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Return timetable data as JSON
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

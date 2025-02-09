const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

const DATA_FILE = path.join(__dirname, 'timetable.json');

// Function to read timetable data from the file
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Function to write timetable data to the file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'root.html'));
});
// API to add a lecture
app.post('/add-lecture', (req, res) => {
    const { time, teacher, branch } = req.body;

    if (!time || !teacher || !branch) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let timetable = readData();
    timetable.push({ id: Date.now(), time, teacher, branch });
    writeData(timetable);

    res.json({ message: 'Lecture added successfully' });
});

// API to get the timetable
app.get('/get-timetable', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read timetable" });
        }
        res.json(JSON.parse(data));
    });
});


app.delete('/clear-timetable', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Failed to clear timetable" });
        res.json({ message: "Timetable cleared successfully" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

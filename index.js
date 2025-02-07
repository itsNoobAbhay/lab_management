const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'root.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
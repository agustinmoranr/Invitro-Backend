const express = require('express');
const app = express();
const { config } = require('./config/index');

const port = config.port || 8000;

// middlewarea
app.use(express.json());

//routes


// server
app.listen(port || 8000, () => { 
        console.log(`Server created Successfully on ${port}`);
});
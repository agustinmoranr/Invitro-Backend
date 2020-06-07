const express = require('express');
const app = express();
const { config } = require('./config/index');
const user = require('./components/user/network');
const exam = require('./components/exam/network');

const port = config.port || 8000;

// middlewares
app.use(express.json());

//routes
app.use('/user', user);
app.use('/exam', exam);

// server
app.listen(port || 8000, () => { 
        console.log(`Server created Successfully on port: ${port}`);
});
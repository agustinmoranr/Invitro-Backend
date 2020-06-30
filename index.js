const express = require('express');
const app = express();
const { configAdmin } = require('./config/index');
const user = require('./components/user/network-user');
const login = require('./components/login/network-login');
const massive = require('./components/user-massive/network-user-massive');
const consult = require('./components/consult/network-consult');
const cors = require('cors');

const port = configAdmin.port || 8000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//routes
app.use('/user', user);
app.use('/consult', consult);
app.use('/login', login);
app.use('/uploadCSV', massive);


// server
app.listen(port || 8000, () => { 
        console.log(`Server created Successfully on port: ${port}`);
});
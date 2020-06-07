const express = require('express');
const app = express();
const { configAdmin } = require('./config/index');
const user = require('./components/user/network-user');
const login = require('./components/login/network-login')

const port = configAdmin.port || 8000;

// middlewarea
app.use(express.json());

//routes
app.use('/user', user);
app.use('/login', login)

// server
app.listen(port || 8000, () => { 
        console.log(`Server created Successfully on port: ${port}`);
});
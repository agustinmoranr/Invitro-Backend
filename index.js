const express = require('express');
const app = express();

//calls to networks
const user = require('./components/user/network-user');
const login = require('./components/login/network-login');
const massive = require('./components/user-massive/network-user-massive');
const exam = require('./components/exam/network-exam');
const result = require('./components/result/network-result');

const { firebaseAdminConf } = require('./config/index');
const cors = require('cors');

const port = firebaseAdminConf.port || 8000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//routes
app.use('/user', user);
app.use('/exam', exam);
app.use('/login', login);
app.use('/uploadCSV', massive);
app.use('/result', result);


//server
app.listen(port || 8000, () => { 
        console.log(`Server created Successfully on port: ${port}`);
});
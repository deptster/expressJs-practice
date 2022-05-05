//initialize express
const express = require('express');
const app = express();
const port = 5000;

const db = require('./db')

//loads json body-parser file
app.use(express.json())


// /user/register route
app.use('/user', require('./routes/routes'));



//front end response on root
app.get('/', (req, res) => {
    res.send("hi");
})

//app listening port
app.listen(port, (req, res) => {
    console.log(`server listens to ${port} `);
})
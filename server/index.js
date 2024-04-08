const {
    client
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//routes

//init function
const init = async ()=> {
    await client.connect();
    console.log('Client connected.');

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`Now listening on port ${port}.`));
}

//init invocation
init();
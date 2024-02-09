const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {

        app.listen(port, () => {
            console.log(`Running on port ${port}`)
        });
    }
});
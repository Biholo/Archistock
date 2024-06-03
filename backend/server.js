const express = require('express');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors())

const databaseRoute = require('./src/routes/databaseRoute');
const userRoute = require('./src/routes/userRoute');

app.use('/database', databaseRoute);
app.use('/user', userRoute);

app.listen(8000, function () {
    console.log("Serveur ouvert: ");
});
  
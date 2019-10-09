const express = require('express')
const app = express()
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

mongoose
  .connect(
      "mongodb+srv://Ade:pzukLECtbhvRiEDR@cluster0-fwqpb.mongodb.net/node-angular",
      { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
});

app.use(express.static(__dirname + '/client/dist/client/'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})
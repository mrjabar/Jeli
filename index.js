const express = require('express')
const app = express()
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);

const bodyParser = require('body-parser');
const cors = require('cors');

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

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/client/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})
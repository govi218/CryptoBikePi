const express = require('express');
const bodyParser = require('body-parser');
const azure = require('azure');
const fs = require('fs');

/** Init **/

let app = express();

const port = 3000;

// express config

// CORS policy
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app
  .use(allowCrossDomain)
  .use(bodyParser.urlencoded());

/** File Serving Routes **/

app.post('/state_change', (req, res) => {
  if (!exists(req.body)) {
    res
      .status(400)
      .send('Error: Invalid request');
      return;
  }
  console.log('State changed:');
  console.log(req.body);

  fs.writeFile("./state_changes.txt", JSON.stringify(req.body), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
  res.status(200);
});

app.get('/change_history', (req, res) => {
  res.sendFile('./state_changes.txt');
})

/* Server Config */
app.listen(port, () => {
  console.log('listening on port ' + port);
});

/* Helpers */

// Checks if an object exists
let exists = (obj) => {
  if (obj === null || obj === undefined || obj === '') {
    return false;
  }
  return true;
}

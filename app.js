var express = require('express'),
  bodyParser = require("body-parser"),
  bootstrap = require("./lib/bootstrap.js");

var app = express();

var swagger = express();
swagger.use(bodyParser.urlencoded({ extended: false }));
swagger.use(bodyParser.json({ type: 'application/json' }));
swagger.use(bodyParser.text({ type: '*/xml' }));
app.use("/swagger",swagger);

bootstrap.start(swagger);

app.listen(3000);
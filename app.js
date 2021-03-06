var express = require('express'),
  bodyParser = require("body-parser"),
  bootstrap = require("./lib/bootstrap.js"),
  swaggerGen = require("./lib/swagger-gen.js");

var app = express();
app.use('/swagger_ui', express.static(__dirname + '/swagger_ui'));
app.use('/samples', express.static(__dirname + '/samples'));

var swagger = express();
swagger.use(bodyParser.urlencoded({ extended: false }));
swagger.use(bodyParser.json({ type: 'application/json' }));
swagger.use(bodyParser.text({ type: '*/xml' }));
app.use("/swagger",swagger);

bootstrap.start(swagger);

app.get("/swagger-api",function(req,res){
  var swg = swaggerGen.getSpec();
  res.json(swg);
});

app.listen(3001);
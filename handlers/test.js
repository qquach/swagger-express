/**
 * Description of the test handler. This will be used as description for the tag object
 */
var util = require("util");

module.exports = function(fn){
  fn({
    method: "get",
    path: "/check/:abc?:check&:p",
    summary:"test summary",
    description: "test description",
    params:{
      abc:{
        "description":"test path parameters",
        "required":true,
        "type":"integer"
      },
      check:{
        "required":true,
        "type":"string",
      },
      p:{
        "required":false,
        "type":"boolean"
      }
    },
    handler: function(req,res){
      res.send(util.format("check get api | abc: %s, check: %s, p: %s", req.parameters["abc"], req.parameters["check"], req.parameters["p"]));
    },
    response:{
      contentType:"text/html",//default
      statusCode:200, //default
    }
  });
  fn({
    method: "post",
    path: "/check/urlencoded/:abc?:check&:p",
    params:{
      abc:{
        "description":"tes path parameters",
        "required":true,
        "type":"integer"
      },
      check:{
        "required":true,
        "type":"string",
      },
      p:{
        "required":false,
        "type":"boolean"
      }
    },
    //expected content type of post data
    /**
     * urlencoded = application/x-www-form-urlencoded (default)
     * json = application/json
     * xml = application/xml or text/xml
     */
    contentType: "urlencoded",
    body:{
      name:{
        "description":"test string",
        "required":true,
        "type":"string"
      },
      age:{
        description:"test an integer",
        required:true,
        type: "integer"
      }
    },
    handler: function(req,res){
      res.write(util.format("check get api | abc: %s, check: %s, p: %s", req.parameters["abc"], req.parameters["check"], req.parameters["p"]));
      res.write(util.format("check get api | name: %s, age: %s", req.body["name"], req.body["age"]));
      res.end();
    }
  });
  fn({
    method: "post",
    path: "/check/json1",
    contentType: "json",
    body:{
      name:{
        "description":"test string",
        "required":true,
        "type":"string"
      },
      age:{
        description:"test an integer",
        required:true,
        type: "integer"
      }
    },
    handler: function(req,res){
      res.send(util.format("check get api | name: %s, age: %d", req.body.name, req.body.age));
    }
  });
  /**
   * test json from model
   */
  fn({
    method: "post",
    path: "/check/json2",
    contentType: "json",
    body: "#userInfo",
    handler: function(req,res){
      res.send(util.format("check get api | name: %s, age: %d", req.body.name, req.body.age));
    }
  });
  /**
   * test json from model
   */
  fn({
    method: "post",
    path: "/check/json3",
    contentType: "json",
    body: "#definitions/user",
    handler: function(req,res){
      res.send(util.format("check get api | name: %s, age: %d", req.body.name, req.body.age));
    }
  });

  /**
   * test json from model
   */
  fn({
    method: "post",
    path: "/check/json4",
    contentType: "json",
    body: "#definitions/class",
    handler: function(req,res){
      var student = req.body.students[0];
      res.send(util.format("check get api | name: %s, age: %d", student.name, student.age));
    }
  });
  /**
   * test xml
   */
  fn({
    method: "post",
    path: "/check/xml",
    contentType: "xml",
    body: "#userInfo",
    handler: function(req,res){
      res.send(util.format("check get api | name: %s, age: %d, toys: %s", req.body.name, req.body.age, req.body.toys.join(";")));
    }
  });
};
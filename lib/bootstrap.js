var wsUtil = require("./ws-util.js"),
    fs = require("fs"),
    path = require("path"),
    util = require("util"),
    xmlParser = require("xml-parser"),
    extend = require("extend");

module.exports = {
    start: function(swagger){
      fs.readdirSync('./handlers').forEach(function(file){
        var func = require("../handlers/"+file);
        func(function(h){
          var path = h.path;
          var i = h.path.indexOf("?");
          if(i!=-1){
            path = path.substr(0,i);
          }
          //path = "/api"+path;
          console.log("path: %s, method: %s", path, h.method);
          swagger[h.method](path, function(req,res){
            //console.log("req.param('abc'): %s", req.param("abc"));
            //handle parameters in path or query
            if(h.params) req.parameters = wsUtil.getValue(h.params, extend({},req.params,req.query));
            //handle body. validate and convert the body to correct data type.
            if(h.body) {
              var contentType = h.contentType || "urlencoded";
              contentType = TypeMap[contentType];
              if(!req.is(contentType)){
                return res.status(400).send(util.format("Bad request | expected content-type: %s", contentType));
              }
              getPostBodyValues(h.body, req, function(values){
                req.body = values;
                h.handler(req, res);
              });
            }
            else{
            //console.log("req.parameters: %s", JSON.stringify(req.parameters));
              h.handler(req, res);
            }
          });
        });
      });
    }
};

function getPostBodyValues(params, req, callback){
  console.log(util.format("getPostBodyValues: %j, content-type", params, req.get("content-type")));
  if(req.is("application/json") || req.is("application/x-www-form-urlencoded")){
    console.log("process json or urlencoded body");
    callback(wsUtil.getValue(params, req.body,req.is("application/json")));
    return;
  }
  if(req.is("*/xml")){
    console.log("process xml body: %s",req.body);
    xmlParser.parseString(req.body,function(err,result){
      if(err){
        throw "xml parsing error" + err.message;
      }
      console.log(util.format("xml parsed: result: %j", result));
      callback(wsUtil.getValue(params,result));
    });
    return;
  }
  throw "unhandled content type";
}

var TypeMap = {"json":"application/json","xml":"text/xml","urlencoded":"application/x-www-form-urlencoded"};

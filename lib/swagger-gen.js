/**
 * Create the swagger object from handlers
 */
var fs = require("fs"),
    log = require("./log.js"),
    extend = require("extend");

var infoObj = {
    title:"swagger express",
    description:"demonstration of swagger express",
    termsOfService: "",
    contact:{
      name:"Quoc Quach",
      url:"http://github.com/qquach",
      email:"quoc_cooc@yaoo.com",
    },
    license:{
      "name":"MIT License",
      "url":"http://opensource.org/licenses/MIT"
    },
    version:"1.0.0"
};

var swaggerObj = {
    swagger: "2.0",
    info: infoObj,
    host:"",
    basePath: "/swagger",
    schemes:["http"],
    consumes: ["application/json"],
    produces: ["text/html", "application/json", "application/xml"],
    paths:{},
    definitions:{},
    parameters:{},
    responses:{},
    securityDefinitions:{},
    security:[],
    tags:[],
    externalDocs:{}
};

// adding default definitions
var def = require("../schema/definitions.js");
var builtinTypes = ["string","number","integer","boolean","array"];

if(def){
  log.debug("def: %j", def);
  for(var i in def){
    log.info("definitions name: %s", i);
    var model = convertDefinition(def[i]);
    swaggerObj.definitions[i] = {"properties":model};
  }
  log.debug("after def: %j", def);
}

function convertDefinition(model){
  var out = extend(true,{},model);
  for(var i in out){
    log.info("i: %s", i);
    var p = out[i];
    log.info("p.type: %s", p.type);
    if(p.type=="array"){
      log.info("arrays of items | i: %s", i);
      if(typeof(p.items)=="string"){
        log.info("p.items is string: %s",p.items);
        out[i].items = {
            $ref: p.items
        };
      }
      else{
        //create new object and create mapping
        var id = randomName();
        swaggerObj.definitions[id]={"properties":p.items};
        out[i].items = {
            $ref: id
        };
      }
    }
    else if(builtinTypes.indexOf(p.type)==-1){
      if(typeof(p.type)=="string"){
        out[i] = {"$ref":p.type};
      }
      else{
        var id = randomName();
        swaggerObj.definitions[id]={"properties":p.type};
        out[i] = {
            $ref: id
        };
      }
    }
    else{
      //out[i] = model[i];
    }
  }
  return out;
}


module.exports = {
    /**
     * return the swagger obj.
     * can be use by directly by express
     */
    getSpec: function(){
      return swaggerObj;
    },
    /**
     * Adding tag as group of handler files
     */
    addTag: function(file){
      var content = fs.readFileSync("./handlers/"+file,{encoding:"utf8"});
      var m = content.match(/^\s*\/\*{2}([\s\S]*?)\*\//);
      var desc = (m) ? m[1] : "";
      desc = desc.replace(/\*\s*/g,"").replace(/^\s*/,"").replace(/\s*$/,""); //remove leading * of the doc
      swaggerObj.tags.push({name: file, description: desc});
    },
    /**
     * adding handler as paths to swagger object.
     * @param handler
     */
    addHandler:function(file, handler){
      log.debug("addHandler | file: %s, handler: %j",file, handler);
      var t = createTag(file);
      var tags = [t];
      if(handler.tags) tags = tags.concat(handler.tags);
      var uriInfo = parsePath(handler.path);
      var paths = swaggerObj.paths;
      if(! (handler.path in paths)){
        paths[uriInfo.path] = {};
      }
      var h = {
          tags:tags,
          summary: handler.summary || handler.description || "",
          description: handler.description || "",
          parameters: getParams(uriInfo, handler),
          consumes: getContentType(handler.contentType)
      };
      console.log("addHandler | h: %j", h);
      paths[uriInfo.path][handler.method] = h;
    }
};

//===================private functions========================
var TypeMap = {"json":"application/json","xml":"text/xml","urlencoded":"application/x-www-form-urlencoded"};

function getContentType(type){
  var t = TypeMap[type];
  if(t) return [t];
  return undefined;
}
/**
 * parse handler path
 * return {path:"path map to swagger format", pathParams: [params], queryParams: [params]}
 */
function parsePath(path){
  log.info("parseParth | path: %s", path);
  var uriInfo = {};
  var index = path.indexOf("?");
  //adding query params
  if(index!=-1){
    var queryStr = path.substr(index+1);
    var m = queryStr.match(/:[^&]+/g);
    if(m){
      var queryParams = [];
      for(var i = 0; i < m.length; i++) {
        var param = m[i].substr(1);
        queryParams.push(param);
      }
      uriInfo.queryParams = queryParams;
    }
    //remove query from path
    path = path.substr(0,index);
  }
  //parsing path and query path
  var m = path.match(/:[^\/]+/g);
  if(m){
    var pathParams = [];
    for(var i = 0; i < m.length; i++) {
      var param = m[i].substr(1);
      pathParams.push(param);
      path = path.replace(m[i],"{"+param+"}");
    }
    uriInfo.pathParams = pathParams;
  }
  uriInfo.path = path;
  log.info("parsePath | uriInfo: %j",uriInfo);
  return uriInfo;
}

function createTag(file){
  file = file.replace(/\.\w+$/,"");//remove extension
  file = file.replace(/\s+/g,"");//remove all spaces
  return file.toLowerCase();

}

function getParams(uriInfo, handler){
  log.debug("getParams | uriInfo: %j, params: %j, body: %j, contentType", uriInfo, handler.params, handler.body, handler.contentType);
  var out = [];
  out = out.concat(getUrlParams(uriInfo, handler.params),getPostParams(handler.body, handler.contentType));
  log.info("getParams | out: %j", out);
  return out;
}

function getUrlParams(uriInfo, params){
  var out = [];
  if(!params) return out;
  for(var i in params){
    var paramInfo = params[i];
    var location;
    if("in" in paramInfo) location = p["in"];
    else if(uriInfo.pathParams.indexOf(i)!=-1) location = "path";
    else if(uriInfo.queryParams.indexOf(i)!=-1) location = "query";
    else{
      log.warn("param name missing name: %s", i);
      continue;
    }
    //header, formData are not handled
    out.push({
      name: i,
      "in": location,
      description: paramInfo.description || "",
      required: paramInfo.required || false,
      type: paramInfo.type,
      items: paramInfo.items
    });
  }
  return out;
}
function randomName(){
  return Math.random().toString(36).substr(2);
}
function getPostParams(params, type){
  var out = [];
  if(!params) return out;
  if(type=="urlencoded"){
    for(var i in params){
      var paramInfo = params[i];
      out.push({
        name: i,
        "in": "formData",
        description: paramInfo.description || "",
        required: paramInfo.required || false,
        type: paramInfo.type,
        items: paramInfo.items
      });
    }
  }else{
    var ref = "";
    if(typeof(params)=="string"){
      ref = "#/definitions/" + params;//remove the # in front of #model
    }else{
      var id = randomName();
      ref = "#/definitions/" + id;
      swaggerObj.definitions[id] = {"properties":params};
    }
    out.push({
      "name":"body",
      "in":"body",
      "schema":{
        "$ref":ref
      }
    });
  }
  return out;
}
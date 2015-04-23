var util = require("util"),
defaultDefinitions = require("../schema/definitions.js"),
log = require("./log.js");
var wsUtil = {
  /**
   * return the schema object of reference.
   * @param ref
   * @returns {___anonymous179_180}
   */
  getSchema: function(ref){
    log.debug("getSchema: %s",ref);
    var arr;
    if(ref.charAt(0)=="#"){
      ref = ref.substr(1);
      arr = ref.split("/");
    }
    else{
      arr = ["definitions",ref];
    }
    log.debug("arr: %j", arr);
    var schema = require("../schema/"+arr[0]+".js");
    var out = (arr.length==1) ? schema : schema[arr[1]];
    log.debug("out: %j", out);
    return out;
  },
  /**
   * validate the format of parameter type
   * @param schema: declaration of the schema
   * @param value: value need to parse
   * @param isJson: special handling for json object, since it already parsed to correct type
   */
  getValue: function(schema, value, isJson){
    log.debug("getValue | schema: %j, value: %j, isJson: %s, typeof schema: %s", schema, value, isJson, typeof(schema));
    if(!schema || value===undefined || value===null) return null;
    if(typeof(schema)=="string"){
      schema = wsUtil.getSchema(schema);
      log.info("schema object: %j", schema);
    }
    log.debug("schema.type: %s", schema.type);
    switch(schema.type){
    case "integer":
      return parseIntParam(schema,value,isJson);
    case "float":
    case "number":
      return parseFloatParam(schema,value,isJson);
    case "string":
      return parseStringParam(schema, value);
    case "boolean":
      return parseBooleanParam(schema, value, isJson);
    case "date":
      return parseDateParam(schema, value);
    case "array":
      return parseArrayParam(schema, value, isJson);
    default:
      return parseObjectParam(schema, value, isJson);
    }
  }
};

module.exports = wsUtil;
/**
 *
 * @param schema
 * @param value
 * @param isJson
 * @returns
 */
function parseIntParam(schema, value, isJson){
  log.debug("parseIntParam");
  if(isJson && typeof(value)=="number" && value%1===0) {
    log.info("return value directly");
    return value;
  }

  if(!value){
    if(schema.required){
      throw new Error("required parameter");
    }
    return undefined;
  }

  if(value.match(/[^\d]/)){
    throw new Error(util.format("type mismatch: %s is not integer", value));
  }
  return parseInt(value);
}

/**
 *
 * @param schema
 * @param value
 * @param isJson
 * @returns
 */
function parseFloatParam(schema, value, isJson){
  if(isJson && typeof(value)=="number") return value;

  if(!value){
    if(schema.required){
      throw new Error("required parameter");
    }
    return undefined;
  }
  if(!value.match(/^\d+(\.\d+)?$/)){
    throw new Error(util.format("type mismatch: %s is not float", value));
  }
  return parseFloat(value);
}

/**
 *
 * @param schema
 * @param value
 * @returns
 */
function parseStringParam(schema, value){
  if(typeof(value)=="string") return value;
  if(schema.required)
    throw new Error(util.format("type mismatch: %s is not string", value));
  return undefined;
}

/**
 *
 * @param schema
 * @param value
 * @param isJson
 * @returns
 */
function parseBooleanParam(schema, value, isJson){
  if(isJson && typeof(boolean)=="boolean") return value;

  if(!value){
    if(schema.required){
      throw new Error("required parameter");
    }
    return undefined;
  }

  if(!value.match(/^true$|^false$/i)){
    throw new Error(util.format("type mismatch: %s is not boolean", value));
  }
  return value.toLowerCase()=="true";
}

/**
 *
 * @param schema
 * @param value
 * @returns
 */
function parseDateParam(schema, value){
  var d = new Date(value);
  if(d.toString().toLowerCase()=="invalid date"){
    if(schema.required){
      throw new Error(util.format("type mismatch: %s is not date", value));
    }
    return undefined;
  }
  return d;
}

/**
 *
 * @param schema
 * @param value
 * @param isJson
 * @returns {Array}
 */
function parseArrayParam(schema, value, isJson){
  log.debug("parseArrayParam");

  if(!util.isArray(value)){
    if(schema.required) throw util.format("type mismatch: %s is not array", value);
    return undefined;
  }

  var a = [];
  for(var i = 0; i<value.length; i++){
    log.debug("parseArrayParam | i: %d", i);
    a[i] = wsUtil.getValue(schema.items,value[i],isJson);
  }
  return a;
}

/**
 *
 * @param schema
 * @param value
 * @param isJson
 * @returns {___anonymous3529_3530}
 */
function parseObjectParam(schema, value, isJson){
  log.info("parseObjectParam");
  var a = {};
  for(var i in schema){
    a[i] = wsUtil.getValue(schema[i],value[i],isJson);
  }
  return a;
}

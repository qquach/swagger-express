var util = require("util");
var wsUtil = {
  /**
   * validate the format of parameter type
   * @param schema: declaration of the schema
   * @param value: value need to parse
   * @param isJson: special handling for json object, since it already parsed to correct type
   */
  getValue: function(schema, value, isJson){
  //check for required
    /*
    if(param.required && !value){
      throw util.format("missing required parameter: %s",i);
    }*/
    console.log(util.format("schema: %j, value: %j, isJson: %s",schema ,value, isJson));
    switch(schema.type){
    case "integer":
      return parseIntParam(schema,value,isJson);
    case "float":
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
  if(isJson && typeof(value)=="number" && value%1===0) return value;

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
  if(isJson){
    if(!util.isArray(value) && schema.required) throw util.format("type mismatch: %s is not array", value);
    return undefined;
  }
  var a = [];
  for(var i = 0;i<value.length;i++){
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
  var a = {};
  for(var i in schema){
    a[i] = wsUtil.getValue(schema[i],value[i],isJson);
  }
  return a;
}

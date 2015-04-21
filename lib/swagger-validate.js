/**
 * validate swagger
 * http://json-schema.org/latest/json-schema-validation.html
 */

module.exports = function(obj,schema){
  if(!schema){
    throw "schema is not defined";
  }
  switch(schema.type){
    case "integer":
    case "number":
      validateNumberSchema(schema);
      return validateNumber(obj, schema);
    case "string":
      validateStringSchema(schema);
      return validateString(obj, schema);
    case "array":
      validateArraySchema(schema);
      return validateArray(obj, schema);
    default:
      //console.log('validate object');
      validateObjectSchema(schema);
      return validateObject(obj, schema);
  }
}

function validateNumberSchema(schema){
  if(schema.multipleOf!=undefined && (!isInteger(schema.multipleOf) || schema.multipleOf<=0)){
    throw "multipleOf must be a positive integer";
  }
  if(schema.maximum!=undefined && typeof(schema.maximum)!="number"){
    throw "maximum must be a number";
  }
  if(schema.exclusiveMaximum!=undefined && typeof(schema.exclusiveMaximum)!="boolean"){
    throw "exclusiveMaximum must be a boolean";
  }
  if(schema.minimum!=undefined && typeof(schema.minimum)!="number"){
    throw "minimum must be a number";
  }
  if(schema.exclusiveMinimum!=undefined && typeof(schema.exclusiveMinimum)!="boolean"){
    throw "exclusiveMinimum must be a boolean";
  }
}

function validateNumber(num, schema){
  if(schema.multipleOf!==undefined){
    if(num % schema.multipleOf!==0){
      throw "number is not a multipleOf";
    }
  }
  if(schema.maximum!=undefined){
    if(schema.exclusiveMaximum && num >= schema.maximum){
      throw "number is larger than or equal exclusiveMaximum";
    }
    if(num > schema.maximum){
      throw "number is larger maximum";
    }
  }
  if(schema.minimum!=undefined){
    if(schema.exclusiveMinimum && num <= schema.minimum){
      throw "number is less than or equal exclusiveMinimum";
    }
    if(num < schema.minimum){
      throw "number is less than minimum";
    }
  }
  return true;
}

function validateStringSchema(schema){
  if(schema.maxLength!=undefined && (!isInteger(schema.maxLength) || schema.maxLength<0)){
    throw "maxLength must be a none negative integer";
  }
  if(schema.minLength!=undefined && (!isInteger(schema.minLength) || schema.minLength<0)){
    throw "minLength must be a none negative integer";
  }
  if(schema.pattern!=undefined && typeof(schema.pattern)!="string"){
    throw "pattern must be a string";
  }
}

function validateString(str, schema){
  if(schema.maxLength != undefined && str.length > schema.maxLength){
    throw "string length is bigger than maxLength";
  }
  if(schema.minLength != undefined && str.length < schema.minLength){
    throw "string length is smaller than minLength";
  }
  if(schema.pattern != undefined){
    var pattern = schema.pattern.replace(/\\/g,"\\\\").replace(/\./g,"\\.");
    var regex = new RegExp(schema.pattern);
    if(regex.test(str)){
      throw "string does not match pattern";
    }
  }
  return true;
}
function validateArraySchema(schema){
  if(schema.maxItems!=undefined && (!isInteger(schema.maxItems) || schema.maxItems<0)){
    throw "maxItems of array schema must be positive integer";
  }
  if(schema.minItems!=undefined && (!isInteger(schema.minItems) || schema.minItems<0)){
    throw "minItems of array schema must be positive integer";
  }
  if(schema.uniqueItems!=undefined && typeof(schema.uniqueItems)!="boolean"){
    throw "uniqueItems must be a boolean";
  }
}

function validateArray(array, schema){
  if(schema.maxItems!=undefined && schema.maxItems < array.length){
    throw "array length is larger than max items";
  }
  if(schema.minItems!=undefined && schema.minItems > array.length){
    throw "array length is less than min items";
  }
  if(schema.uniqueItems!=undefined){
    for(var i=0;i<array.length-1;i++){
      for(var j=i+1;j<array.length;j++){
        if(deepEqual(array[i],array[j])){
          throw "array items are not unique";
        }
      }
    }
  }
  return true;
}

function validateObjectSchema(schema){
  //console.log('validateObjectSchema');
  if(schema.maxProperties!=undefined && (!isInteger(schema.maxProperties)||schema.maxProperties<0)){
    throw "maxProperties must be positive integer";
  }
  if(schema.minProperties!=undefined && (!isInteger(schema.minProperties)||schema.minProperties<0)){
    throw "minProperties must be positive integer";
  }
  if(schema.required!=undefined && (!isArray(schema.required) || !isUniqueKey(schema.required))){
    throw "required must be and aray";
  }
}

function validateObject(obj, schema){
  //console.log('validateObject');
  if(schema.maxProperties!=undefined && getPropertyCount(obj) > schema.maxProperties){
    throw "property count larger than max properties";
  }
  //console.log('pass max');
  if(schema.minProperties!=undefined && getPropertyCount(obj) < schema.minProperties){
    throw "property count less than min properties";
  }
  //console.log('pass min');
  if(schema.required!=undefined){
    //console.log("length: %s", schema.required.length);
    for(var i = 0; i < schema.required.length; i++){
      //console.log("i: %s", i);
      if(!obj.hasOwnProperty(schema.required[i])){
        throw "object does not has required properties";
      }
    }
  }
  return true;
}

/**
 * only consider own properties of an object. If share properties or methods belong to prototype will not be considered.
 * @param obj
 * @returns {Number}
 */
function getPropertyCount(obj){
  //console.log('getPropertyCount');
  var count = 0;
  for(var i in obj){
    if(obj.hasOwnProperty(i)) count++;
  }
  return count;
}

function isUniqueKey(array){
  for(var i=0;i<array.length-1;i++){
    if(typeof(array[i])!="string"){
      throw "key must be string";
    }
    for(var j=i+1;j<array.length;j++){
      if(array[i]==array[j]){
        throw "key not unique";
      }
    }
  }
  return true;
}

function deepEqual(obj1, obj2){
  if(obj1===obj2) return true;
  var type1 = Object.prototype.toString.apply(obj1);
  var type2 = Object.prototype.toString.apply(obj2);
  if(type1!=type2) return false;
  if(type1=="[object Array]"){
    if(obj1.length!=obj2.length) return false;
    for(var i = 0; i<obj1.length; i++ ){
      if(!deepEqual(obj1[i],obj2[i])) return false;
    }
    return true;
  }
  if(type1=="[object Object]"){
    var check = {};
    for(var i in obj1){
      check[i]=true;
      if(!deepEqual(obj1[i],obj2[i])) return false;
    }
    for(var i in obj2){
      if(!check[i]) return false;
    }
    return true;
  }
  if(type1=="[object Date]"){
    return obj1.getTime()==obj2.getTime();
  }
  if(type1=="[object RegExp]"){
    return obj1.toString()==obj2.toString();
  }
  return false;
}

function isInteger(num){
  return typeof(num)=="number" && Math.floor(num)===num;
}

function isArray(arr){
  return Object.prototype.toString.call(arr)=="[object Array]";
}
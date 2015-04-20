/**
 * New node file
 */
var swValidate = require("../lib/swagger-validate.js");
module.exports = {
    /*
     * if(schema.multiplOf!=undefined && (!isInteger(schema.multipleOf) || schema.multipleOf<=0)){
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
  }*/
    validateNumberSchema: function(test){
      var schema = {
          type:"number",
          multipleOf:0.6
      }
      checkMessage(test,2,schema,"multipleOf must be a positive integer");
      schema = {
          type:"number",
          multipleOf:-2
      }
      checkMessage(test,2,schema,"multipleOf must be a positive integer");
      schema = {
          type:"number",
          maximum: 'test'
      }
      checkMessage(test,2,schema,"maximum must be a number");
      schema = {
          type:'integer',
          exclusiveMaximum: "sdf"
      }
      checkMessage(test,2,schema,"exclusiveMaximum must be a boolean");
      schema = {
          type:'integer',
          minimum: "sdf"
      }
      checkMessage(test,2,schema,"minimum must be a number");

      schema = {
          type:'integer',
          exclusiveMinimum: "sadf"
      }
      checkMessage(test,2,schema,"exclusiveMinimum must be a boolean");

      test.done();
    }
}

function checkMessage(test,obj,schema,message){
  try{
    swValidate(obj,schema);
  }
  catch(msg){
    test.equal(msg,message);
  }
}
/**
 * New node file
 */
var swValidate = require("../lib/swagger-validate.js");
module.exports = {
    validateParameter: function(test){
      checkMessage(test,2,null,"schema is not defined");
      test.done();
    },
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
    },
    validateNumber: function(test){
      var schema = {
          type:'integer',
          multipleOf: 2
      }
      test.ok(swValidate(4,schema));
      checkMessage(test,3,schema,"number is not a multipleOf");

      schema = {
          type:'integer',
          maximum: 3
      }
      test.ok(swValidate(2,schema));
      checkMessage(test,4,schema,"number is larger maximum");
      schema = {
          type:'integer',
          maximum: 3,
          exclusiveMaxium: true
      }
      test.ok(swValidate(2,schema));
      checkMessage(test,3,schema,"number is larger than or equal exclusiveMaximum");

      schema = {
          type:'integer',
          minimum: 3
      }
      test.ok(swValidate(4,schema));
      checkMessage(test,2,schema,"number is less than minimum");

      schema = {
          type:'integer',
          minimum: 3,
          exclusiveMinimum: true
      }
      checkMessage(test,3,schema,"number is less than or equal exclusiveMinimum");
      test.done();
    },
    validateStringSchema: function(test){
      var schema = {
          type:'string',
          maxLength: 'asdf'
      }
      checkMessage(test,'asd',schema,"maxLength must be a none negative integer");

      schema = {
          type:'string',
          minLength: 'asdf'
      }
      checkMessage(test,'asd',schema,"minLength must be a none negative integer");

      schema = {
          type:'string',
          pattern: 1234
      }
      checkMessage(test,'asd',schema,"pattern must be a string");
      test.done();
    },
    validateString: function(test){
      var schema = {
          type:'string',
          maxLength: 3
      }
      test.ok(swValidate("asd",schema));
      checkMessage(test,'asdsd',schema,"string length is bigger than maxLength");

      schema = {
          type:'string',
          minLength: 3
      }
      test.ok(swValidate("as3d",schema));
      checkMessage(test,'as',schema,"string length is smaller than minLength");

      schema = {
          type:'string',
          pattern: '\d+\.\w{3}'
      }
      test.ok(swValidate("12.as3",schema));
      checkMessage(test,'aasdf',schema,"string does not match pattern");

      schema = {
          type:'string',
          pattern: '\(\d{3}\) \d{3}-\d{4}'
      }
      test.ok(swValidate("(408) 123 4567",schema));

      schema = {
          type:'string',
          pattern: '\d{4}\/\d{2}\/\d{2}'
      }
      test.ok(swValidate("2000/03/12",schema));
      test.done();
    },
    validateArraySchema: function(test){
      schema = {
          type:'array',
          items:{
            type:"number"
          },
          maxItems: 'adsf'
      }
      checkMessage(test,[],schema,"maxItems of array schema must be positive integer");

      schema = {
          type:'array',
          items:{
            type:"number"
          },
          minItems: 'adsf'
      }
      checkMessage(test,[],schema,"minItems of array schema must be positive integer");

      schema = {
          type:'array',
          items:{
            type:"number"
          },
          uniqueItems: 'ads'
      }
      checkMessage(test,[],schema,"uniqueItems must be a boolean");

      test.done();
    },
    validateArray: function(test){
      schema = {
          type:'array',
          items:{
            type:"number"
          },
          maxItems: 3
      }
      test.ok(swValidate([1,2,3],schema));
      checkMessage(test,[1,2,3,4],schema,"array length is larger than max items");

      schema = {
          type:'array',
          items:{
            type:"number"
          },
          minItems: 3
      }
      test.ok(swValidate([1,2,3,3],schema));
      checkMessage(test,[1,2],schema,"array length is less than min items");

      schema = {
          type:'array',
          items:{
            type:"number"
          },
          uniqueItems: true
      }
      test.ok(swValidate([1,2,3,4],schema));
      checkMessage(test,[1,2,1,3],schema,"array items are not unique");

      test.done();
    },
    validateObjectSchema: function(test){
      var schema = {
          type:"user",
          maxProperties: 'asd'
      }
      checkMessage(test,{},schema,"maxProperties must be positive integer");

      schema = {
          type:"user",
          minProperties: 'asd'
      }
      checkMessage(test,{},schema,"minProperties must be positive integer");

      schema = {
          type:"user",
          required: 'asd'
      }
      checkMessage(test,{},schema,"required must be and aray");
      test.done();
    },
    validateObject: function(test){
      var schema = {
          type:"user",
          maxProperties: 3
      }
      //console.log('v0');
      test.ok(swValidate({'a':'A','b':'B'},schema));
      //console.log('v1');
      checkMessage(test,{'a':"A",'b':"B",'c':'C','d':'D'},schema,"property count larger than max properties");
      //console.log('v2');
      schema = {
          type:"user",
          minProperties: 2
      }
      test.ok(swValidate({'a':'A','b':'B'},schema));
      //console.log('v3');
      checkMessage(test,{'a':"A"},schema,"property count less than min properties");
      //console.log('v4');
      schema = {
          type:"user",
          required: ['a','b']
      }
      test.ok(swValidate({'a':'A','b':'B'},schema));
      //console.log('v5');
      checkMessage(test,{'a':"A",'c':"C"},schema,"object does not has required properties");
      //console.log('v6');
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
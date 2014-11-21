var util = require("util");
module.exports = {
  /**
   * validate the format of parameter type
   * @param model: declaration of the model
   * @param value: value need to parse
   * @param isJson: special handling for json object, since it already parsed to correct type
   */
  getValue: function(model, value, isJson){
  //check for required
    /*
    if(param.required && !value){
      throw util.format("missing required parameter: %s",i);
    }*/
    console.log(util.format("model: %j, value: %j, isJson: %s",model ,value, isJson));
    switch(model.type){
    case "integer":
      if(isJson && typeof(value)=="number" && value%1===0) return value;
      else if(!value || value.match(/[^\d]/)){
        throw util.format("type mismatch: %s is not integer", value);
      }
      return parseInt(value);
    case "float":
      if(isJson && typeof(value)=="number") return value;
      else if(!value || !value.match(/^\d+(\.\d+)?$/)){
        throw util.format("type mismatch: %s is not float", value);
      }
      return parseFloat(value);
    case "string":
      if(typeof(value)=="string") return value;
      throw util.format("type mismatch: %s is not string", value);
    case "boolean":
      if(isJson && typeof(boolean)=="number") return value;
      else if(!value || !value.match(/^true$|^false$/i)){
        throw util.format("type mismatch: %s is not boolean", value);
      }
      return value.toLowerCase()=="true";
    case "date":
      var d = new Date(value);
      if(d.toString().toLowerCase()=="invalid date"){
        throw util.format("type mismatch: %s is not date", value);
      }
      return d;
    case "array":
      var a = [];
      if(isJson && !isArray(value)){
        throw util.format("type mismatch: %s is not array", value);
      }
      var correctedValue = value;
      if(!isJson && !util.isArray(value)){
        //there for xml. <items><item>a</item></items> => {items:{item:[a]}}, what we want is {items:[{item:a}]}
        console.log("correcting array item");
        correctedValue=[];
        for(var i in value){
          correctedValue.push({i:value[i]});
        }
      }
      for(var i = 0;i<correctedValue.length;i++){
        a[i] = this.getValue(model.items,value[i],isJson);
      }
      return a;
    default:
      //defined model - object
      var a = {};
      for(var i in model){
        a[i] = this.getValue(model[i],value[i],isJson);
      }
      return a;
    }
  }
};

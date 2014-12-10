var util = require("util");
module.exports = {
    debug: function(){
      console.log(util.format.apply(this,arguments));
    },
    info: function(){
      console.info(util.format.apply(this,arguments));
    },
    warn: function(){
      console.warn(util.format.apply(this,arguments));
    },
    error: function(){
      console.error(util.format.apply(this,arguments));
    }
};
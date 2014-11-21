var toy = {
  type:"string",
  required:true,
  description:"name of the toy"
};
module.exports = {
    name: {
      type: "string",
      required: true,
      description: "user name"
    },
    age: {
      type:"float",
      required: true,
      description: "age of user"
    },
    toys:{
      type:"array",
      items:toy,
      required: false,
      description: "toy users have"
    }
};

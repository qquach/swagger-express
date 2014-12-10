/**
 * Directly map to swagger definitions with slightly adding property structures
 */
module.exports = {
    "user":{
      "name":{
        "type":"string",
        "description":"user name",
        "required":true
      },
      "age":{
        "type":"integer",
        "description":"age of user"
      }
    },
    "class":{
      "subject":{
        "type":"string"
      },
      "grade":{
        type:"string"
      },
      students:{
        type:"array",
        items: "user"
      },
      extra:{
        type:"array",
        items:{
          "a":{
            type:"string"
          },
          "b":{
            type:"integer"
          }
        }
      },
      test:{
        type:"user"
      },
      other:{
        type:{
          "c":{type:"string"},
          "d":{type:"number"}
        }
      }
    }
};
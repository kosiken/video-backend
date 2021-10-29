const path = require("path");

const { readFile } = require("fs").promises;

module.exports = {
  friendlyName: "Update privacy policy",

  description: "",

  inputs: {
 
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },
  },

  fn: async function (inputs, exits) {
    let tcPath = path.join(process.cwd(), "data/terms-and-conditions.md");

    let file = await readFile(tcPath, {encoding: 'utf-8'});

    return exits.success({
      path: tcPath,
      file
    });
  },
};

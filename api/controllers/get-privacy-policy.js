const path = require("path");

const {readFile} = require("fs").promises;

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
    let privacyPolicyPath = path.join(process.cwd(), "data/privacy-policy.md");

    let file = await readFile(privacyPolicyPath, {
      encoding: 'utf-8'
    })

    return exits.success({
      path: privacyPolicyPath,
      file
    });
  },
};

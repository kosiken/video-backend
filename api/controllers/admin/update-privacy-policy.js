const path = require("path");

const { writeFile } = require("fs").promises;

module.exports = {
  friendlyName: "Update privacy policy",

  description: "",

  inputs: {
    body: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },
  },

  fn: async function (inputs, exits) {
    let privacyPolicyPath = path.join(process.cwd(), "data/privacy-policy.md");

    let file = await writeFile(privacyPolicyPath, inputs.body)

    return exits.success({
      policy: privacyPolicyPath,
      file
    });
  },
};

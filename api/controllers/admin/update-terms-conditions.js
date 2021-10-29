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
    let tcPath = path.join(process.cwd(), "data/terms-and-conditions.md");

    let file = await writeFile(tcPath, inputs.body)

    return exits.success({
      path: tcPath,
      file
    });
  },
};

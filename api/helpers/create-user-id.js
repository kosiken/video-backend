const uuid = require("uniqid");

module.exports = {
  friendlyName: "Create user id",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    let n = uuid();

    return exits.success(n);
    // TODO
  },
};

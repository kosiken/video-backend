const bcrypt = require("bcryptjs");

/**
 * 
 * @param {string} password The password to validate
 * @param {string} hash The hash for validation
 * @returns {Promise<boolean>}
 */
function validatePassword(password, hash) {
  return new Promise((resolve, reject) => {
    let valid = false;
    try {
      valid = bcrypt.compareSync(password, hash);
      resolve(valid);
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = {
  friendlyName: "Validate password",

  description: "",

  inputs: {
    password: {
      type: "string",
      example: "`INSERT ID`",
      description: "The password to validate",
      required: true,
    },
    hash: {
      type: "string",
    
      description: "The hash for validation",
      required: true,
    }

  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    // TODO

    return await validatePassword(inputs.password, inputs.hash);
  },
};

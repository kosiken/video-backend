const jwt = require("jsonwebtoken");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "lion";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "lion_refresh";
function checkToken(token, refresh) {
  return new Promise((res, rej) => {
    jwt.verify(token,refresh ? REFRESH_TOKEN_SECRET : TOKEN_SECRET, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data);
    });
  });
}
module.exports = {
  friendlyName: "Verify token",

  description: "This is used to verify a web token",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
    refresh: {
      type: "boolean",
      defaultsTo: false
    }
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    // TODO
    let ans = await checkToken(inputs.token, inputs.refresh);
    return ans;
  },
};

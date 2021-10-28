const jwt = require("jsonwebtoken");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "lion";

module.exports = {
  friendlyName: "Create Web Token",

  description: "Return a jwt and a refresh token for a user",

  inputs: {
    id: {
      type: "string",
      example: "`INSERT ID`",
      description: "The id of the user",
      required: true,
    },
    role: {
      type: "string",
      example: "Patient",
      enum: ["new_user", "patient", "physician", "admin"],
      description: "The role of the user",
    },
    isAdmin: {
      type: "boolean",
    },
    createRefresh: {
      type: "boolean",
      defaultsTo: true,
    },
  },

  fn: async function (user, exits) {
    const accessToken = jwt.sign(
      { id: user.id, role: user.role || "new_user", isAdmin: !!user.isAdmin },
      TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return exits.success([accessToken, ""]);
  },
};

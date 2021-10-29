module.exports = {
  friendlyName: "Signup",

  description: "Signup user.",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const token = this.req.query.token;
      if (!token)
        return exits.badRequest({
          message: "token is required",
        });

      let object = await sails.helpers.verifyToken.with({ token });
      let user = await User.findOne({
        passwordResetToken: object.id,
      });
      if (!user) {
        return exits.badRequest({
          message: "Invalid token",
        });
      }
      if (user.passwordResetTokenExpiresAt < Date.now()) {
        return exits.badRequest({
          message: "Expired token",
        });
      } else {
        object.isValid = true;
      }
      return exits.success(object);
    } catch (err) {
      if (err.name === "E_UNIQUE") {
        return exits.badRequest({
          message: err.message,
        });
      } else {
        return exits.serverError(err.message);
      }
    }
  },
};

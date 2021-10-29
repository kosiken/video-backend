module.exports = {
  friendlyName: "Reset password",

  description: "",

  inputs: {
    passwordResetToken: {
      type: "string",
      description:
        "A unique token used to verify the user's identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.",
      required: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 4,
      maxLength: 60,
    },
  },

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
      description: "There is a problem on the server",
      responseType: "serverError",
      statusCode: 500,
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    try {
      inputs.password = await sails.helpers.hashPassword.with({
        password: inputs.password,
      });
      inputs.passwordResetTokenExpiresAt = 0;
      let user = await User.updateOne(
        {
          passwordResetToken: inputs.passwordResetToken,
        },
        {
          ...inputs,
          passwordResetToken: "",
        }
      ).fetch();

      if (!user) {
        return exits.badRequest({
          message: "Invalid password reset request",
        });
      } else {
        console.log(user);
      }
      user = await sails.helpers.sanitizeUser.with({ user });
      return exits.success(user);
    } catch (error) {
      return exits.serverError({
        message: error.message,
      });
    }
  },
};

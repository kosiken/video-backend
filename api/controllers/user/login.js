module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
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
      description:
        "The requesting user agent has been successfully registered",
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
      let model = await User.findOne({
        emailAddress: inputs.emailAddress,
      });

      if (!model) {
        return exits.notFound({
          message: "User with Email " + inputs.emailAddress + " does not exist",
        });
      }

      let valid = await sails.helpers.validatePassword(
        inputs.password,
        model.password
      );

      if (!valid) {
        return exits.badRequest({
          message: "The password is not valid",
        });
      }
      sails.log.info("Setting cookie");
      this.req.session.userId = model.id;
      let [token] = await sails.helpers.createWebToken.with({
        id: model.id,
        createRefresh: true,
      });

      let user = await sails.helpers.sanitizeUser.with({ user: model });
      user.token = token;
      // All done.
      return exits.success(user);
    } catch (error) {
      console.log(exits)
      return exits.serverError({ message: error.message });
    }
  },
};

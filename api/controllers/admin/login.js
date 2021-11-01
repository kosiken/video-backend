module.exports = {
  friendlyName: "Login",

  description: "Login admin.",

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
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
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
      let model = await Admin.findOne({
        emailAddress: inputs.emailAddress,
      });

      if (!model) {
        return exits.notFound({title: "Login",
          hasError: true,
          errorMessage:
            "Admin with Email " + inputs.emailAddress + " does not exist",layout:"layouts/layout-admin"
        });
      }

      let admin = model;
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
      console.log(this.req.query)
      this.req.session.userId = model.id;
      let [token] = await sails.helpers.createWebToken.with({
        id: model.id,
        createRefresh: true,
      });
      admin.token = token
      
      return exits.success(admin)
    } catch (error) {
      console.log(exits);
      return exits.serverError({ message: error.message });
    }
  },
};

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
      responseType: "view",
      viewTemplatePath: "pages/admin/login",
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
      
      return this.res.redirect(this.req.query.redirectTo || "/admin/api/dashboard");
    } catch (error) {
      console.log(exits);
      return exits.serverError({ message: error.message });
    }
  },
};

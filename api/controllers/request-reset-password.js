module.exports = {
  friendlyName: "Request reset password",

  description: "",

  inputs: {
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
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
      let retHtml = this.req.query.retHtml === "true";
      let model = await User.findOne({
        emailAddress: inputs.emailAddress,
      });

      if (!model) {
        return exits.notFound({
          message: "User with Email " + inputs.emailAddress + " does not exist",
        });
      }
      const user = model;
      const id = await sails.helpers.createUserId.with();
      let [token] = await sails.helpers.createWebToken.with({
        id,
        createRefresh: false,
        role: "reset_token",
      });

      const expiresIn = Date.now() + 30 * 60 * 1000;
      await User.updateOne(
        {
          id: model.id,
        },
        {
          passwordResetToken: id,
          passwordResetTokenExpiresAt: Date.now() + 30 * 60 * 1000,
        }
      );
      let html = await sails.helpers.sendTemplateEmail.with({
        template: "email-reset-password",
        from: sails.config.custom.fromEmailAddress,
        subject: "Verify Change of Password",
        to: user.emailAddress,
        toName: user.fullName,
        templateData: {
          fullName: user.fullName,
          token: token,
        },
      });
      console.log(html);
      if (retHtml) {
        return this.res.end(html.htmlEmailContents);
      }
      return exits.success({
        passwordReset: true,
        expiresIn,
      });
    } catch (error) {
      console.log(exits);
      return exits.serverError({ message: error.message });
    }
  },
};

module.exports = {
  friendlyName: 'Signup',

  description: 'Signup user.',

  inputs: {
    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'mary.sue@example.com',
    },

    password: {
      type: 'string',
      required: true,

      minLength: 10,
      maxLength: 60,
    },

    fullName: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 60,
    },
  },

  exits: {
    success: {
      description: 'The requesting user agent has been successfully registered',
      statusCode: 201,
    },
    badRequest: {
      description: 'There is a problem with input parameters',
      responseType: 'badRequest',
    },
    serverError: {
      description: 'There is a problem with input parameters',
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {
    inputs.password = await sails.helpers.hashPassword.with({
      password: inputs.password,
    });

    let user;
    let html;
    try {
      inputs.emailProofToken = await sails.helpers.createUserId.with();
      inputs.emailProofTokenExpiresAt = Date.now() + (2 * 3600 * 1000 );
      user = await User.create(inputs).fetch();
  
      html = await sails.helpers.sendTemplateEmail.with({
        template: 'email-verify-account',
        from: sails.config.custom.fromEmailAddress,subject: "Verify your Ereder Account",
        to: user.emailAddress,
        templateData: {
          fullName: user.fullName,
          token: user.emailProofToken
        },
      });
    } catch (err) {
   
      if ((err.name === 'E_UNIQUE')) {
        return exits.badRequest({
          message: err.message,
        });
      } else {
        return exits.serverError(err.message);
      }
    }
console.log(html)
    return exits.success(user);
  },
};

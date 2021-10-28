module.exports = {
  friendlyName: 'Verify email',

  description: '',

  inputs: {},

  exits: {
    success: {
      description: 'The requesting user agent has been successfully registered',
      statusCode: 201,
    },
    notFound: {
      description: 'There is a problem with input parameters',
      responseType: 'notFound',
    },
    serverError: {
      description: 'There is a problem with input parameters',
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {
    // All done.
    let model = await User.updateOne(
      { emailProofToken: this.req.query.token },
      { emailStatus: 'confirmed', emailProofToken: '', emailProofTokenExpiresAt: 0}
    );
    console.log(this.req.hostname )
    if (model) {
      exits.success(model);
    } else {
      return exits.notFound({ message: 'No such token' });
    }
  },
};

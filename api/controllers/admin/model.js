module.exports = {
  friendlyName: "Model",

  description: "Model admin.",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
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
    const Models = {
      video: Video,
      channel: Channel,

      user: User,

      request: Request,
      transaction: Transaction,
      wallet: Wallet,
    };

    try {
      const req = this.req;
      const query = this.req.query;
      if (query && query.page) {
        page = query.page;
      }

      let theModel = Models[req.params.modelName];
      if (!theModel) {
        return exits.badRequest({
          message: `Cannot find ${req.params.modelName}, ${req.params.modelName} model does not exist`,
        });
      }
      const _model = Models[this.req.params.modelName];
      // console.log(_model);

      const objects = await _model.find();

      // All done.
      return exits.success(objects);
    } catch (error) {
      return exits.serverError({
        message: `Cannot load this page at this time error -> ${error.message}`,
      });
    }
  },
};

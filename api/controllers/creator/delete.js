module.exports = {
  friendlyName: "Analytics",

  description: "Analytics creator.",

  inputs: {
    records: {
      type: "string",
      required: true,
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
      comment: Comment,
      video: Video,
    };

    let modelName = this.req.params.modelName;

    try {
      if (!Models[modelName]) {
        return exits.badRequest({
          message: "Cannot get access to model " + modelName,
        });
      }
      let models = await Models[modelName].destroy({
        id: { in: inputs.records.split(",") },
      });

      return exits.success(models);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }

    // All done.
  },
};

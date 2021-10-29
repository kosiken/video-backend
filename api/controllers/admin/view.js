module.exports = {
  friendlyName: "View",

  description: "View admin.",

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
      this.req.params.modelName;
      let id = this.req.params.id;
      let view = this.req.params.modelName;

      let theModel = Models[view];
      if (!theModel) {
        return exits.badRequest({
          message: `Cannot find ${view} with id ${id}, ${view} model does not exist`,
        });
      }
      let object;
      if (view === "wallet") {
        object = await Models[view]
          .findOne({
            id,
          })
          .populate("owner");
      } else {
        object = await Models[view].findOne({
          id,
        });
      }
      if (!object) {
        return exits.notFound({
          message: `Cannot find ${view} with id ${id}`,
        });
      }

      if (object.password) delete object.password;
      delete object.updatedAt;

      for (let key in object) {
        if (object[key] === "" || (!object[key] && object[key] !== false)) {
          object[key] = "None";
        }
      }

      // All done.
      return exits.success(
        object,
      );
    } catch (error) {
      return exits.serverError({
        message: `Cannot load this page at this time error -> ${error.message}`,
      });
    }
  },
};

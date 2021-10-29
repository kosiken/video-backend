module.exports = {
  friendlyName: "Get wallet",

  description: "",

  inputs: {},

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
      if (!this.req.me.id) {
        return exits.unauthorizedRequest({ message: "No session found" });
      }
      let wallet = await Wallet.findOne({
        owner: this.req.me.id,
      });
      if (!wallet) {
        return exits.serverError({
          message: "Cannot find wallet for this profile.",
        });
      }
      return exits.success(wallet);
    } catch (error) {
      return exits.serverError({ message: error.message });
    }
  },
};

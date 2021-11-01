module.exports = {
  friendlyName: "Check for access",

  description: "",

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
      let { videoId } = this.req.params;

      let purchase = await Purchase.findOne({
        userWhoPurchased: this.req.me.id,
        videoPurchased: videoId,
      });

      if (!purchase) {
        return exits.notFound({
          message: "Cannot Find Purchase",
        });
      }
      // All done.
      return exits.success(purchase);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

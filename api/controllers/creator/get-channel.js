module.exports = {
  friendlyName: "Get channel",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },

    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    if (!this.req.me) {
      return exits.unauthorizedRequest({ message: "No Session found" });
    }

    let channel = await Channel.findOne({ user: this.req.me.id });

    if (!channel) {
      return exits.notFound({
        message: "Cannot find channel associated with prifile",
      });
    }

    let sanitizedChannel = await sails.helpers.sanitizeChannel.with({
      channel,
    });

    // All done.
    return exits.success(sanitizedChannel);
  },
};

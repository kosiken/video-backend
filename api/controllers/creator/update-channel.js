module.exports = {
  friendlyName: "Update channel",

  description: "Update a creator channel",

  inputs: {
    name: {
      type: "string",

      minLength: 3,
      maxLength: 60,
    },
    about: { type: "string" },
    shortDescription: { type: "string" },
    logo: { type: "string" },
    banner: { type: "string" },
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
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }
      if (Object.keys(inputs).length === 0) {
        return exits.badRequest({ message: "Nothing to update" });
      }
      let channel = await Channel.updateOne({ user: this.req.me.id }, inputs);
      let sanitizedChannel = await sails.helpers.sanitizeChannel.with({
        channel,
      });
      return exits.success(sanitizedChannel);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

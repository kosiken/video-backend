module.exports = {
  friendlyName: "Me",

  description: "Me user.",

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
      responseType: "notFound",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    // All done.
    let test = true; // TODO  false

    if (!this.req.me) {
      return exits.unauthorizedRequest({ message: "No Session found" });
    }
  let user = await sails.helpers.sanitizeUser.with({user: this.req.me})
    return exits.success(user );
  },
};

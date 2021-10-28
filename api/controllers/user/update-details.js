module.exports = {
  friendlyName: "Update details",

  description: "",

  inputs: {
    emailAddress: {
      type: "string",

      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
    },
    country: {
      type: "string",
    },
    dob: {
      type: "string",
    },
    fullName: {
      type: "string",
    },
    profilePic: {
      type: "string",
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
    if (!this.req.me) {
      return exits.unauthorizedRequest({ message: "No Session found" });
    }
    if (Object.keys(inputs).length === 0) {
      return exits.badRequest({ message: "Nothing to update" });
    }
    let user = await User.updateOne({id: this.req.me.id}, inputs);
    user = await sails.helpers.sanitizeUser.with({ user });

    // All done.
    return exits.success(user);
  },
};

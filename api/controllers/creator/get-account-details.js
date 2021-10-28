module.exports = {
  friendlyName: "Get account details",

  description: "",

  inputs: {},

  exits: {
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
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
    if (!this.req.me.isCreator) {
      return exits.badRequest({
        message: "You are not a creator",
      });
    }
    let user = this.req.me;

    const details = {
      bankName: user.bankName || "None",
      bankAccountName: user.bankAccountName || "None",
      bankAccountNumber: user.bankAccountNumber || "None",
    };
    if (details.bankAccountNumber !== "None") {
      details.bankAccountNumber =
        details.bankAccountNumber.slice(0, 4) + "******";
    }

    // All done.
    return exits.success(details);
  },
};

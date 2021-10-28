module.exports = {
  friendlyName: "Add card",

  description: "",

  inputs: {
    billingCardBrand: {
      type: "string",
      example: "Visa",
      required: true,
    },

    billingCardNumber: {
      type: "string",
      example: "5555555555554444",
      required: true,
      minLength: 10,
      maxLength: 16,
    },

    billingCardExpMonth: {
      type: "string",
      example: "08",
      required: true,
    },

    billingCardExpYear: {
      type: "string",
      example: "2023",
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
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }

      let details = {
        ...inputs,
        billingCardLast4: inputs.billingCardNumber.slice(-4),
        hasBillingCard: true,
      };
      delete details.billingCardNumber;

      await User.updateOne(
        {
          id: this.req.me.id,
        },
        {
          ...details,
        }
      );
      return exits.success(details);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

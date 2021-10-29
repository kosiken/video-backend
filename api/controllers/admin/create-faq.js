module.exports = {
  friendlyName: "Create faq",

  description: "",

  inputs: {
    title: {
      type: "string",
      required: true,
    },
    body: {
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
      const IsDev = sails.config.environment === "development";
      if (IsDev) {
        inputs.id = "none";
      }
      await Faq.create(inputs);
      return exits.success(inputs);
    } catch (error) {
      console.log(exits);
      return exits.serverError({ message: error.message });
    }
  },
};

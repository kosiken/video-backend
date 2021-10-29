module.exports = {
  friendlyName: "Add ticket",

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
    let id = this.req.me.id;

    try {
      const IsDev = sails.config.environment === "development";
      inputs = {
        ...inputs,
        user: this.req.me.id,
      };
      if (IsDev) {
        inputs.id = "none";
      }
      let t = await Ticket.create(inputs);
      return exits.success(t);
    } catch (error) {
      return exits.serverError({ message: error.message });
    }
  },
};

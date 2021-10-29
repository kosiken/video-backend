module.exports = {
  friendlyName: "Message admin",

  description: "",

  inputs: {
    // title: {type: "string",},

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
      responseType: "notFound",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    let ticketId = this.req.params.ticketId;
   
    try {
      let ticket = await Ticket.findOne({ id: ticketId });
      if (!ticket) {
        return exits.notFound({
          message: "Cannot Find ticket",
        });
      }

      const IsDev = sails.config.environment === "development";
      inputs = {
        ...inputs,
        messageType: "admin_to_use",
        user: ticket.user,
        ticket: ticket.id,
      };
      if (IsDev) {
        inputs.id = "none";
      }
      await Message.create(inputs);
      return exits.success({ sent: true });
    } catch (error) {
      return exits.serverError({ message: error.message });
    }
  },
};

module.exports = {
  friendlyName: "Get messages",

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
    let ticketId = this.req.params.ticketId;

    // All done.
    try {
      sails.log.info("getting messages");
      let ticket = await Ticket.findOne({ id: ticketId }).populate("messages");
      if (!ticket) {
        return exits.notFound({
          message: "No such ticket with id " + ticketId,
        });
      }

      let messages = ticket.messages;
      return exits.success(messages);
    } catch (error) {
      exits.serverError({
        message: error.message,
      });
    }
  },
};

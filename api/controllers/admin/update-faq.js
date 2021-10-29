module.exports = {
  friendlyName: "Update faq",

  description: "",

  inputs: {
    title: {
      type: "string",
    },
    body: {
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
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }
      
      if (Object.keys(inputs).length === 0) {
        return exits.badRequest({ message: "Nothing to update" });
      }
      let id = this.req.params.faqId;
      if(!id) {
        return exits.badRequest({ message: "No id parameter found" });

      }

      let faq = await Faq.updateOne({ id }, inputs);
   
      return exits.success(faq);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

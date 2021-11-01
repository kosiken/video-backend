module.exports = {
  friendlyName: "Analytics",

  description: "Analytics creator.",

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
let v = await Video.find({
  
})
    } catch (err) {
      return exits.serverError({ message: err.message });
    }

    // All done.
  },
};

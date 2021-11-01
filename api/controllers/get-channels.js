module.exports = {
  friendlyName: "All videos",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },  serverError: {
      description: "There is a problem on the server",
      responseType: "serverError",
      statusCode: 500,
    },   notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    try {

      let videos = await Channel.find();


      return exits.success(videos);
    } catch (error) {
      exits.serverError({message: error.message})
    }
 
  },
};


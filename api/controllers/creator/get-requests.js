module.exports = {


  friendlyName: 'Get requests',


  description: '',


  inputs: {

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
      if (!this.req.me.isCreator) {
        return exits.unauthorizedRequest({ message: "You are not yet a creator" });
      }
   
      let requests = await Request.find({
        userAssociated: this.req.me.id
      })

      return exits.success(requests);
      
    } catch (error) {

      exits.serverError({
        message: error.message
      });
    }

  }


};

module.exports = {


  friendlyName: 'Get comments',


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
      let videoId = this.req.params.videoId;
      if (!videoId) {
        return exits.badRequest({
          message: "videoId is required",
        });
      }
   

      let comments = await Comment.find({video: videoId}).populate("user");
      return exits.success(comments)

    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

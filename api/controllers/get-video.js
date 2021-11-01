module.exports = {


  friendlyName: 'Get video',


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
      let video = await Video.findOne({ id: videoId }).populate("channel");
      if (!video) {
        return exits.notFound({
          message: "video with id " + videoId + " not found",
        });
      }
      if(video.videoType === "restricted")
      {
        if(video.channel.user === this.req.me.id) {
          return exits.success(video)
        }
        else return exits.badRequest({
          message: "Cannot view this without an access token"
        })
      }

      return exits.success(video);
    
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

module.exports = {
  friendlyName: "Add comment",

  description: "",

  inputs: {
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
      let videoId = this.req.params.videoId;
      if (!videoId) {
        return exits.badRequest({
          message: "videoId is required",
        });
      }
      let video = await Video.findOne({ id: videoId });
      if (!video) {
        return exits.notFound({
          message: "video with id " + videoId + " not found",
        });
      }
      const IsDev = sails.config.environment === "development";
      if (IsDev) {
        inputs.id = "none";
      }
      let toCreate = { ...inputs, video: videoId, user: this.req.me.id };

      let comment = await Comment.create(toCreate).fetch();

      return exits.success(comment);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

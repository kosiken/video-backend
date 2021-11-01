module.exports = {
  friendlyName: "Get video",

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
    try {
      let { accessCode } = this.req.params;
      let { videoId } = this.req.query;
      if (videoId) {
        let video = await Video.findOne({
          id: videoId,
        });

        if (video) {
          video.url = "";
          return exits.success(video);
        }
      }

      if (!accessCode) {
        return exits.badRequest({
          message: "Purchase accessCode is required",
        });
      }

      console.log(accessCode)

      let purchase = await Purchase.findOne({ accessCode }).populate(
        "videoPurchased"
      );

      if (!purchase) {
        return exits.badRequest({
          message: "Purchase with accessCode " + accessCode + " not found",
        });
      }

      let video = purchase.videoPurchased;
      if (!video) {
        return exits.notFound({
          message: "video with  not found",
        });
      }
      let channel = await Channel.findOne({ id: video.channel });
      if (!channel) {
        return exits.notFound({
          message: "channel with  not found",
        });
      }

      video.channel = channel;

      return exits.success(video);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

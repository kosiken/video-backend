module.exports = {
  friendlyName: "Show video",

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
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
  },

  fn: async function (_, exits) {
    try {
      let viewing = 0;
      if (this.req.session) {
        viewing = this.req.session.videoViewing;
      }
      let _video = this.req.params.videoId;

      if (!_video) {
        return exits.badRequest({ message: "videoId is required" });
      }
      let video = await Video.findOne({ id: parseInt(_video) }).populate(
        "channel"
      );

      if (!video) {
        return exits.notFound({ message: "Video cannot be found" });
      }
      if (viewing === video.id) {
        // prevent excessive view counting
        return exits.success({
          video: video.viewCount,
          channel: video.channel.totalViews,
        });
      }
      this.req.session.videoViewing = video.id;

      let channel = await Channel.updateOne(
        { id: video.channel.id },
        {
          totalViews: video.channel.totalViews + 1,
        }
      );
      video = await Video.updateOne(
        { id: video.id },
        {
          viewCount: video.viewCount + 1,
        }
      );

      // All done.
      return exits.success({
        video: video.viewCount,
        channel: channel.totalViews,
      });
    } catch (error) {
      return exits.serverError({ message: error.message });
    }
  },
};

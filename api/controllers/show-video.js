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
      let video = await Video.findOne({ id: _video }).populate("channel");
      let channelViews = video.channel.totalViews;

      let duration = parseInt(this.req.query.duration);
      if (isNaN(duration)) {
        return exits.badRequest({
          message: "duration must be a number",
        });
      }

      if (!video) {
        return exits.notFound({ message: "Video cannot be found" });
      }
      if (viewing !== video.id) {
        // prevent excessive view counting
        sails.log.info("prevent prevent excessive view counting");

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
            totalViewTime:
              video.totalViewTime + parseInt(this.req.query.duration),
          }
        );

        // All done.
        return exits.success({
          video: video.viewCount,
          channel: channel.totalViews,
        });
      } else {
        video = await Video.updateOne(
          { id: video.id },
          {
            totalViewTime:
              video.totalViewTime + parseInt(this.req.query.duration),
          }
        );
        // All done.
        return exits.success({
          video: video.viewCount,
          channel: channelViews,
          
        });
      }
    } catch (error) {
      return exits.serverError({ message: error.message });
    }
  },
};

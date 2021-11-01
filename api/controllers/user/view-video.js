module.exports = {
  friendlyName: "View video",

  description: 'Display "Video" page.',
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
    let purchase = null;
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }

      inputs.duration = parseInt(this.req.query.duration || 1000);
      if (isNaN(inputs.duration)) {
        return exits.badRequest({
          message: "duration must be a number",
        });
      }
      let video = await Video.findOne({ id: this.req.params.videoId }).populate(
        "channel"
      );

      if (!video) {
        return exits.badRequest({
          message: "Cannot be viewing non existent video",
        });
      }

      if (video.videoType === "restricted") {
        let skip = video.channel.user === this.req.me.id;

        let accessToken = this.req.query.accessToken;
        if (!skip) {
          if (!accessToken) {
            return exits.badRequest({
              message: "Cannot be viewing restricted video without accessToken",
            });
          }
          purchase = await Purchase.findOne({ accessCode: accessToken });

          if (!purchase || purchase.videoPurchased !== video.id) {
            return exits.badRequest({
              message: "Cannot be view restricted video, invalid accessToken",
            });
          }
        }
      }

      if (inputs.duration > video.duration) {
        return exits.badRequest({
          message: `view duration ${inputs.duration} is greater than video total duration ${video.duration}`,
        });
      }

      let view = await View.updateOne(
        {
          userWhoViewed: this.req.me.id,
          video: video.id,
        },
        {
          duration: this.req.query.duration || 1000,
        }
      );

      if (!view) {
        if (!video.channel.id) {
          return exits.serverError({
            message: "Cannot find channel",
          });
        }

        const IsDev = sails.config.environment === "development";
        let toCreate = {
          video: video.id,
          duration: inputs.duration > 1000 ? inputs.duration : 1000,
          userWhoViewed: this.req.me.id,
          channel: video.channel.id,
          isPayedView: !!purchase,
        };
        if (IsDev) {
          toCreate.id = "none";
        }
        view = await View.create(toCreate).fetch();

        channel = await Channel.updateOne(
          {
            id: video.channel.id,
          },
          { totalViews: video.channel.totalViews + 1 }
        );
        video = await Video.updateOne(
          { id: video.id },
          {
            viewCount: video.viewCount + 1,
            totalViewTime: video.totalViewTime + inputs.duration,
          }
        );
      } else {
        video = await Video.updateOne(
          { id: video.id },
          {
            totalViewTime: video.totalViewTime + inputs.duration,
          }
        );
      }

      view.video = video;
      return exits.success(view);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

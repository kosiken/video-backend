module.exports = {
  friendlyName: "View video",

  description: 'Display "Video" page.',
  inputs: {
    video: {
      type: "number",
      required: true,
    },
    duration: {
      type: "number",
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
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }

      const { accessCode } = this.req.params;
      if (!accessCode) {
        return exits.badRequest({
          message: "Purchase accessCode is required",
        });
      }

      let purchase = Purchse.findOne({ accessCode }).populate("videoPurchased");
      if (!purchase) {
        return exits.badRequest({
          message: "Purchase with accessCode " + accessCode + " not found",
        });
      }
      let video = purchase.video;
      video.channel = await Channel.findOne({ id: video.channel });

      if (!video) {
        return exits.badRequest({
          message: "Cannot be viewing non existent video",
        });
      }

      let view = await View.updateOne(
        {
          userWhoViewed: this.req.me.id,
          video: video.id,
          isPayedView: true,
        },
        {
          duration: inputs.duration,
        }
      );

      if (!view) {
        if (!video.channel.id) {
          return exits.serverError({
            message: "Cannot find channel",
          });
        }
        view = await View.create({
          video: video.id,
          duration: inputs.duration > 1000 ? inputs.duration : 1000,
          userWhoViewed: this.req.me.id,
          channel: video.channel.id,
          isPayedView: true,
        }).fetch();

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

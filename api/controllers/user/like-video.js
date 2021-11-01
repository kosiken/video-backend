module.exports = {
  friendlyName: "Like video",

  description: "",

  inputs: {
    videoLiked: {
      type: "string",
      required: true,
    },
    channel: {
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
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }

      let like = await Like.findOne({
        likedBy: this.req.me.id,
        videoLiked: inputs.videoLiked,
      });
      if (!like) {
        let channel = await Channel.findOne({ id: inputs.channel });

        if (!channel) {
          return exits.badRequest({
            message: "Channel not found",
          });
        }

        let video = await Video.findOne({ id: inputs.videoLiked });
        if (!video) {
          return exits.notFound({
            message: "No such video",
          });
        }
        const IsDev = sails.config.environment === "development";
        if (IsDev) {inputs.id = "none";}
        like = await Like.create({
          ...inputs,
          likedBy: this.req.me.id,
        });
        await Video.updateOne({
          id: video.id,

        }, {
          likeCount: video.likeCount + 1
        })
      }
      return exits.success({like: true});
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

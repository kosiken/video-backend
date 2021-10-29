module.exports = {
  friendlyName: "Like video",

  description: "",

  inputs: {
    videoLiked: {
      type: "number",
      required: true,
    },
    channel: {
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

      let like = await Like.findOne({
        likedBy: this.req.me.id,
        videoLiked: inputs.videoLiked,
      });
      if (!like) {
        let channel = await Channel.findOne({ id: parseInt(inputs.channel) });

        if (!channel) {
          return exits.badRequest({
            message: "Channel not found",
          });
        }

        let video = await Video.findOne({ id: parseInt(inputs.videoLiked) });
        if (!video) {
          return exits.notFound({
            message: "No such video",
          });
        }

        like = await Like.create({
          ...inputs,id: 'none',
          likedBy: this.req.me.id,
        }).fetch();
      }
      return exits.success(like);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

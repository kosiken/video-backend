module.exports = {
  friendlyName: "Un like video",

  description: "",

  inputs: {
    videoLiked: {
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

      let like = await Like.destroyOne({
        likedBy: this.req.me.id,
        videoLiked: inputs.videoLiked,
      });
      if (!like) {
        return exits.badRequest({
          message: "Trying to unlike a video that you did not like",
        });
      }
      let video =await Video.findOne({
       id: inputs.videoLiked
      })

      if(video && video.likeCount > 0 ){
        await Video.updateOne({
          id: video.id,

        }, {
          likeCount: video.likeCount - 1
        })
      }
      return exits.success({like: false});
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

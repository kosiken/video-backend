module.exports = {
  friendlyName: "Upload video",

  description: "",

  inputs: {
    thumbnail: {
      type: "string",
    },
    price: {
      type: "number",
    },
    title: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 100,
    },

    description: {
      type: "string",
    },
  duration: {
type: "number",
required: true
  },
    videoType: {
      type: "string",
      isIn: ["public", "restricted"],
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
    // All done.
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }
      let uploadId = this.req.params.uploadId;
      let upload = await Upload.findOne({
        id: uploadId
      });

      if(!upload) {
        return exits.badRequest({
          message: "No associated with upload with id",
        });
      }
  
      inputs.url = "/uploads/" + upload.basename;
      let channel = await Channel.findOne({ user: this.req.me.id });

      if (!channel) {
        return exits.badRequest({
          message: "No channnel associated with profile",
        });
      }
      if (inputs.videoType === "restricted") {
        if (!inputs.price) {
          return exits.badRequest({
            message: "Cannot upload restricted video with no price",
          });
        } else if (inputs.price < 100) {
          return exits.badRequest({
            message: "Cannot upload restricted video with less than N100",
          });
        }
      }
      const IsDev = sails.config.environment === "development";
      if(IsDev) {
        inputs.id = 'none';
      }

      let video = await Video.create({
        ...inputs,
        channel: channel.id,
        uploaded: Date.now(),
      }).fetch();
      await Upload.destroyOne({
        id: upload.id
      });
      await Channel.updateOne(
        {
          id: channel.id,
        },
        {
          videoCount: channel.videoCount + 1,
        }
      );
      return exits.success(video);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

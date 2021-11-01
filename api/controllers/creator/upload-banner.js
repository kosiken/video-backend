const path = require("path");

module.exports = {
  friendlyName: "Video init",

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
  },

  fn: async function (inputs, exits) {
    let res = this.res;
    const req = this.req;
    let  channel = await Channel.findOne({
      user: req.me.id,
    });

    if(!channel) {
      return exits.badRequest({
        message: "Channel not found"
      })
    }

    this.req.file("banner").upload(
      {
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 500000000,
        dirname: require("path").resolve(
          sails.config.appPath,
          ".tmp/public/uploads"
        ),
      },
      async function whenDone(err, uploadedFiles) {
        if (err) {
          return res.serverError(err);
        }

        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest({ message: "No file was uploaded" });
        }
        let file = uploadedFiles[0];

      channel = await Channel.updateOne(
          {
            id: channel.id
          },

          {  banner: `/uploads/${path.basename(file.fd)}` }
        );

        return exits.success(channel);

     
    
      }
    ); // All done.
    return;
  },
};

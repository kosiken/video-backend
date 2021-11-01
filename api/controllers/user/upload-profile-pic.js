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
    let user = req.me;

    if(!user) {
      return exits.badRequest({
        message: "User not found"
      })
    }

    this.req.file("profile").upload(
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

        console.log(uploadedFiles)
        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest({ message: "No file was uploaded" });
        }
        let file = uploadedFiles[0];

      user = await User.updateOne(
          {
           id: user.id
          },

          {  profilePic: `/uploads/${path.basename(file.fd)}` }
        );
        user = await sails.helpers.sanitizeUser.with({user})

        return exits.success(user);

        // Get the base URL for our deployed application from our custom config
        // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
        var baseUrl = sails.config.custom.baseUrl;
      }
    ); // All done.
    return;
  },
};

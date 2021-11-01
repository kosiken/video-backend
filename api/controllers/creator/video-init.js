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
    let me = this.req.me;
    this.req.file("video").upload(
      {
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 500000000, dirname: require('path').resolve(sails.config.appPath, '.tmp/public/uploads')
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
        let toCreate = {
          basename: path.basename(file.fd),
        };
        const IsDev = sails.config.environment === "development";
        if (IsDev) {
          toCreate.id = "none";
        }
        let up = await Upload.create(toCreate).fetch();

        return res.json({ up, ok: true });

        // Get the base URL for our deployed application from our custom config
        // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
        var baseUrl = sails.config.custom.baseUrl;
      }
    ); // All done.
    return;
  },
};

const fs = require("fs");
const path = require("path");
module.exports = {
  friendlyName: "Load video",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    try {
      let pathName = this.req.params.videoUrl;
      let ext = this.req.query.ext;
      pathName += "." + ext;

      function fileThere(pathToCheck) {
        return new Promise((resolve, reject) => {
          let nb = path.join(process.cwd(), ".tmp/uploads", pathToCheck);

          fs.exists(nb, (exists) => {
            resolve([exists, nb]);
          });
        });
      }

      let [existsHere, nb] = await fileThere(pathName);
      if (!existsHere)
        return this.res.notFound({
          message: "Video " + pathName + " not found",
        });

      var SkipperDisk = require("skipper-disk");
      var fileAdapter = SkipperDisk(/* optional opts */);

      fileAdapter
        .read(nb)
        .on("error", function (err) {
          return this.res.status(500).send(err.message);
        })
        .pipe(this.res);
    } catch (error) {}
    // All done.
    return;
  },
};

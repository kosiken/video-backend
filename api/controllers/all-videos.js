module.exports = {
  friendlyName: "All videos",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },
  },

  fn: async function (inputs, exits) {
    let videos = await Video.find().populate("channel");
    return exits.success(videos);
  },
};

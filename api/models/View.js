module.exports = {
  attributes: {
    video: {
      model: "video",
      required: true,
    },
    channel: {
      model: "channel",
      required: true,
    },
    userWhoViewed: {
      model: "user",
      required: true,
    },
    duration: {
      min: 1000,
      defaultsTo: 1000,
      type: "number",
    },
    isPayedView: {
      type: "boolean",
      defaultsTo: false
    }
  },
};

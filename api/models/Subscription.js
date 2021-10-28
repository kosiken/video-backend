module.exports = {
  attributes: {
    userSubscribing: {
      model: "user",
      required: true,
    },
    channel: {
      model: "channel",
      required: true,
    },
  },
};

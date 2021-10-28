module.exports = {
  attributes: {
    likedBy: {
      model: "user",
      required: true,
    },
    videoLiked: {
      model: "video",
      required: true,
    },
    channel: {
      model: "channel",
      required: true,
    },
  },
};

module.exports = {
  attributes: {
    video: {
      model: "video",
      required: true,
    },
    body: {
      type: "string",
      required: true,
    },
    user: {
      model: "user",
      required: true,
    },
  },
};

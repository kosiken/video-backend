module.exports = {
  attributes: {
    userWhoPurchased: {
      model: "user",
      required: true,
    },
    videoPurchased: {
      model: "video",
      required: true,
    },
    channel: {
      model: "channel",
      required: true,
    },
    amountPaid: {
      type: "number",
      required: true,
    },
    accessCode: {
      type: "string",
      required: true
    }
  },
};

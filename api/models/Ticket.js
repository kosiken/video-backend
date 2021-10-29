module.exports = {
  attributes: {
    title: {
      type: "string",
      required: true,
    },
    body: {
      type: "string",
      required: true,
    },
    messages: {
      collection: "message",
      via: "ticket",
    },
    user: {
      model: "user",
      required: true,
    },
  },
};

module.exports = {
  attributes: {
    messageType: {
      type: "string",
      required: true,
      isIn: ["admin_to_user", "user_to_admin"],
    },
    user: {
      model: "user",
      required: true,
    },
    ticket: {
      model: "ticket",
      required: true,
    },
    body: {
        type: "string",
        required: true,
      },
  },
};

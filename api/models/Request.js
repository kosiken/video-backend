module.exports = {
  attributes: {
    amount: {
      type: "number",
      required: true,
    },
    userAssociated: {
      model: "user",
      required: true,
    },
    status: {
      type: "string",
      defaultsTo: "pending",
      isIn: ["pending", "fulfilled", "denied"],
    },
  },
};

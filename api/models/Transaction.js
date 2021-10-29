module.exports = {
  attributes: {
    transactionType: {
      type: "string",
      isIn: ["withdarawal", "payment"],
      required: true,
    },
    amount: {
      type: "number",
      required: true,
    },
    associatedUser: {
      model: "user",
      required: true,
    },
  },
};

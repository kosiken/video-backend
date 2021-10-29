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
  },   beforeCreate: async function (valuesToSet, proceed) {
    // Hash password
    console.log("here");
    const IsDev = sails.config.environment === "development";
    if (IsDev) {
      let id = await sails.helpers.createUserId.with();
      valuesToSet.id = id;
      return proceed();
    }
  },
};

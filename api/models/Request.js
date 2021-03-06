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
    
  },beforeCreate: async function (valuesToSet, proceed) {
    // Hash password
    console.log("here");
    const IsDev = sails.config.environment === "development";
    if (IsDev) {
      let id = await sails.helpers.createUserId.with();
      valuesToSet.id = id;
    }
    return proceed();
  },
};

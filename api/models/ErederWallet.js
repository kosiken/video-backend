module.exports = {
  attributes: {
    depositBalance: {
      type: "number",
      defaultsTo: 0,
    },
    identifier: {
      type: "string",
      defaultsTo: "ErederWallet",
      unique: true,
    },
  },
  beforeCreate: async function (valuesToSet, proceed) {
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

module.exports = {
  attributes: {
    income: {
      type: "number",
      min: 0,
      defaultsTo: 0,
    },
    owner: {
      model: "user",
      required: true,
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


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

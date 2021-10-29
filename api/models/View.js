module.exports = {
  attributes: {
    video: {
      model: "video",
      required: true,
    },
    channel: {
      model: "channel",
      required: true,
    },
    userWhoViewed: {
      model: "user",
      required: true,
    },
    duration: {
      min: 1000,
      defaultsTo: 1000,
      type: "number",
    },
    isPayedView: {
      type: "boolean",
      defaultsTo: false,
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

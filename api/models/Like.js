module.exports = {
  attributes: {
    likedBy: {
      model: "user",
      required: true,
    },
    videoLiked: {
      model: "video",
      required: true,
    },
    channel: {
      model: "channel",
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
      return proceed();
    }
  },
};

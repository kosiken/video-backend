module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 60,
    },
    about: { type: "string" },
    shortDescription: { type: "string" },
    logo: { type: "string" },
    banner: { type: "string" },

    followerCount: { type: "number", defaultsTo: 0 },
    totalViews: { type: "number", defaultsTo: 0 },
    likeCount: { type: "number", defaultsTo: 0 },
    videoCount: { type: "number", defaultsTo: 0 },
    videos: {
      collection: "video",
      via: "channel",
    },
    user: {
      model: "user",
      required: true,
    },
    purchases: {
      collection: "purchase",
      via: "channel",
    },
  },
};

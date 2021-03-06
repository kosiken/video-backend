module.exports = {
  attributes: {
    channel: {
      model: "channel",
      required: true,
    },
    likes: {
      collection: "like",
      via: "videoLiked",
    },
    thumbnail: {
      type: "string",
      defaultsTo: "/images/defaultThumbnail.jpg",
    },
    price: {
      type: "number",
      defaultsTo: 0,

    },
    title: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 100,
    },

    description: {
      type: "string",
    },

    uploaded: {
      type: "number",
      required: true,
    },
    videoType: {
      type: "string",
      isIn: ["public", "restricted"],
      required: true,
    },
    duration: {
      type: "number",
      min: 2 * 60 * 1000, required: true,

    },
    url: {
      type: "string",
      required: true,
    },

    viewCount: { type: "number", defaultsTo: 0 },
    views: {
      collection: "view",
      via: "video",
    },
    totalViewTime: {
      type: "number", defaultsTo: 0
    },
    likeCount: {
      type: "number", defaultsTo: 0
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

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
      min: 100,
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

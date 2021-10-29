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
    twitterUrl: {
      type: "string",
      defaultsTo: "https://twitter.com/kosisoali",
    },
    instagramUrl: {
      type: "string",
      defaultsTo: "https://instagram.com/allisonkosy",
    },
    others: {
      type: "string",
      defaultsTo: JSON.stringify([
        {
          app: "Youtube",
          url: "https://www.youtube.com/channel/UCYC34xdbCK_5rYYotnpUvQQ",
        },
      ]),
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

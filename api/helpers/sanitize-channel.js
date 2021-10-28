/* eslint-disable camelcase */
module.exports = {
  friendlyName: "Sanitize channel",

  description: "",

  inputs: {
    channel: { type: "ref" },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { channel } = inputs;

    const sanitizedChannel = {
      id: channel.id,
      user_id: channel.user,
      name: channel.name,
      about: channel.about,
      short_description: channel.shortDescription,
      logo: channel.logo,
      banner: channel.banner,
      follower_count: channel.followerCount,
      like_count: channel.likeCount,
      video_count: channel.videoCount,
      total_views: channel.totalViews
    };

    return sanitizedChannel;
    // TODO
  },
};

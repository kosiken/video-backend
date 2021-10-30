module.exports = {
  friendlyName: "Logout",

  description: "Logout user.",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
  },

  fn: async function (inputs, exits) {
    if (this.req.session) {
      delete this.req.session.userId;
    }
    return exits.success({ logout: true });
  },
};

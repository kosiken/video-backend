module.exports = {
  friendlyName: "Become",

  description: "Become creator.",

  inputs: {},

  exits: {
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
  },

  fn: async function (inputs, exits) {
    let wallet;
    if (this.req.me) {
      let model = await User.updateOne(
        { id: this.req.me.id },
        { isCreator: true }
      );
      if (model.isCreator) {
        let uuid = await sails.helpers.createUserId.with();
        let channel = await Channel.findOne({ user: model.id });
        if (!channel) {
          const IsDev = sails.config.environment === "development";
          const toCreate = {
            user: model.id,
            name: `Channel-${uuid}`,
            logo: "/images/defaultLogo.jpg",
            banner: "/images/defaultBanner.jpg",
          };
          const toCreateWallet = {
            owner: model.id,
            income: 0,
          };

          if (IsDev) {
            toCreate.id = "none";
            toCreateWallet.id = "none";
          }

          channel = await Channel.create(toCreate);
          wallet = await Wallet.create(toCreateWallet).fetch();
        }

        // sails.log.info(channel);
      }

      return exits.success({ isCreator: model.isCreator, wallet });
    }
    // All done.
    return exits.unauthorizedRequest({ message: "No session found" });
  },
};

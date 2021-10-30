module.exports = {
  friendlyName: "Purchase video",

  description: "",

  inputs: {

  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }

      if (!this.req.me.hasBillingCard) {
        return exits.badRequest({
          message: "No Card registered for account",
        });
      }

      inputs.videoPurchased = this.req.params.videoId;

      let video = await Video.findOne({ id: inputs.videoPurchased });
      
      if (!video) {
        return exits.badRequest({
          message: "Cannot be purchasing non existent video",
        });
      }
      let channel = await Channel.findOne({ id: video.channel });
      if (!channel) {
        return exits.serverError({
          message: "Cannot find channel",
        });
      }
      if (video.videoType === "public") {
        return exits.badRequest({
          message: "Cannot be purchasing free video",
        });
      }
      if (channel.user === this.req.me.id) {
        return exits.badRequest({
          message: "Cannot be purchasing your own video",
        });
      }

      let purchase = await Purchase.findOne({
        userWhoPurchased: this.req.me.id,
        videoPurchased: inputs.videoPurchased,
      });
      if (!purchase) {
        const accessCode = await sails.helpers.createUserId.with();

        const IsDev = sails.config.environment === "development";
        if (IsDev) {
          inputs.id = "none";
        }
        let wallet = await Wallet.findOne({
          owner: channel.user,
        });

        if (!wallet) {
          sails.log.error("Cannot find wallet for channel " + channel.id);
          exits.serverError({
            message: "there is an issue completing this purchase",
          });
        }

        purchase = await Purchase.create({
          ...inputs,
          userWhoPurchased: this.req.me.id,
          amountPaid: video.price,
          channel: channel.id,
          accessCode,
        }).fetch();

        await Wallet.updateOne(
          {
            id: wallet.id,
          },
          {
            income: wallet.income + video.price * 0.9,
          }
        );

        let ereder = await ErederWallet.findOne({ identifier: "ErederWallet" });
        if (!ereder) {
          let inner = { depositBalance: video.price };
          if (IsDev) {
            inner.id = "none";
          }
          ereder = await ErederWallet.create(inner).fetch();
        } else {
          ereder = await ErederWallet.updateOne(
            { identifier: "ErederWallet" },
            {
              depositBalance: video.price + ereder.depositBalance,
            }
          );
        }

        let toCreate = {
          amount: video.price,
          transactionType: "payment",
          depositBalance: ereder.depositBalance,
          associatedUser: channel.user,
        };
        if (IsDev) {
          toCreate.id = "none";
        }
        await Transaction.create(toCreate);
      }
      return exits.success(purchase);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

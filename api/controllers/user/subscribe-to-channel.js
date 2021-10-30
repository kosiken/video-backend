module.exports = {
  friendlyName: "Subcribe to channel",

  description: "",

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

  fn: async function (_, exits) {
    try {
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }
      let id = this.req.me.id;
      let channelId = this.req.params.channelId;
      if (!channelId) {
        exits.badRequest({ message: "channelId is required" });
      }
      let channel = await Channel.findOne({ id: channelId });
      if (!channel) {
        return exits.notFound({ message: "No such channel exists" });
      }

      if (this.req.query.unsubscribe === "true") {
        let deleted = await Subscription.destroyOne({
          channel: channelId,
          userSubscribing: id,
        });
        if (!deleted) {
          return exits.badRequest({
            message: "Cannot unsubscribe if you have never subscribed before",
          });
        }
       await Channel.updateOne({id: channel.id}, {
          followerCount: channel.followerCount - 1
        })

        return exits.success({ deleted: true });
      }
      let sub = await Subscription.findOne({
        channel: channelId,
        userSubscribing: id,
      });

      if (sub) {
        return exits.badRequest({ message: "Already subscribed to channel" });
      }

   
      if (channel.user === id) {
        return exits.badRequest({
          message: "Cannot subscribe to your own channel",
        });
      }

      if (!sub) {
        const IsDev = sails.config.environment === "development";
        let toCreate = {
          channel: channel.id,
          userSubscribing: id,
        };
        if (IsDev) {
          toCreate.id = "none";
        }
        sub = await Subscription.create(toCreate).fetch();
        channel = await Channel.updateOne(
          {
            id: channel.id,
          },
          { followerCount: channel.followerCount + 1 }
        );
      }
      sub.channel = channel;
      return exits.success(sub);
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};

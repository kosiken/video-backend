module.exports = {
  friendlyName: "Analytics",

  description: "Analytics creator.",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
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
    const Models = {
      like: Like,
      view: View,
      purchase: Purchase,
      subscription: Subscription,
      video: Video,
    };

    let modelName = this.req.params.modelName;
    let since = parseInt(this.req.query.since);
    let returnType = this.req.query.returnType || "list";
    let map = this.req.query.map;
    let ans = [];
    let populate = this.req.query.populate;
    try {
      if (!Models[modelName]) {
        return exits.badRequest({
          message: "Cannot get access to model " + modelName,
        });
      }
      let attributes = Models[this.req.params.modelName].attributes;
      if (since && !isNaN(since)) {
        if (populate) {
          if (!attributes[populate]) {
            return exits.badRequest({
              message: `Cannot Map model ${modelName} by property ${populate}`,
            });
          }
          ans = await Models[modelName]
            .find({
              createdAt: { ">=": since },
            })
            .populate(populate);
        }
      else { ans = await Models[modelName].find({
          createdAt: { ">=": since },
        });}
      } else {
        if (populate) {
          if (!attributes[populate]) {
            return exits.badRequest({
              message: `Cannot Map model ${modelName} by property ${populate}`,
            });
          }
          ans = await Models[modelName].find({}).populate(populate);
        }
        else {ans = await Models[modelName].find({});}
      }

      if (returnType === "list") {
        return exits.success(ans);
      } else if (returnType === "map") {
        if (!map) {
          return exits.badRequest({
            message: "No property to map",
          });
        }

        if (!attributes[map]) {
          return exits.badRequest({
            message: `Cannot Map model ${modelName} by property ${map}`,
          });
        } else {
          return exits.success(ans.map((a) => a[map]));
        }
      } else {
        return exits.success({ count: ans.length });
      }
    } catch (err) {
      return exits.serverError({ message: err.message });
    }

    // All done.
  },
};

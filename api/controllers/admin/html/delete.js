module.exports = {
  friendlyName: "Delete",

  description: "Delete admin.",

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: "pages/admin/deletepage",
      layout: "layouts/layout-admin",
    },
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "view",
      viewTemplatePath: "pages/admin/deletepage",
    },
    serverError: {
      description: "There is a problem on the server",
      responseType: "view",
      viewTemplatePath: "pages/admin/deletepage",
      statusCode: 500,
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "view",
      viewTemplatePath: "pages/admin/deletepage",
    },
  },

  fn: async function (inputs, exits) {
    let channels = [];
    const Models = {
      video: Video,
      channel: Channel,

      user: User,

      request: Request,
      faq: Faq
    };

    try {
      this.req.params.modelName;
      let id = this.req.params.id;
      let view = this.req.params.modelName;

      let theModel = Models[view];
      if(!theModel)  {
        return exits.badRequest({
          title: "Admin",
          hasError: true,
          errorMessage: `Cannot find ${view} with id ${id}, ${view} model does not exist`,
          layout: "layouts/layout-admin",
        });
      }
      let object = await Models[view].destroyOne({
        id,
      });

      if (!object) {
        return exits.notFound({
          title: "View " + view,
          hasError: true,
          errorMessage: `Cannot find ${view} with id ${id}`,
          layout: "layouts/layout-admin",
        });
      }

      if (view === "channel") {
        await User.updateOne(
          {
            id: object.user,
          },
          {
            channelDeleted: true,
          }
        );
      } else if (view === "user") {
        channels = await Channel.destroy({
          user: object.id,
        }).fetch();
        await Wallet.destroy({
         owner: object.id,
        })
      }

      // All done.
      return exits.success({
        title: "Admin -" + (object.name || object.fullName || view),

        message: `${view} ${
          object.name || object.fullName || object.id
        } deleted successfully ${
          channels.length > 0 ? ("also deleted " + channels.length + " channel(s)") : ''
        }`,
        view,
        layout: "layouts/layout-admin",
      });
    } catch (error) {
      return exits.serverError({
        title: "Adimin - Error ",
        hasError: true,
        errorMessage: `Cannot load this page at this time error -> ${error.message}`,
        layout: "layouts/layout-admin",
      });
    }
  },
};

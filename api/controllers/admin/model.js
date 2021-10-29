module.exports = {
  friendlyName: "Model",

  description: "Model admin.",

  inputs: {},

  exits: {
    success: { viewTemplatePath: "pages/admin/list" ,layout:"layouts/layout-admin"},
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
      viewTemplatePath: "pages/admin/list" 
    },
    serverError: {
      description: "There is a problem on the server",
      responseType: "serverError",
      statusCode: 500,
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "view",
      viewTemplatePath: "pages/admin/login",
    },
  },

  fn: async function (inputs) {
    const Models = {
      video: Video,
      channel: Channel,

      user: User,

      request: Request,
    };

    const query = this.req.query;
    if (query && query.page) {
      page = query.page;
    }

    const _model = Models[this.req.params.modelName];
    // console.log(_model);

    const objects = await _model.find();

    let ret = {
      modelName: this.req.params.modelName.toUpperCase(),
      identifiers: await sails.helpers.getIdentifiers.with({
        model: this.req.params.modelName,
      }),
      objects,
      title: "Admin - " + this.req.params.modelName,layout:"layouts/layout-admin"
    };

    // All done.
    return ret;
  },
};

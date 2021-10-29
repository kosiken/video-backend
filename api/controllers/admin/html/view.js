module.exports = {
  friendlyName: "View",

  description: "View admin.",

  inputs: {},

  exits: {    success: {
    viewTemplatePath: "pages/admin/view",
    layout: "layouts/layout-admin",
  },
  badRequest: {
    description: "There is a problem with input parameters",
    responseType: "view", viewTemplatePath: "pages/admin/view",
   
  },
  serverError: {
    description: "There is a problem on the server",
    responseType: "view", viewTemplatePath: "pages/admin/view",
    statusCode: 500,
  },
  notFound: {
    description: "There is a problem with input parameters",
    statusCode: 404,
    responseType: "view",
    viewTemplatePath: "pages/admin/view",
  },
  
  },

  fn: async function (inputs, exits) {
    const Models = {
      video: Video,
      channel: Channel,

      user: User,

      request: Request,   transaction: Transaction,  wallet: Wallet, faq: Faq
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
      let object = await Models[view].findOne({
        id,
      });

      if (!object) {
        return exits.notFound({
          title: "View " + view,
          hasError: true,
          errorMessage:`Cannot find ${view} with id ${id}`,
          layout: "layouts/layout-admin",
        });
      }

      if (object.password) delete object.password;
      delete object.createdAt;
      delete object.updatedAt;

      for(let key in object) {
        if(object[key] === ""  || (!object[key] && object[key] !== false)) {
          object[key] = "None"
        }
      }
      
  
      // All done.
      return exits.success( {
        title: "Admin -" +  (object.name || object.fullName || view),
        identifiers: Object.keys(object),
        object,
        view,layout:"layouts/layout-admin"
      });
    } catch (error) {
      return exits.serverError({
        title: "View " + view,
        hasError: true,
        errorMessage:`Cannot load this page at this time error -> ${error.message}`,
        layout: "layouts/layout-admin",
      });
    }
  },
};

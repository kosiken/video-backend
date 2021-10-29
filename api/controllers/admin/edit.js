const _ = require("@sailshq/lodash");

module.exports = {
  friendlyName: "Delete",

  description: "Delete admin.",

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: "pages/admin/edit",
      layout: "layouts/layout-admin",
    },
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "view",
      viewTemplatePath: "pages/admin/edit",
    },
    serverError: {
      description: "There is a problem on the server",
      responseType: "view",
      viewTemplatePath: "pages/admin/edit",
      statusCode: 500,
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "view",
      viewTemplatePath: "pages/admin/edit",
    },
  },

  fn: async function (inputs, exits) {
    const Models = {
      video: Video,
      channel: Channel,

      user: User,

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
          layout: "layouts/layout-admin",id:0
        });
      }
      let object = await Models[view].findOne({
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

      if (object.password) delete object.password;
      delete object.createdAt;
      delete object.updatedAt;

      let attributes = _.clone(Models[this.req.params.modelName].attributes);
      if (attributes.password) {
        delete attributes.password;
      }
      delete attributes.id;
      if (attributes.Role) {
        delete attributes.Role;
      }
      delete attributes.createdAt;
      for (let k of [
        "billingCardBrand",
        "billingCardLast4",
        "billingCardExpMonth",
        "billingCardExpYear",
        "bankName",
        "bankAccountName",
        "bankAccountNumber",
        "emailProofTokenExpiresAt",
        "emailProofToken",
        "profilePic",
        "passwordResetTokenExpiresAt",
        "passwordResetToken",
        "emailChangeCandidate",
        "followerCount",
        "totalViews",
        "likeCount",
        "videoCount",
      ]) {
        delete attributes[k];
        delete object[k];
      }

      delete attributes.updatedAt;
      let keys = Object.keys(attributes);
      for (let key in attributes) {
        if (attributes[key].collection) {
          attributes[key].type = "modelList";
        } else if (attributes[key].model) {
          attributes[key].type = "model";
        } else if (attributes[key].validations) {
          if (attributes[key].validations.isIn) {
            // console.log(attributes[key].validations.isIn)
            attributes[key].ofType = "select";

            attributes[key].isIn = attributes[key].validations.isIn;
          }
        }
      }

      // All done.
      return exits.success({
        title: "Edit -" + (object.name || object.fullName || view),
        keys,
        attributes,
        id: this.req.params.id,
        object,
        view,
        model: this.req.params.modelName,
        layout: "layouts/layout-admin",
      });
    } catch (error) {
      
      return exits.serverError({
        title: "Error ",
        hasError: true,
        errorMessage: `Cannot load this page at this time error -> ${error.message}`,
        layout: "layouts/layout-admin",id: 0
      });
    }
  },
};

module.exports = {
  friendlyName: "Get identifiers",

  description: "",

  inputs: {
    model: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Identifiers",
    },
  },

  fn: async function (inputs) {
    const model = inputs.model;
    const IdentifierList = {
      user: ["id", "fullName", "isCreator"],
      video: ["id", "title", "videoType", "viewCount"],
      channel: ["id", "name"],
      request: ["id", "userAssociated"],
      transaction: ["id", "transactionType", "status"],
      wallet: ["id", "income", "owner"],
      faq: ["id", "title"],
    };
    // Get identifiers.
    let identifiers;
    // TODO

    if (model === "newuser" || model === "patient" || model === "physician") {
      identifiers = IdentifierList.user;
    } else {
      identifiers = IdentifierList[model];
    }

    console.log(identifiers, model);
    // Send back the result through the success exit.
    return identifiers;
  },
};

/* eslint-disable camelcase */
module.exports = {
  friendlyName: "Sanitize user",

  description: "",

  inputs: {
    user: { type: "ref" },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    let { user } = inputs;
    let sanitized = {
      id: user.id,
      email: user.emailAddress,
      username: "none",
      birthdate: user.dob,
      fullName: user.fullName,
      isCreator: user.isCreator,
      profilePic: user.profilePic || "/images/me.jpg",
      has_billing_card: user.hasBillingCard,
      billing_card_brand: user.billingCardBrand,
    
      billing_card_last4: user.billingCardLast4,
    };
    return sanitized;
    // TODO
  },
};
